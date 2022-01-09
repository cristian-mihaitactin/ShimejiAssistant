import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BuckyProfileModel } from '../../../models/bucky-profile-model';
import { BuckyBehaviourModel } from '../../../models/bucky-behaviour-model'
import { BuckyProfileService } from 'src/app/services/bucky-profile-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-bucky-profile-sample',
  templateUrl: './bucky-profile-sample.component.html',
  styleUrls: ['./bucky-profile-sample.component.css']
})
export class BuckyProfileSampleComponent implements OnInit {

  buckProfile: BuckyProfileModel = {id: "", name: "", description: "", behaviours: new Array<BuckyBehaviourModel>()}; 
  imagePath!: SafeResourceUrl;

  @Input()
  buckyProfileId!: string;

  constructor(
    private _sanitizer: DomSanitizer,
    private buckyProfileService: BuckyProfileService,
    private cdr: ChangeDetectorRef
    ) {
    this.buckyProfileService = buckyProfileService;
  }

  ngOnInit(): void {
    console.log("id recieved: " + this.buckyProfileId);
    this.buckyProfileService.getBuckyProfile(this.buckyProfileId).subscribe(
      (value) => {
        this.buckProfile = value;
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + value.behaviours[0].imageBytes);

      this.cdr.detectChanges();
    })
  }

}
