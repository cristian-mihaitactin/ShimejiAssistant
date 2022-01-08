import { environment } from "./environments/environment";
import { app, ipcMain,shell } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";
import { AuthService } from './auth/auth.service'
import {BuckyProfileService} from './bucky_profile/bucky-profile.service';
import { UserStore } from './helpers/user-store';
import createWindow from "./helpers/window";

//import { environment } from "environments/environment";
const buckyProfileService = new BuckyProfileService();
var buckyProfile = buckyProfileService.getLocalBuckyProfile("8919e40e-d588-42f2-a0a8-4afb9ad1589b");

const authService = new AuthService();
const userStore = new UserStore({
  configName: environment.config,
  defaults: environment.default_user
});
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
const initIpc = () => {
  ipcMain.on("need-app-path", (event, arg) => {
    event.reply("app-path", app.getAppPath());
  });
  ipcMain.on("open-external-link", (event, href) => {
    shell.openExternal(href);
  });

  ipcMain.on("get-initial-bucky-profile", (event,arg) => {
    event.reply("bucky-profile", buckyProfile);
  });
};

app.on("ready", () => {
  initIpc();

  const mainWindow = createWindow("main", {
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
  const buckyWindow = createWindow("antler", {
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

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../mane-spa/dist/mane-spa/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  buckyWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../Antler/dist/Antler/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
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
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});


