function populateEvents(month) {
    //make search condition for current month 
    let prevdate = (currentMonth.year - 1) + "-" + (month + 1) + "-1";
    let nextdate = (currentMonth.year + 2) + "-1-1";
    let userid = sessionStorage.getItem('userid');
    // Make a URL-encoded string for passing POST data to fetch all the events for current month:

    //get all the selected tag values
    let boxes = document.getElementsByName('tag_checkbox');
    var tagArray = new Array();
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].checked)
            tagArray.push(boxes[i].value);
    }

    //get all the selected calendar values
    let calendarBox = document.getElementsByName('calendar_checkbox');
    var shareusers = new Array();
    for (let i = 0; i < calendarBox.length; i++) {
        if (calendarBox[i].checked)
            shareusers.push(calendarBox[i].value);
    }

    let days = document.getElementsByTagName('td');
    for (let i = 0; i < days.length; i++) {
        let findex = days[i].id.indexOf("-");
        let fstr = days[i].id.substring(findex + 1);
        let sindex = fstr.indexOf("-");
        days[i].innerHTML = fstr.substring(sindex + 1);
    }
    const data = {
        'prevdate': prevdate, 'nextdate': nextdate, 'userid': userid,
        'tags': tagArray, 'shareusers': shareusers
    };
    fetch("fetchEvents_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(function (data) {
            //populate events for each date
            if (data.success == true) {
                for (var i = 0; i < data.dates.length; i++) {
                    let year = data.dates[i].substring(0, 4)
                    let month = parseInt(data.dates[i].substring(5, 7));
                    let day = parseInt(data.dates[i].substring(8, 10));
                    if (document.getElementById(year + "-" + month + "-" + day)) {
                        document.getElementById(year + "-" + month + "-" + day).innerHTML = day;
                    }
                }
                for (var i = 0; i < data.dates.length; i++) {
                    let year = data.dates[i].substring(0, 4)
                    let month = parseInt(data.dates[i].substring(5, 7));
                    let day = parseInt(data.dates[i].substring(8, 10));
                    let time = data.dates[i].substring(11, 16);
                    if (document.getElementById(year + "-" + month + "-" + day)) {
                        document.getElementById(year + "-" + month + "-" + day).innerHTML +=
                            "<p class = 'event' id = 'event" + data.ids[i] + "'>" + time + " " + data.contents[i] + "</p>"
                            + "<input type = 'hidden' id = 'tag" + data.ids[i] + "' value = " + data.tags[i] + " />";
                    }
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function hideOrShowButtons() {
    let username = sessionStorage.getItem("username");
    let token = sessionStorage.getItem("token");
    document.getElementById("token").value = token;
    if (username) {
        document.getElementById("hello").innerText = "hello, " + username;
        $("#login").hide();
        $("#register").hide();
        $("#logout_btn").show();
        $("#shared_calendar").show();
        $("#tagsboxes").show();
        $("#group_event_container").show();
    }
    else {
        document.getElementById("hello").innerText = "";
        $("#login").show();
        $("#register").show();
        $("#logout_btn").hide();
        $("#shared_calendar").hide();
        $("#tagsboxes").hide();
        $("#group_event_container").hide();
    }
}
function addTag(event) {
    let newtag = "";
    if (document.getElementById("newtag").value != "") {
        newtag = document.getElementById("newtag").value;
    }
    else {
        return;
    }
    let token = sessionStorage.getItem("token");
    let userid = sessionStorage.getItem("userid");
    const data = { 'userid': userid, 'newtag': newtag, "token": token };
    fetch("addTag_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(function (data) {
            $("#panel").slideUp();
            updateCalendar();
        })
        .catch(function (error) {
            console.log(error);
        });
}
function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    //pass data and check result
    fetch("login_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(function (data) {
            if (data.success) {
                //if valid user, set session variables and update events
                sessionStorage.setItem("username", data.username);
                sessionStorage.setItem("userid", data.userid);
                sessionStorage.setItem("token", data.token);
                document.getElementById("token").value = data.token;
                updateCalendar();
                document.getElementById("errormsg").innerHTML = "";
            }
            else {
                document.getElementById("errormsg").innerHTML = data.message;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}
function registerAjax(event) {
    const username_reg = document.getElementById("username_reg").value; // Get the username from the form
    const password_reg = document.getElementById("password_reg").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username_reg': username_reg, 'password_reg': password_reg };

    //pass data and check result
    fetch("register_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(function (data) {
            if (data.success) {
                //if valid user, set session variables and update events
                sessionStorage.setItem("username", data.username);
                sessionStorage.setItem("userid", data.userid);
                sessionStorage.setItem("token", data.token);
                document.getElementById("token").value = data.token;
                updateCalendar();
                document.getElementById("errormsg").innerHTML = "";
            }
            else {
                document.getElementById("errormsg").innerHTML = data.message;
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function fetchSharedCalendars() {
    let userid = sessionStorage.getItem('userid');
    const data = { 'userid': userid };
    fetch("fetchSharedCalendars_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(function (data) {
            document.getElementById("others_calendar_div").innerHTML = "";
            for (let i = 0; i < data.username_shares.length; i++) {
                let button = document.createElement("button");
                button.id = "deleteTag";
                button.addEventListener("click", function (event) {
                    let token = sessionStorage.getItem("token");
                    const tagdata = { 'userid': userid, 'user_id_shares': data.user_id_shares[i], 'token': token };
                    fetch("deleteSharedCalendar_ajax.php", {
                        method: 'POST',
                        body: JSON.stringify(tagdata),
                        headers: { 'content-type': 'application/json' }
                    })
                        .then(response => response.json())
                        .then(function (data) {
                            populateEvents(currentMonth.month);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }, false);
                button.innerHTML = "x";
                document.getElementById("others_calendar_div").appendChild(button);
                let label = document.createElement("label");
                label.innerHTML = data.username_shares[i];
                let box = document.createElement("input");
                box.type = "checkbox";
                box.name = "calendar_checkbox";
                box.value = data.username_shares[i];
                box.addEventListener("click", function (event) {
                    populateEvents(currentMonth.month);
                }, false);
                label.appendChild(box);
                document.getElementById("others_calendar_div").appendChild(label);
                let br = document.createElement("br");
                document.getElementById("others_calendar_div").appendChild(br);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function shareCalendar() {

    let userid = sessionStorage.getItem('userid');
    let token = $("#token").val();
    let data = {
        'userid_share': userid, 'username_shared': document.getElementById("user_options").value,
        'token': token
    };

    //pass data and check result
    fetch("shareCalendar_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => alert(data.success ? "Successfully shared!" : "Failed to share"))
        .catch(function (error) {
            console.log(error);
        });
}

//share event with other
function shareEvent() {

    let eventid = "event" + document.getElementById("eventid").value;
    let datetime = document.getElementById("date").value +
        " " + document.getElementById(eventid).innerHTML.substring(0, 5)
    let token = $("#token").val();
    let tag = $("#tags").val();
    const data = {
        'content': document.getElementById(eventid).innerHTML.substring(6), "tag": tag,
        'date': datetime, 'username': document.getElementById("selectOptions").value, "token": token
    };
    fetch("shareEvent_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => alert(data.success ? "Successfully shared event!" : `Failed to share event`))
        .catch(function (error) {
            console.log(error);
        });
}

//load and update calendar
document.addEventListener("DOMContentLoaded", updateCalendar, false);

// Change the month when the "next" button is pressed
document.getElementById("next_mobth").addEventListener("click", function (event) {
    currentMonth = currentMonth.nextMonth();
    updateCalendar();
}, false);

// Change the month when the "previous" button is pressed
document.getElementById("prev_month").addEventListener("click", function (event) {
    currentMonth = currentMonth.prevMonth();
    updateCalendar();
}, false);

//log out
document.getElementById("logout_btn").addEventListener("click", function (event) {

    sessionStorage.clear();
    updateCalendar();
}, false);

document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click
document.getElementById("register_btn").addEventListener("click", registerAjax, false);
document.getElementById("share_btn").addEventListener("click", shareCalendar, false);

//when user clicks, add this event to the corresponding user
document.getElementById("clickToShare").addEventListener("click", shareEvent, false);
document.getElementById("addtag_btn").addEventListener("click", addTag, false);
