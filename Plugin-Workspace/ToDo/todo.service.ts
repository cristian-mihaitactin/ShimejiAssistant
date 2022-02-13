import * as path from "path";
import * as fs from "fs";
import { elementAt } from "rxjs-compat/operator/elementAt";

export interface ToDo {
    title:string,
    toDoSection:string,
    enabled: boolean,
}

export interface ToDoSection {
    title:string,
    toDoList: ToDo[],
    enabled: boolean
}
const todoFileName = "todos.json"

export class ToDoService {
    private todoFJsonPath: string;
    private toDoSectionList: ToDoSection[];

    constructor(workspacePath:string){
        if (!fs.existsSync(workspacePath)){
            fs.mkdir(workspacePath, { recursive: true }, (err) => {
                if (err) throw err;
              });
        }

        this.todoFJsonPath = path.join(workspacePath, todoFileName);

        if (!fs.existsSync(this.todoFJsonPath)){
            fs.writeFileSync(this.todoFJsonPath, JSON.stringify([]));
        }

        this.toDoSectionList = JSON.parse(fs.readFileSync(this.todoFJsonPath).toString());
    }

    getToDoSections(): ToDoSection[] {
        return this.toDoSectionList;
    }

    getToDo(toDoTitle, toDoSectionTitle): ToDo {
        var toDoSectionIndex = this.toDoSectionList.findIndex(tds => tds.title === toDoSectionTitle);

        if (toDoSectionIndex < 0) {
            return;
        } 
        
        var toDoIndex = this.toDoSectionList[toDoSectionIndex].toDoList.findIndex(td => td.title === toDoTitle);

        if (toDoIndex < 0) {
            return;
        }
        
        return this.toDoSectionList[toDoSectionIndex].toDoList[toDoIndex];
    }

    addSection(toDoSection: ToDoSection){
        var toDoSectionIndex = this.toDoSectionList.findIndex(tds => tds.title === toDoSection.title);

        if (toDoSectionIndex >= 0){
            return;
        } else {
            this.toDoSectionList.push(toDoSection);
            this.writeToDosToFile();
        }
    }

    addToDo(toDo:ToDo) {
        var toDoSectionIndex = this.toDoSectionList.findIndex(tds => tds.title === toDo.toDoSection);

        if (toDoSectionIndex >= 0) {
            this.toDoSectionList[toDoSectionIndex].toDoList.push(toDo)
        } else {
            this.toDoSectionList.push({
                title: toDo.toDoSection,
                toDoList: [toDo],
                enabled: true
            });
        }
            
        this.writeToDosToFile();
    }

    updateToDoSection(toDoSection: ToDoSection) {
        var toDoSectionIndex = this.toDoSectionList.findIndex(tds => tds.title === toDoSection.title);

        if (toDoSectionIndex < 0) {
            return;
        } 
        
        this.toDoSectionList[toDoSectionIndex] = toDoSection;

        this.writeToDosToFile();
    }

    updateToDo(toDo: ToDo) {
        var toDoSectionIndex = this.toDoSectionList.findIndex(tds => tds.title === toDo.toDoSection);

        if (toDoSectionIndex < 0) {
            return;
        } 
        
        var toDoIndex = this.toDoSectionList[toDoSectionIndex].toDoList.findIndex(td => td.title === toDo.title);

        if (toDoIndex < 0) {
            return;
        } 

        this.toDoSectionList[toDoSectionIndex].toDoList[toDoIndex] = toDo;

        this.writeToDosToFile();
    }

    removeToDoSection(toDoSection:ToDoSection) {
        const index = this.toDoSectionList.findIndex(tds => tds.title === toDoSection.title);
        if (index > -1) {
            this.toDoSectionList.splice(index, 1);
        }
        this.writeToDosToFile();
    }

    removeToDo(toDo:ToDo) {
        const toDoSectionIndex = this.toDoSectionList.findIndex(tds => tds.title === toDo.toDoSection);
        if (toDoSectionIndex < 0) {
            return;
        } 

        const index = this.toDoSectionList[toDoSectionIndex].toDoList.findIndex(tds => tds.title === toDo.title);

        if (index > -1) {
            this.toDoSectionList[toDoSectionIndex].toDoList.splice(index, 1);
        }
        this.writeToDosToFile();
    }

    private writeToDosToFile() {
        fs.writeFileSync(this.todoFJsonPath, JSON.stringify(this.toDoSectionList));
    }
}