import * as fs from "fs";
import * as path from "path";
import { Observable, of, Subject, connectable} from 'rxjs';
import {map, filter, take, tap, flatMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

import {BuckyProfileModel} from "./bucky-profile-model";
import {BuckyBehaviourModel} from "./bucky-behaviour-model";
import { UserStore } from "helpers/user-store";
import { UserService } from "user/user.service";
import { BarnBuckyService } from "barn-service/barn-bucky-service";
import { mergeMap } from "rxjs-compat/operator/mergeMap";
import { switchMap } from "rxjs-compat/operator/switchMap";
import { exhaustMap } from "rxjs-compat/operator/exhaustMap";
import { Method } from "axios";
import Axios from "axios-observable";

//const profileDirectoryPath = "./bucky_profile/profiles";
const profileDirectoryPath = "profiles";
const profileUrl = '/api/Profile';
const userPreferencesEndpoint = '/api/UserPeferences';
export class BuckyProfileService {
  private userStore: UserStore;
  private barnService: BarnBuckyService;

  constructor(userStore: UserStore, barnService: BarnBuckyService){
    this.userStore = userStore;
    this.barnService = barnService;
  }

    getUserBuckyProfile() : Observable<BuckyProfileModel> {
      const buckyId = this.userStore.get('buckyProfile') ?? environment.default_user.buckyProfile;

      if( buckyId !== undefined && buckyId !== null && buckyId !== ''){
        return this.barnService.callBarn(`${profileUrl}/${buckyId}`, "GET" as Method, new Map([['Content-Type', 'application/x-www-form-urlencoded' ]]))
        .pipe(
          map(res => res.data as BuckyProfileModel),
          tap((v) => v.isMainProfile = true)
        );
      } else {
        // call barn to set
        var accessToken = this.userStore.getAuthTokens().access_token;
        if (accessToken !== undefined && accessToken !== null && accessToken !== '' ){
          console.log('fetching user profile')
          return this.barnService.callBarn('/api/User/Profile', 'GET' as Method)
            .pipe(
              map(res => res.data as BuckyProfileModel)
            );
        } else {
          // return default profile
          console.log('returning default profile');
          var defaultProfile = environment.default_user.buckyProfile;
          return this.barnService.callBarn(`${profileUrl}/${defaultProfile}`, "GET" as Method, new Map([['Content-Type', 'application/x-www-form-urlencoded' ]]))
          .pipe(
            map(res => res.data as BuckyProfileModel)
          );
        }
      }
      
    }

    getBuckyProfileById(id: string): Observable<BuckyProfileModel> {
      const buckyId = this.userStore.get('buckyProfile') ?? environment.default_user.buckyProfile;

      return this.barnService.callBarn(`${profileUrl}/${id}`, "GET" as Method, new Map([['Content-Type', 'application/x-www-form-urlencoded' ]]))
      .pipe(
        map(res => res.data as BuckyProfileModel),
        tap((v) => {
          if(v.id  === buckyId) {
            v.isMainProfile = true;
          } else {
            v.isMainProfile = false;
          }
        }
      ));
    }

    getAllBuckyProfilesWithoutBehaviours(): Observable<BuckyProfileModel[]> {
      const buckyId = this.userStore.get('buckyProfile') ?? environment.default_user.buckyProfile;

      return this.barnService.callBarn(`${profileUrl}`, "GET" as Method,  new Map([['Content-Type', 'application/x-www-form-urlencoded' ]])).pipe(
        map(res=> 
          res.data as BuckyProfileModel[]),
        map((v) =>v.map(value => {
          if(value.id === buckyId) {
             value.isMainProfile = true
          } else {
            value.isMainProfile = false;
          }
          return value;})
      ));
    }
    
    setBuckyProfileById(buckyProfileId:string) {
      
      console.log('setBuckyProfileById:', buckyProfileId);

      this.barnService.callBarn( `${userPreferencesEndpoint}`,
        "PUT" as Method, new Map([['Content-Type', 'application/json' ]]),JSON.stringify({
          buckyProfileID: buckyProfileId
        })
        ).subscribe({
            next: (value) => {
              //Store new behaviour
              this.userStore.set('buckyProfile', buckyProfileId);

              this.getBuckyProfileById(buckyProfileId)
                .subscribe({
                  next: (val) => {
                    this.userStore.setBuckyProfile(val);
                  }
                });
            },
            error: (error) => {
              console.error(error);
            }
          }
        );
    }
}
