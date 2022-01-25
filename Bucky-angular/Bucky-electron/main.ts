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
import { Subject } from "rxjs";
import { PluginService } from "./plugin-service/plugin.service";

//import { environment } from "environments/environment";

if (!environment.production){
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
}

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

const pluginService = new PluginService(userStore);


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
    //mainBuckyProfile
    buckyProfileService.getUserBuckyProfile()
      .subscribe({
        next: (value) => {
          event.reply("selected-bucky-profile", value);
        },
        error: (error) => {
          console.error(error);
        }
      })
  });
  ipcMain.on("get-all-bucky-profiles", (event,arg) => {
    console.log("in get-all-bucky-profiles")
    buckyProfileService.getAllBuckyProfilesWithoutBehaviours()
      .subscribe({
        next: (value) => {
          console.log("bucky-profiles: " + value);
          event.reply("bucky-profiles", value);
        },
        error: (error) => {
          console.error(error);
        }
      })
  });

  ipcMain.on("get-bucky-profile-by-id", (event,arg) => {
    console.log('get-bucky-profile-by-id: ' + arg);
    if(arg !== undefined && arg !== null) {
      buckyProfileService.getBuckyProfileById(arg)
        .subscribe({
          next: (value) => {
            event.reply("bucky-profile-by-id", value);
          },
          error: (error) => {
            console.error(error);
          }
        })

    }
  });

  ipcMain.on("get-bucky-assitant-profile-by-id", (event,arg) => {
    console.log('get-bucky-assitant-profile-by-id', arg);
    if(arg !== undefined && arg !== null) {
      buckyProfileService.getBuckyProfileById(arg)
        .subscribe({
          next: (value) => {
            event.reply("bucky-assistant-profile-by-id", value);
          },
          error: (error) => {
            console.error(error);
          }
        })
    }
  });

  
  ipcMain.on("get-user-plugins", (event,arg) => {
    pluginService.registeredPlugins
      .subscribe({
        next: (value) => {
          console.log('in get-user-plugins');
          event.reply("user-plugins-response", value);
        },
        error: (err) => {
          console.error(err);
        }
      });
  });

  ipcMain.on("get-all-plugins", (event,arg) => {
    pluginService.getAllPlugins()
      .subscribe({
        next: (value) => {
          event.reply("all-plugins-response", value);
        },
        error: (err) => {
          console.error(err);
        }
      })
  });

  ipcMain.on("get-plugin-details", (event,arg) => {
    pluginService.getPluginDetails(arg)
      .subscribe({
        next: (value) => {
          event.reply("plugin-details-response", value);
        },
        error: (err) => {
          console.error(err);
        }
      })
  });
  
  ipcMain.on("get-plugin-sample", (event,arg) => {
    pluginService.getPluginDetails(arg)
      .subscribe({
        next: (value) => {
          event.reply("plugin-sample-response", value);
        },
        error: (err) => {
          console.error(err);
        }
      })
  });

  ipcMain.on("install-plugin-request", (event, arg) => {
    pluginService.installPluginById(arg);
  });
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
      enableRemoteModule: true
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

  buckyWindow.setAlwaysOnTop(true, 'screen');

  buckyWindow.openDevTools();
  mainWindow.openDevTools();

  ipcMain.on("is-logged-in", (event,arg) => {
    if (userService.userIsLoggedIn()){
      event.reply("logged-in", true);
    } else {
      event.reply("logged-in", false);
    }
  });

  ipcMain.on("setPosition", (event,arg) => {
    // buckyWindow.setPosition(arg.x, arg.y);
    buckyWindow.setBounds({
      width: buckyWindow.getSize()[0],
      height: buckyWindow.getSize()[1],
      x: arg.x,
      y: arg.y
  });
  });

  ipcMain.on("set-bucky-profile", (event,arg) => {
    console.log('set-bucky-profile: ' + arg);
    buckyProfileService.setBuckyProfileById(arg);
    mainBuckyProfile = buckyProfileService.getUserBuckyProfile();
    mainBuckyProfile
    .subscribe({
      next: (value) => {
        console.log('set-bucky-profile sending ');
        buckyWindow.webContents.send("selected-bucky-profile", value);
      },
      error: (error) => {
        console.error(error);
      }
    });
  });
  
  
  ipcMain.on("user-info-request", (event,arg) => {
    console.log('user-info');
    console.log(authService.userBehaviour.getValue())
    event.reply('user-info-reply', authService.userBehaviour.getValue())
  });
  
  authService.userBehaviour.subscribe({
    next: (value) => {
      console.log('user-info - subscribed');
      console.log(value)
      mainWindow.webContents.send('user-info-reply', value)
    },
    error: (error) => {
      console.error(error);
    }
  });

  ipcMain.on('login-request', (event, arg) => {
    authService.login(arg).subscribe(
      {
        next: (value) => {
          event.reply("login-reply", 
          {
            result: 'Logged In',
            isError: false,
            error: null 
          });
          userService.userIsLoggedIn();
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
    authService.register(arg).subscribe(
      {
        next: (value) => {
          event.reply("register-reply", 
          {
            result: 'Registered',
            isError: false,
            error: null 
          });
          mainWindow.webContents.send("logged-in", true);
        },
        error: (error) => {
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
    authService.logout();
    pluginService.clean();
    mainWindow.webContents.send("logged-in", false);
  });

//////////////////

pluginService.registeredPlugins.subscribe({
  next: (value) => {
    console.log(value);
  },
  error: (err) => {
    console.error(err);
  }
});
/*
var x = './Plugin/main.js';
import(x).then((a) => {
  // `a` is imported and can be used here
  var subject = new Subject<{notificationMessage: string;
    actionType: number}>();
  a.Plugin(subject, "18", "41");
  subject.subscribe({
    next: (val) => {
      console.log(val);
    },
    error: (val) => {
      console.log(val);
    }
  })
});
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

