import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { BuckyBehaviourModel } from 'src/app/models/bucky-behaviour-model';
import { BuckyProfileService } from 'src/app/services/bucky-profile-service';

@Component({
  selector: 'app-assistant-profile',
  templateUrl: './assistant-profile.component.html',
  styleUrls: ['./assistant-profile.component.css']
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

  constructor(private _sanitizer: DomSanitizer,
    private buckyProfileService: BuckyProfileService,
    private cdr: ChangeDetectorRef) {


  }

  ngOnInit() {
    this.buckyProfileService.buckyProfile.subscribe((value) => {

      console.log(value.id);

      this.buckyBehaviours = value.behaviours;
      console.log(value.behaviours);

      if (value.behaviours.length > 0){
        console.log("In if");

        value.behaviours.forEach((behaviour, index) => {
          let imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + behaviour.imageBytes);
          this.images.push({path: imagePath});
        })

        //this.image = value.behaviours[0].imageBytes;
      }

      this.cdr.detectChanges();
    });
  }

}
