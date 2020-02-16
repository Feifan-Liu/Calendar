let date = new Date();
let currentMonth = new Month(date.getFullYear(), date.getMonth());
let currentDate = date.getDate();
function updateCalendar() {

    //fetch and make the dropdown box for all users
    let username = sessionStorage.getItem("username");
    let userid = sessionStorage.getItem("userid");
    let data = { 'username': username };
    fetch("fetchUsers_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(function (data) {
            document.getElementById("user_options").innerHTML = "";
            for (var i = 0; i < data.usernames.length; i++) {
                let option = document.createElement("option");
                option.innerHTML = data.usernames[i];
                document.getElementById("user_options").appendChild(option);
            }

        })
        .catch(function (error) {
            console.log(error);
        });

    //fetch and make the dropdown box for all grouped tags
    data = { 'userid': userid, "grouped": 1 };
    fetch("fetchTags_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(function (data) {
            document.getElementById("group_event").innerHTML = "";
            for (let i = 0; i < data.tags.length; i++) {
                let button = document.createElement("button");
                button.id = "deleteTag";
                button.addEventListener("click", function (event) {
                    let token = sessionStorage.getItem("token");
                    const tagdata = { 'userid': userid, 'tag': data.tags[i], 'token': token };
                    fetch("deleteTag_ajax.php", {
                        method: 'POST',
                        body: JSON.stringify(tagdata),
                        headers: { 'content-type': 'application/json' }
                    })
                        .then(response => response.json())
                        .then(function (data) {
                            updateCalendar();
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }, false);
                button.innerHTML = "x";
                document.getElementById("group_event").appendChild(button);
                let label = document.createElement("label");
                label.innerHTML = data.tags[i];
                let box = document.createElement("input");
                box.type = "checkbox";
                box.value = data.tags[i];
                box.checked = true;
                box.name = "tag_checkbox"
                box.addEventListener("click", function (event) {
                    populateEvents(currentMonth.month);
                }, false);
                label.appendChild(box);
                document.getElementById("group_event").appendChild(label);
                let br = document.createElement("br");
                document.getElementById("group_event").appendChild(br);
            }
            populateEvents(currentMonth.month);
        })
        .catch(function (error) {
            console.log(error);
        });

    //fetch and make the dropdown box for all tags
    data = { 'userid': userid, "grouped": 0 };
    fetch("fetchTags_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(function (data) {
            document.getElementById("tag_box_div").innerHTML = "";
            for (let i = 0; i < data.tags.length; i++) {
                if(data.tags.length > 1){
                    let button = document.createElement("button");
                    button.id = "deleteTag";
                    button.addEventListener("click", function (event) {
                        let token = sessionStorage.getItem("token");
                        const tagdata = { 'userid': userid, 'tag': data.tags[i], 'token': token };
                        fetch("deleteTag_ajax.php", {
                            method: 'POST',
                            body: JSON.stringify(tagdata),
                            headers: { 'content-type': 'application/json' }
                        })
                            .then(response => response.json())
                            .then(function (data) {
                                updateCalendar();
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }, false);
                    button.innerHTML = "x";
                    document.getElementById("tag_box_div").appendChild(button);
                }
                let label = document.createElement("label");
                label.innerHTML = data.tags[i];
                let box = document.createElement("input");
                box.type = "checkbox";
                box.value = data.tags[i];
                box.checked = true;
                box.name = "tag_checkbox"
                box.addEventListener("click", function (event) {
                    populateEvents(currentMonth.month);
                }, false);
                label.appendChild(box);
                document.getElementById("tag_box_div").appendChild(label);
                let br = document.createElement("br");
                document.getElementById("tag_box_div").appendChild(br);
            }
            if (data.tags.length > 0) {
                let button = document.createElement("button");
                button.id = "addTag";
                button.addEventListener("click", function (event) {
                    $("#panel").slideToggle();
                }, false);
                button.innerHTML = "Add Tag";
                document.getElementById("tag_box_div").appendChild(button);
            }
            populateEvents(currentMonth.month);
        })
        .catch(function (error) {
            console.log(error);
        });
    $("#shareEvent").hide();
    hideOrShowButtons();
    document.getElementById("calendar").innerHTML = "";
    // get the actual month
    const month = parseInt(currentMonth.month) + 1
    // display month,year
    document.getElementById("title").innerHTML = "<strong>" + month + " - " + currentMonth.year + "</strong>";
    let table = document.createElement("table");
    let tr = document.createElement("tr");
    // display weekdays
    let weekday = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    for (let i = 0; i <= 6; i++) {
        let th = document.createElement("th");
        th.innerHTML = weekday[i];
        tr.appendChild(th);
    }
    table.appendChild(tr);
    let weeks = currentMonth.getWeeks();
    // flag to determine if the date is in current month
    let flag = true;
    let prevMonthFlag = true;
    for (let w in weeks) {
        let days = weeks[w].getDates();
        let tr = document.createElement("tr");
        // display each day in a week starting from sunday
        for (let d in days) {
            let day = days[d].getDate();
            if (day == 1) {
                flag = !flag;
                prevMonthFlag = false;
            }
            let td = document.createElement("td");

            //if previous month
            if (flag && prevMonthFlag) {
                td.setAttribute("class", "otherMonth");
                if (currentMonth.month == 0) {
                    td.setAttribute("id", (currentMonth.year - 1) + "-12-" + day);
                } else {
                    td.setAttribute("id", currentMonth.year + "-" + currentMonth.month + "-" + day);
                }
            }

            //if next month
            else if (flag) {
                td.setAttribute("class", "otherMonth");
                if (currentMonth.month == 11) {
                    td.setAttribute("id", (currentMonth.year + 1) + "-1-" + day);
                } else {
                    td.setAttribute("id", currentMonth.year + "-" + (currentMonth.month + 2) + "-" + day);
                }
            } else {
                if (day == currentDate && currentMonth.month == date.getMonth() && date.getFullYear() == currentMonth.year) {
                    td.setAttribute("class", "currentDate");
                }
                td.setAttribute("id", currentMonth.year + "-" + (currentMonth.month + 1) + "-" + day);
            }
            td.innerHTML = day;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    //create table
    document.getElementById("calendar").appendChild(table)

    //if logged in user, add click event for each day
    if (username) {
        fetchSharedCalendars();
        flag = true;
        prevMonthFlag = true;
        for (let w in weeks) {
            let days = weeks[w].getDates();
            for (let d in days) {
                let day = days[d].getDate();
                if (day == 1) {
                    flag = !flag;
                    prevMonthFlag = false;
                }

                //if previous month
                if (flag && prevMonthFlag) {
                    if (currentMonth.month == 0) {
                        document.getElementById((currentMonth.year - 1) + "-12-" + day).addEventListener("click", function (event) {
                            document.getElementById("date").value = (currentMonth.year - 1) + "-12-" + day;
                            document.getElementById("month").value = "12";
                            clickedOnEvent(event);
                            dialog.dialog("open");
                        }, false);
                    } else {
                        document.getElementById(currentMonth.year + "-" + currentMonth.month + "-" + day).addEventListener("click", function (event) {
                            document.getElementById("date").value = currentMonth.year + "-" + currentMonth.month + "-" + day;
                            document.getElementById("month").value = currentMonth.month;
                            clickedOnEvent(event);
                            dialog.dialog("open");
                        }, false);
                    }
                }

                //if next month
                else if (flag) {
                    if (currentMonth.month == 11) {
                        document.getElementById((currentMonth.year + 1) + "-1-" + day).addEventListener("click", function (event) {
                            document.getElementById("date").value = (currentMonth.year + 1) + "-1-" + day;
                            document.getElementById("month").value = "1";
                            clickedOnEvent(event);
                            dialog.dialog("open");
                        }, false);
                    } else {
                        document.getElementById(currentMonth.year + "-" + (currentMonth.month + 2) + "-" + day).addEventListener("click", function (event) {
                            document.getElementById("date").value = currentMonth.year + "-" + (currentMonth.month + 2) + "-" + day;
                            document.getElementById("month").value = (currentMonth.month + 2);
                            clickedOnEvent(event);
                            dialog.dialog("open");
                        }, false);
                    }

                } else {
                    document.getElementById(currentMonth.year + "-" + (currentMonth.month + 1) + "-" + day).addEventListener("click", function (event) {
                        document.getElementById("date").value = currentMonth.year + "-" + (currentMonth.month + 1) + "-" + day;
                        clickedOnEvent(event);
                        dialog.dialog("open");
                    }, false);
                }
            }
        }
        populateEvents(currentMonth.month);
    }

}

//set up click event for clicking on an event, prepopluate data for the popped up form
function clickedOnEvent(event) {
    event.stopPropagation();
    let eventId = event.target.id;
    let userid = sessionStorage.getItem("userid");
    const data = { 'userid': userid, "grouped": 0 };
    fetch("fetchTags_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(function (data) {
            document.getElementById("tags").innerHTML = "";
            let tag = "Default";
            if (document.getElementById("eventTag").value) {
                tag = document.getElementById("eventTag").value;
            }
            for (var i = 0; i < data.tags.length; i++) {
                let option = document.createElement("option");
                option.innerHTML = data.tags[i];
                if (data.tags[i] == tag) {
                    option.selected = true;
                }
                document.getElementById("tags").appendChild(option);
            }
            document.getElementById("eventTag").value = "";
        })
        .catch(function (error) {
            console.log(error);
        });
    //cliecked on an event
    if (eventId.substring(0, 5) == "event") {
        //fetch all other users to make drop down box to be selected to share an event
        $("#shareEvent").show();
        $("#groupEvent").hide();
        let username = sessionStorage.getItem("username");
        const data = { 'username': username };
        fetch("fetchUsers_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(function (data) {
                document.getElementById("selectOptions").innerHTML = "";
                for (var i = 0; i < data.usernames.length; i++) {
                    let option = document.createElement("option");
                    option.innerHTML = data.usernames[i];
                    document.getElementById("selectOptions").appendChild(option);
                }

            })
            .catch(function (error) {
                console.log(error);
            });

        document.getElementById("eventid").value = eventId.substring(5);
        document.getElementById("eventTag").value = document.getElementById("tag" + eventId.substring(5)).value;
        document.getElementById("time").value = document.getElementById(eventId).innerHTML.substring(0, 5);
        document.getElementById("tips").innerHTML = "Update event";
        document.getElementById("content").innerHTML = document.getElementById(eventId).innerHTML.substring(6);
    }
    //adding event
    else {
        $("#shareEvent").hide();
        $("#groupEvent").show();

        //fetch all the other usernames and make the checkbox
        let username = sessionStorage.getItem("username");
        const data = { 'username': username };
        fetch("fetchUsers_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(function (data) {
                document.getElementById("userGroup").innerHTML = "";
                for (var i = 0; i < data.usernames.length; i++) {
                    let checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    checkbox.value = data.usernames[i];
                    checkbox.setAttribute("class", "checkbox");
                    let label = document.createElement('label')
                    label.htmlFor = "label";
                    label.innerHTML = data.usernames[i];
                    label.appendChild(checkbox);
                    document.getElementById("userGroup").appendChild(label);
                }

            })
            .catch(function (error) {
                console.log(error);
            });

        document.getElementById("eventid").value = "";
        document.getElementById("tips").innerHTML = "Add event";
        document.getElementById("content").innerHTML = "";
        document.getElementById("time").value = "";
    }
}