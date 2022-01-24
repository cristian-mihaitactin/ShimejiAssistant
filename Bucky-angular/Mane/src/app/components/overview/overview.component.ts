import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BuckyProfileModel } from  '../../models/bucky-profile-model';
import { BuckyProfileService } from '../../services/bucky-profile-service';
import * as $ from 'jquery';

const electron = (<any>window).require('electron');

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  encapsulation : ViewEncapsulation.None 

})
export class OverviewComponent implements OnInit {

  buckyProfileIds = new Map<string, boolean>();
  buckyProfiles = new BehaviorSubject<BuckyProfileModel[]>([]);
  mainBuckyProfileId = '';

  constructor(
    private cdr: ChangeDetectorRef
  ) { 
    electron.ipcRenderer.on('bucky-profiles', (_event: any, arg: BuckyProfileModel[]) => {
      this.buckyProfiles.next(arg);
      // buckyProfiles = new BehaviorSubject<BuckyProfileModel[]>([]);
      //buckyProfiles.complete();
    });
  }

  ngOnInit(): void {
    electron.ipcRenderer.send('get-all-bucky-profiles', '');

    this.buckyProfiles
    .subscribe(profiles => {
      if(profiles !== undefined && Array.isArray(profiles) && profiles.length > 0) {
        profiles.forEach((profile,index) => {
          // if (profile.isMainProfile !== undefined && profile.isMainProfile === true){
          //   console.log('profile.isMainProfile !== undefined && profile.isMainProfile === true');
          //   console.log(profile.isMainProfile !== undefined && profile.isMainProfile === true);
          //   console.log('profile.id, profile.isMainProfile')
          //   console.log(profile.id, profile.isMainProfile)
          //   this.mainBuckyProfileId = profile.id;
          // }
          
          this.buckyProfileIds.set(profile.id, profile.isMainProfile);
        })
        this.cdr.detectChanges();
      }
    })
  }

  newAreaSelected(event: string){
    switch(event) {
      case "assistant-profile": {
        $("#overview-section-group .overview-section-group-item").hide();
        $("#assistant-section").show();
        break;
      }
      case "manage-plugins": {
        $("#overview-section-group .overview-section-group-item").hide();
        $("#plugin-section").show();
        break;
      }
      default: {

      }
    }
  }
  changeAssistantProfile(event:MouseEvent, buckyProfileId:string){
    event.stopPropagation();

    this.mainBuckyProfileId = buckyProfileId;

    this.cdr.detectChanges();
  }

  setAssistantProfile(event:MouseEvent, buckyProfileId:string){
    event.stopPropagation();
    this.mainBuckyProfileId = buckyProfileId;

    electron.ipcRenderer.send('set-bucky-profile', buckyProfileId);
    this.cdr.detectChanges();
  }
}
