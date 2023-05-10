
const todoTitle = document.querySelector("#todo-title");
const todoDate = document.querySelector("#todo-duedate");
const submit = document.querySelector("#todo-submit");
const todoTable = document.querySelector("#todo-list-table");


const checkIcon = "\u2713";
const deleteIcon = "\u00D7";
const editIcon = "\u270E";
const offset = 2;

let rowToMove;
let startDragRowIndex;

// New todo Render
function renderNewItem(itemObj) {
    const newRowToInsert = todoTable.insertRow(-1);
    const titleEdditButtonsCell = newRowToInsert.insertCell(0); // title + edit + delete buttons 
    const dueDateCell = newRowToInsert.insertCell(1); // date 
    const statusCell = newRowToInsert.insertCell(2); // status
    renderTitleAndEditAndButtonsCell(titleEdditButtonsCell,itemObj.title);
    renderDueDateCell(dueDateCell,itemObj.date);
    renderStatusCell(statusCell,itemObj.status)
}

function renderStatusCell(cell,status){
    cell.innerHTML = status ? checkIcon: "";
    cell.className = "hover-cell";
    cell.addEventListener("click", (event) =>updateStatus(event.target.parentElement));
}

function renderDueDateCell(cell,date){
    cell.innerHTML = date;
    cell.draggable = "true"; // enable row dragging by date column
    cell.addEventListener("dragstart", (event) => startDrag(event));
    cell.addEventListener("dragover", (event) => dragOver(event));
    cell.addEventListener("dragend", (event) => endDrag(event));
}

function renderTitleAndEditAndButtonsCell(cell,title){
    const titleEditToggleCell = document.createElement("div") // title + edit wrapper
    const editCell = document.createElement("span");
    const deleteCell = document.createElement("span"); 

    renderTitleAndEditCell(titleEditToggleCell,title);
    deleteCell.textContent = deleteIcon;
    editCell.className = "hover-cell"

    editCell.textContent = editIcon
    deleteCell.className = "hover-cell"
 
    cell.appendChild(deleteCell);
    cell.appendChild(editCell);
    cell.appendChild(titleEditToggleCell);

    deleteCell.addEventListener("click", (event) =>removeItem(event.target.parentElement.parentElement));
    editCell.addEventListener("click", (event) => toggleEditMode(event.target.parentElement));

}

function renderTitleAndEditCell(cell,title){
    const editTitleModeCell = document.createElement("input"); // edit title slot
    const titleCell = document.createElement("p");

    editTitleModeCell.id = "edit-title" 
    titleCell.id = "title-text"

    titleCell.innerHTML = title;
    editTitleModeCell.value = title;

    editTitleModeCell.style.setProperty("display", "none"); // make edit title invisible by default
    
    cell.appendChild(editTitleModeCell);
    cell.appendChild(titleCell);
    editTitleModeCell.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const newTitle = event.target.value;
            const row = event.target.parentElement.parentElement.parentElement;
            const titleNode = event.target.parentElement;
            updateTitle(row, titleNode, newTitle);

        }
    });
}



// todo operations:
function updateStatus(row) {
    const index = row.rowIndex - offset;
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos[index].status = !todos[index].status; // update the status of the task (done or not)
    localStorage.setItem("todos", JSON.stringify(todos));
    if (row.lastElementChild.textContent) {
        row.lastElementChild.textContent = "";
    }
    else {
        row.lastElementChild.textContent = checkIcon;
    }
}

function removeItem(row) {
    const index = row.rowIndex - offset;
    const todos = JSON.parse(localStorage.getItem("todos"));
    let length = Number(localStorage.getItem("length"));
    todos.splice(index,1);
    length--;
    localStorage.setItem("length", length);
    localStorage.setItem("todos",JSON.stringify(todos))
    document.getElementById("todo-list-table").deleteRow(index + offset);
    if(!length){
        localStorage.removeItem("length")
        localStorage.removeItem("todos")
    }
}

function createNewItem(title, date) {
    let length = Number(localStorage.getItem("length"));
    const todos = JSON.parse(localStorage.getItem("todos"))
    const newItem = {
        title: title,
        date: date,
        status: false,
    }
    localStorage.setItem("length", length+1);
    todos.push(newItem)
    localStorage.setItem("todos",JSON.stringify(todos));
    renderNewItem(newItem);

}

function updateTitle(row, titleNode, newTitle) {
    const index = row.rowIndex - offset;
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos[index].title = newTitle;
    localStorage.setItem("todos", JSON.stringify(todos));
    titleNode.lastChild.innerHTML = newTitle;
    toggleEditMode(row.firstChild); // change back to display mode

}

function toggleEditMode(titleNode) {
    const toggleElement1 = titleNode.lastChild.childNodes[0];
    const toggleElement2 = titleNode.lastChild.childNodes[1];
    toggleElement1.style.display = toggleElement1.style.display === "none" ? "block" : "none"
    toggleElement2.style.display = toggleElement2.style.display === "none" ? "block" : "none"

}

// Drag handlers
function startDrag(event) {
    rowToMove = event.target.parentElement; // mark row we want to move
    startDragRowIndex = rowToMove.rowIndex-offset;
}
function dragOver(event) {
    const currentRow = event.target.parentElement
    event.preventDefault();
    let children = Array.from(currentRow.parentElement.children);
    if (children.indexOf(currentRow) > children.indexOf(rowToMove)){ // switch between rows
        currentRow.after(rowToMove);
    }else{
        currentRow.before(rowToMove);
    }
}

function endDrag(event){
    const localStorageTodos = JSON.parse(localStorage.getItem("todos"))
    const currentRow = event.target.parentElement
    const item = localStorageTodos[startDragRowIndex];
    localStorageTodos.splice(startDragRowIndex, 1);
    localStorageTodos.splice(currentRow.rowIndex-offset, 0, item);
    localStorage.setItem("todos",JSON.stringify(localStorageTodos));
}



function init() {
    if (!localStorage.length) {
        createNewTodoList();
    }else{
        loadTodoListFromLocalStorage();
    }

    }

function createNewTodoList(){
    localStorage.setItem("length", 0);
    localStorage.setItem('todos',JSON.stringify([]));
    createNewItem("Hi! Im a new task on your todo list", "03-05-2023")

}

function loadTodoListFromLocalStorage(){
    const localStorageTodos = JSON.parse(localStorage.getItem("todos"));
    localStorageTodos.forEach(item => renderNewItem(item))
}

submit.addEventListener("click", () => {
    if (todoTitle) {
        createNewItem(todoTitle.value, todoDate.value);
    }

});


init();
