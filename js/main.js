const notesTextarea = document.getElementById("notes-textarea")
const notesPlaceholder = "Edit"

const taskList = document.getElementById("task-list")
const taskInput = document.getElementById("task-input")

const bookmarkList = document.getElementById("bookmark-list")
const bookmarkInput = document.getElementById("bookmark-input")

const d = new Date()

let tasks = []
let bookmarks = []

tasks = localStorage.getItem("tasks") != null ? JSON.parse(localStorage.getItem("tasks")) : []
bookmarks = localStorage.getItem("bookmarks") != null ? JSON.parse(localStorage.getItem("bookmarks")) : []
notesTextarea.innerHTML = localStorage.getItem("notes") != null ? localStorage.getItem("notes") : ""

function refresh(){
    refreshTaskList(taskList,tasks)
    refreshTaskList(bookmarkList, bookmarks)
}


function saveToStorage(){
    localStorage.setItem("tasks",JSON.stringify(tasks))
    localStorage.setItem("bookmarks",JSON.stringify(bookmarks))
    localStorage.setItem("notes",formatInput(notesTextarea.innerHTML))
}


function handleInputEventListner(e,tasks,taskList,bookmark,input){
    if (e.keyCode === 13 && formatInput(input.value) != "") {
        let id = Date.now()
        let date = d.getDate()
        let title = formatInput(input.value)
        input.value = ""

        addTask(tasks, title, false, date, bookmark, id)
        saveToStorage()
        refresh()
    }
}


function removeTaskAfterDay(tasks){
    filteredTasks = tasks.filter(task => task.date == d.getDate())
    return filteredTasks
}


function formatInput(input){
    return input.replace("<br>","").trim()
}


function refreshTaskList(list,tasks) {
    list.innerHTML = ""

    for (let i = 0; i < tasks.length; i ++) {
        let task = tasks[i]
        list.innerHTML += `<div id="${task.id}" class="task secondary ${task.bookmark ? "bookmark" : ""}"><span ondblclick="removeTask(this)" onclick="toggleTask(this)" class="checkbox ${task.completed ? "checked" : ""}"></span><span class="task-title ${task.completed ? "strikethrough" : ""} ">${task.title}</span></div>`

    }
}


function resetTextarea(){
    if (formatInput(notesTextarea.innerHTML) == ""){ 
        notesTextarea.innerHTML = notesPlaceholder
        notesTextarea.style.color = "#767676";
    }
}





function toggleTask(e){
    let parent = e.parentElement
    let title = parent.children[1]
    let completed  
    let index = -1

    if (parent.classList.contains("bookmark")){
        index = GetIndexOfTaskFromId(bookmarks,parent.id)
        bookmarks[index].completed = !bookmarks[index].completed
        completed = bookmarks[index].completed
    }else{
        index = GetIndexOfTaskFromId(tasks,parent.id)
        tasks[index].completed = !tasks[index].completed
        completed = tasks[index].completed
    }

    if (completed){
        title.classList.add("strikethrough")
        e.classList.add("checked")
    }else{
        title.classList.remove("strikethrough")
        e.classList.remove("checked")
    }

    saveToStorage()
}


function GetIndexOfTaskFromId(tasks, id){
    for (let i = 0; i < tasks.length; i++){
        if (tasks[i].id == id){
            return i
        }
    }
    return -1
}


function addTask(tasks, title, completed, date, bookmark, id){
    task = {
        "title":title,
        "completed":completed,
        "date":date,
        "bookmark":bookmark,
        "id":id
    }

    tasks.push(task)
    refresh()
    saveToStorage()
} 


function removeTask(e){
    id = e.parentElement.id
    console.log("REMOVE")

    if (e.parentElement.classList.contains("bookmark")){
        index = GetIndexOfTaskFromId(bookmarks,id)
        bookmarks.splice(index, 1)
        
    }else{
        index = GetIndexOfTaskFromId(tasks,id)
        tasks.splice(index,1)
    }

    refresh()
    saveToStorage()
}



notesTextarea.addEventListener("focus", function(e){
    if(notesTextarea.innerHTML == notesPlaceholder) {
        notesTextarea.innerHTML = ""
        notesTextarea.style.color = "#000"
    }
})

notesTextarea.addEventListener("blur", function(e){
    resetTextarea()
})

taskInput.addEventListener("keyup", function(e) {
    handleInputEventListner(e,tasks,taskList,false,taskInput)
})

bookmarkInput.addEventListener("keyup", function(e) {
    handleInputEventListner(e,bookmarks,bookmarkList,true,bookmarkInput)
})


resetTextarea()
refresh()
taskInput.value = ""


setInterval(function() {
    tasks = removeTaskAfterDay(tasks)
    refresh()

},10000)


window.onbeforeunload = function(){
    saveToStorage()
}
