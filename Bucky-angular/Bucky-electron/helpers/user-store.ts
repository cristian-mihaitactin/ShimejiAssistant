import { app } from "electron";
import * as path from "path";
import * as fs from "fs";
import { AuthTokenModel } from "../auth/models/auth-tokens-model";
import { BuckyProfileModel } from "bucky_profile/bucky-profile-model";
import { environment } from "../environments/environment";
import { BehaviorSubject, Subject } from "rxjs";

const profilePath = 'buckyProfile'
const defaultProfilePath = 'default_profile'

export class UserStore {
  
    
    private path: string;
    private data: string[];
    private defaults: string[];

  defaultBuckyProfile: Subject<BuckyProfileModel>

  constructor(opts) {
    const userDataPath = app.getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    /*defaults: {
      username: string;
      email: string;
      buckyProfile: BuckyProfileModel;
      pluginsInstalled: string;
    }*/
    this.defaults = opts.defaults;
    this.data = parseDataFile(this.path, opts.defaults);

    const buckyPath = path.join(app.getPath('userData'), profilePath);

    if (!fs.existsSync(buckyPath)){
      this.setDefaultBuckyProfile();
    }

    this.defaultBuckyProfile = new Subject<BuckyProfileModel>();
  }
  
  public get(key) {
    return this.data[key];
  }
  
  public set(key, val) {
    console.log('userstore.set:', key);
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
  public remove(key) {
    delete this.data[key];

    console.log('remove key: ', key)
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  resetToDefault() {
    this.data = parseDataFile(this.path, this.defaults, true);
    //this.setDefaultBuckyProfile();
  }

  getAuthTokens(): AuthTokenModel {
    var authString = this.get('auth-tokens');
    if (authString !== undefined && authString !== ''){
      return JSON.parse(authString);
    }

    return null;
  }

  getUserBuckyProfile(): BuckyProfileModel{
    const buckyPath = path.join(app.getPath('userData'), profilePath);

    const buckyProfileString = this.get('buckyProfile');
    if (buckyProfileString === undefined || buckyProfileString === null || buckyProfileString === ''){
      this.setDefaultBuckyProfile();
    }
    const buckyProfile = this.get('buckyProfile') as unknown as BuckyProfileModel;

    buckyProfile.behaviours.forEach((element, index) => {
      buckyProfile.behaviours[index].imageBytes = fs.readFileSync(path.join(buckyPath, element.actionTypeString) + '.png', 'base64');
    });

    return buckyProfile;
  }

  setBuckyProfile(newBuckyProfile: BuckyProfileModel) {
    const buckyPath = path.join(app.getPath('userData'), profilePath);

    var buckyProfile = newBuckyProfile;

    if (!fs.existsSync(buckyPath)){
      fs.mkdirSync(buckyPath, { recursive: true });
    }

    this.defaultBuckyProfile.next(buckyProfile);
    newBuckyProfile.behaviours.forEach((element, index) => {
      fs.writeFileSync(path.join(buckyPath, element.actionTypeString) + '.png', element.imageBytes, 'base64');
      buckyProfile.behaviours[index].imageBytes = '';
    });
    buckyProfile.isMainProfile = true;
    this.set('buckyProfile', buckyProfile);
  }

  private setDefaultBuckyProfile(){
    var defaultProfile = environment.default_buckyProfile as BuckyProfileModel;

    defaultProfile.behaviours.forEach((element,index) => {
      const defaultBehaviourPath = path.join(app.getAppPath(), 'dist', defaultProfilePath,defaultProfile.id, element.actionTypeString + '.png');
      
      if(fs.existsSync(defaultBehaviourPath)){
        defaultProfile.behaviours[index].imageBytes = fs.readFileSync(defaultBehaviourPath, 'base64');
      }
    });

    this.setBuckyProfile(defaultProfile);
  }
}

function parseDataFile(filePath, defaults, force = false) {
    if (fs.existsSync(filePath) && !force) { 
      try {
        return JSON.parse(fs.readFileSync(filePath).toString());
      } catch(error) {
        // if there was some kind of error, return the passed in defaults instead.
        console.error(error);
        return defaults;
      }
    } else {
      try{
        fs.writeFileSync(filePath, JSON.stringify(defaults));
      } catch (error) {
        console.error(error);
        return defaults;
      }
    }

    return defaults;
}