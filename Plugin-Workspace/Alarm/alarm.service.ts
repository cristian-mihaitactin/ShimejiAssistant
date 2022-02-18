import * as path from "path";
import * as fs from "fs";
import { elementAt } from "rxjs-compat/operator/elementAt";

export interface Alarm {
    hour:string,
    minute:string,
    enabled: boolean,
    utcString: string
}

const alarmsFileName = "alarms.json"

export class AlarmService {
    private alarmsJsonPath: string;
    private alarmList: Alarm[];

    constructor(workspacePath:string){
        if (!fs.existsSync(workspacePath)){
            fs.mkdir(workspacePath, { recursive: true }, (err) => {
                if (err) throw err;
              });
        }

        this.alarmsJsonPath = path.join(workspacePath, alarmsFileName);

        if (!fs.existsSync(this.alarmsJsonPath)){
            fs.writeFileSync(this.alarmsJsonPath, JSON.stringify([]));
        }

        this.alarmList = JSON.parse(fs.readFileSync(this.alarmsJsonPath).toString());
    }

    getAlarms(): Alarm[] {
        return this.alarmList;
    }

    addAlarm(alarm:Alarm) {
        if (alarm.hour !== undefined && alarm.hour !== ""
        && alarm.minute !== undefined && alarm.minute !== "")
        this.alarmList.push(alarm);

        this.writeAlarmsToFile();
    }

    updateAlarm(alarm: Alarm) {
        const index = this.alarmList.findIndex((element, index) => element.hour === alarm.hour && element.minute === alarm.minute);
        if (index > -1) {
            this.alarmList[index] = alarm
        }

        this.writeAlarmsToFile();
    }

    removeAlarm(alarm:Alarm) {
        const index = this.alarmList.findIndex((element, index) => "" + element.hour === "" + alarm.hour && "" + element.minute === "" + alarm.minute);
        if (index > -1) {
            this.alarmList.splice(index, 1);
        } else {
            if (this.alarmList.length === 1) {
                this.alarmList = [];
            }
        }
        this.writeAlarmsToFile();
    }

    private writeAlarmsToFile() {
        fs.writeFileSync(this.alarmsJsonPath, JSON.stringify(this.alarmList));
    }
}