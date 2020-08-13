"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("Connect", function (loggedUserConnectionId) {
    var option = document.createElement('option');
    if (connection.connectionId == loggedUserConnectionId) {
        for (var i = 0; i < document.getElementById("targetConnectionId").options.length; i++) {
            if (document.getElementById("targetConnectionId").options[i].value == loggedUserConnectionId) {
                document.getElementById("targetConnectionId").remove(i)
            }
        }
        option.innerHTML = "Me";
        option.value = loggedUserConnectionId;
    } else {
        option.text = option.value = loggedUserConnectionId;
    }
    document.getElementById("targetConnectionId").add(option);
});

connection.on("Disconnect", function (loggedUserConnectionId) {
    for (var i = 0; i < document.getElementById("targetConnectionId").options.length; i++) {
        if (document.getElementById("targetConnectionId").options[i].value == loggedUserConnectionId) {
            document.getElementById("targetConnectionId").remove(i)
        }
    }
});

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.on("ReceiveMessage", function (user, targetConnectionId, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg + "by" + targetConnectionId;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
    document.getElementById("userConnectionId").value = connection.connectionId;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    var targetConnectionId = document.getElementById("targetConnectionId").value;
    if (targetConnectionId) {
        if (connection.connectionId == targetConnectionId) {
            connection.invoke("SendMessageToMe", targetConnectionId, message).catch(function (err) {
                return console.error(err.toString());
            });
        } else {
            connection.invoke("SendMessageToUser", user, targetConnectionId, message).catch(function (err) {
                return console.error(err.toString());
            });
        }
    } else {
        connection.invoke("SendMessageToAll", user, message).catch(function (err) {
            return console.error(err.toString());
        });
    }
    event.preventDefault();
});