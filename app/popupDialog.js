let dialog;
let form,
    tips = $(".validateTips");
$(function () {

    function deleteEvent() {
        let valid = true;
        let month = $("#month").val();
        let eventid = $("#eventid").val();
        let token = $("#token").val();
        const data = { 'id': eventid, "token": token };
        fetch("deleteEvent_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => populateEvents())
            .catch(function (error) {
                console.log(error);
            });
        if (valid) {
            document.getElementById("eventid").value = "";
            let element = document.getElementById("event" + eventid);
            if (element) {
                element.parentNode.removeChild(element);
            }
            dialog.dialog("close");
        }
        return valid;
    }

    function editEvent() {
        let valid = true;

        //load values from html elements
        let content = $("#content").val(); // Get the content from the form
        let userid = sessionStorage.getItem("userid");
        let time = $("#time").val();
        let date = $("#date").val();
        let month = $("#month").val();
        let token = $("#token").val();
        let eventid = $("#eventid").val();
        let tag = $("#tags").val();
        let datetime = date + " " + time;
        let groupFlag = 0;
        //if adding event
        if (eventid.length == 0) {

            //make array for all the cehcked values for selected usernames 
            let username = sessionStorage.getItem("username");
            var checkedValues = [username];
            var checkElements = document.getElementsByClassName('checkbox');
            for (var i = 0; checkElements[i]; ++i) {
                if (checkElements[i].checked) {
                    checkedValues.push(checkElements[i].value);
                }
            }
            //if this is a group event
            if (checkedValues.length > 1) {
                tag = "group of " + username;
                groupFlag = 1;
            }

            // Make a URL-encoded string for passing POST data:
            const data = {
                'content': content, 'date': datetime, 'userid': userid,
                "token": token, "tag": tag, 'userGroups': checkedValues, "groupFlag": groupFlag
            };
            fetch("addEvent_ajax.php", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })
                .then(response => response.json())
                .then(function (data) {
                    if (groupFlag == 1) {
                        updateCalendar()
                    } else {
                        populateEvents()
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        //if updating event
        else {
            // Make a URL-encoded string for passing POST data:
            const data = { 'content': content, 'date': datetime, 'id': eventid, "token": token, "tag": tag };
            fetch("updateEvent_ajax.php", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'content-type': 'application/json' }
            })
                .then(response => response.json())
                .then(data => populateEvents())
                .catch(function (error) {
                    console.log(error);
                });
        }

        if (valid) {

            document.getElementById("eventid").value = "";
            dialog.dialog("close");
        }
        return valid;
    }

    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 500,
        width: 450,
        modal: true,
        buttons: {
            "Submit": editEvent,
            "Delete": deleteEvent,
            Cancel: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            form[0].reset();
        }
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        editEvent();
    });
});