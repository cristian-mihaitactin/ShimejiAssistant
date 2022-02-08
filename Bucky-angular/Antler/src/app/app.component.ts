import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BuckyBehaviourModel } from './models/bucky-behaviour-model';
import { BehaviorSubject } from 'rxjs';
import { BuckyProfileModel } from './models/bucky-profile-model';
import { delay } from 'rxjs-compat/operator/delay';
import { PluginDetailsModel } from './models/plugin.details.model';
import { PluginModel } from './models/plugin.model';
import { PluginNotification } from './models/plugin.notification';
const electron = (<any>window).require('electron');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  imagePath: SafeResourceUrl;
  //image: string;
  buckyBehaviours: BuckyBehaviourModel[] = new Array<BuckyBehaviourModel>();
  buckyProfile = new BehaviorSubject<BuckyProfileModel>(
    {id: "", name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}
  );
  displayedPlugins:{
    id: string,
    imgBytes: SafeResourceUrl,
    defaultHtml: string
  }[] = [];
  plugins:BehaviorSubject<PluginModel[]> = new BehaviorSubject<PluginModel[]>([]);

  

  constructor(private _sanitizer: DomSanitizer,
    // private buckyProfileService: BuckyProfileService,
    private cdr: ChangeDetectorRef) { 
      this.initElectronIpc();
     }

     private initElectronIpc(){
      electron.ipcRenderer.on('selected-bucky-profile', (event, arg) => {
        console.log('arg: ', arg);
        if (arg === undefined || arg === null) {
          console.log('arg is not ok. Try again')
          electron.ipcRenderer.send('get-initial-bucky-profile', '');
        }else {
          console.log(arg) // prints "pong"
          this.buckyProfile.next(arg);
        }
        this.cdr.detectChanges();
      });

      electron.ipcRenderer.on('user-plugins-response', (event, arg: PluginModel[]) => {
        console.log('user-plugins-response arg:');
        console.log(arg);
        this.plugins.next(arg);        
      });

      electron.ipcRenderer.on('plugin-details-response', (event, arg: PluginDetailsModel) => {
        var pluginFound = false;

        this.displayedPlugins.forEach((value, index) => {
          if (value.id === arg.id){
            pluginFound = true;
            return;
          }
        });

        if (!pluginFound){
          var newPlugin = {
            id: arg.id,
            imgBytes:  this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
            + arg.pluginImageBlob.pngBytes),
            defaultHtml: arg.html
          };
            this.displayedPlugins.push(newPlugin);
            this.cdr.detectChanges();
          }
      });

      electron.ipcRenderer.on('plugin-notification', (event, arg: PluginNotification) => {
        var activatedPlugin = document.getElementById("notification-container");
        if (activatedPlugin !== null && activatedPlugin !== undefined && activatedPlugin.firstChild){
          while (activatedPlugin.firstChild) {
            activatedPlugin.removeChild(activatedPlugin.firstChild);
          };
        }

        const html = arg.data;
        let frag = document.createRange().createContextualFragment('<div id="activatedPlugin">' + html + '</div>');
        activatedPlugin.appendChild(frag);

        const newBehaviour = this.buckyBehaviours.find(element => parseInt(element.actionType) === arg.actionType);
        if (newBehaviour){
          this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + newBehaviour.imageBytes);
          this.cdr.detectChanges();
        }

        //notification-message
        var pluginMessage = document.getElementById("notification-message");
        if (pluginMessage !== null && pluginMessage !== undefined && pluginMessage.firstChild){
          while (pluginMessage.firstChild) {
            pluginMessage.removeChild(pluginMessage.firstChild);
          };
        }
        pluginMessage.textContent = arg.notificationMessage;

        if (pluginMessage.style.display === "none") {
          pluginMessage.style.display = "block";
        }
        });

     }

  ngOnInit() {
    console.log('this.pluginService.testing_GetPluginHtml()');
    //console.log(this.pluginService.testing_GetPluginHtml());
    this.buckyProfile.subscribe((value) => {
      this.buckyBehaviours = value.behaviours;

      if (value.behaviours.length > 0){
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + value.behaviours[0].imageBytes);
      }
    });
    
    this.plugins.subscribe({
      next: (value) => {
        console.log('plugins.subscribe(value):');
        console.log(value);
        if(value !== undefined && value !== null){
          value.forEach((pluginModel,index) => {
            electron.ipcRenderer.send('get-plugin-details', pluginModel.id);
          });
        }
      },
      error: (err) => {
        console.error(err);
      }
    });

    electron.ipcRenderer.send('get-initial-bucky-profile', '');
    electron.ipcRenderer.send("get-user-plugins", '');

    window.addEventListener('plugin-input', (e: CustomEvent) => {
      /*
      detail:
data: {action: 'add', hour: '02', minute: '03'}
pluginId: "76433374-9d88-43f9-aaa1-c6a9c1c8592e"
      */
      console.log('plugin-input:',e);
      electron.ipcRenderer.send('plugin-input', e.detail);

    });
//////////////////////////////////////////////////////////
    

    let wX;
    let wY;
    let dragging = false;

    const mouseDownCallback = (e) => {
      console.log('callback asynchronous-message', 'down')
      dragging = true;
      wX = e.pageX;
      wY = e.pageY;

      /*
      const draggedBehaviour = this.buckyBehaviours.find(bb=> bb.actionTypeString === 'Dragged');
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + draggedBehaviour.imageBytes);
      this.cdr.detectChanges();
      */
      this.setBuckyBehaviour('Dragged');
    };

    const windowMouseUpCallback = (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (dragging) {
          var xLoc = e.screenX - wX;
          var yLoc = e.screenY - wY;

          try {
            // remote.getFocusedWindow().setPosition(xLoc, yLoc);
            electron.ipcRenderer.send('setPosition', {x: xLoc, y: yLoc});
          } catch (err) {
              console.log(err);
          }
        }

      };
    const mouseUpCallback = () => {
      dragging = false;
      
      this.setBuckyBehaviour('Standby');
      console.log('asynchronous-message', 'up')
    };
    document.getElementById('systembar').addEventListener('mousedown',(mouseDownCallback));

    window.addEventListener('mousemove',(windowMouseUpCallback));

    document.getElementById('systembar').addEventListener('mouseup',mouseUpCallback);
  }

  pluginIcoClick(event){
    event.preventDefault();

    var pluginMessage = document.getElementById("notification-message");
    if (pluginMessage !== null && pluginMessage !== undefined && pluginMessage.firstChild){
      while (pluginMessage.firstChild) {
        pluginMessage.removeChild(pluginMessage.firstChild);
      };
    }

    if (pluginMessage.style.display !== "none") {
      pluginMessage.style.display = "none";
    }

    var activatedPlugin = document.getElementById("notification-container");
    if (activatedPlugin !== null && activatedPlugin !== undefined && activatedPlugin.firstChild){
      while (activatedPlugin.firstChild) {
        activatedPlugin.removeChild(activatedPlugin.firstChild);
      };
      return; 
    }
    
    //get html of clicked plugin
    const pluginId = event.srcElement.pluginId;
    if (pluginId === undefined || pluginId === null || pluginId === ''){
      return;
    }
    const html = this.getPluginHtml(pluginId);
    let frag = document.createRange().createContextualFragment('<div id="activatedPlugin">' + html + '</div>');
    activatedPlugin.appendChild(frag);
  }
  
  private getPluginHtml(id:string) {
    const plugin = this.displayedPlugins.find(plugin => plugin.id === id);
    
    return plugin.defaultHtml;
  }
  
  private setBuckyBehaviour(bahaviourString: string) {

    const behaviour = this.buckyBehaviours.find(bb=> bb.actionTypeString.toLowerCase() === bahaviourString.toLowerCase());
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + behaviour.imageBytes);
    this.cdr.detectChanges();
  }
}
