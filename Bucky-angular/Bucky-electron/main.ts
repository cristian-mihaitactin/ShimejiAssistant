import { environment } from "./environments/environment";
import { app, ipcMain,shell } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";
import { AuthService } from './auth/auth.service'
import {BuckyProfileService} from './bucky_profile/bucky-profile.service';
import { UserStore } from './helpers/user-store';
import createWindow from "./helpers/window";
import { UserService } from "./user/user.service";
import { BarnBuckyService } from "./barn-service/barn-bucky-service";

//import { environment } from "environments/environment";

const userStore = new UserStore({
  configName: environment.config,
  defaults: environment.default_user
});

const authService = new AuthService(userStore);

const barnService = new BarnBuckyService();
const userService = new UserService(userStore);
const buckyProfileService = new BuckyProfileService(
  userStore,  barnService
);

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
var mainBuckyProfile = buckyProfileService.getUserBuckyProfile();
// We can communicate with our window (the renderer process) via messages.
const initIpc = () => {
  ipcMain.on("need-app-path", (event, arg) => {
    event.reply("app-path", app.getAppPath());
  });
  ipcMain.on("open-external-link", (event, href) => {
    shell.openExternal(href);
  });

  ipcMain.on("get-initial-bucky-profile", (event,arg) => {
    mainBuckyProfile
      .subscribe(
        (value) => {
          event.reply("selected-bucky-profile", value);
        }
    )
  });
  ipcMain.on("get-all-bucky-profiles", (event,arg) => {
    console.log("in get-all-bucky-profiles")
    buckyProfileService.getAllBuckyProfilesWithoutBehaviours()
      .subscribe(
        (value) => {
          console.log("bucky-profiles: " + value);
          event.reply("bucky-profiles", value);
        }
    )
  });

  ipcMain.on("get-bucky-profile-by-id", (event,arg) => {
    console.log('get-bucky-profile-by-id: ' + arg);
    buckyProfileService.getBuckyProfileById(arg)
      .subscribe(
        (value) => {
          event.reply("bucky-profile", value);
        }
    )
  });

  
}

if (!environment.production){
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
}

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
      pathname: path.join(__dirname, `/../../Mane/dist/mane/index.html`),
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

  ipcMain.on("set-bucky-profile", (event,arg) => {
    console.log('set-bucky-profile: ' + arg);
    buckyProfileService.setBuckyProfileById(arg);
    var mainBuckyProfile = buckyProfileService.getUserBuckyProfile();
    mainBuckyProfile
    .subscribe(
      (value) => {
        console.log('set-bucky-profile sending ');
        buckyWindow.webContents.send("selected-bucky-profile", value);
      }
  );


    /*
      .subscribe(
        (value) => {
          event.reply("bucky-profile", value);
        }
    )
    */
  });
  
  ipcMain.on('login-request', (event, arg) => {
    console.log('register-request');
    console.log(arg);
    authService.login(arg).subscribe(
      {
        next: (value) => {
          console.log("login-reply");
          console.log(value);
          event.reply("login-reply", 
          {
            result: 'Logged In',
            isError: false,
            error: null 
          });
          mainWindow.webContents.send("logged-in", true);
        },
        error: (error) => {
          event.reply("login-reply", 
          {
            result: '',
            isError: true,
            error: error 
          });
        }
      }
    )
  });

  ipcMain.on('register-request', (event, arg) => {
    console.log('register-request');
    console.log(arg);
    authService.register(arg).subscribe(
      {
        next: (value) => {
          console.log("register-reply");
          event.reply("register-reply", 
          {
            result: 'Registered',
            isError: false,
            error: null 
          });
          mainWindow.webContents.send("logged-in", true);
        },
        error: (error) => {
          console.error("register-reply error");
          console.error(error);
          event.reply("register-reply", 
          {
            result: '',
            isError: true,
            error: error 
          });

        }
      });
    });

  ipcMain.on('logout-request', (event, arg) => {
    console.log('logout-request');
    authService.logout();
    mainWindow.webContents.send("logged-in", false);
  });
  //////////////////testing the auth///////////
  /*
authService.register(
  {
    userName : "myNewUser",
    password : "123!@#qweQWE",
    confirmPassword: "123!@#qweQWE"
  }
).subscribe(() => {
    console.log('Successfully registered');
},
error => console.log( error ));
*/
/*
var x = authService.login({
  username : "myNewUser",
    password : "123!@#qweQWE"
}).subscribe(val => {
  console.log('in login');
  console.log(val)
})
*/

//console.log('login:' + x);
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


