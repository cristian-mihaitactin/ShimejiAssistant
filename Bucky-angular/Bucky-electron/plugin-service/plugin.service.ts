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

const pluginRelativePath = "Plugins";
const pluginPackageEndpoint = "/api/Plugin"
const userPreferencesEndpoint = '/api/UserPeferences';

export class PluginService {
    pluginDirectory:string;

    registeredPlugins: BehaviorSubject<PluginModel[]>;
    /**
     *
     */
    constructor(private userStore: UserStore) {
        const userDataPath = app.getPath('userData');

        this.registeredPlugins = new BehaviorSubject<PluginModel[]>([]);

        this.pluginDirectory = path.join(userDataPath,pluginRelativePath);
        
        const userPlugins = userStore.get('pluginsInstalled')  as unknown as Array<PluginModel>;
        if (userPlugins !== undefined && userPlugins !== null && Array.isArray(userPlugins)) {
            console.log('userPlugins');
            console.log(userPlugins.length);
            if (userPlugins.length > 0)
            {
                console.log('userPlugins.length');
                console.log(userPlugins.length);
                this.registeredPlugins.next(userPlugins);
            } else {
                this.getUserPlugins();
            }
        }

        this.registeredPlugins.subscribe({
            //store all registered plugins in userstore
            next: (value) => {
                console.log('regitered plugins value')
                var existingPlugins:PluginModel[] = [];
                value?.forEach((plugin,index) => {
                    if (!existingPlugins.includes(plugin)){
                        //this.installPlugin(plugin);
                        this.callBarnWithAuth(this.userStore.getAuthTokens().access_token, userPreferencesEndpoint
                            + "/Plugin/" + plugin.id, "POST" as Method).subscribe({
                                error: (err) => {
                                    console.error(err);
                                }
                            })
                        existingPlugins.push(plugin);
                    }
                })
                userStore.set('pluginsInstalled', existingPlugins);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    getUserPlugins(){
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
                                this.registeredPlugins.next(val);
                            },
                            error: (err) => {
                                console.error(err);
                            }
                        });
                }
    }

    getAllPlugins() : Observable<PluginModel[]> {
        return this.callBarn(`${pluginPackageEndpoint}/`, "GET" as Method)
            .pipe(
                map(res => res.data as PluginModel[])
            );
    }

    getPluginDetails (id:string) : Observable<PluginDetailsModel> {
        return this.callBarn(`${pluginPackageEndpoint}/${id}/Details`, "GET" as Method)
            .pipe(
                map(res => res.data as PluginDetailsModel)
            );
    }

    clean() {
        const fsExtra = require('fs-extra')

        fsExtra.emptyDirSync(this.pluginDirectory);
    }

    installPluginById(id:string) {
        return this.callBarn(`${pluginPackageEndpoint}/${id}`, "GET" as Method)
            .pipe(
                map(res => res.data as PluginModel)
            )
            .subscribe({
                next: (value) => {
                    this.installPlugin(value);
                },
                error: (err) => {
                    console.error(err);
                }
            });
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

        this.callBarn(`${pluginPackageEndpoint}/${plugin.id}/PluginPackage`, "GET" as Method)
            .pipe(
                map(res => res.data as PluginPackageModel)
            ).subscribe({
                next: (value) => {
                    // copy to user storage
                    if (!fs.existsSync(path.join(this.pluginDirectory, plugin.name))) {
                        fs.mkdirSync(path.join(this.pluginDirectory, plugin.name))
                    }

                    const pluginZipPath = path.join(this.pluginDirectory, this.getPluginDirectoryName(plugin))
                    fs.writeFileSync(pluginZipPath  + '.zip', value.zipBytes, 'base64');

                    fs.createReadStream(pluginZipPath + '.zip')
                        .pipe(Extract({ path: pluginZipPath }));
                    // register plugin
                    const installedPlugin = {
                        id: plugin.id,
                        name: plugin.name,
                        version: plugin.version,
                        path: pluginZipPath,
                    }
                    const registeredPluginList = this.registeredPlugins.value;
                    if (registeredPluginList !== undefined && registeredPluginList !== null){
                        console.log('pushing to registeredPluginList')
                        if(!registeredPluginList.includes(installedPlugin)){
                            registeredPluginList.push(installedPlugin);
                            this.registeredPlugins.next(registeredPluginList);
                        }
                    }
                    else {
                        this.registeredPlugins.next([installedPlugin]);
                    }
                    
                }
            });
    }

    private getPluginDirectoryName(plugin: PluginModel) {
        return `${plugin.name}/${plugin.version}`
    }
    
    private callBarn(endpoint: string, method: Method) : Observable<AxiosResponse> {
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