cfg.MUI, cfg.Light, cfg.Portrait;

app.LoadPlugin( "Support" );
app.LoadPlugin( "Xml2Js" );

const ROKU_IP = "192.168.70.236";
var btnCurr;

function OnStart()
{
plg = app.CreateXml2Js();
speech = app.CreateSpeechRec()
	speech.SetOnReady( speech_OnReady )
	speech.SetOnResult( speech_OnResult )
	speech.SetOnError( speech_OnError )
//colorx = MUI.colors.teal
    app.InitializeUIKit(MUI.colors.deepPurple.darken1)
 lay = app.CreateLayout( "Linear", "Top,HCenter,FillXY" );
 //lay.SetChildMargins( 0.1,0.1,0.1,0.1 );
  lay2 = app.CreateLayout( "Linear", "VCenter,FillXY" );
  
 //lay.SetChildMargins( 0.1,0.1,0.1,0.1 );
 
 var commands = ["Vol Down","Speech","Vol Up","","Power On","","Back","","Home","","Up","","Left","Ok","Right","","Down","","Return","Sleep","Menu","Rewind","Play","Forward","Netflix","","Disney","Apple","","Hbo"];
apb = MUI.CreateAppBar("Remote Control", "keyboard", "more_vert")
   
             var apbHeight = apb.GetHeight()
   lay.AddChild(apb)
 sup = app.CreateSupport();
 
 grid = sup.CreateGridLayout();
 grid.SetColCount( 3 );

 for( var i=0; i<30; i++ )
 {
 if( commands[i] != "") {
  btn = MUI.CreateButtonRaisedO( commands[i], 0.33, -1, MUI.colors.deepPurple.darken1);
  btn.Animate("Newspaper", null, 1750);
  btn.SetOnTouch(Click);

 //btn = app.CreateButton( commands[i], 0.33, -1);
 }else{
 btn = app.CreateButton( commands[i], 0.33, -1);
 btn.SetVisibility( "Gone"  );
 }
  grid.AddChild( btn );
 }

 lay2.AddChild( grid );
 
lay.AddChild( lay2 );

spn = MUI.CreateSpinner("", 1, 0.1);
        spn.SetOnChange(OnChange);
        spn.SetHint("Channels:");
        lay2.AddChild(spn);

 app.AddLayout( lay );
app.HttpRequest( "GET", "http://" + ROKU_IP + ":8060/query/apps", null, null, handleReply );


}

function OnChange(value, index)
{
    app.ShowPopup("Launching " + value);
    HandleCommand("launch/"+ar2[index]);
}


function handleReply( error, reply )
{
    if( error ) alert( reply );
    else
    {
    //alert(reply);
    plg.ParseString( reply, OnResult );
        //var funfact = reply.slice( reply.indexOf("<i>") + 3, reply.indexOf("</i>") );
       // alert( funfact );
    }
}

function OnResult( err, result )
{
 // alert( JSON.stringify(result) );
 var ar = new Array();
 ar2= new Array();
 /*ar.push("");
 ar.push("");
 ar2.push("");
 ar2.push("");*/
 for(a=0;a<result.apps.app.sort().length;a++){
 ar.push(result.apps.app.sort()[a]._);
 ar2.push(result.apps.app.sort()[a].$.id);
  //app.ShowPopup(result.apps.app[a]._);//.$.id);
  }
  spn.SetList( ar );
}

function Click()
{

var self = this;
self.Animate("Rubberband", null, 950);
	if(self.GetText().includes("Power")) btnCurr = self;
	if(self.GetText() == "Up") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Down") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Left") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Right") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Ok") HandleCommand("select");
	if(self.GetText() == "Menu") HandleCommand("home");
		if(self.GetText() == "Vol Up") HandleCommand("Vol Up");
		if(self.GetText() == "Vol Down") HandleCommand("Vol Down");
		if(self.GetText() == "Power Off") {
		btnCurr=self;
		HandleCommand("power off");
		btnCurr.SetText("Power On");
		}
		
	if(self.GetText() == "Power On") {
	btnCurr=self;
	HandleCommand("power on");
	btnCurr.SetText("Power Off");
	}
		if(self.GetText() == "Speech") StartListening();


}

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
    } else if (command.includes("channel down")) {
        SendCommand(baseUrl + "ChannelDown");
    } else if (command.includes("up")) {
        SendCommand(baseUrl + "Up");
    } else if (command.includes("down")) {
        SendCommand(baseUrl + "Down");
     } else if (command.includes("left")) {
        SendCommand(baseUrl + "Left");
    } else if (command.includes("right")) {
        SendCommand(baseUrl + "Right");
    } else if (command.includes("home")) {
        SendCommand(baseUrl + "Menu");
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


// Function to start listening for speech
function StartListening() {
	speech.Recognize();
    app.ShowProgress("Listening...");
}

function speech_OnResult( results )
{
    //An array of recognition results is returned
    //here, with the most probable at the front
    //of the array.
    
    //Show the top result.
    app.ShowPopup( results[0].toLowerCase());
        app.HideProgress();
        HandleCommand(results[0].toLowerCase());
}

//Called if recognition fails.
function speech_OnError()
{
    app.ShowPopup( "Please speak more clearly!" );
    StartListening();
}

function speech_OnReady()
{
   app.ShowPopup( "Listening..." + "Short" )
}