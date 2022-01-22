import { IPlugin } from "interfaces/iplugin";
import { PluginNotification } from "interfaces/plugin.notification";
import { Subject } from "rxjs";


let plugin: IPlugin;
 
plugin = (eventHandler:Subject<PluginNotification>, ...argv: string[]): void => {
    var timeHour = argv[0];
    var timeMinute = argv[1];
    var now = new Date();
    var toUTC = new Date();

    // Each plugin receives an even handler with which it communicates with the electron app (ping when ready)
    function checkTime () {
        now = new Date();

        toUTC = new Date();
      toUTC.setHours(parseInt(timeHour))
      toUTC.setMinutes(parseInt(timeMinute))
    
      if (now.getUTCHours() >= toUTC.getUTCHours() && now.getUTCMinutes() >= toUTC.getUTCMinutes()) {
          console.log("WAKE UP");
          eventHandler.next({
              notificationMessage: "Wake up message",
              actionType: 1
          });
      }
      else {
        console.log('Alarm check at ', now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds());
        //Check at most every minute
        setTimeout(checkTime, 1000*(59 - now.getSeconds()) + (999 - now.getMilliseconds()));
      }
    }

    checkTime();
    
    let dateDifference = toUTC.valueOf() - now.valueOf();
    var minutes = Math.floor((dateDifference/1000)/60);

    console.log('miliseconds diff: ', dateDifference);
    let settingMessage = `Setting alarm for ${timeHour}:${timeMinute} (in aprox ${minutes} minutes)`;
    console.log(settingMessage);
    
    eventHandler.next({
        notificationMessage: settingMessage,
        actionType: 8
    });
};

// console.log('running plugin: ', plugin("16:54"));

export {plugin as Plugin}

var testSubject = new Subject<PluginNotification>();

testSubject.subscribe({
    next: (val) => {
      console.log(val);
    },
    error: (val) => {
      console.log('error: ', val);
    }
  })

plugin(testSubject, '19', '20')