import * as fs from "fs";
import * as path from "path";
import { Observable, of, Subject, connectable, BehaviorSubject} from 'rxjs';
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
  defaultBuckyProfile: BehaviorSubject<BuckyProfileModel>

  constructor(userStore: UserStore, barnService: BarnBuckyService){
    this.userStore = userStore;
    this.barnService = barnService;

    this.defaultBuckyProfile = new BehaviorSubject(this.userStore.getUserBuckyProfile());
    this.userStore.defaultBuckyProfile.subscribe({
      next: value => {
        this.defaultBuckyProfile.next(value);
      }
    })
  }

    // getUserBuckyProfile() : BuckyProfileModel {//Observable<BuckyProfileModel> {
    //   console.log('getUserBuckyProfile');
    //   return this.userStore.getUserBuckyProfile();
    // }

    getBuckyProfileById(id: string): Observable<BuckyProfileModel> {
      const buckyProfile = (this.userStore.get('buckyProfile') ?? environment.default_user.buckyProfile) as BuckyProfileModel;

      return this.barnService.callBarn(`${profileUrl}/${id}`, "GET" as Method, new Map([['Content-Type', 'application/x-www-form-urlencoded' ]]))
      .pipe(
        map(res => res.data as BuckyProfileModel),
        tap((v) => {
          if(v.id  === buckyProfile.id) {
            v.isMainProfile = true;
          } else {
            v.isMainProfile = false;
          }
        }
      ));
    }

    getAllBuckyProfilesWithoutBehaviours(): Observable<BuckyProfileModel[]> {
      const buckyProfile = (this.userStore.get('buckyProfile') ?? environment.default_user.buckyProfile) as BuckyProfileModel;

      return this.barnService.callBarn(`${profileUrl}`, "GET" as Method,  new Map([['Content-Type', 'application/x-www-form-urlencoded' ]])).pipe(
        map(res=> 
          res.data as BuckyProfileModel[]),
        map((v) =>v.map(value => {
          if(value.id === buckyProfile.id) {
             value.isMainProfile = true
          } else {
            value.isMainProfile = false;
          }
          return value;})
      ));
    }
    
    setBuckyProfileById(buckyProfileId:string) {
      console.log('PUTTING new profile', buckyProfileId);

      return this.barnService.callBarn( `${userPreferencesEndpoint}`,
        "PUT" as Method, new Map([['Content-Type', 'application/json' ]]),JSON.stringify({
          buckyProfileID: buckyProfileId
        })
        ).subscribe({
            next: (value) => {
              //Store new behaviour
              this.getBuckyProfileById(buckyProfileId)
                .subscribe({
                  next: (val) => {
                    this.userStore.setBuckyProfile(val);

                    this.defaultBuckyProfile.next(this.userStore.getUserBuckyProfile());
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
