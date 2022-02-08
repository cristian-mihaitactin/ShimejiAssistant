import { environment } from '../environments/environment'
import { Observable, of, Subject } from 'rxjs';
import {AxiosResponse, AxiosResponseHeaders, Method } from 'axios'
import {Axios} from 'axios-observable'
import { AuthService } from '../auth/auth.service';
import { UserStore } from '../helpers/user-store';

export class BarnBuckyService {

    constructor(
        private authService: AuthService,
        private userStore: UserStore
    ) {}

    public callBarn(endpoint: string, method: Method, customHeaders: Map<string, string> = new Map<string,string>(), body: string = null) : Observable<AxiosResponse> {
        const tokens = this.userStore.getAuthTokens();

        if (tokens !== undefined && tokens !== null) {
            //'Authorization': `Bearer ${accessToken}`
            customHeaders.set('Authorization', `${tokens.token_type} ${tokens.access_token}`);
        } else {
            // User not logged in - do not go forward if method is different than GET
            if (method !== "GET" as Method) {
                return of(null);
            } 
        }

        let headerObj = Array.from(customHeaders).reduce((obj, [key, value]) => (
            Object.assign(obj, { [key]: value })
        ), {});

        const options = {
            baseURL: `${environment.baseApiUrl}`,
            url: endpoint,
            method: method, 
            data: body,
            headers: headerObj
        }

        const instance = Axios.create(options);
        
        instance.interceptors.response.use(null, (error) => {
            console.log("in interceptor")
            if (error.config && error.response && error.response.status === 401) {
            console.log("in interceptor IFF")

            this.authService.refreshTokens().subscribe({
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

        return instance.request(options).pipe();
    }
}