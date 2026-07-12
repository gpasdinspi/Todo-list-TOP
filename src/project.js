class Project{

    constructor(title, description, priority, notes, todos=[]){
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.notes = notes;
        this.todos = todos;
    }

    addTodo(todos){
        this.todos = todos;
    }
    
}

export {Project}