import { app } from "electron";
import { environment } from "../environments/environment";

import { BehaviorSubject, flatMap, from, fromEventPattern, map, Observable, of, Subject } from "rxjs";
import { AxiosResponse, Method } from "axios";
import Axios from "axios-observable";
import * as path from "path";
import * as fs from "fs";
import { Extract } from 'unzip-stream'

import { UserStore } from "../helpers/user-store";
import { PluginModel } from "../models/plugin.model";
import { PluginPackageModel } from "../models/plugin.package.model";
import { PluginDetailsModel } from "../models/plugin.details.model";
import { read } from "fs-jetpack";
import { PluginNotification } from "../models/plugin.notification";
import { IPlugin } from "../models/iplugin";
import { RegisteredPlugin } from "../models/registered.plugin";
import { PluginInput } from "../models/plugin.input";
import { BarnBuckyService } from "../barn-service/barn-bucky-service";

const pluginRelativePath = "Plugins";
const pluginPackageEndpoint = "/api/Plugin"
const userPreferencesEndpoint = '/api/UserPeferences';

export class PluginService {
    pluginDirectory:string;
    registeredPlugins: BehaviorSubject<RegisteredPlugin[]>;
    pluginHandlers: Map<string, {eventHandlerIn: Subject<PluginInput>, eventHandlerOut: Subject<PluginNotification>}>

    constructor(private userStore: UserStore, 
        private barnService: BarnBuckyService) {
        const userDataPath = app.getPath('userData');

        this.registeredPlugins = new BehaviorSubject<RegisteredPlugin[]>([]);
        this.pluginHandlers = new Map<string, {eventHandlerIn: Subject<PluginInput>, eventHandlerOut: Subject<PluginNotification>}>();

        const userPlugins = userStore.get('pluginsInstalled')  as unknown as Array<PluginModel>;

        this.registeredPlugins.subscribe({
            //store all registered plugins in userstore
            next: (value) => {
                console.log('regitered plugins value')
                var existingPlugins:PluginModel[] = [];
                value?.forEach((plugin,index) => {
                    if (!existingPlugins.includes(plugin.pluginModel)){
                        this.barnService.callBarn(userPreferencesEndpoint
                            + "/Plugin/" + plugin.pluginModel.id, "POST" as Method).subscribe({
                                error: (err) => {
                                    console.error(err);
                                }
                            });
                        existingPlugins.push(plugin.pluginModel);

                        this.pluginHandlers.set(plugin.plugin.id,
                            {
                                eventHandlerIn: plugin.plugin.eventHandlerIn,
                                eventHandlerOut: plugin.plugin.eventHandlerOut
                            });
                    }
                }); 

                userStore.set('pluginsInstalled', existingPlugins);
            },
            error: (err) => {
                console.error(err);
            }
        });// end registeredPlugins subscribe

        this.pluginDirectory = path.join(userDataPath ,pluginRelativePath);
        
        if (userPlugins !== undefined && userPlugins !== null && Array.isArray(userPlugins)) {
            if (userPlugins.length > 0)
            {
                userPlugins.forEach((userPlugin,index) => {
                    this.downloadAndInstallPlugin(userPlugin);
                });
            }
        }

        //if logged in, get user plugins
        var authTokens = this.userStore.getAuthTokens();
        if (authTokens !== undefined && authTokens !== null) {
            this.registerUserPlugins();
        }
    }
    
    installPluginById(id:string) {
        this.getPluginModelByIdFromBarn(id)
            .subscribe({
                next: (value) => {
                    this.installPlugin(value);
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }

    getAllPlugins() : Observable<PluginModel[]> {
        return this.barnService.callBarn(`${pluginPackageEndpoint}/`, "GET" as Method)
            .pipe(
                map(res => res.data as PluginModel[])
            );
    }

    getPluginDetails (id:string) : Observable<PluginDetailsModel> {
        var pluginFound = this.registeredPlugins.value.find(profile => profile.plugin.id === id);
        if (pluginFound !== undefined && pluginFound !== null){
            console.log('getPluginDetails FOUND');
            const pluginDetails = {
                id: pluginFound.pluginModel.id,
                name: pluginFound.pluginModel.name,
                description: pluginFound.pluginModel.description,
                version: pluginFound.pluginModel.version,
                html: pluginFound.plugin.getHtml(),
                pluginImageBlob: {
                    icoBytes: '',
                    pngBytes: '',
                    svgBytes: ''
                }
            } as PluginDetailsModel;

            pluginDetails.pluginImageBlob.icoBytes = fs.readFileSync(path.join(pluginFound.pluginModel.path,'../','ico' + '.ico'), 'base64');
            pluginDetails.pluginImageBlob.pngBytes = fs.readFileSync(path.join(pluginFound.pluginModel.path,'../','png' + '.png'), 'base64');
            pluginDetails.pluginImageBlob.svgBytes = fs.readFileSync(path.join(pluginFound.pluginModel.path,'../','svg' + '.svg'), 'base64');

            return of(pluginDetails);
        } else {
            console.log('getPluginDetails NOOOOT FOUND');

            return this.getPluginDetailsFromBarn(id);
        }
        
        /*
         id: string,
    name: string,
    description: string,
    version: string,
    html:string,
    pluginImageBlob: {
      icoBytes: string,
      svgBytes: string,
      pngBytes: string
    }
        */

    }

    private getPluginDetailsFromBarn(id:string): Observable<PluginDetailsModel>{
        return this.barnService.callBarn(`${pluginPackageEndpoint}/${id}/Details`, "GET" as Method)
        .pipe(
            map(res => res.data as PluginDetailsModel),
            map(pdm => {
                var registeredPlugin = this.registeredPlugins.value.find(element => element.plugin.id === id);
                pdm.html = registeredPlugin !== undefined && registeredPlugin !== null ? registeredPlugin.plugin.getHtml(): '';

                return pdm;
            })
        );
    }

    clean() {
        const fsExtra = require('fs-extra')

        fsExtra.emptyDirSync(this.pluginDirectory);
    }

    registerUserPlugins(){
        const authtokens = this.userStore.getAuthTokens();
                if(authtokens !== undefined && authtokens !== null){
                    this.barnService.callBarn(userPreferencesEndpoint, "GET" as Method)
                        .pipe(
                            map(res => res.data),
                            map(userpref => userpref.plugins as Array<PluginModel>)
                        ).subscribe({
                            next: (val) => {
                                console.log('val for subscribe');
                                console.log(val);
                                if (val !== undefined && val !== null) {
                                    val.forEach((plugin, index) => {
                                        this.downloadAndInstallPlugin(plugin);
                                    })
                                }
                            },
                            error: (err) => {
                                console.error(err);
                            }
                        });
                }
    }

    handlePluginInput(pluginInput: PluginInput) {
        var eventHandlers = this.pluginHandlers.get(pluginInput.pluginId);

        if (eventHandlers !== undefined && eventHandlers !== null){
            eventHandlers.eventHandlerIn.next(pluginInput);
        }
    }

    private getPluginModelByIdFromBarn(id:string) : Observable<PluginModel> {
        return this.barnService.callBarn(`${pluginPackageEndpoint}/${id}`, "GET" as Method)
            .pipe(
                map(res => res.data as PluginModel)
            );
    }

    private downloadAndInstallPlugin(userPlugin: PluginModel){
        if (fs.existsSync(userPlugin.path)){
            const pluginModelString = fs.readFileSync(path.join(userPlugin.path,'details') + '.json', 'utf8');
            const pluginModel = JSON.parse(pluginModelString) as PluginModel;
            this.importPlugin(pluginModel);
        } else {
            this.getPluginModelByIdFromBarn(userPlugin.id)
                .subscribe({
                    next: (value) => {
                        this.installPlugin(value);
                    },
                    error: (err) => {
                        console.error(err);
                    }
                });
        }
    }

    private installPlugin(plugin:PluginModel) {
        // Check if plugin already installed
        var pluginPackageDirPath = path.join(this.pluginDirectory, plugin.name);
        if (fs.existsSync(pluginPackageDirPath)) {
            var pluginPackageVersionDirPath = path.join(pluginPackageDirPath, plugin.version);

            // Check if this version of plugin exists
            if (!fs.existsSync(pluginPackageVersionDirPath)) {
                this.installPluginPackageBinaries(plugin);
            }
        } else {
            this.installPluginPackageBinaries(plugin);
        }

        //plugin already installed
        this.importPlugin(plugin);
    }

    private installPluginPackageBinaries(plugin: PluginModel) {
        console.log('installing package:', plugin)

        this.barnService.callBarn(`${pluginPackageEndpoint}/${plugin.id}/PluginPackage`, "GET" as Method)
            .pipe(
                map(res => res.data as PluginPackageModel)
            ).subscribe({
                next: (value) => {
                    // copy to user storage
                    const pluginMainPath = path.join(this.pluginDirectory, value.name);
                    if (!fs.existsSync(pluginMainPath)) {
                        fs.mkdirSync(pluginMainPath, { recursive: true });
                    }
                    //Write ico file
                    fs.writeFileSync(path.join(pluginMainPath,'ico') + '.ico', value.pluginImagesBlob.icoBytes, 'base64');
                    fs.writeFileSync(path.join(pluginMainPath,'png') + '.png', value.pluginImagesBlob.pngBytes, 'base64');
                    fs.writeFileSync(path.join(pluginMainPath,'svg') + '.svg', value.pluginImagesBlob.svgBytes, 'base64');

                    const pluginZipPath = path.join(pluginMainPath, value.fileName)
                    fs.writeFileSync(pluginZipPath, value.zipBytes, 'base64');

                    const pluginFinalPath = path.join(pluginMainPath, value.version);
                    fs.createReadStream(pluginZipPath)
                        .pipe(
                            Extract({ path: pluginFinalPath })
                                .on('finish', () => {
                                    // register plugin
                                    const installedPluginModel = {
                                        id: plugin.id,
                                        name: value.name,
                                        version: value.version,
                                        path: pluginFinalPath,
                                        description: plugin.description
                                    } as PluginModel;

                                    fs.writeFileSync(path.join(pluginFinalPath,'details') + '.json', JSON.stringify(installedPluginModel), 'utf8');

                                    console.log('installedPluginModel: ', installedPluginModel);
                                    this.importPlugin(installedPluginModel);     
                           })
                        );
                }
            });
    }

    private importPlugin(pluginModel: PluginModel){
        const pluginPath = pluginModel.path ?? path.join(this.pluginDirectory, pluginModel.name, pluginModel.version);
        
        console.log('pluginPath', pluginPath)
        console.log('fs.existsSync(pluginPath)', fs.existsSync(pluginPath))
        if (!fs.existsSync(pluginPath)){
            return;
        }

        pluginModel.path = pluginPath;
        import(pluginModel.path + "/main.js").then((a) => {
        // `a` is imported and can be used here
        var eventHandlerIn = new Subject<PluginInput>();
        var eventHandlerOut = new Subject<PluginNotification>();

        const importedPlugin = new a.Plugin(eventHandlerIn,eventHandlerOut, pluginModel.id) as IPlugin;
        eventHandlerIn.subscribe({
        next: (val) => {
            console.log('in plugin input')
            console.log(val);
        },
        error: (val) => {
            console.log(val);
        }
        });

        eventHandlerOut.subscribe({
            next: (val) => {
                console.log('in plugin output')
                console.log(val);
            },
            error: (val) => {
                console.log(val);
            }
        });

        const registeredPlugin = {
            plugin: importedPlugin,
            pluginModel: pluginModel
        };

        const existingPlugins = this.registeredPlugins.value;

        if (!existingPlugins.includes(registeredPlugin)) {
            existingPlugins.push(registeredPlugin);
            this.registeredPlugins.next(existingPlugins);
        };
    });
    }
}