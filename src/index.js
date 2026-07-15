import "./style.css";
import {Project} from "./project";
import {Todo} from "./Todo";
import { addTask, displayInbox, displayTodo, addProjectOption } from "./display";
import { compareAsc, format } from "date-fns";

format(new Date(2014, 1, 11), "yyyy-MM-dd");
//=> '2014-02-11'

const dates = [
  new Date(1995, 6, 2),
  new Date(1987, 1, 11),
  new Date(1989, 6, 10),
];
dates.sort(compareAsc);

function main(){
    // displays the project when we load the website
    document.addEventListener("DOMContentLoaded", () => displayInbox());
    
    // handle the dialoge for adding tasks
    const openBtn = document.querySelector('.task');
    const dialogTask = document.getElementById('addtask-dialog');
    openBtn.addEventListener('click', () => {
    addProjectOption();
    dialogTask.showModal();
    });
    
    dialogTask.addEventListener('close', () => {
    if (dialogTask.returnValue === 'submit') {
        const form = dialogTask.querySelector('form');
        const data = new FormData(form);

        let project = data.get('project');        
        const newProject = new Todo(
        data.get('title'),
        data.get('description'),
        data.get('dueDate'),
        data.get('priority'),
        data.get('notes')
        );

        addTask(project, newProject);
        displayTodo(project);
        dialogTask.querySelector('form').reset();        
    }
    });

    document.querySelector(".inbox").addEventListener("click", ()=> displayInbox());
    
    // handle the dialoge for adding Projects
    let dialogProject = document.getElementById('addProject-dialog');
    dialogProject.addEventListener('close', () => {
    if (dialogProject.returnValue === 'submit') {
        const form = dialogProject.querySelector('form');
        const data = new FormData(form);
        
        const newProject = new Project(
        data.get('title'),
        data.get('description'),
        data.get('priority'),
        data.get('notes')
        );

        let projects = JSON.parse(localStorage.getItem("projects")) || [];
        projects.push(newProject);
        localStorage.setItem("projects", JSON.stringify(projects));

        dialogProject.querySelector('form').reset();
        
        displayInbox()
    }
    });

}

main()