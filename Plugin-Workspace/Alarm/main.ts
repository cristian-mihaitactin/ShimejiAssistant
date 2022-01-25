import { IPluginConstructor, IPlugin } from "./interfaces/iplugin";
import { PluginNotification } from "./interfaces/plugin.notification";
import { filter, Subject } from "rxjs";
import { map } from "rxjs-compat/operator/map";
import { AlarmMessage } from "interfaces/alarm.message";
import { AlarmModel } from "interfaces/alarm.model";

import * as path from "path";
import * as fs from "fs";

const Plugin: IPluginConstructor = class Plugin implements IPlugin {
  eventHandlerIn:Subject<PluginNotification>;
  eventHandlerOut:Subject<PluginNotification>;
  id:string;
  html:string;

  private alarmList: AlarmModel[];
  
  constructor(eventHandlerIn:Subject<PluginNotification>, eventHandlerOut:Subject<PluginNotification>, id: string, ...argv: string[]) {
    this.eventHandlerOut = eventHandlerOut;
    this.eventHandlerIn = eventHandlerIn;
    this.id = id;
    this.alarmList = this.getAlarmList();

    this.html = `<div><label for="appt">Choose a time for your meeting:</label>
    <input type="time" id="appt" name="appt"
           min="00:00" max="23:59" required> <button onclick="pluginClick(event)">click here</button></div>
    <script>
    function pluginClick(event,data) {
      var input = document.getElementById("appt");
      console.log(input.value);
      var timeArray = input.value.split(':');
    
    const alarmEvent = new CustomEvent('plugin-input', {
        pluginName: '${id}',
        data: {
            action: 'add',
            hour: timeArray[0],
            minute:timeArray[1]
        }
    });
  
    dispatchEvent(alarmEvent);
    }
    </script>
    `;

    eventHandlerIn.subscribe({
      next: (value) => {
        var alarmMessage = value.data as AlarmMessage;
        if(alarmMessage.action === 'add') {
          this.addAlarm(alarmMessage.hour, alarmMessage.minute);
        }
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  private getAlarmList(): AlarmModel[] {
    const alarmJsonPath = path.join(__dirname , 'alarm.json'); 
    if (fs.existsSync(alarmJsonPath)) { 
      try {
        return JSON.parse(fs.readFileSync(alarmJsonPath).toString());
      } catch(error) {
        // if there was some kind of error, return the passed in defaults instead.
        console.error(error);
        return [];
      }
    } else {
      try{
        fs.writeFileSync(alarmJsonPath, JSON.stringify([]));
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  }
  
  private addAlarm(timeHour:string, timeMinute:string) {
    // Each plugin receives an even handler with which it communicates with the electron app (ping when ready)
    var now = new Date();
    var toUTC = new Date();

    function checkTime () {
      toUTC.setHours(parseInt(timeHour))
      toUTC.setMinutes(parseInt(timeMinute))
    
      if (now.getUTCHours() >= toUTC.getUTCHours() && now.getUTCMinutes() >= toUTC.getUTCMinutes()) {
          console.log("WAKE UP");
          this.eventHandler.next({
              notificationMessage: "Wake up message",
              actionType: 1
          });
      }
      else {
        console.log('Alarm check at ', now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds());
        //Check at most every minute
        setTimeout(this.checkTime, 1000*(59 - now.getSeconds()) + (999 - now.getMilliseconds()));
      }
    }// end checkTime

    checkTime();
    
    let dateDifference = toUTC.valueOf() - now.valueOf();
    var minutes = Math.floor((dateDifference/1000)/60);

    console.log('miliseconds diff: ', dateDifference);
    let settingMessage = `Setting alarm for ${timeHour}:${timeMinute} (in aprox ${minutes} minutes)`;
    console.log(settingMessage);
    
    this.eventHandlerOut.next({
        notificationMessage: settingMessage,
        actionType: 8,
        data:null
    });
  }
};

// console.log('running plugin: ', plugin("16:54"));

export {Plugin}