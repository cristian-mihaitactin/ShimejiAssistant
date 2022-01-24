import { app } from "electron";
import { environment } from "../environments/environment";

import { BehaviorSubject, from, fromEventPattern, map, Observable, of } from "rxjs";
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
        if (userPlugins !== undefined && userPlugins !== null) {
            console.log('userPlugins', userPlugins);
            console.log('userPlugins.length', userPlugins.length);
            console.log('typeof userPlugins', typeof userPlugins);
            if (userPlugins.length > 0)
            {
                // install plugin
                userPlugins.forEach((plugin,index) => {
                    console.log('plugin')
                    console.log(plugin)
                    this.installPlugin(plugin);
                });
            }
        }
        
    }

    getAllPlugins() : Observable<PluginModel[]> {
        return this.callBarn(`${pluginPackageEndpoint}/`, "GET" as Method, null)
            .pipe(
                map(res => res.data as PluginModel[])
            );
    }

    getPluginDetails (id:string) : Observable<PluginDetailsModel> {
        return this.callBarn(`${pluginPackageEndpoint}/${id}`, "GET" as Method, null)
            .pipe(
                map(res => res.data as PluginDetailsModel)
            );
    }

    clean() {
        console.log('in clean')
        const fsExtra = require('fs-extra')

        fsExtra.emptyDirSync(this.pluginDirectory);
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

        this.callBarn(`${pluginPackageEndpoint}/${plugin.id}/PluginPackage`, "GET" as Method, null)
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
                    const registeredPluginList = this.registeredPlugins.value;
                    registeredPluginList.push({
                        id: plugin.id,
                        name: plugin.name,
                        version: plugin.version,
                        path: pluginZipPath,
                    });
                    this.registeredPlugins.next(registeredPluginList);
                }
            });
    }

    private getPluginDirectoryName(plugin: PluginModel) {
        return `${plugin.name}/${plugin.version}`
    }
    
    private callBarn(endpoint: string, method: Method, params: URLSearchParams) : Observable<AxiosResponse> {
        const options = {
            baseURL: `${environment.baseApiUrl}`,
            url: endpoint,
            method: method, //"POST" as Method,
            params: params,
        }
        
        return Axios.request(options)
    }
}