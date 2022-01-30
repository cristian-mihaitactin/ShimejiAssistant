import { IPluginConstructor, IPlugin } from "./interfaces/iplugin";
import { PluginNotification } from "./interfaces/plugin.notification";
import { Subject } from "rxjs";

import * as path from "path";
import * as fs from "fs";

import { Alarm, AlarmService } from "./alarm.service";
import { AlarmMessage, PluginInput } from "interfaces/plugin.input";
import { parentPort } from "worker_threads";

const Plugin: IPluginConstructor = class Plugin implements IPlugin {
  eventHandlerIn:Subject<PluginInput>;
  eventHandlerOut:Subject<PluginNotification>;
  id:string;
  htmlTemplate: string;
  
  alarmService:AlarmService = new AlarmService(__dirname);

  constructor(eventHandlerIn:Subject<PluginInput>, eventHandlerOut:Subject<PluginNotification>, id: string, ...argv: string[]) {
    this.eventHandlerOut = eventHandlerOut;
    this.eventHandlerIn = eventHandlerIn;
    this.id = id;
    
    this.htmlTemplate = `<div><label for="appt">Choose a time for your alarm:</label>
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
    this.startCheckTime(this.alarmService, this.eventHandlerOut);
  }// end ctor
  
  private addAlarm(timeHour:string, timeMinute:string) {
    // Each plugin receives an even handler with which it communicates with the electron app (ping when ready)

    var thisAlarm = {
      hour: timeHour,
      minute: timeMinute,
      enabled: true
    };

    this.alarmService.addAlarm(thisAlarm);

    var now = new Date();
    var toUTC = new Date();

    toUTC.setHours(parseInt(thisAlarm.hour))
    toUTC.setMinutes(parseInt(thisAlarm.minute));

    let dateDifference = toUTC.valueOf() - now.valueOf();
    var minutes = Math.floor((dateDifference/1000)/60);

    console.log('miliseconds diff: ', dateDifference);
    let settingMessage = `Setting alarm for ${timeHour}:${timeMinute} (in aprox ${minutes} minutes)`;
    console.log(settingMessage);
    
    this.eventHandlerOut.next({
        notificationMessage: settingMessage,
        actionType: 8,
        data:`<div>Alarm set for ${timeHour}:${timeMinute}(in aprox ${minutes} minutes)</div>
        ${this.getHtml()}`
    });
  }// end of addAlarm

  private startCheckTime (functionAlarmService: AlarmService, pluginOut: Subject<PluginNotification>) : void {
    var thisPlugin = this;

    function checkTime (functionAlarmService: AlarmService, pluginOut: Subject<PluginNotification>) {
      var now = new Date();
      function checkAlarm(alarm: Alarm, functionAlarmService: AlarmService, pluginOut: Subject<PluginNotification>): void  {
        var now = new Date();
    
        var toUTC = new Date();
        toUTC.setHours(parseInt(alarm.hour))
        toUTC.setMinutes(parseInt(alarm.minute));
    
        if (now.getUTCHours() >= toUTC.getUTCHours() && now.getUTCMinutes() >= toUTC.getUTCMinutes()) {
          console.log("WAKE UP");
          alarm.enabled = false;
          
          functionAlarmService.updateAlarm(alarm);
    
          console.log(pluginOut);
          pluginOut.next({
            data: `<div style="color=red;">!!!ALARM!!!</div>
            ${thisPlugin.getHtml()}`,
            notificationMessage: "Wake up message",
            actionType: 1
          });
        } else {
          console.log('Alarm check at ', now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds());
        } 
      }
  
      var alarmList = functionAlarmService.getAlarms();
      alarmList.filter(element => element.enabled).forEach((alarm, index) => {
        checkAlarm(alarm, functionAlarmService, pluginOut);
      });
      //Check at most every minute
      setTimeout(() => {checkTime(functionAlarmService, pluginOut)}, 1000*(59 - now.getSeconds()) + (999 - now.getMilliseconds()));
    }// end checkTime
    checkTime(functionAlarmService, pluginOut);
  }// end of startCheckTime

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