import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PluginDetailsModel } from '../../../models/plugin.details.model';

const electron = (<any>window).require('electron');

@Component({
  selector: 'app-plugin-details',
  templateUrl: './plugin-details.component.html',
  styleUrls: ['./plugin-details.component.css']
})
export class PluginDetailsComponent implements OnInit {

  imagePath!: SafeResourceUrl;
  pluginName!: string;
  pluginDescription!: string;
  pluginVersion!: string;
  
  @Input()
  pluginId!:string;
  

  constructor(private _sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef) {
      electron.ipcRenderer.on('plugin-details-response', (_event: any, arg: PluginDetailsModel) => {
        this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + arg.pluginImageBlob.pngBytes);
        this.pluginName = arg.name;
        this.pluginDescription = arg.description;
        this.pluginVersion = arg.version

        cdr.detectChanges();
      });// end
    }
  ngOnInit(): void {
    console.log('this.pluginId')
      console.log(this.pluginId)
    if (this.pluginId !== undefined && this.pluginId !== null && this.pluginId !== ''){
      electron.ipcRenderer.send('get-plugin-details', this.pluginId);
    }
  }

  ngOnChanges() {
    /**********THIS FUNCTION WILL TRIGGER WHEN PARENT COMPONENT UPDATES 'someInput'**************/
    //Write your code here
    if (this.pluginId !== undefined && this.pluginId !== null && (this.pluginId + '').split(' ').join('') !== ''){
      electron.ipcRenderer.send('get-plugin-details', this.pluginId);
      this.cdr.detectChanges();
    }
  }   

  installPlugin(event: Event) {
    
  }
}
