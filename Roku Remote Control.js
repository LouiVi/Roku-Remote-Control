cfg.Light, cfg.MUI, cfg.Portrait;
app.LoadPlugin( "Xml2Js" );

const ROKU_IP = "192.168.70.236";

// Initialize the app and start listening
function OnStart() {
    app.SetTitle("Roku Remote");
plg = app.CreateXml2Js();
    // Create a layout with vertical orientation
    var lay = app.CreateLayout("linear", "Top,FillX");
    
    speech = app.CreateSpeechRec()
	speech.SetOnReady( speech_OnReady )
	speech.SetOnResult( speech_OnResult )
	speech.SetOnError( speech_OnError )
	
    // Create a button to start speech recognition
    var btn = app.CreateButton("Start Listening", 0.5, 0.1);
    btn.SetOnTouch(StartListening);
    lay.AddChild(btn);
    
     var lay2= app.CreateLayout("linear", "Horizontal, VCenter");
  
    btn2 = app.CreateButton( "Vol ↑", 0.30, -1 );
    btn2.SetOnTouch( btn2_OnTouch );
    txt2 = app.CreateTextEdit( "1", 0.20, -1 );
    
    lay2.AddChild( btn2 );
    lay2.AddChild( txt2 );
    
    lay.AddChild( lay2 )
    
     var lay23= app.CreateLayout("linear", "Horizontal, VCenter");
  
    btn23 = app.CreateButton( "Vol ↓", 0.30, -1 );
    btn23.SetOnTouch( btn23_OnTouch );
    txt23 = app.CreateTextEdit( "1", 0.20, -1);
    
    lay2.AddChild( btn23 );
    lay2.AddChild( txt23 );
    
    lay.AddChild( lay23 )
    
    btn4 = app.CreateButton( "arrow_drop_up", -1, -1, );
    btn4.SetFontFile( "Misc/MaterialIcons-Regular.ttf" );
    btn4.SetOnTouch( ()=>{HandleCommand("up");})
    btn4.SetTextSize( 18 );
    
    btn41 = app.CreateButton( "arrow_drop_down", -1, -1, );
    btn41.SetFontFile( "Misc/MaterialIcons-Regular.ttf" );
    btn41.SetOnTouch( ()=>{HandleCommand("down");});
    btn41.SetTextSize( 18 );
    
    lay23.AddChild( btn4 );
      lay23.AddChild( btn41);
      
       btn42 = app.CreateButton( "arrow_left", -1, -1, );
    btn42.SetFontFile( "Misc/MaterialIcons-Regular.ttf" );
    btn42.SetOnTouch( ()=>{HandleCommand("left");})
    btn42.SetTextSize( 18 );
    
    btn412 = app.CreateButton( "arrow_right", -1, -1, );
    btn412.SetFontFile( "Misc/MaterialIcons-Regular.ttf" );
    btn412.SetOnTouch( ()=>{HandleCommand("right");});
    btn412.SetTextSize( 18 );
    
    lay23.AddChild( btn42);
      lay23.AddChild( btn412);
      
    // Add the layout to the app
    app.AddLayout(lay);
    
    app.HttpRequest( "GET", "http://" + ROKU_IP + ":8060/query/apps", null, null, handleReply );


}

function handleReply( error, reply )
{
    if( error ) alert( reply );
    else
    {
    plg.ParseString( reply, OnResult );
        //var funfact = reply.slice( reply.indexOf("<i>") + 3, reply.indexOf("</i>") );
       // alert( funfact );
    }
}

function OnResult( err, result )
{
 // alert( JSON.stringify(result) );
 for(
  alert(result.apps.app[a].$.id);
}

// Function to start listening for speech
function StartListening() {
	speech.Recognize();
    app.ShowProgress("Listening...");
    /*app.Listen(function(result) {
        app.HideProgress();
        HandleCommand(result.toLowerCase());
    });*/
}

function btn2_OnTouch()
{
	r = parseInt(txt2.GetText());
	for(c=0;c<r;c++){
	HandleCommand("volume up");
	app.Wait(1, false);
	}
}

function btn23_OnTouch()
{
	r = parseInt(txt23.GetText());
	for(c=0;c<r;c++){
	HandleCommand("volume down");
	app.Wait(1, false);
	}
}


// Function to handle commands
function HandleCommand(command) {
    var baseUrl = "http://" + ROKU_IP + ":8060/keypress/";

    if (command.includes("volume up")) {
        SendCommand(baseUrl + "VolumeUp");
    } else if (command.includes("volume down")) {
        SendCommand(baseUrl + "VolumeDown");
    } else if (command.includes("power off")) {
        SendCommand(baseUrl + "PowerOff");
    } else if (command.includes("power on")) {
        SendCommand(baseUrl + "PowerOn");
    } else if (command.includes("channel up")) {
        SendCommand(baseUrl + "ChannelUp");
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
    } else if (command.includes("mute")) {
        SendCommand(baseUrl + "Mute");
    } else if (command.includes("netflix")) {
        SendCommand(baseUrl + "Launch/12"); // Example for Netflix, app ID may vary
    } else if (command.includes("camera")) {
        SendCommand(baseUrl + "Launch/600807"); // Example for Netflix, app ID may vary
    
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
        if (xhr.status == 200)
            app.ShowPopup("Command sent successfully!");
        else
            app.ShowPopup("Failed to send command.");
    };
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
    app.ShowPopup( "Please speak more clearly!" )
}

function speech_OnReady()
{
    app.ShowPopup( "Listening...", "Short" )
}