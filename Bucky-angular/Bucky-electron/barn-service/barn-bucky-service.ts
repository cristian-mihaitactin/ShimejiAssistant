import { environment } from '../environments/environment'
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BuckyProfileModel } from '../bucky_profile/bucky-profile-model'
import { BuckyBehaviourModel } from '../bucky_profile/bucky-behaviour-model'
import {AxiosResponse, AxiosResponseHeaders, Method } from 'axios'
import {Axios} from 'axios-observable'

export class BarnBuckyService {
    
    private profileUrl = '/api/Profile';


    getBuckyProfile(id: string): Observable<BuckyProfileModel> {
        /*
        const params = new URLSearchParams();
        params.append('id', id);
        */

        console.log('getBuckyProfile(id)')
        console.log(id)
        var response = this.callBarn(`${this.profileUrl}/${id}`, "GET" as Method);

        return response.pipe(
            map(res => res.data as BuckyProfileModel)
        );
    }

    getAllBuckyProfiles(): Observable<BuckyProfileModel[]> {
        var response = this.callBarn(`${this.profileUrl}`, "GET" as Method);

        return response.pipe(
            map(res=> 
                res.data as BuckyProfileModel[])
        )
      }

    private callBarn(endpoint: string, method: Method) : Observable<AxiosResponse> {
        const options = {
            baseURL: `${environment.baseApiUrl}`,
            url: endpoint,
            method: method //"POST" as Method,
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
        
        // return this.http.post(`${environment.baseApiUrl}/connect/token`, params.toString(), options).pipe(
        return Axios.request(options)
    }
}