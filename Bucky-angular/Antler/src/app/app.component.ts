import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BuckyProfileService } from './services/bucky-profile-service'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BuckyBehaviourModel } from './models/bucky-behaviour-model';
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
  buckyBehaviours: BuckyBehaviourModel[];

  constructor(private _sanitizer: DomSanitizer,
    private buckyProfileService: BuckyProfileService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    // Make the DIV element draggable:
    //this.dragElement(document.getElementById("mydiv"));

    console.log('AppComponent-ngOnInit');
    /*
    console.log(this.buckyProfileService.buckyProfile);
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
                 + this.buckyProfileService.buckyProfile.behaviours[0].imageBytes);
    */
    this.buckyProfileService.buckyProfile.subscribe((value) => {
      this.buckyBehaviours = value.behaviours;

      if (value.behaviours.length > 0){

        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + value.behaviours[0].imageBytes);
        //this.image = value.behaviours[0].imageBytes;
      }

      this.cdr.detectChanges();
    });
//////////////////////////////////////////////////////////
let wX;
  let wY;
  let dragging = false;

  document.getElementById('systembar').addEventListener('mousedown',(function (e) {
      console.log('asynchronous-message', 'down')
      dragging = true;
      wX = e.pageX;
      wY = e.pageY;
  }));

  window.addEventListener('mousemove',(function (e) {
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
  }));

  document.getElementById('systembar').addEventListener('mouseup',(function () {
      dragging = false;
      console.log('asynchronous-message', 'up')
  }));







  }
  
  
}
