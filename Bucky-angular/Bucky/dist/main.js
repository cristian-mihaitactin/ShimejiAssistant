"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var auth_service_1 = require("./auth/auth.service");
var bucky_profile_service_1 = require("./bucky_profile/bucky-profile.service");
var window_1 = require("./helpers/window");
//import { environment } from "environments/environment";
var buckyProfileService = new bucky_profile_service_1.BuckyProfileService();
var buckyProfile = buckyProfileService.getLocalBuckyProfile("8919e40e-d588-42f2-a0a8-4afb9ad1589b");
console.log("baseApiUrl" + process.env.baseApiUrl);
console.log(electron_1.app.getPath("userData"));
//const {createWindow} = require("./helpers/window");
var authService = new auth_service_1.AuthService();
//////////////////////////////////////
// Special module holding environment variables which you declared
// in config/env_xxx.json file.
// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
/*
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}
*/
// We can communicate with our window (the renderer process) via messages.
var initIpc = function () {
    electron_1.ipcMain.on("need-app-path", function (event, arg) {
        event.reply("app-path", electron_1.app.getAppPath());
    });
    electron_1.ipcMain.on("open-external-link", function (event, href) {
        electron_1.shell.openExternal(href);
    });
    electron_1.ipcMain.on("get-initial-bucky-profile", function (event, arg) {
        event.reply("bucky-profile", buckyProfile);
    });
};
electron_1.app.on("ready", function () {
    initIpc();
    var mainWindow = (0, window_1.default)("main", {
        width: 1000,
        height: 600,
        webPreferences: {
            // Two properties below are here for demo purposes, and are
            // security hazard. Make sure you know what you're doing
            // in your production app.
            nodeIntegration: true,
            contextIsolation: false,
            // Spectron needs access to remote module
            //enableRemoteModule: env.name === "test"
        }
    });
    var buckyWindow = (0, window_1.default)("antler", {
        width: 300,
        height: 300,
        transparent: true,
        frame: false,
        webPreferences: {
            // Two properties below are here for demo purposes, and are
            // security hazard. Make sure you know what you're doing
            // in your production app.
            nodeIntegration: true,
            contextIsolation: false,
            // Spectron needs access to remote module
            //enableRemoteModule: env.name === "test"
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "/../../mane-spa/dist/mane-spa/index.html"),
        protocol: "file:",
        slashes: true
    }));
    buckyWindow.loadURL(url.format({
        pathname: path.join(__dirname, "/../../Antler/dist/Antler/index.html"),
        protocol: "file:",
        slashes: true
    }));
    //buckyWindow.openDevTools();
    mainWindow.openDevTools();
    //////////////////testing the auth///////////
    // authService.register(
    //   {
    //     userName : "myNewUser",
    //     password : "123!@#qweQWE",
    //     confirmPassword: "123!@#qweQWE"
    //   }
    // ).subscribe(() => {
    //     console.log('Successfully registered');
    // },
    // error => console.log( error ));
    //////
    /*
      if (env.name === "development") {
        mainWindow.openDevTools();
        //buckyWindow.openDevTools();
      }
      */
});
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map