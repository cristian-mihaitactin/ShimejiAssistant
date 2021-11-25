import { environment } from './../environments/environment';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable, first, throwError, catchError, interval, of } from 'rxjs';
import { map, filter, scan, flatMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { RefreshGrantModel } from './models/refresh-grant-model';
import { ProfileModel } from './models/profile-model';
import { AuthStateModel } from './models/auth-state-model';
import { AuthTokenModel } from './models/auth-tokens-model';
import { RegisterModel } from './models/register-model';
import { LoginModel } from './models/login-model';

const jwtDecode = require('jwt-decode');

export class AuthService {

    private initalState: AuthStateModel = { profile: null, tokens: null, authReady: false };
    private authReady$ = new BehaviorSubject<boolean>(false);
    private state: BehaviorSubject<AuthStateModel>;
    private refreshSubscription$: Subscription;

    state$: Observable<AuthStateModel>;
    tokens$: Observable<AuthTokenModel>;
    profile$: Observable<ProfileModel>;
    loggedIn$: Observable<boolean>;

    constructor(
        private http: Http,
    ) {
        this.state = new BehaviorSubject<AuthStateModel>(this.initalState);
        this.state$ = this.state.asObservable();

        this.tokens$ = this.state.pipe(filter(state => state.authReady),
            map(state => state.tokens));

        this.profile$ = this.state.pipe(filter(state => state.authReady),
            map(state => state.profile));

        this.loggedIn$ = this.tokens$.pipe(map(tokens => !!tokens));
    }
    init(): Observable<AuthTokenModel> {
        return this.startupTokenRefresh().pipe(
            tap(() => this.scheduleRefresh()));
    }

    register(data: RegisterModel): Observable<Response> {
        return this.http.post(`${environment.baseApiUrl}/account/register`, data).pipe(
            catchError (res => throwError(res.json())));
    }

    login(user: LoginModel): Observable<any> {
        return this.getTokens(user, 'password').pipe(
            catchError(res => throwError(res.json())),
            tap(res => this.scheduleRefresh()));
    }

    logout(): void {
        this.updateState({ profile: null, tokens: null });
        if (this.refreshSubscription$) {
            this.refreshSubscription$.unsubscribe();
        }
        this.removeToken();
    }

    refreshTokens(): Observable<AuthTokenModel> {
        return this.state.pipe(
            first(),
            map(state => state.tokens),
            flatMap(tokens => this.getTokens({ refresh_token: tokens.refresh_token }, 'refresh_token').pipe(
                catchError(error => throwError('Session Expired')))
            ));
    }

    private storeToken(tokens: AuthTokenModel): void {
        const previousTokens = this.retrieveTokens();
        if (previousTokens != null && tokens.refresh_token == null) {
            tokens.refresh_token = previousTokens.refresh_token;
        }

        localStorage.setItem('auth-tokens', JSON.stringify(tokens));
    }

    private retrieveTokens(): AuthTokenModel {
        const tokensString = localStorage.getItem('auth-tokens');
        const tokensModel: AuthTokenModel = tokensString == null ? null : JSON.parse(tokensString);
        return tokensModel;
    }

    private removeToken(): void {
        localStorage.removeItem('auth-tokens');
    }

    private updateState(newState: AuthStateModel): void {
        const previousState = this.state.getValue();
        this.state.next(Object.assign({}, previousState, newState));
    }

    private getTokens(data: RefreshGrantModel | LoginModel, grantType: string): Observable<AuthTokenModel> {
        const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const options = new RequestOptions({ headers: headers });

        Object.assign(data, { grant_type: grantType, scope: 'openid offline_access' });

        const params = new URLSearchParams();
        Object.keys(data)
            .forEach(key => params.append(key, data[key]));
        return this.http.post(`${environment.baseApiUrl}/connect/token`, params.toString(), options).pipe(
            tap(res => {
                const tokens: AuthTokenModel = res.json();
                const now = new Date();
                tokens.expiration_date = new Date(now.getTime() + tokens.expires_in * 1000).getTime().toString();

                const profile: ProfileModel = jwtDecode(tokens.id_token);

                this.storeToken(tokens);
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
                const profile: ProfileModel = jwtDecode(tokens.id_token);
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
}

