import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { PluginDetailsModel } from '../../../models/plugin.details.model';

const electron = (<any>window).require('electron');


@Component({
  selector: 'app-plugin-sample',
  templateUrl: './plugin-sample.component.html',
  styleUrls: ['./plugin-sample.component.css']
})
export class PluginSampleComponent implements OnInit {

  @Input()
  pluginId!:string;

  imagePath!: SafeResourceUrl;
  pluginName!: string;

  constructor(private _sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef) {
      electron.ipcRenderer.on('plugin-details-response', (_event: any, arg: PluginDetailsModel) => {
        if (arg.id === undefined || arg.id === null || arg.id !== this.pluginId){
          return;
        }
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + arg.pluginImageBlob.pngBytes);
        this.pluginName = arg.name;

        cdr.detectChanges();
      });// end

   }

  ngOnInit() {
    //plugin-details-response
    console.log('plugin-sample-component: plugindId: ', this.pluginId);
    if (this.pluginId !== undefined && this.pluginId !== null && this.pluginId !== '')
      electron.ipcRenderer.send('get-plugin-details', this.pluginId);

  }

}
