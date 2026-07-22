import "./style.css";
import filterIcon from "./img/filter.png";
import addproject from "./img/plus.png";
import addtask from "./img/plus.png";
import { Project } from "./project";
import { Todo } from "./Todo"
import { format, startOfToday } from "date-fns";
import { ht } from "date-fns/locale";

function displayInbox(){

    if (!localStorage.getItem("projects")){
        // fix the date
        let task1 = new Todo("create your first task", "description", "2026-09-23", "low", "note");
        let task2 = new Todo("create a new project", "description", "2026-02-13", "low", "note");
        let task3 = new Todo("use the search option", "description", "2021-03-14", "low", "note");
        let task4 = new Todo("complete your first task", "description", "2027-09-23", "low", "note");

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
    
    // handle the filter option
    let filterDialog = document.getElementById('filter-dialog');
    
    document.querySelector(".view").addEventListener("click", () => {completeFilter();
    filterDialog.showModal();} );
    setupDialog(filterDialog, (data) => {
        const priority = data.get('priority');
        const projectName = data.get('projectName');
        displayFilter(priority, projectName);
    });

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

    let sortedTodos =[];
    _project.forEach(toDos => {
        let inserted = false;
        for (let i = 0; i < sortedTodos.length; i++) {
            if (toDos.dueDate < sortedTodos[i].dueDate) {
                sortedTodos.splice(i, 0, toDos);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            sortedTodos.push(toDos);
        }
    });

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    let html = ""
    sortedTodos.forEach(toDo =>{
        if (toDo.checklist) return;
        if (toDo.dueDate !== currentDate){
            currentDate = toDo.dueDate;
            html += `<h3>${currentDate}</h3>
            `
        }
        html+= `
        <hr class="lighter_hr">
        <div class="todo">
            <p><input type="checkbox" class="round-checkbox" data-id="${toDo.id}" data-project="${project}"> ${toDo.title}</p>
            <p class="little">${toDo.description}</p>
            <p class="little">${toDo.notes}</p>
        </div>
        `
    })
    container.querySelector(".content-todo").innerHTML = html;

    container.querySelector(".content-todo").innerHTML +=`
    <hr class="lighter_hr">
    <div class="options task">
        <img src=${addtask} alt="add" class="icons">
        <p>
            new task
        </p>
    </div>
    `
    addTaskEvent();

    // handle the checkbox removal
    container.querySelector(".content-todo").addEventListener("change", (e) => {
    if (e.target.classList.contains("round-checkbox") && e.target.checked) {
        const { id, project } = e.target.dataset;
        completeTask(project, id);
        e.target.closest(".todo").remove(); 
    }
    });

}

function addTaskEvent(){
    const openBtn = document.querySelector('.content-todo .task');
    if (!openBtn) return;
    const dialogTask = document.getElementById('addtask-dialog');

    openBtn.addEventListener('click', () => {
        addProjectOption();
        dialogTask.showModal();
    });
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

function addProjectOption(){
    let projects = JSON.parse(localStorage.getItem("projects"));
    let array = []
    for (const project of projects) {
        array.push(project.title);
    }

    let addTaskDialog = document.querySelector(".add-task");
    let html = `<select name="project" id="project-priority">`;
    for (const element of array) {
        html += `<option value="${element}">${element}</option>`;
    }
    html += `</select>`;

    addTaskDialog.innerHTML = html;
}

function displayUpcomming(){
    let today = format(new Date(), "yyyy-MM-dd");
    let projects = JSON.parse(localStorage.getItem("projects"));
    let tasks = [];

    projects.forEach(project =>
        project.todos.forEach(todo =>{
            if (toDo.checklist) return;
            if (todo.dueDate >= today){
                tasks.push({ ...todo, projectName: project.title });
            }
        }
        )
    )

    tasks.sort();

    const container = document.querySelector(".right");
    container.innerHTML = `<h1>Upcomming tasks</h1><div class="content-todo"></div>`;

    let html = "";
    tasks.forEach(todo => {
        html += `
        <hr class="lighter_hr">
        <div class="todo">
            <p><input type="checkbox" class="round-checkbox"> ${todo.title}</p>
            <p class="little">${todo.projectName}</p>
            <p class="little">${todo.description}</p>
        </div>`;
    });
    container.querySelector(".content-todo").innerHTML = html || "<p>No upcomming tasks</p>";

    // handle the checkbox removal
    container.querySelector(".content-todo").addEventListener("change", (e) => {
    if (e.target.classList.contains("round-checkbox") && e.target.checked) {
        const { id, project } = e.target.dataset;
        completeTask(project, id);
        e.target.closest(".todo").remove(); 
    }
    });

}

function displaySearch(query){
    const projects = JSON.parse(localStorage.getItem("projects"));
    const results = [];

    projects.forEach(project => {
        project.todos.forEach(todo => {
            if (toDo.checklist) return;
            if (todo.title.toLowerCase().includes(query.toLowerCase())) {
                results.push({ ...todo, projectName: project.title });
            }
        });
    });

   const container = document.querySelector(".right");
    container.innerHTML = `<h1>Résultats pour "${query}"</h1><div class="content-todo"></div>`;

    let html = "";
    results.forEach(todo => {
        html += `
        <hr class="lighter_hr">
        <div class="todo">
            <p><input type="checkbox" class="round-checkbox"> ${todo.title}</p>
            <p class="little">${todo.projectName}</p>
            <p class="little">${todo.description}</p>
        </div>`;
    });
    container.querySelector(".content-todo").innerHTML = html || "<p>No result found</p>";

    // handle the checkbox removal
    container.querySelector(".content-todo").addEventListener("change", (e) => {
    if (e.target.classList.contains("round-checkbox") && e.target.checked) {
        const { id, project } = e.target.dataset;
        completeTask(project, id);
        e.target.closest(".todo").remove();
    }
    });


}

function displayFilter(priority = "all", projectName = "all"){
    const projects = JSON.parse(localStorage.getItem("projects"));
    let tasks = [];

    projects.forEach(project => {
        if (projectName !== "all" && project.title !== projectName) return;
        project.todos.forEach(todo => {
            if (toDo.checklist) return;
            if (priority !== "all" && todo.priority !== priority) return;
            tasks.push({ ...todo, projectName: project.title });
        });
    });

    tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    const container = document.querySelector(".right");
    container.innerHTML = `<h1>Filtered tasks</h1><div class="content-todo"></div>`;

    let html = "";
    tasks.forEach(todo => {
        html += `
        <hr class="lighter_hr">
        <div class="todo">
            <p><input type="checkbox" class="round-checkbox"> ${todo.title}</p>
            <p class="little">${todo.projectName} — ${todo.priority}</p>
            <p class="little">${todo.description}</p>
        </div>`;
    });
    container.querySelector(".content-todo").innerHTML = html || "<p>No matching tasks</p>";

    // handle the checkbox removal
    container.querySelector(".content-todo").addEventListener("change", (e) => {
    if (e.target.classList.contains("round-checkbox") && e.target.checked) {
        const { id, project } = e.target.dataset;
        completeTask(project, id);
        e.target.closest(".todo").remove();
    }
    });

}

function completeFilter(){
    let dialog = document.querySelector(".filter-option");
    let projects = JSON.parse(localStorage.getItem("projects"));
    let array = []

    for (const project of projects) {
        array.push(project.title);
    }

    let html = `<select name="projectName" id="project-priority">`;
    html += `<option value="all">all</option>`
    for (const element of array) {
        html += `<option value="${element}">${element}</option>`;
    }
    html += `</select>`;

    dialog.innerHTML = html;

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

function completeTask(projectTitle, todoId){
    let projects = JSON.parse(localStorage.getItem("projects"));
    const project = findProject(projectTitle, projects);
    const todo = project.todos.find(t => t.id === todoId);
    if (todo) {
        todo.checklist = true;
        localStorage.setItem("projects", JSON.stringify(projects));
    }
}

export {addTask, displayInbox, displayTodo, addProjectOption, addTaskEvent, displaySearch, displayUpcomming, displayFilter, completeFilter, setupDialog};