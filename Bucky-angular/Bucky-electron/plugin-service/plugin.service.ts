import { app } from "electron";
import { environment } from "../environments/environment";

import { BehaviorSubject, from, fromEventPattern, map, Observable, of, Subject } from "rxjs";
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

const pluginRelativePath = "Plugins";
const pluginPackageEndpoint = "/api/Plugin"
const userPreferencesEndpoint = '/api/UserPeferences';

export class PluginService {
    pluginDirectory:string;

    //registeredPlugins: BehaviorSubject<PluginModel[]>;
    /**
     *
     */

    registeredPlugins: BehaviorSubject<RegisteredPlugin[]>;

    constructor(private userStore: UserStore) {
        const userDataPath = app.getPath('userData');
        this.registeredPlugins = new BehaviorSubject<RegisteredPlugin[]>([]);

        this.registeredPlugins.subscribe({
            //store all registered plugins in userstore
            next: (value) => {
                console.log('regitered plugins value')
                var existingPlugins:RegisteredPlugin[] = [];
                value?.forEach((plugin,index) => {
                    if (!existingPlugins.includes(plugin)){
                        this.callBarnWithAuth(this.userStore.getAuthTokens().access_token, userPreferencesEndpoint
                            + "/Plugin/" + plugin.pluginModel.id, "POST" as Method).subscribe({
                                error: (err) => {
                                    console.error(err);
                                }
                            });
                        existingPlugins.push(plugin);
                    }
                }); 
                userStore.set('pluginsInstalled', existingPlugins);
            },
            error: (err) => {
                console.error(err);
            }
        });

        this.pluginDirectory = path.join(userDataPath, 'dist' ,pluginRelativePath);
        
        const userPlugins = userStore.get('pluginsInstalled')  as unknown as Array<PluginModel>;
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
        return this.callBarnWithoutCreds(`${pluginPackageEndpoint}/`, "GET" as Method)
            .pipe(
                map(res => res.data as PluginModel[])
            );
    }

    getPluginDetails (id:string) : Observable<PluginDetailsModel> {
        return this.callBarnWithoutCreds(`${pluginPackageEndpoint}/${id}/Details`, "GET" as Method)
            .pipe(
                map(res => res.data as PluginDetailsModel)
            );
    }

    clean() {
        const fsExtra = require('fs-extra')

        fsExtra.emptyDirSync(this.pluginDirectory);
    }

    registerUserPlugins(){
        const authtokens = this.userStore.getAuthTokens();
                if(authtokens !== undefined && authtokens !== null){
                    this.callBarnWithAuth(this.userStore.getAuthTokens().access_token, userPreferencesEndpoint, "GET" as Method)
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

    private getPluginModelByIdFromBarn(id:string) : Observable<PluginModel> {
        return this.callBarnWithoutCreds(`${pluginPackageEndpoint}/${id}`, "GET" as Method)
            .pipe(
                map(res => res.data as PluginModel)
            );
    }

    private downloadAndInstallPlugin(userPlugin: PluginModel){
        if (fs.existsSync(userPlugin.path)){
            return;
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
    }

    private installPluginPackageBinaries(plugin: PluginModel) {
        console.log('installing package')

        this.callBarnWithoutCreds(`${pluginPackageEndpoint}/${plugin.id}/PluginPackage`, "GET" as Method)
            .pipe(
                map(res => res.data as PluginPackageModel)
            ).subscribe({
                next: (value) => {
                    // copy to user storage
                    const pluginMainPath = path.join(this.pluginDirectory, value.name);
                    if (!fs.existsSync(pluginMainPath)) {
                        fs.mkdirSync(pluginMainPath, { recursive: true });
                    }

                    const pluginZipPath = path.join(pluginMainPath, value.fileName)
                    fs.writeFileSync(pluginZipPath, value.zipBytes, 'base64');

                    const pluginFinalPath = path.join(pluginMainPath, value.version);
                    fs.createReadStream(pluginZipPath)
                        .pipe(Extract({ path: pluginFinalPath }));
                    
                    // register plugin
                    const installedPluginModel = {
                        id: plugin.id,
                        name: value.name,
                        version: value.version,
                        path: pluginFinalPath,
                    } as PluginModel;

                    this.importPlugin(installedPluginModel);
                }
            });
    }

    private importPlugin(pluginModel: PluginModel){
/*
        const x = (async () => {
  
            let file = pluginModel.path + "/main.js";
          
            const f = await import(file);
            return f;
          })().then(f => {
            
            var eventHandlerIn = new Subject<PluginNotification>();
            var eventHandlerOut = new Subject<PluginNotification>();

            const s = new f.default(eventHandlerIn,eventHandlerOut, 'id');
            console.log(s.html);
          })
            .catch(error => {
              // Handle/report error
              console.error(error);
            });
*/

        import(pluginModel.path + "/main.js").then((a) => {
        // `a` is imported and can be used here
        var eventHandlerIn = new Subject<PluginNotification>();
        var eventHandlerOut = new Subject<PluginNotification>();

        
          
        const importedPlugin = new a.Plugin(eventHandlerIn,eventHandlerOut, pluginModel.id) as IPlugin;

        eventHandlerIn.subscribe({
        next: (val) => {
            console.log(val);
        },
        error: (val) => {
            console.log(val);
        }
        });

        eventHandlerOut.subscribe({
            next: (val) => {
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
    
    private callBarnWithoutCreds(endpoint: string, method: Method) : Observable<AxiosResponse> {
        const options = {
            baseURL: `${environment.baseApiUrl}`,
            url: endpoint,
            method: method, //"POST" as Method,
        }
        
        return Axios.request(options)
    }

    private callBarnWithAuth(accessToken,endpoint: string, method: Method) : Observable<AxiosResponse> {
        const options = {
            baseURL: `${environment.baseApiUrl}`,
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            url: endpoint,
            method: method //"POST" as Method,
        }
        
        return Axios.request(options)
    }
}