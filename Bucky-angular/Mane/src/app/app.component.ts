import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Image Browser';

  // constructor(private imageService: ImagesService) {}
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log(this.router.url);

    //this.imageService.navigateDirectory('.');
  }
}
