import { environment } from '../environments/environment'
import { Observable, first, throwError, catchError, interval, of } from 'rxjs';
import { map, filter, scan, flatMap, tap} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { from } from 'rxjs';
import { RefreshGrantModel } from './models/refresh-grant-model';
import { ProfileModel } from './models/profile-model';
import { AuthStateModel } from './models/auth-state-model';
import { AuthTokenModel } from './models/auth-tokens-model';
import { RegisterModel } from './models/register-model';
import { LoginModel } from './models/login-model';
import {AxiosResponse, AxiosRequestHeaders, AxiosResponseHeaders, AxiosRequestConfig, Method} from 'axios'
import {Axios} from 'axios-observable'
import jwt_decode  from 'jwt-decode'
import { UserStore } from 'helpers/user-store';
import { UserModel } from '../user/models/user-model';
import { fstat } from 'original-fs';
import { PluginService } from '../plugin-service/plugin.service';
import { BarnBuckyService } from 'barn-service/barn-bucky-service';
import { BuckyProfileModel } from 'bucky_profile/bucky-profile-model';

export class AuthService {

    private initalState: AuthStateModel = { profile: null, tokens: null, authReady: false };
    private authReady$ = new BehaviorSubject<boolean>(false);
    private state: BehaviorSubject<AuthStateModel>;
    private refreshSubscription$: Subscription;

    private userEndpoint = '/api/User'
    private userPreferencesEndpoint = '/api/UserPeferences'
    private userBuckyProfile = '/api/User/Profile'
    public userBehaviour: BehaviorSubject<UserModel>;

    state$: Observable<AuthStateModel>;
    tokens$: Observable<AuthTokenModel>;
    profile$: Observable<ProfileModel>;
    loggedIn$: Observable<boolean>;
    constructor(
        private localStorage:UserStore,
    ) {
        this.state = new BehaviorSubject<AuthStateModel>(this.initalState);
        this.state$ = this.state.asObservable();

        this.tokens$ = this.state.pipe(filter(state => state.authReady),
            map(state => state.tokens));

        this.profile$ = this.state.pipe(filter(state => state.authReady),
            map(state => state.profile));

        this.loggedIn$ = this.tokens$.pipe(map(tokens => !!tokens));

        this.userBehaviour = new BehaviorSubject<UserModel>(this.getDefaultUser())
    }
    init(): Observable<AuthTokenModel> {
        return this.startupTokenRefresh().pipe(
            tap(() => this.scheduleRefresh()));
    }

    register(data: RegisterModel): Observable<AxiosResponse> {
        const config = {
            baseURL: `${environment.baseApiUrl}`,
            url: '/account/register',
            method: "POST" as Method,
            data: data,
            
        }
        
        return Axios.request(config)
        .pipe(
                catchError (res => throwError(() => {
                    console.error('Register error')
                    console.error(res);
                    return new Error(res.response.data);
                }))
            );
    }

    login(user: LoginModel): Observable<any> {
        // return this.getTokens(user, 'client_credentials').pipe(
        return this.getTokens(user, 'password').pipe(
            // catchError(res => throwError(res.json())),
            catchError(res => throwError(() => {
                console.error('Login error');
                console.error(res);

                return new Error(res.response.data.error_description);
            })),
            tap(res => this.scheduleRefresh()));
    }

    logout(): void {
        this.updateState({ profile: null, tokens: null });
        if (this.refreshSubscription$) {
            this.refreshSubscription$.unsubscribe();
        }
        this.removeToken();
        this.localStorage.resetToDefault();
        this.userBehaviour.next(this.getDefaultUser());
        console.log('end logout')
    }

    refreshTokens(): Observable<AuthTokenModel> {
        return this.state.pipe(
            first(),
            map(state => state.tokens ?? this.localStorage.get('auth-tokens') as unknown as AuthTokenModel),
            flatMap(tokens => this.getTokens({ refresh_token: tokens.refresh_token }, 'refresh_token').pipe(
                catchError(error => throwError('Session Expired')))
            ),
            // map(res => res.data.json()));
            map(res => res.data));
    }

    private storeToken(tokens: AuthTokenModel): void {
        const previousTokens = this.retrieveTokens();
        if (previousTokens != null && tokens.refresh_token == null) {
            tokens.refresh_token = previousTokens.refresh_token;
        }

        this.localStorage.set('auth-tokens', JSON.stringify(tokens));
        // this.localStorage.set('auth-tokens', tokens);
    }

    private retrieveTokens(): AuthTokenModel {
        const tokensString = this.localStorage.get('auth-tokens');
        const tokensModel: AuthTokenModel = tokensString == null ? null : JSON.parse(tokensString);
        return tokensModel;
    }

    private removeToken(): void {
        this.localStorage.remove('auth-tokens');
    }

    private updateState(newState: AuthStateModel): void {
        const previousState = this.state.getValue();
        this.state.next(Object.assign({}, previousState, newState));
    }

    private getTokens(data: RefreshGrantModel | LoginModel, grantType: string): Observable<AxiosResponse> {
        Object.assign(data, { grant_type: grantType, scope: 'openid offline_access' });
        const params = new URLSearchParams();
        Object.keys(data)
            .forEach(key => {
                params.append(key, data[key])
            });
        const options = {
            baseURL: `${environment.baseApiUrl}`,
            url: '/connect/token',
            method: "POST" as Method,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: params
            // params: params,
        }
        
        return Axios.request(options)
        .pipe(
                tap(res  => {
                    const tokens: AuthTokenModel = res.data;
                    const now = new Date();
                    tokens.expiration_date = new Date(now.getTime() + tokens.expires_in * 1000).getTime().toString();
    
                    const profile: ProfileModel = jwt_decode(tokens.id_token);
    
                    this.storeToken(tokens);
                    this.storeUserInfo(tokens.access_token);
                    this.updateState({ authReady: true, tokens, profile });
                }));
    }

    private startupTokenRefresh(): Observable<AuthTokenModel> {
        return of(this.retrieveTokens()).pipe(
            flatMap((tokens: AuthTokenModel) => {
                if (!tokens) {
                    this.updateState({ authReady: true });
                    return throwError('No token in Storage');
                }
                const profile: ProfileModel = jwt_decode(tokens.id_token);
                this.updateState({ tokens, profile });

                if (+tokens.expiration_date > new Date().getTime()) {
                    this.updateState({ authReady: true });
                }

                return this.refreshTokens();
            }),
            catchError(error => {
                this.logout();
                this.updateState({ authReady: true });
                return throwError(error);
            }));
    }

    private scheduleRefresh(): void {
        this.refreshSubscription$ = this.tokens$.pipe(
            first(),
            // refresh every half the total expiration time
            flatMap(tokens => interval(tokens.expires_in / 2 * 1000)),
            flatMap(() => this.refreshTokens()))
            .subscribe();
    }

    private storeUserData(userData: UserModel) {
        this.localStorage.set('username',userData.username);
        this.localStorage.set('email',userData.email);
        this.userBehaviour.next(userData);
    }
    private getDefaultUser() : UserModel{
        return {
            username: this.localStorage.get('username') ?? environment.default_user.username,
            email: this.localStorage.get('email') ?? environment.default_user.email
        }
    }

    private storeUserInfo(accessToken){
        console.log('in storeUserInfo')
        this.callCallBarn(accessToken, this.userEndpoint, "GET" as Method)
            .subscribe({
                next: (barnValue) => {

                    var newUserData: UserModel = {
                        username: barnValue.data.userName,
                        email: barnValue.data.email
                    }

                    this.storeUserData(newUserData);

                    this.userBehaviour.next(newUserData);
                }
        }); 

        this.callCallBarn(accessToken, this.userBuckyProfile, "GET" as Method)
            .subscribe({
                next: (barnValue: any) => {
                    var buckyProfile = barnValue.data;// as BuckyProfileModel;
        
                    this.localStorage.setBuckyProfile(buckyProfile);
                }
        });
    }

    private callCallBarn(accessToken, url:string, method: Method) {
        const options = {
            baseURL: `${environment.baseApiUrl}`,
            url: url,
            method: method, // "GET" as Method,
            // headers: { 'Authorization': `Bearer ${this.userStore.get('auth-tokens')}` },
            headers: { 'Authorization': `Bearer ${accessToken}` },
            // params: params,
        }
        
            const instance = Axios.create(options);
        
            instance.interceptors.response.use(null, (error) => {
                console.log("in interceptor")
                if (error.config && error.response && error.response.status === 401) {
                console.log("in interceptor IFF")
    
                this.refreshTokens().subscribe({
                    next: (value) => {
                        options.headers['Authorization'] = `${value.token_type} ${value.access_token}`;
                    },
                    error: (err) => {
                        console.error(err);
                    }
                });
                }
    
                return Promise.reject(error);
            });
    
            return instance.request(options).pipe();    }
}

