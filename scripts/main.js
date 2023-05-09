const todoTitle = document.querySelector("#todo-title");
const todoDate = document.querySelector("#todo-duedate");
const submit = document.querySelector("#todo-submit");
const statusButton = document.querySelector("tbody tr td:last-child");
const todoTable = document.querySelector("#todo-list-table");
const checkIcon = "\u2713";
const deleteIcon = "\u00D7";
const editIcon = "\u270E";

var row;

/**
 * render (or reload) new item to table
 * @param {title,date,status,index} itemObj 
 */
function renderItem(itemObj) {
    const row = todoTable.insertRow(-1);

    const titleEdditButtonsCell = row.insertCell(0); // title + edit + delete buttons 
    const dueDateCell = row.insertCell(1); // date 
    const statusCell = row.insertCell(2); // status
    const titleEditToggleCell = document.createElement("div") // title + edit wrapper
    const editTitleModeCell = document.createElement("input"); // edit title slot
    const titleCell = document.createElement("p");
    const deleteCell = document.createElement("span"); 
    const editCell = document.createElement("span");

    dueDateCell.draggable = "true"; // enable row dragging by date column
    editTitleModeCell.id = "edit-title" 
    editTitleModeCell.style.setProperty("display", "none"); // make edit title invisible by default
    row.setAttribute("key", itemObj.index);
    titleCell.id = "title-text"
    statusCell.innerHTML = itemObj.status ? checkIcon: "";
    titleCell.innerHTML = itemObj.title;
    dueDateCell.innerHTML = itemObj.date;
    editTitleModeCell.value = itemObj.title;
    deleteCell.textContent = deleteIcon;
    editCell.textContent = editIcon
    statusCell.className = "hover-cell"
    editCell.className = "hover-cell"
    deleteCell.className = "hover-cell"



    titleEditToggleCell.appendChild(editTitleModeCell);
    titleEditToggleCell.appendChild(titleCell);
  
    titleEdditButtonsCell.appendChild(deleteCell);
    titleEdditButtonsCell.appendChild(editCell);
    titleEdditButtonsCell.appendChild(titleEditToggleCell);

    dueDateCell.addEventListener("dragstart", (event) => startDrag(event));
    dueDateCell.addEventListener("dragover", (event) => dragOver(event));


    deleteCell.addEventListener("click", (event) =>
        removeItem(event.target.parentElement.parentElement));

    statusCell.addEventListener("click", (event) =>
        updateStatus(event.target.parentElement));

    editCell.addEventListener("click", (event) =>
toggleEditMode(event.target.parentElement));

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
/**
 * 
 * @param {*} row - row in table HTML element 
 * @param {*} titleNode - title of task HTML element
 * @param {*} newTitle - new title to replace old one
 */
function updateTitle(row, titleNode, newTitle) {
    const key = row.getAttribute("key");
    const itemToUpdate = JSON.parse(localStorage.getItem(key));
    localStorage.removeItem(key);
    itemToUpdate.title = newTitle;
    localStorage.setItem(key, JSON.stringify(itemToUpdate));
    titleNode.lastChild.innerHTML = newTitle;
    toggleEditMode(row.firstChild); // change back to display mode

}


function createNewItem(title, date) {
    let length = Number(localStorage.getItem("length"));
    const newItem = {
        title: title,
        date: date,
        status: false,
        index: length++,
    }
    localStorage.setItem("length", length);
    localStorage.setItem(newItem.index.toString(), JSON.stringify(newItem))
    renderItem(newItem);

}

function removeItem(row) {
    const key = row.getAttribute("key")
    let length = localStorage.getItem("length");
    let next = row
    localStorage.removeItem(key);
    for (let i = Number(key) + 1; i < length; i++) { // undate succesive rows
        next = next.nextElementSibling;
        updateItemIndex(i, next);
    }
    length--;
    localStorage.setItem("length", length);

    document.getElementById("todo-list-table").deleteRow(Number(key) + 2);
}

/**
 * change between edit and display mode
 * @param {*} titleNode  - container of elements to toggle
 */
function toggleEditMode(titleNode) {
    const toggleElement1 = titleNode.lastChild.childNodes[0];
    const toggleElement2 = titleNode.lastChild.childNodes[1];
    toggleElement1.style.display = toggleElement1.style.display === "none" ? "block" : "none"
    toggleElement2.style.display = toggleElement2.style.display === "none" ? "block" : "none"

}
function updateItemIndex(key, itemElement) {
    const item = JSON.parse(localStorage.getItem(key.toString()));
    localStorage.removeItem(key.toString())
    item.index--;
    localStorage.setItem(item.index.toString(), JSON.stringify(item));
    itemElement.setAttribute("key", item.index);

}

function updateStatus(row) {
    const key = row.getAttribute("key");
    const item = JSON.parse(localStorage.getItem(key));
    item.status = !item.status; // update the status of the task (done or not)
    localStorage.setItem(key, JSON.stringify(item));
    if (row.lastElementChild.textContent) {
        row.lastElementChild.textContent = "";
    }
    else {
        row.lastElementChild.textContent = checkIcon;
    }
}
function startDrag(event) {
    row = event.target.parentElement; // mark row we want to move
}
function dragOver(event) {
    const currentRow = event.target.parentElement
    event.preventDefault();
    let children = Array.from(currentRow.parentElement.children);
    if (children.indexOf(currentRow) > children.indexOf(row)) // switch between rows
        currentRow.after(row);
    else
        currentRow.before(row);
}
function init() {
    if (localStorage.length === 0) {
        localStorage.setItem("length", "0");
        createNewItem("Hi! Im a new task on your todo list", "03-05-2023")
        return;
    }
    const length = localStorage.getItem("length");
    for (let key = 0; key < length; key++) {
        renderItem(JSON.parse(localStorage.getItem(key.toString())));
    
    }
    
}

submit.addEventListener("click", () => {
    if (todoTitle) {
        createNewItem(todoTitle.value, todoDate.value);
    }

});


init();
