import { environment } from '../environments/environment'
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BuckyProfileModel } from '../bucky_profile/bucky-profile-model'
import { BuckyBehaviourModel } from '../bucky_profile/bucky-behaviour-model'
import {AxiosResponse, AxiosResponseHeaders, Method } from 'axios'
import {Axios} from 'axios-observable'

export class BarnBuckyService {
    getBuckyProfile(id: string): Observable<BuckyProfileModel> {
        /*
        const params = new URLSearchParams();
        params.append('id', id);
        */
        var response = this.callBarn(`/api/Profile/${id}`, "GET" as Method , null);

        return response.pipe(
            map(res => res.data as BuckyProfileModel)
        );
    }

    private callBarn(endpoint: string, method: Method, params: URLSearchParams) : Observable<AxiosResponse> {
        const options = {
            baseURL: `${environment.baseApiUrl}`,
            url: endpoint,
            method: method, //"POST" as Method,
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            params: params,
        }
        
        // return this.http.post(`${environment.baseApiUrl}/connect/token`, params.toString(), options).pipe(
        return Axios.request(options)
    }
}