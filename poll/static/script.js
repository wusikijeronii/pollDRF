var getPolls = null;
var startTime = null;
var passedTests = [];
var sortByUser = {};
$(function () {
    $("#login").submit(function (event) {
        event.preventDefault();
        var createNewUser = null;
        var customUserID = $(this).serializeArray()[1]["value"];
        if (customUserID != "") {
            createNewUser = { "id": customUserID };
        }
        else {
            $.ajax({
                "async": false,
                "type": "POST",
                "global": false,
                "url": "/api/v1/poll/main/UserAuthModel/?format=json",
                "dataType": "json",
                "success": function (data) {
                    createNewUser = data;
                }
            });
        }
        $("h1").text("Hello user" + createNewUser["id"]);
        $("#login").css("display", "none");
        console.log(createNewUser);
        $.ajax({
            "async": false,
            "type": "GET",
            "global": false,
            "url": "/api/v1/poll/main/PollModel/?format=json",
            "dataType": "json",
            "success": function (data) {
                getPolls = data;
            }
        });
        console.log(getPolls);
        var answersData = null;
        $.ajax({
            "async": false,
            "type": "GET",
            "global": false,
            "url": "/api/v1/poll/main/AnswerModel/?format=json",
            "dataType": "json",
            "success": function (data) {
                answersData = data;
            }
        });
        for (var l = 0; l < answersData.length; l++) {
            if (answersData[l]["userObjAnswer"] == createNewUser["id"]) {
                sortByUser[answersData[l]["pollObjAnswer"]] = answersData[l]["answerData"];
            }
        }
        var getQuestionsInfo = null;
        $.ajax({
            "async": false,
            "type": "GET",
            "global": false,
            "url": "/api/v1/poll/main/QuestionModel/?format=json",
            "dataType": "json",
            "success": function (data) {
                getQuestionsInfo = data;
            }
        });
        var sortByUserKeys = Object.keys(sortByUser);
        for (var l = 0; l < getQuestionsInfo.length; l++) {
            for (var k = 0; k < sortByUserKeys.length; k++) {
                if (getQuestionsInfo[l]["id"] == sortByUserKeys[k] && passedTests.includes(getQuestionsInfo[l]["pollObj"]) == false) {
                    passedTests.push(getQuestionsInfo[l]["pollObj"]);
                }
            }
        }
        console.log(passedTests);
        console.log(sortByUser);
        var userDiv = $(".userData");
        for (var i = 0; i < getPolls.length; i++) {
            var formElement = document.createElement("form");
            formElement.setAttribute("id", "poll" + getPolls[i]["id"]);
            formElement.setAttribute("data-number", getPolls[i]["id"]);
            userDiv.append(formElement);
            var labelElement = $(document.createElement("label"));
            labelElement.text(getPolls[i].title);
            var formMain = $(userDiv.children()[userDiv.children().length - 1]);
            formMain.append(labelElement);
            var pElement = $(document.createElement("p"));
            pElement.text(getPolls[i].description)
            formMain.append(pElement);
            var inputElement = document.createElement("input");
            inputElement.setAttribute("type", "submit");
            if (passedTests.includes(getPolls[i]["id"])) {
                inputElement.setAttribute("value", "Passed");
            }
            else {
                inputElement.setAttribute("value", "Pass");
            }
            formMain.append(inputElement);
        }
        for (var i = 0; i < getPolls.length; i++) {
            $("#poll" + getPolls[i]["id"]).submit(function (event) {
                event.preventDefault();
                if (startTime == null) {
                    startTime = new Date().toLocaleString();
                }
                console.log(startTime);
                var activeIndex = null;
                for (var j = 0; j < getPolls.length; j++) {
                    if ($(this).data("number") == getPolls[j]["id"]) {
                        activeIndex = j;
                    }
                }
                var pollData = getPolls[activeIndex]["pollData"];
                var brTag = document.createElement("br");
                $(this).append(brTag);
                for (var j = 0; j < pollData.length; j++) {
                    var formMain = $(this);
                    var labelElement = $(document.createElement("label"));
                    labelElement.text(pollData[j]["title"]);
                    formMain.append(labelElement);
                    var types = {
                        0: "text",
                        1: "radio",
                        2: "checkbox"
                    }
                    if (pollData[j]["questionType"] == 0) {
                        var inputElement = document.createElement("input");
                        inputElement.setAttribute("type", types[pollData[j]["questionType"]]);
                        inputElement.setAttribute("name", "question" + pollData[j]["id"]);
                        if (passedTests.includes(getPolls[activeIndex]["id"])) {
                            var str = sortByUser[pollData[j]["id"]];
                            inputElement.setAttribute("value", str.slice(1, str.length - 1));
                        }
                        formMain.append(inputElement);
                    }
                    else {
                        var questionData = (0, eval)('(' + pollData[j]["questionData"] + ')');
                        for (var k = 0; k < questionData.length; k++) {
                            var inputElement = document.createElement("input");
                            inputElement.setAttribute("type", types[pollData[j]["questionType"]]);
                            inputElement.setAttribute("name", "question" + pollData[j]["id"]);
                            inputElement.setAttribute("value", k);
                            if (passedTests.includes(getPolls[activeIndex]["id"])) {
                                if (eval(sortByUser[pollData[j]["id"]]).includes(k) == true) {
                                    inputElement.checked = true;
                                }
                            }
                            formMain.append(inputElement);
                            var nestedLabelElement = $(document.createElement("label"));
                            nestedLabelElement.text(questionData[k]);
                            formMain.append(nestedLabelElement);

                        }

                    }
                    var brTag = document.createElement("br");
                    $(this).append(brTag);
                }
                var anonymous = document.createElement("input");
                anonymous.setAttribute("type", "checkbox");
                anonymous.setAttribute("name", "anonymous");
                anonymous.setAttribute("value", 1);
                $(this).append(anonymous);
                var nestedLabelElement = $(document.createElement("label"));
                nestedLabelElement.text("Anonymous");
                $(this).append(nestedLabelElement);
                var submitElement = document.createElement("input");
                submitElement.setAttribute("type", "submit");
                submitElement.setAttribute("value", "Finish");
                $(this).append(submitElement);
                $($(this).children()[$(this).children().length - 1]).click(function (event) {
                    event.preventDefault();
                    var endTime = new Date().toLocaleString();
                    console.log(endTime);
                    console.log(pollData);
                    serializedArr = $(this).parent().serializeArray();
                    var newJsonObj = {};
                    for (var d = 0; d < serializedArr.length; d++) {
                        if (newJsonObj.hasOwnProperty(serializedArr[d]["name"])) {
                            if (Array.isArray(newJsonObj[serializedArr[d]["name"]])) {
                                newJsonObj[serializedArr[d]["name"]].push(serializedArr[d]["value"]);
                            }
                            else {
                                newJsonObj[serializedArr[d]["name"]] = [newJsonObj[serializedArr[d]["name"]], serializedArr[d]["value"]];
                            }
                        }
                        else {
                            newJsonObj[serializedArr[d]["name"]] = serializedArr[d]["value"];
                        }
                    }
                    console.log(newJsonObj);
                    var userID = createNewUser;
                    if (newJsonObj.hasOwnProperty("anonymous")) {
                        userID = { "id": 1 };
                        delete newJsonObj["anonymous"];
                    }
                    newJsonObjKeys = Object.keys(newJsonObj);
                    for (var d = 0; d < newJsonObjKeys.length; d++) {
                        var answerData = null;
                        if (Array.isArray(answersData) == true) {
                            answerData = "[" + newJsonObj[newJsonObjKeys[d]].toString() + "]";
                        }
                        else {
                            answerData = newJsonObj[newJsonObjKeys[d]]
                        }
                        $.post("/api/v1/poll/main/AnswerModel/?format=json",
                            {
                                "answerData": answerData,
                                "dataStart": startTime,
                                "dataEnd": endTime,
                                "userObjAnswer": userID["id"],
                                "pollObjAnswer": Number(newJsonObjKeys[d].split("question")[1])
                            }
                        )
                    }
                    startTime = null;
                    var dataToDelete = $(this).parent().children();
                    $(dataToDelete[2]).val("Passed");
                });
            });
        }
    });
});