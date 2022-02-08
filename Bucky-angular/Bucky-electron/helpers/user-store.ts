import { app } from "electron";
import * as path from "path";
import * as fs from "fs";
import { AuthTokenModel } from "../auth/models/auth-tokens-model";
import { BuckyProfileModel } from "bucky_profile/bucky-profile-model";
import { BuckyBehaviourModel } from "../bucky_profile/bucky-behaviour-model";
import { environment } from "environments/environment";

const profilePath = 'buckyProfile'
const defaultProfilePath = 'default_profile'

export class UserStore {
  
    
    private path: string;
    private data: string[];
    private defaults: string[];
  constructor(opts) {
    const userDataPath = app.getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    /*defaults: {
      username: string;
      email: string;
      buckyProfile: string;
      pluginsInstalled: string;
    }*/
    this.defaults = opts.defaults;
    this.data = parseDataFile(this.path, opts.defaults);
    
    const buckyPath = path.join(app.getPath('userData'), profilePath);
    if (!fs.existsSync(buckyPath)){
      this.setDefaultBuckyProfile();
    }
  }
  
  public get(key) {
    return this.data[key];
  }
  
  public set(key, val) {
    console.log('key,val', key,val);
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
    this.setDefaultBuckyProfile();
  }

  getAuthTokens(): AuthTokenModel {
    var authString = this.get('auth-tokens');
    if (authString !== undefined && authString !== ''){
      return JSON.parse(authString);
    }

    return null;
  }

  setBuckyProfile(buckyProfile: BuckyProfileModel) {
    const buckyPath = path.join(app.getPath('userData'), profilePath);

    if (!fs.existsSync(buckyPath)){
      fs.mkdirSync(buckyPath, { recursive: true });
  }

    buckyProfile.behaviours.forEach(element => {
      fs.writeFileSync(path.join(buckyPath, element.actionTypeString) + '.png', element.imageBytes, 'base64');
    });
  }

  private setDefaultBuckyProfile(){
    var defaultProfile = environment.default_buckyProfile as BuckyProfileModel;

    defaultProfile.behaviours.forEach((element,index) => {
      const defaultBehaviourPath = path.join(__dirname,defaultProfilePath,defaultProfile.id, element.actionTypeString, '.png');
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