import "./style.css";
import filterIcon from "./img/filter.png";
import { Project } from "./project";
import { Todo } from "./Todo"

function displayInbox(){
    let main = new Project("main", "default project", "low", "notes");

    let task1 = new Todo("create your first task", "description", "duedate", "low", "note");
    let task2 = new Todo("create a new project", "description", "duedate", "low", "note");
    let task3 = new Todo("use the search option", "description", "duedate", "low", "note");
    let task4 = new Todo("complete your first task", "description", "duedate", "low", "note");

    let main_task = [task1, task2, task3, task4];

    localStorage.setItem("main", JSON.stringify(main_task))

    let projects = []
    projects.push(main);

    localStorage.setItem("projects", JSON.stringify(projects));

    let right = document.querySelector(".right");
    right.innerHTML = ""; // clear the div

    right.innerHTML = `<header>
            <p class="view"><img src="${filterIcon}" alt="filter" class="icons">view</p>
            <h1>inbox</h1>
        </header>
        <hr>

        <div class="content">
        
        </div>`

    const _projects = JSON.parse(localStorage.getItem("projects"));
    
    right.querySelector(".content").innerHTML = _projects.map(project => (`
        <div class="project ${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <select name="priority" id="priority">
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
            </select>
            <p>${project.notes}</p>
        </div>`)).join("")

    const allProjects = document.querySelectorAll(".project");

    allProjects.forEach(function(projectElement) {
        projectElement.addEventListener("click", function() {
            const projectName = projectElement.querySelector("h3").textContent;
            displayTodo(projectName);
        });
    });
     
}

function displayProject(){
    let projects = document.querySelector(".projects");

    const _projects = JSON.parse(localStorage.getItem("projects"));
    projects.innerHTML = _projects.map(project => `

        ` ).join("")

}

function displayTodo(project){
    const _project = JSON.parse(localStorage.getItem(project));
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

function addTask(todos, task){

    todos.push();
}


export {addTask, displayInbox, displayTodo};