import "./style.css";
import {Project} from "./project";
import {Todo} from "./Todo";
import { addTask, displayInbox, displayTodo, addProjectOption, displaySearch, displayUpcomming, displayFilter } from "./display";
import { compareAsc, format } from "date-fns";

function main(){
    // displays the project when we load the website
    document.addEventListener("DOMContentLoaded", () => displayInbox());
    
    // handle the dialoge for adding tasks
    const openBtn = document.querySelector('.task');
    const dialogTask = document.getElementById('addtask-dialog');
    // fill the select option
    openBtn.addEventListener('click', () => {
    addProjectOption();
    dialogTask.showModal();
    });
    // setup the dialog
    setupDialog(dialogTask, (data) => {
    const project = data.get('project');
    const newTask = new Todo(
        data.get('title'), data.get('description'),
        data.get('dueDate'), data.get('priority'), data.get('notes')
    );
    addTask(project, newTask);
    displayTodo(project);
    });

    document.querySelector(".inbox").addEventListener("click", ()=> displayInbox());
    // handle the dialoge for adding Projects
    let dialogProject = document.getElementById('addProject-dialog');
    setupDialog(dialogProject, (data) => {
    const newProject = new Project(
        data.get('title'), data.get('description'),
        data.get('priority'), data.get('notes')
    );
    let projects = JSON.parse(localStorage.getItem("projects")) || [];
    projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(projects));
    displayInbox();
    });

    // handle the search option
    let searchDialog = document.getElementById('search-dialog');
    document.querySelector(".search").addEventListener("click", () => searchDialog.showModal());
    setupDialog(searchDialog, (data) => {
        const query = data.get('keyword');
        displaySearch(query);
    });

    // handle the upcomming option
    document.querySelector(".upcomming").addEventListener("click", () => displayUpcomming());

}

function setupDialog(dialog, onSubmit) {
  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'submit') {
      const form = dialog.querySelector('form');
      const data = new FormData(form);
      onSubmit(data);
      form.reset();
    }
  });
}

main()