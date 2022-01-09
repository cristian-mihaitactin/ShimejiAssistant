import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
    console.log("in here")
    console.log(arg.id) // prints "pong"
    this.buckyProfile.next(arg);
  })

    electron.ipcRenderer.send('get-initial-bucky-profile', '');
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
  }
}
