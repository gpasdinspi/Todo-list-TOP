import "./style.css";
import filterIcon from "./img/filter.png";
import addproject from "./img/plus.png";
import { Project } from "./project";
import { Todo } from "./Todo"

function displayInbox(){

    if (!localStorage.getItem("projects")){
        let task1 = new Todo("create your first task", "description", "duedate", "low", "note");
        let task2 = new Todo("create a new project", "description", "duedate", "low", "note");
        let task3 = new Todo("use the search option", "description", "duedate", "low", "note");
        let task4 = new Todo("complete your first task", "description", "duedate", "low", "note");

        let main_task = [task1, task2, task3, task4];

        let main = new Project("main", "default project", "low", "notes", main_task);

        let projects = []
        projects.push(main);

        localStorage.setItem("projects", JSON.stringify(projects));
    }

    let right = document.querySelector(".right");
    right.innerHTML = ""; // clear the div

    right.innerHTML = `<header>
            <p class="view"><img src="${filterIcon}" alt="filter" class="icons">view</p>
            <h1>inbox</h1>
        </header>
        <hr>

        <div class="content">
        
        </div>`

    displayProject();

    right.querySelector(".content").innerHTML +=
    `<button command="show-modal" commandfor="addProject-dialog" class="addProject-btn">
    <div class="add-project">
        <h3>new Project</h3>
        <p><img src="${addproject}" alt="add" class="bigger-icon"></p>
    </div>
    </button>
    `
    

    const allProjects = document.querySelectorAll(".project");

    allProjects.forEach(function(projectElement) {
        projectElement.addEventListener("click", function() {
            const projectName = projectElement.querySelector("h3").textContent;
            displayTodo(projectName);
        });
    });
     
}

function displayProject(){
    let projects = document.querySelector(".content");

    const _projects = JSON.parse(localStorage.getItem("projects"));
    projects.innerHTML = _projects.map(project => `
        <div class="project ${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <p>${project.notes}</p>
        </div>`).join("")

}

function displayTodo(project){
    const _project = findProject(project, JSON.parse(localStorage.getItem("projects"))).todos;
    const container = document.querySelector(".right");

    container.innerHTML = `<h1>${project}</h1>
        <hr>
        <div class="content-todo">

        </div>`

    container.querySelector(".content-todo").innerHTML = _project.map(toDos => `
        <div class="todo">
                <input type="checkbox" class="round-checkbox">
                <p>${toDos.title}</p>
            </div>
        `).join("")

}

function findProject(title, projects){
    for (const project of projects) {
        if (project.title === title){
            return project
        }
    }
}

function addTask(project_name, task){
    let projects = JSON.parse(localStorage.getItem("projects"));
    findProject(project_name, projects).todos.push(task);
    localStorage.setItem("projects", JSON.stringify(projects));
}


export {addTask, displayInbox, displayTodo};