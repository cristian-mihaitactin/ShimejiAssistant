import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BuckyProfileModel } from '../../../models/bucky-profile-model';
import { BuckyBehaviourModel } from '../../../models/bucky-behaviour-model'
import { BuckyProfileService } from 'src/app/services/bucky-profile-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscriber, map, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
const electron = (<any>window).require('electron');

@Component({
  selector: 'app-bucky-profile-sample',
  templateUrl: './bucky-profile-sample.component.html',
  styleUrls: ['./bucky-profile-sample.component.css']
})
export class BuckyProfileSampleComponent implements OnInit {

  buckProfile: BuckyProfileModel = {id: "", isMainProfile: false, name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}; 
  imagePath!: SafeResourceUrl;
  recievedBuckyProfiles = new BehaviorSubject<BuckyProfileModel>(
    {id: "", isMainProfile: false, name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}
  );
  
  @Input()
  buckyProfileId!: string;

  constructor(
    private _sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
    ) {
      electron.ipcRenderer.on('bucky-profile-by-id', (_event: any, arg: BuckyProfileModel) => {
        console.log('in setBuckyProfile' + arg.id)
        this.recievedBuckyProfiles.next(arg);
        // recievedBuckyProfiles = new BehaviorSubject<BuckyProfileModel>(
        //   {id: "", name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}
        // );
        //recievedBuckyProfiles.complete();
      });
  }

  ngOnInit(): void {
    console.log('this.buckyProfileId')
    console.log('|' + this.buckyProfileId + '|')
    electron.ipcRenderer.send('get-bucky-profile-by-id', this.buckyProfileId);
    console.log("id recieved: " + this.buckyProfileId);
    this.recievedBuckyProfiles
    .pipe(
      filter( value => value.id === this.buckyProfileId)
    ).subscribe(
      (value) => {
        this.buckProfile = value;
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + value.behaviours[0].imageBytes);
      this.cdr.detectChanges();
      //y.unsubscribe();
    })
    //x.complete();
  }
}
