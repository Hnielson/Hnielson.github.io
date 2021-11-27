var assignment_id = null;

var addButton = document.querySelector("#add-work");
addButton.onclick = function () {
    var newHomeworkInput = document.querySelector("#homework");
    var newSubjectInput = document.querySelector("#subject");
    var newDueDateInput = document.querySelector("#duedate");
    var newUrgencyInput = document.querySelector("#urgency");
    var newPlaceholderInput = document.querySelector("#placeholder");

    createAssignmentOnServer(newHomeworkInput.value, newSubjectInput.value, newDueDateInput.value, newUrgencyInput.value, newPlaceholderInput.value);
}

var editAddButton = document.querySelector("#edit-add-work");
editAddButton.onclick = () => {
    editAssignmentOnServer(assignment_id);
}

function editAssignmentOnServer(assignment_id) {
    var name = document.querySelector("#edit-homework").value;
    var subject = document.querySelector("#edit-subject").value;
    var duedate = document.querySelector("#edit-duedate").value;
    var urgency = document.querySelector("#edit-urgency").value;
    var placeholder = document.querySelector("#edit-placeholder").value;
    var data = "name=" + encodeURIComponent(name) +
                "&subject=" + encodeURIComponent(subject) +
                "&duedate=" + encodeURIComponent(duedate) +
                "&urgency=" + encodeURIComponent(urgency) +
                "&placeholder=" + encodeURIComponent(placeholder);
    
    fetch("https://pure-brushlands-38748.herokuapp.com/homework/" + assignment_id, {
        method:"PUT",
        body:data,
        headers: {
            "Content-Type":"application/x-www-form-urlencoded"
        },
        credentials: "include"
    }).then((res) => {
        loadHomework();
    })
    document.querySelector("#edit-wrapper").style.display = "none";
    document.querySelector("#input-wrapper").style.display = "flex";
}

function createAssignmentOnServer(homeworkName, homeworkSubject, homeworkDueDate, homeworkUrgency, homeworkPlaceholder) {
    var data = "name=" + encodeURIComponent(homeworkName) +
                "&subject=" + encodeURIComponent(homeworkSubject) +
                "&duedate=" + encodeURIComponent(homeworkDueDate) +
                "&urgency=" + encodeURIComponent(homeworkUrgency) +
                "&placeholder=" + encodeURIComponent(homeworkPlaceholder);

    fetch("https://pure-brushlands-38748.herokuapp.com/homework", {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        credentials: "include"
    }).then(function (res) {
        loadHomework();
    });
    document.querySelector("#homework").innerHTML = "";
    document.querySelector("#subject").innerHTML = "";
    document.querySelector("#duedate").innerHTML = "";
    document.querySelector("#urgency").innerHTML = "";
    document.querySelector("#homework").placeholder = "name";
    document.querySelector("#subject").placeholder = "subject";
    document.querySelector("#duedate").placeholder = "duedate";
    document.querySelector("#urgency").placeholder = "urgency";
    // document.querySelector("#placeholder").placeholder = "placeholder";
}

function editView(homeworkName, homeworkSubject, homeworkDuedate, homeworkUrgency, homeworkPlaceholder) {
    var create = document.querySelector("#input-wrapper");
    create.style.display = "none";
    document.querySelector("#edit-homework").value = homeworkName;
    document.querySelector("#edit-subject").value = homeworkSubject;
    document.querySelector("#edit-duedate").value = homeworkDuedate;
    document.querySelector("#edit-urgency").value = homeworkUrgency;
    document.querySelector("#edit-placeholder").value = homeworkPlaceholder;
    var edit = document.querySelector("#edit-wrapper");
    edit.style.display = "flex";
}

function deleteAssignmentOnServer(assignment_id) {
    document.querySelector("#edit-wrapper").style.display = "none";
    document.querySelector("#input-wrapper").style.display = "flex";
    fetch("https://pure-brushlands-38748.herokuapp.com/homework/" + assignment_id, {
        method:"DELETE",
        credentials: "include"
    }).then(function(res) {
        loadHomework();
    });
}

function loadHomework() {
    fetch("https://pure-brushlands-38748.herokuapp.com/homework", {
        credentials: "include"
    }).then(function (res) {
        if (res.status == 401) {
            // hide homework, etc.
            // show login/register, etc.
            return;
        } else if (res.status == 200) {
            // show restaurants, etc.
            // hide login/register, etc.
        } else {
            // unexpected
        }

        // put this stuff in the else if
        res.json().then(function (data) {
            workList = data;

            var homeworkList = document.querySelector("#homework-list");
            homeworkList.innerHTML = "";
            //loop over data and display in dom
            workList.forEach(function (homework) {
                console.log("one-work:", homework);
                var workItem = document.createElement("li");

                var nameEl = document.createElement("div");
                nameEl.innerHTML = "name: " + homework.name;
                nameEl.classList.add("aname");
                workItem.appendChild(nameEl);

                var subEl = document.createElement("div");
                subEl.innerHTML = "subject: " + homework.subject;
                subEl.classList.add("asub");
                workItem.appendChild(subEl);

                var dateEl = document.createElement("div");
                dateEl.innerHTML = "duedate: " + homework.duedate;
                dateEl.classList.add("adate");
                workItem.appendChild(dateEl);

                var urgentEl = document.createElement("div");
                urgentEl.innerHTML = "urgency: " + homework.urgency;
                urgentEl.classList.add("aurg");
                workItem.appendChild(urgentEl);

                var placeholderEl = document.createElement("div");
                placeholderEl.innerHTML = "placeholder: " + homework.placeholder;
                placeholderEl.classList.add("aplace");
                workItem.appendChild(placeholderEl);

                var editButton = document.createElement("button");
                editButton.innerHTML = "edit";
                editButton.classList.add("edit-button")
                editButton.onclick = () => {
                    console.log("edit button clicked", homework);
                    assignment_id = homework.id
                    editView(homework.name, homework.subject, homework.duedate, homework.urgency, homework.placeholder);
                };
                workItem.appendChild(editButton);

                var deleteButton = document.createElement("button");
                deleteButton.innerHTML = "delete";
                deleteButton.classList.add("delete-button")
                deleteButton.onclick = () => {
                    console.log("delete button clicked", homework);
                    if(confirm("Are you sure you want to delete " + homework.name + "?")) {
                        deleteAssignmentOnServer(homework.id);
                    };
                };
                workItem.appendChild(deleteButton);

                homeworkList.appendChild(workItem);
            })
        })
    })
}

loadHomework();