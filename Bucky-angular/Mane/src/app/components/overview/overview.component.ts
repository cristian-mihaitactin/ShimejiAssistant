import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BuckyProfileModel } from  '../../models/bucky-profile-model';
import { PluginModel } from  '../../models/plugin.model';
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
  pluginIds = new Map<string, boolean>();
  buckyProfiles = new Subject<BuckyProfileModel[]>();
  plugins = new Subject<PluginModel[]>();
  mainBuckyProfileId = '';
  focusedPlugin:string = '';

  constructor(
    private cdr: ChangeDetectorRef
  ) { 
    electron.ipcRenderer.on('bucky-profiles', (_event: any, arg: BuckyProfileModel[]) => {
      this.buckyProfiles.next(arg);
    });

    
    electron.ipcRenderer.on("all-plugins-response", (_event: any, arg: PluginModel[]) => {
      this.plugins.next(arg);
    });
  }

  ngOnInit(): void {
    electron.ipcRenderer.send('get-all-bucky-profiles', '');
    electron.ipcRenderer.send("get-all-plugins", '');

    this.buckyProfiles
      .subscribe(profiles => {
        if(profiles !== undefined && Array.isArray(profiles) && profiles.length > 0) {
          profiles.forEach((profile,index) => {
            this.buckyProfileIds.set(profile.id, profile.isMainProfile);
          })
          this.cdr.detectChanges();
        }
      })
    this.plugins
      .subscribe(plugins => {
        if(plugins !== undefined && Array.isArray(plugins) && plugins.length > 0) {
          plugins.forEach((plugin,index) => {
            
            this.pluginIds.set(plugin.id, true);
          })
          this.cdr.detectChanges();
        }
      });
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
    console.log('changeAssistantProfile');

    this.mainBuckyProfileId = buckyProfileId;

    this.cdr.detectChanges();
  }

  setAssistantProfile(event:MouseEvent, buckyProfileId:string){
    event.stopPropagation();
    console.log('setAssistantPRofile');
    this.mainBuckyProfileId = buckyProfileId;

    electron.ipcRenderer.send('set-bucky-profile', buckyProfileId);
    this.cdr.detectChanges();
  }

  
  focusOnPlugin(event:MouseEvent, pluginId:string){
    event.stopPropagation();
    this.focusedPlugin = pluginId;

    $("#plugin-details").show();

    this.cdr.detectChanges();
  }
}
