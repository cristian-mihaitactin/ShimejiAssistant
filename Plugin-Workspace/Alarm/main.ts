import { IPluginConstructor, IPlugin } from "./interfaces/iplugin";
import { PluginNotification } from "./interfaces/plugin.notification";
import { Subject } from "rxjs";

import * as path from "path";
import * as fs from "fs";

import { AlarmService } from "./alarm.service";
import { AlarmMessage, PluginInput } from "interfaces/plugin.input";
import { parentPort } from "worker_threads";

const Plugin: IPluginConstructor = class Plugin implements IPlugin {
  eventHandlerIn:Subject<PluginInput>;
  eventHandlerOut:Subject<PluginNotification>;
  id:string;
  htmlTemplate: string;
  
  private alarmService:AlarmService;

  constructor(eventHandlerIn:Subject<PluginInput>, eventHandlerOut:Subject<PluginNotification>, id: string, ...argv: string[]) {
    this.eventHandlerOut = eventHandlerOut;
    this.eventHandlerIn = eventHandlerIn;
    this.id = id;
    this.alarmService = new AlarmService(__dirname);
    
    this.htmlTemplate = `<div><label for="appt">Choose a time for your meeting:</label>
    <input type="time" id="appt" name="appt"
           min="00:00" max="23:59" required> <button onclick="pluginClick(event)">click here</button></div>
           
    <script>
    function pluginClick(event,data) {
      var input = document.getElementById("appt");
      console.log(input.value);
      var timeArray = input.value.split(':');
    
    const alarmEvent = new CustomEvent('plugin-input', {
      bubbles: true,
      detail: {
        pluginId: '${id}',
        data: {
            action: 'add',
            hour: timeArray[0],
            minute:timeArray[1]
        }
      }
    });
  
    this.dispatchEvent(alarmEvent);
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
  
  private addAlarm(timeHour:string, timeMinute:string) {
    // Each plugin receives an even handler with which it communicates with the electron app (ping when ready)
    var now = new Date();
    var toUTC = new Date();

    var thisAlarm = {
      hour: timeHour,
      minute: timeMinute,
      enabled: true
    };

    this.alarmService.addAlarm(thisAlarm);

    function checkTime (alarmService: AlarmService, plugin: IPlugin) {
      toUTC.setHours(parseInt(timeHour))
      toUTC.setMinutes(parseInt(timeMinute))
    
      if (now.getUTCHours() >= toUTC.getUTCHours() && now.getUTCMinutes() >= toUTC.getUTCMinutes()) {
          console.log("WAKE UP");
          thisAlarm.enabled = false;
          
          alarmService.updateAlarm(thisAlarm);
          plugin.eventHandlerOut.next({
            data: "It's time",
            notificationMessage: "Wake up message",
            actionType: 1
          });
      }
      else {
        console.log('Alarm check at ', now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds());
        //Check at most every minute
        setTimeout(this.checkTime(alarmService, plugin), 1000*(59 - now.getSeconds()) + (999 - now.getMilliseconds()));
      }
    }// end checkTime

    checkTime(this.alarmService, this);
    
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

  getHtml():string {
    let frag = this.htmlTemplate;

    const alarmList = this.alarmService.getAlarms();
    if (alarmList.length < 1) {
      return frag;
    }

    frag.concat(`<ul>
    `);

    alarmList.forEach((value,index) => {
      frag.concat(`<li>${value.hour}:${value.minute} - Enabled: ${value.enabled}</li>`);
    });
    frag.concat(`</ul>
    `);

    return frag;
  }

};

// console.log('running plugin: ', plugin("16:54"));

export {Plugin}