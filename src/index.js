import "./style.css";
import {Project} from "./project";
import {Todo} from "./Todo";
import { addTask, displayInbox, displayTodo } from "./display";

function main(){
    document.addEventListener("DOMContentLoaded", () => displayInbox())
    
    document.querySelector(".task").addEventListener("click", ()=> addTask())

    document.querySelector(".main").addEventListener("click", displayTodo("main"))
    
    document.querySelector(".inbox").addEventListener("click", ()=> displayInbox())
}

main()