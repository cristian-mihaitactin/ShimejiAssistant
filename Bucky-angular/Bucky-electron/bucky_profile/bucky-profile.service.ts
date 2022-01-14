import * as fs from "fs";
import * as path from "path";
import { Observable, of, Subject, connectable} from 'rxjs';
import {map, filter, take, tap, flatMap } from 'rxjs/operators';


import {BuckyProfileModel} from "./bucky-profile-model";
import {BuckyBehaviourModel} from "./bucky-behaviour-model";
import { UserStore } from "helpers/user-store";
import { UserService } from "user/user.service";
import { BarnBuckyService } from "barn-service/barn-bucky-service";
import { mergeMap } from "rxjs-compat/operator/mergeMap";
import { switchMap } from "rxjs-compat/operator/switchMap";
import { exhaustMap } from "rxjs-compat/operator/exhaustMap";

//const profileDirectoryPath = "./bucky_profile/profiles";
const profileDirectoryPath = "profiles";

export class BuckyProfileService {
  private userStore: UserStore;
  private barnService: BarnBuckyService;

  constructor(userStore: UserStore, barnService: BarnBuckyService){
    this.userStore = userStore;
    this.barnService = barnService;
  }
    getUserBuckyProfile() : Observable<BuckyProfileModel> {
      const buckyId = this.userStore.get('bucky_profile');

      return this.barnService.getBuckyProfile(buckyId).pipe(
        tap((v) => v.isMainProfile = true)
      );
    }

    getBuckyProfileById(id: string): Observable<BuckyProfileModel> {
      const buckyId = this.userStore.get('bucky_profile');

      return this.barnService.getBuckyProfile(id).pipe(
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
      const buckyId = this.userStore.get('bucky_profile');

      return this.barnService.getAllBuckyProfiles().pipe(
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
      this.userStore.set('bucky_profile', buckyProfileId);
      //Call Barn?
    }
  /*
    profileExists(id: string): boolean{
        try {
          var directoryPath = path.join(__dirname, profileDirectoryPath,id);
            if (fs.existsSync(directoryPath)) {
              return true;
            }
          } catch(err) {
            console.error(err)
            return false;
          }
        return false;
    }

    getLocalBuckyProfile(id:string): BuckyProfileModel {
        var directoryPath = path.join(__dirname, profileDirectoryPath,id);
        // `${directoryPath}/${files}`
        var buckyProfile: BuckyProfileModel = {id: id, name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()};

        var imageList = fs.readdirSync(directoryPath)
                            .map(files => (
                              {
                                actionType: files.replace('.png',''),
                                imageBytes: ""
                              }
                            )
                             );
        
        imageList.forEach((val, index) => {
          val.imageBytes = this.getFileContentByPath(`${directoryPath}/${val.actionType}.png`);

          buckyProfile.behaviours.push(val);
        })

        return buckyProfile;
    }

    private getFileContentByPath(imgPath: string) : string {
        return fs.readFileSync(imgPath, {encoding: 'base64'});
    }
    */
}