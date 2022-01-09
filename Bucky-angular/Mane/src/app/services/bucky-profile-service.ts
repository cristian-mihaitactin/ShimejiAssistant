import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BuckyBehaviourModel } from '../models/bucky-behaviour-model'
import { BuckyProfileModel } from '../models/bucky-profile-model'
const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})
export class BuckyProfileService {
  buckyProfile = new BehaviorSubject<BuckyProfileModel>(
    {id: "", name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}
  );

  constructor() {
    electron.ipcRenderer.on('bucky-profile', (_event: any, arg: BuckyProfileModel) => {
    this.buckyProfile.next(arg);

    });// end

    electron.ipcRenderer.send('get-initial-bucky-profile', '');

    
    /*
  ipcMain.on("get-all-bucky-profiles", (event,arg) => {

    */
/*
    electron.ipcRenderer.on('getImagesResponse', (event, images) => {
      this.images.next(images);
    });
    electron.ipcRenderer.on('getDirectoryResponse', (event, directory) => {
      this.directory.next(directory);
    });
  }

  navigateDirectory(path) {
    electron.ipcRenderer.send('navigateDirectory', path);
  }
  */
  } // end of cotr

  getBuckyProfiles() : BehaviorSubject<BuckyProfileModel[]>{

    var buckyProfiles = new BehaviorSubject<BuckyProfileModel[]>([]);
    
    electron.ipcRenderer.on('bucky-profiles', (_event: any, arg: BuckyProfileModel[]) => {
      buckyProfiles.next(arg);
    });

    electron.ipcRenderer.send('get-all-bucky-profiles', '');

    return buckyProfiles;
  }

  getBuckyProfile(id:string) : BehaviorSubject<BuckyProfileModel> {
    var recievedBuckyProfiles = new BehaviorSubject<BuckyProfileModel>(
      {id: "", name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}
    );

    electron.ipcRenderer.on('bucky-profile', (_event: any, arg: BuckyProfileModel) => {
      console.log('in setBuckyProfile' + arg.id)
      recievedBuckyProfiles.next(arg);
    });

    electron.ipcRenderer.send('get-bucky-profile-by-id', id);

    return recievedBuckyProfiles;
  }
}
