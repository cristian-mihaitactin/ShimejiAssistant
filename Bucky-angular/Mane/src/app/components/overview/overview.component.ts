import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BuckyProfileService } from '../../services/bucky-profile-service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  testProfile:string = "";
  showBuckyProfileSample: boolean = false;

  constructor(
    private buckyProfileService: BuckyProfileService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.buckyProfileService.getBuckyProfiles()
    .subscribe(v => {
      if(v !== undefined && Array.isArray(v) && v.length > 0) {
        this.testProfile = v[1].id;
        console.log("in overview:" + v[1].id);
        this.showBuckyProfileSample = true;
        this.cdr.detectChanges();
      }
    })
  }

}
