import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BuckyProfileService } from './services/bucky-profile-service'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BuckyBehaviourModel } from './models/bucky-behaviour-model';
import { BehaviorSubject } from 'rxjs';
import { BuckyProfileModel } from './models/bucky-profile-model';
import { delay } from 'rxjs-compat/operator/delay';
import { PluginDetailsModel } from './models/plugin.details.model';
import { PluginModel } from './models/plugin.model';
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
          //electron.ipcRenderer.send('get-initial-bucky-profile', '');
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
     }

  ngOnInit() {
    console.log('this.pluginService.testing_GetPluginHtml()');
    //console.log(this.pluginService.testing_GetPluginHtml());
    this.buckyProfile.subscribe((value) => {
      this.buckyBehaviours = value.behaviours;

      if (value.behaviours.length > 0){

        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + value.behaviours[0].imageBytes);
        //this.image = value.behaviours[0].imageBytes;
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


    /*
    
    function pluginClick(event,data) {
      var input = document.getElementById("appt");
      console.log(input.value);
      var timeArray = input.value.split(':');
    
    const alarmEvent = new CustomEvent('plugin-input', {
        pluginName: '76433374-9d88-43f9-aaa1-c6a9c1c8592e',
        data: {
            action: 'add',
            hour: timeArray[0],
            minute:timeArray[1]
        }
    });
  
    dispatchEvent(alarmEvent);
    }
    
    */

    window.addEventListener('plugin-input', (e) => {
      console.log('plugin-input:',e);
      // electron.ipcRenderer.send('plugin-input', e.);

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
    console.log('pluginIcoClick:', event);

    var activatedPlugin = document.getElementById("activatedPlugin");

    if (activatedPlugin !== null && activatedPlugin !== undefined){
      activatedPlugin.parentElement.removeChild(activatedPlugin);
    }
    
    //get html of clicked plugin
    const pluginId = event.srcElement.pluginId;
    if (pluginId === undefined || pluginId === null || pluginId === ''){
      return;
    }
    const html = this.getPluginHtml(pluginId);
    let frag = document.createRange().createContextualFragment('<div id="activatedPlugin">' + html + '</div>');
    document.getElementById('notification-container').appendChild(frag);
  }
  
  private getPluginHtml(id:string) {
    const plugin = this.displayedPlugins.find(plugin => plugin.id === id);
    
    return plugin.defaultHtml;
  }
  
  private setBuckyBehaviour(bahaviourString: string) {
    const behaviour = this.buckyBehaviours.find(bb=> bb.actionTypeString === bahaviourString);
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + behaviour.imageBytes);
      this.cdr.detectChanges();
  }
}
