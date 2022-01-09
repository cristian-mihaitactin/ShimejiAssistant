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
  // buckyProfile = new BehaviorSubject<BuckyProfileModel>(
  //   {id: "", name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}
  // );

  // buckyProfiles = new BehaviorSubject<BuckyProfileModel[]>([]);
  // recievedBuckyProfiles = new BehaviorSubject<BuckyProfileModel>(
  //   {id: "", name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}
  // );

  constructor() {
    // electron.ipcRenderer.on('bucky-profile', (_event: any, arg: BuckyProfileModel) => {
    //   console.log("arg.id");
    //   console.log(arg.id);
    //   this.buckyProfile.next(arg);
    // });// end

    // electron.ipcRenderer.send('get-initial-bucky-profile', '');

    // electron.ipcRenderer.on('bucky-profiles', (_event: any, arg: BuckyProfileModel[]) => {
    //   this.buckyProfiles.next(arg);
    //   // buckyProfiles = new BehaviorSubject<BuckyProfileModel[]>([]);
    //   //buckyProfiles.complete();
    // });
    
    // electron.ipcRenderer.send('get-all-bucky-profiles', '');

    // electron.ipcRenderer.on('bucky-profile', (_event: any, arg: BuckyProfileModel) => {
    //   console.log('in setBuckyProfile' + arg.id)
    //   this.recievedBuckyProfiles.next(arg);
    //   // recievedBuckyProfiles = new BehaviorSubject<BuckyProfileModel>(
    //   //   {id: "", name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}
    //   // );
    //   //recievedBuckyProfiles.complete();
    // });

    

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

  // getBuckyProfiles() : BehaviorSubject<BuckyProfileModel[]>{

  //   // var buckyProfiles = new BehaviorSubject<BuckyProfileModel[]>([]);
  //   electron.ipcRenderer.send('get-all-bucky-profiles', '');

  //   return this.buckyProfiles;
  // }

  // getBuckyProfile(id:string) : BehaviorSubject<BuckyProfileModel> {
  //   // this.recievedBuckyProfiles = new BehaviorSubject<BuckyProfileModel>(
  //   //   {id: "", name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}
  //   // );

  //   // electron.ipcRenderer.on('bucky-profile', (_event: any, arg: BuckyProfileModel) => {
  //   //   console.log('in setBuckyProfile' + arg.id)
  //   //   recievedBuckyProfiles.next(arg);
  //   //   // recievedBuckyProfiles = new BehaviorSubject<BuckyProfileModel>(
  //   //   //   {id: "", name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}
  //   //   // );
  //   //   //recievedBuckyProfiles.complete();
  //   // });

  //   electron.ipcRenderer.send('get-bucky-profile-by-id', id);

  //   return this.recievedBuckyProfiles;
  // }
}
