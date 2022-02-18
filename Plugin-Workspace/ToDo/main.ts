import { IPluginConstructor, IPlugin } from "./interfaces/iplugin";
import { PluginNotification } from "./interfaces/plugin.notification";
import { Subject } from "rxjs";

import * as path from "path";
import * as fs from "fs";

import { ToDo, ToDoSection, ToDoService } from "./todo.service";
import { PluginInput, ToDoMessage } from "interfaces/plugin.input";
import { emitKeypressEvents } from "readline";
import { Guid } from './interfaces/guid'

const Plugin: IPluginConstructor = class Plugin implements IPlugin {
  eventHandlerIn:Subject<PluginInput>;
  eventHandlerOut:Subject<PluginNotification>;
  id:string;
  htmlTemplate: string;
  
  toDoService:ToDoService = new ToDoService(__dirname);

  constructor(eventHandlerIn:Subject<PluginInput>, eventHandlerOut:Subject<PluginNotification>, id: string, ...argv: string[]) {
    this.eventHandlerOut = eventHandlerOut;
    this.eventHandlerIn = eventHandlerIn;
    this.id = id;
    
    this.htmlTemplate = `<div>
    <div id="section-list">
    <div id="actula-section-list"></div>
    <div><label for="appt">Add new ToDo Sections:</label>
    <input type="text" id="appt" name="appt"> <button onclick="pluginClick(event)">Add</button></div>
    </div>
           
    <script>
    function pluginClick(event,data) {
      var input = document.getElementById("appt");
      console.log(input.value);
      var sectionTitle = input.value;
    
    const toDoEvent = new CustomEvent('plugin-input', {
      bubbles: true,
      detail: {
        pluginId: '${id}',
        data: {
            action: 'add-section',
            title: sectionTitle
        }
      }
    });
  
    this.dispatchEvent(toDoEvent);
    }

    function removeSection(event,sectionTitle) {
      const toDoEvent = new CustomEvent('plugin-input', {
        bubbles: true,
        detail: {
          pluginId: '${id}',
          data: {
              action: 'remove-section',
              title: sectionTitle
          }
        }
      });
      
      this.dispatchEvent(toDoEvent);
    }

    function removeToDo(event,toDoTitle,toDoSectionTitle) {
      const toDoEvent = new CustomEvent('plugin-input', {
        bubbles: true,
        detail: {
          pluginId: '${id}',
          data: {
              action: 'remove-todo',
              title: toDoTitle,
              sectionTitle: toDoSectionTitle
          }
        }
      });

      this.dispatchEvent(toDoEvent);
    }

    function addToDo(event,sectionTitle, sectionIndex) {
      var input = document.getElementById("apptodo-" + sectionIndex);
      console.log(input.value);
      var toDoTitle = input.value;
    
      const toDoEvent = new CustomEvent('plugin-input', {
        bubbles: true,
        detail: {
          pluginId: '${id}',
          data: {
              action: 'add-todo',
              title: toDoTitle,
              sectionTitle: sectionTitle
          }
        }
      });
  
    this.dispatchEvent(toDoEvent);
    }

    function toDoCheckboxClicked(cb, toDoTitle, sectionTitle) {
      
      const toDoEvent = new CustomEvent('plugin-input', {
        bubbles: true,
        detail: {
          pluginId: '${id}',
          data: {
              action: 'toggle-todo',
              title: toDoTitle,
              sectionTitle: sectionTitle
          }
        }
      });
  
    this.dispatchEvent(toDoEvent);
    }

    </script>
    `;

    eventHandlerIn.subscribe({
      next: (value) => {
        var toDoMessage = value.data as ToDoMessage;

        switch(toDoMessage.action) { 
          case 'add-section': { 
            this.toDoService.addSection({
              title: toDoMessage.title,
              enabled: true,
              toDoList: []
            });
            eventHandlerOut.next({
              data: `<div style=>ToDo Section "${toDoMessage.title}" Added</div>
              ${this.getHtml()}`,
              notificationMessage: "ToDo Section Added",
              actionType: 8
            });
            
            break; 
          } 
          case 'remove-section': {
            this.toDoService.removeToDoSection({
              title: toDoMessage.title,
              enabled: false,
              toDoList: []
            });
            eventHandlerOut.next({
              data: `<div style=>ToDo Section "${toDoMessage.title}" Removed</div>
              ${this.getHtml()}`,
              notificationMessage: "ToDo Section Removed",
              actionType: 8
            });
             break; 
          } 
          case 'remove-todo': {
              this.toDoService.removeToDo({
                title: toDoMessage.title,
                enabled: false,
                toDoSection: toDoMessage.sectionTitle
              });
              eventHandlerOut.next({
                data: `<div style=>ToDo "${toDoMessage.title}" Removed</div>
                ${this.getHtml()}`,
                notificationMessage: "ToDo Removed",
                actionType: 8
              });

             break; 
          } 
          case 'add-todo': { 
            this.toDoService.addToDo({
              title: toDoMessage.title,
              enabled: true,
              toDoSection: toDoMessage.sectionTitle
            });
            eventHandlerOut.next({
              data: `<div style=>ToDo "${toDoMessage.title}" Added</div>
              ${this.getHtml()}`,
              notificationMessage: "ToDo Added",
              actionType: 8
            });
            
            break; 
          } 
          case 'toggle-todo': {
            console.log('toggle-todo.message:', toDoMessage);
            var toDo = this.toDoService.getToDo(toDoMessage.title, toDoMessage.sectionTitle);
            console.log('toggle-todo.toDo:', toDo);

            if (toDo === undefined || toDo === null){
              return;
            }
            toDo.enabled = !toDo.enabled;
            this.toDoService.updateToDo(toDo);

            eventHandlerOut.next({
              data: `<div style=>ToDo "${toDoMessage.title}" updated</div>
              ${this.getHtml()}`,
              notificationMessage: "ToDo updated",
              actionType: 8
            });
            
            break; 
          } 
          default: { 
             //statements; 
             break; 
          } 
       } 
      },
      error: (err) => {
        console.error(err);
      }
    })
  }// end ctor
  
  getHtml():string {
    let frag = this.htmlTemplate;

    const toDoSectionList = this.toDoService.getToDoSections().filter(element => element.enabled);
    if (toDoSectionList.length < 1) {
      return frag;
    }

    frag = frag.concat(`<ul>
    `);

    toDoSectionList.forEach((value,index) => {
      if (value.enabled){
        frag = frag.concat(`<li>${value.title} (<a style="cursor: pointer;" onclick="removeSection(event,'${value.title}')">REMOVE</a>)</li>`);
        frag = frag.concat(`<ul>
          `);
        if (value.toDoList !== undefined && value.toDoList !== null && value.toDoList.length > 0){
          
          value.toDoList.forEach((element, index) => {
            var toDoId = Guid.newGuid();
            frag = frag.concat(`<li>
              <input type="checkbox" name="${toDoId}" value="${element.title}" onclick="toDoCheckboxClicked(this,'${element.title}','${value.title}')"`,
              element.enabled ? "" : "checked",
              `>
              <label for="${toDoId}">`, 
              element.enabled ? element.title : `<del>${element.title}</del>`,
               `</label> (<a style="cursor: pointer;" onclick="removeToDo(event,'${element.title}','${value.title}')">REMOVE</a>)
            </li>`);
          });
        }

        frag = frag.concat(`<li>
        <div><label for="apptodo">Add ToDo:</label>
        <input type="text" id="apptodo-${index}" name="apptodo-${index}"> <button onclick="addToDo(event, '${value.title}', ${index})">Add</button></div>
        </div>
        </li>`);
        frag = frag.concat(`</ul>
         `);
      }
    });
    frag = frag.concat(`</ul>
    `);
    console.log('frag:', frag);
    return frag;
  }

};

// console.log('running plugin: ', plugin("16:54"));

export {Plugin}