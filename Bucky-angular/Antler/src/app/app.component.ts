import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BuckyProfileService } from './services/bucky-profile-service'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BuckyBehaviourModel } from './models/bucky-behaviour-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  imagePath: SafeResourceUrl;
  image: string;
  buckyBehaviours: BuckyBehaviourModel[];

  constructor(private _sanitizer: DomSanitizer,
    private buckyProfileService: BuckyProfileService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    /*
    console.log(this.buckyProfileService.buckyProfile);
    this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
                 + this.buckyProfileService.buckyProfile.behaviours[0].imageBytes);
    */
    this.buckyProfileService.buckyProfile.subscribe((value) => {

      console.log(value.id);

      this.buckyBehaviours = value.behaviours;
      console.log(value.behaviours);

      if (value.behaviours.length > 0){
        console.log("In if");

        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + value.behaviours[0].imageBytes);
        this.image = value.behaviours[0].imageBytes;
      }

      this.cdr.detectChanges();
    });

                 /*

    this.imageService.directory.subscribe((value) => {
      this.directory = value;
      this.cdr.detectChanges();
    });
    */
  }
}
