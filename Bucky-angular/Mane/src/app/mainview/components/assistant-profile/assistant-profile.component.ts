import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { BuckyBehaviourModel } from '../../../models/bucky-behaviour-model';
import { BuckyProfileModel } from '../../../models/bucky-profile-model';
import { BuckyProfileService } from '../../../services/bucky-profile-service';
import * as $ from "jquery";

const electron = (<any>window).require('electron');

@Component({
  selector: 'app-assistant-profile',
  templateUrl: './assistant-profile.component.html',
  styleUrls: ['./assistant-profile.component.css'],
  encapsulation : ViewEncapsulation.None 
})

export class AssistantProfileComponent implements OnInit {
  // {path: 'D:/Licenta/GIT/Bucky-angular/mane-spa/src/app/mainview/components/assistant-profile/test/indexa.png'},
    // {path: 'D:/Licenta/GIT/Bucky-angular/mane-spa/src/app/mainview/components/assistant-profile/test/indexb.png'},
    // {path: 'D:/Licenta/GIT/Bucky-angular/mane-spa/src/app/mainview/components/assistant-profile/test/indexc.png'},
    // {path: 'D:/Licenta/GIT/Bucky-angular/mane-spa/src/app/mainview/components/assistant-profile/test/indexd.png'},
  // {path: 'D:/Licenta/GIT/Bucky-angular/mane-spa/src/app/mainview/components/assistant-profile/test/indexa.png'},
  // {path: 'D:/Licenta/GIT/Bucky-angular/mane-spa/src/app/mainview/components/assistant-profile/test/indexb.png'},
  // {path: 'D:/Licenta/GIT/Bucky-angular/mane-spa/src/app/mainview/components/assistant-profile/test/indexc.png'},
  // {path: 'D:/Licenta/GIT/Bucky-angular/mane-spa/src/app/mainview/components/assistant-profile/test/indexd.png'},
  images: { path: SafeResourceUrl; }[] = [];
  buckyBehaviours: BuckyBehaviourModel[] = [];

  buckyProfile = new BehaviorSubject<BuckyProfileModel>(
    {id: "", isMainProfile : false, name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}
  );
  
  @Input()
    buckyProfileId!: string;
  
  constructor(private _sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef) {
      electron.ipcRenderer.on('selected-bucky-profile', (_event: any, arg: BuckyProfileModel) => {
        this.buckyProfile.next(arg);
      });// end
      
      electron.ipcRenderer.on('bucky-assistant-profile-by-id', (_event: any, arg: BuckyProfileModel) => {
        this.buckyProfile.next(arg);
      });
  }

  ngOnInit() {
    this.buckyProfile.subscribe((value) => {
      this.buckyBehaviours = value.behaviours;
      if (value.behaviours !== undefined && value.behaviours.length > 0){
        this.images = [];

        value.behaviours.forEach((behaviour, index) => {
          let imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + behaviour.imageBytes);
          this.images.push({path: imagePath});
        })

        this.cdr.detectChanges();
        //this.image = value.behaviours[0].imageBytes;
      }
    });

      electron.ipcRenderer.send('get-initial-bucky-profile', '');
      //electron.ipcRenderer.send('get-bucky-profile-by-id', this.buckyProfileId);
  }

  ngOnChanges() {
    /**********THIS FUNCTION WILL TRIGGER WHEN PARENT COMPONENT UPDATES 'someInput'**************/
    //Write your code here
    if (this.buckyProfileId !== undefined && this.buckyProfileId !== null && (this.buckyProfileId + '').split(' ').join('') !== ''){
      console.log('here: |', this.buckyProfileId, '|');
      console.log('here: |', this.buckyProfileId, '|');
      electron.ipcRenderer.send('get-bucky-assitant-profile-by-id', this.buckyProfileId);
      this.cdr.detectChanges();
    }
  }   

  getSafeUrlFromBytes(bytes:string){
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
    + bytes);
  }
}
