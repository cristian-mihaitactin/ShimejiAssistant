


import { IPlugin } from "interfaces/iplugin";
import { PluginNotification } from "interfaces/plugin.notification";
import { Subject } from "rxjs";


let plugin: IPlugin;
 
plugin = (eventHandler:Subject<PluginNotification>, argv: string[]): boolean => {
    var time = argv[0].split(':');

    // Each plugin receives an even handler with which it communicates with the electron app (ping when ready)
    
    function checkTime () {
      var now = new Date();
      
      var toUTC = new Date();
      toUTC.setHours(parseInt(time[0]))
      toUTC.setMinutes(parseInt(time[1]))
    
      console.log(now.toUTCString());
      console.log(toUTC.toUTCString()
      );
      console.log((now.getUTCHours() >= toUTC.getUTCHours() && now.getUTCMinutes() >= toUTC.getUTCMinutes()));
    
      if (now.getUTCHours() >= toUTC.getUTCHours() && now.getUTCMinutes() >= toUTC.getUTCMinutes()) {
        // if (now.getUTCHours() >= parseInt(time[0]) && now.getUTCMinutes() >= parseInt(time[1])) {
          console.log("WAKE UP");
          eventHandler.next({
              notificationMessage: "wake up message",
              actionType: 0
          });
        /*
        setInterval(function () {
          console.log("WAKE UP");
        }, 1000);
        */
      }
      else {
        eventHandler.next({
            notificationMessage: "not yet",
            actionType: 0
        });
        console.log(now.getHours() + ':' + now.getMinutes());
        //Check every second
        setTimeout(checkTime, 1000*60);
      }
    }
    
    console.log("Setting alarm for: "+time.join(":"));
    
    checkTime();

    return true;
};

// console.log('running plugin: ', plugin("16:54"));

export {plugin as Plugin}