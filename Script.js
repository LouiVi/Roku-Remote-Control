<style>
body {background: transparent !important;}
img {border-radius: 10px; }
</style>
<script>
const ROKU_IP = "192.168.70.236";
// Function to handle commands
function HandleCommand(command) {
    var baseUrl = "http://" + ROKU_IP + ":8060/keypress/";
var baseUrl2 = "http://" + ROKU_IP + ":8060/";

    if (command.includes("volume up")) {
        SendCommand(baseUrl + "VolumeUp");
    } else if (command.includes("volume down")) {
        SendCommand(baseUrl + "VolumeDown");
   } else if (command.includes("Vol Down")) {
        SendCommand(baseUrl + "VolumeDown");
   } else if (command.includes("Vol Up")) {
        SendCommand(baseUrl + "VolumeUp");
      } else if (command.includes("power off")) {
        SendCommand(baseUrl + "PowerOff");
    } else if (command.includes("power on")) {
        SendCommand(baseUrl + "PowerOn");
    } else if (command.includes("select")) {
        SendCommand(baseUrl + "Select");
    } else if (command.includes("back")) {
        SendCommand(baseUrl + "Back");
    } else if (command.includes("up")) {
        SendCommand(baseUrl + "Up");
    } else if (command.includes("down")) {
        SendCommand(baseUrl + "Down");
     } else if (command.includes("left")) {
        SendCommand(baseUrl + "Left");
    } else if (command.includes("right")) {
        SendCommand(baseUrl + "Right");
    } else if (command.includes("home")) {
        SendCommand(baseUrl + "Home");
     } else if (command.includes("sleep")) {
        SendCommand(baseUrl + "Sleep");
      } else if (command.includes("menu")) {
        SendCommand(baseUrl + "Menu");
      } else if (command.includes("play")) {
        SendCommand(baseUrl + "Play");
    } else if (command.includes("launch")) {
        SendCommand(baseUrl2 + command); // Example for Netflix, app ID may vary
  /*  } else if (command.includes("camera")) {
        SendCommand(baseUrl + "Launch/600807"); // Example for Netflix, app ID may vary
    */
    } else {
        app.ShowPopup("Command not recognized");
    }
}

// Function to send a command via HTTP to Roku
function SendCommand(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.send();
    xhr.onload = function() {
    //alert(xhr.responseText);
        if (xhr.status == 200)
        v = 1
           // app.ShowPopup("Command sent successfully!");
        else
        if(url.includes("PowerOn")) {
        btnCurr.SetText("Power Off");
        }else if(url.includes("PowerOff")){
        btnCurr.SetText("Power On");
        }
        
            //app.ShowPopup("Fail to send comm: "+url);
    };
}
</script>