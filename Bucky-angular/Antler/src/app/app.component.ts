import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BuckyProfileService } from './services/bucky-profile-service'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BuckyBehaviourModel } from './models/bucky-behaviour-model';
import { BehaviorSubject } from 'rxjs';
import { BuckyProfileModel } from './models/bucky-profile-model';
import { delay } from 'rxjs-compat/operator/delay';
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

  constructor(private _sanitizer: DomSanitizer,
    // private buckyProfileService: BuckyProfileService,
    private cdr: ChangeDetectorRef) { 
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
     }

  ngOnInit() {
    // Make the DIV element draggable:
    //this.dragElement(document.getElementById("mydiv"));

    console.log('AppComponent-ngOnInit');
    /*
    console.log(this.buckyProfileService.buckyProfile);
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
                 + this.buckyProfileService.buckyProfile.behaviours[0].imageBytes);
    */

    electron.ipcRenderer.send('get-initial-bucky-profile', '');

    this.buckyProfile.subscribe((value) => {
      this.buckyBehaviours = value.behaviours;

      if (value.behaviours.length > 0){

        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + value.behaviours[0].imageBytes);
        //this.image = value.behaviours[0].imageBytes;
      }

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
  
  private setBuckyBehaviour(bahaviourString: string) {
    const behaviour = this.buckyBehaviours.find(bb=> bb.actionTypeString === bahaviourString);
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + behaviour.imageBytes);
      this.cdr.detectChanges();
  }
}
