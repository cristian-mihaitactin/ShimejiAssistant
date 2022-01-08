import * as fs from "fs";
import * as path from "path";
import { Observable, of, Subject} from 'rxjs';
import {map, filter} from 'rxjs/operators';


import {BuckyProfileModel} from "./bucky-profile-model";
import {BuckyBehaviourModel} from "./bucky-behaviour-model";

//const profileDirectoryPath = "./bucky_profile/profiles";
const profileDirectoryPath = "profiles";

export class BuckyProfileService {
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
}