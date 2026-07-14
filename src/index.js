import "./style.css";
import {Project} from "./project";
import {Todo} from "./Todo";
import { addTask, displayInbox, displayTodo } from "./display";

function main(){
    document.addEventListener("DOMContentLoaded", () => displayInbox());
    
    document.querySelector(".task").addEventListener("click", ()=> addTask());

    document.querySelector(".main").addEventListener("click", () => displayTodo("main"));
    
    document.querySelector(".inbox").addEventListener("click", ()=> displayInbox());
    
    let dialog = document.getElementById('addProject-dialog');
    dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'submit') {
        const form = dialog.querySelector('form');
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

        dialog.querySelector('form').reset();
        
        displayInbox()

    }
    });

}

main()