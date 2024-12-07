cfg.MUI, cfg.Light, cfg.Portrait, cfg.Share;

app.LoadPlugin( "Support" );
app.LoadPlugin( "Xml2Js" );
app.LoadPlugin( "Utils" );

const ROKU_IP = "192.168.70.236";
const TV_CHANNELS = "http://" + ROKU_IP + ":8060/query/tv-channels";
const TV = "http://" + ROKU_IP + ":8060/launch/tvinput.dtv?ch=";
var btnCurr;

function OnStart()
{
utils = app.CreateUtils();
plg = app.CreateXml2Js();
speech = app.CreateSpeechRec()
	speech.SetOnReady( speech_OnReady )
	speech.SetOnResult( speech_OnResult )
	speech.SetOnError( speech_OnError )
	color3 = MUI.colors.deepPurple.darken4;//"#7d8334";// utils.HexToLighterHex(utils.RandomHexColor(false), 0.74);

color2 = utils.HexToLighterHex(color3, 0.53)

//colorx = MUI.colors.teal
    app.InitializeUIKit(MUI.colors.deepPurple.darken1)
 lay = app.CreateLayout( "Linear", "Top,HCenter,FillXY" );
 //lay.SetChildMargins( 0.1,0.1,0.1,0.1 );
  lay2 = app.CreateLayout( "Linear", "Top,HCenter,FillXY" );
  lay2.SetBackGradient( utils.GetGradientColors(color2)[1], color2,  utils.GetGradientColors(color2)[0] )
 //lay.SetChildMargins( 0.1,0.1,0.1,0.1 );
 
 var commands = ["","Power Off","","Vol Up","Vol Down","Vol Mute","Back","Speech","Home","","Up","","Left","Ok","Right","","Down","","Return","Sleep","Menu","YouTube","Play","Netflix","YouTube","Netflix","Prime","Hulu","Apple TV","HBO"];
apb = MUI.CreateAppBar("Remote Control", "keyboard", "help,more_vert")
   apb.SetOnControlTouch((btnTxt, index)=>{alert(btnTxt);});
  apb.SetOnMenuTouch(()=>{alert('TODO');});
  
                        var apbHeight = apb.GetHeight()
   lay.AddChild(apb)
 sup = app.CreateSupport();
 
 grid = sup.CreateGridLayout();
 grid.SetColCount( 3);

 for( var i=0; i<24; i++ )
 {
 if( commands[i] != "") {
 if(commands[i] == "Power Off" || commands[i] == "Up" || commands[i] == "Left" || commands[i] == "Down" || commands[i] == "Right"){
  btn = MUI.CreateButtonRaisedO( commands[i], 0.33, -1, "#ffffff", MUI.colors.deepPurple.darken1);
  }else{
  btn = MUI.CreateButtonRaisedO( commands[i], 0.33, -1, MUI.colors.deepPurple.darken1);

  }
  if(commands[i] == "Ok") btn.SetStyle(MUI.colors.pink.lighten3, MUI.colors.pink.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
  if(commands[i] == "Speech") btn.SetStyle(MUI.colors.cyan.lighten3, MUI.colors.cyan.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
  if(commands[i] == "Back") btn.SetStyle(MUI.colors.lime.lighten3, MUI.colors.lime.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
  if(commands[i] == "Home") btn.SetStyle(MUI.colors.amber.lighten3, MUI.colors.amber.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
    if(commands[i] == "Vol Down") btn.SetStyle(MUI.colors.red.lighten3, MUI.colors.red.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
  if(commands[i] == "Vol Up") btn.SetStyle(MUI.colors.yellow.lighten3, MUI.colors.yellow.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
  if(commands[i] == "Vol Mute") btn.SetStyle(MUI.colors.green.lighten3, MUI.colors.green.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
    if(commands[i] == "Up") btn.SetStyle(MUI.colors.indigo.lighten3, MUI.colors.indigo.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
  if(commands[i] == "Down") btn.SetStyle(MUI.colors.indigo.lighten3, MUI.colors.indigo.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
  if(commands[i] == "Left") btn.SetStyle(MUI.colors.indigo.lighten3, MUI.colors.indigo.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
   if(commands[i] == "Right") btn.SetStyle(MUI.colors.indigo.lighten3, MUI.colors.indigo.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
    if(commands[i] == "Power Off") btn.SetStyle(MUI.colors.gray.lighten4, MUI.colors.gray.darken1, 5, "#efefef", 1, 1), btn.SetTextColor(MUI.colors.deepPurple.darken4), btn.SetTextShadow(5, 0, 0, "#cecece");
  btn.Animate("Newspaper", null, 2750);
  btn.SetOnTouch(Click);

 //btn = app.CreateButton( commands[i], 0.33, -1);
 }else{
 btn = app.CreateButton( commands[i], 0.33, -1);
 btn.SetVisibility( "Gone"  );
 }
  grid.AddChild( btn );
  btn.SetFontFile("Misc/YujiMai-Regular.ttf");
 }

 lay2.AddChild( grid );
 web = app.CreateWebView( 1, -1 );
 web.SetBackAlpha( 256)
 web.SetBackColor( "#00000000" )
 
lay.AddChild( lay2 );

spn = MUI.CreateSpinner("", 1, 0.1);
//alert(color2)


spn.SetBackGradient( utils.GetGradientColors(color2)[0], color2,  utils.GetGradientColors(color2)[1]);

        spn.SetOnChange(OnChange);
        spn.SetHint("Channels (Streaming Apps):");
        lay2.AddChild(spn);
        lay2.AddChild( web );
        spn2 = MUI.CreateSpinner("", 1, 0.1);
        lay2.AddChild( spn2 )
        spn2.SetHint("Channels (TV):");
         spn2.SetOnChange(OnChange2);
        //web.LoadUrl( TV_CHANNELS);
        //app.Wait( 10 )
 

 app.AddLayout( lay );
app.HttpRequest( "GET", "http://" + ROKU_IP + ":8060/query/apps", null, null, handleReply );
app.HttpRequest( "GET", TV_CHANNELS, null, null, handleReplyTV);



}

function OnChange(value, index)
{
spn.Animate( "Tada", null, 1200 );
    app.ShowPopup("Launching " + value);
    HandleCommand("launch/"+ar2[index]);
}

function OnChange2(value, index)
{
spn2.Animate( "Tada", null, 1200 );
    app.ShowPopup("Launching TV Channel: " + value);
    //alert(ar4[index])
   SendCommand(TV + ar4[index]);
   //app.HttpRequest( "POST", TV + ar4[index], null, null, (error, reply)=>{});
   // HandleCommand("launch/"+ar2[index]);
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

function handleReplyTV( error, reply )
{
    if( error ) alert( reply );
    else
    {
    //alert(reply);
    plg.ParseString( reply, OnResultTV);
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
 for(e=0;e<6;e++){
 ar.push("");
 ar2.push("");
 }
 html='<script src="ds:/Sys/app.js"></script>' + app.ReadFile( app.GetAppPath()+"/Script.js" )+'<marquee  direction="left" behavior="alternate" scrolldelay="0.0037" scrollamount="10">';
 for(a=0;a<result.apps.app.sort().length;a++){
 //app.ShowPopup( result.apps.app.sort()[a]._ );
 if(result.apps.app.sort()[a]._ == "Netflix") Netflix = result.apps.app.sort()[a].$.id;
if(result.apps.app.sort()[a]._ == "YouTube") YouTube = result.apps.app.sort()[a].$.id;

  ar.push(result.apps.app.sort()[a]._);
 ar2.push(result.apps.app.sort()[a].$.id);
 
// app.WriteFile( app.GetAppPath()+"/channels.txt", ar.join("\r") );
 //if(!app.FileExists("/storage/emulated/0/Download/"+result.apps.app.sort()[a]._ + ".png"  ))// app.DownloadFile( "http://"+ROKU_IP+":8060/query/icon/"+ result.apps.app.sort()[a].$.id, "/storage/emulated/0/Download/"+result.apps.app.sort()[a]._ + ".png", "Downloading ...")
  html += "<img onClick='HandleCommand(\"launch/"+result.apps.app.sort()[a].$.id+"\")' height='92' hspace='8' src="+"'http://" + ROKU_IP + ":8060/query/icon/" + result.apps.app.sort()[a].$.id + "' />";
  //app.ShowPopup(result.apps.app[a]._);//.$.id);
  }
  html+="</marquee>";
  web.LoadHtml( html )
  app.WriteFile( app.GetAppPath()+"/text.txt", html );
  spn.SetList( ar );
  app.WriteFile( app.GetAppPath()+"/channelsNames.txt", ar.join("\r") );
  app.WriteFile( app.GetAppPath()+"/channelsIds.txt", ar2.join("\r") );
}

function OnResultTV( err, result )
{
//alert("tv")
//alert(JSON.stringify(result["tv-channels"].channel[0].number));
//alert(JSON.stringify(result.tv-channels));
 // alert( JSON.stringify(result) );
 var ar3 = new Array();
 ar4= new Array();
 ar5= new Array();
 /*ar.push("");
 ar.push("");
 ar2.push("");
 ar2.push("");*/
 for(e=0;e<2;e++){
 ar3.push("");
 ar4.push("");
 ar5.push("");
 }
 for(a=0;a<result["tv-channels"].channel.length;a++){
 //app.ShowPopup( result.apps.app.sort()[a]._ );
 
  ar3.push(result["tv-channels"].channel[a].name);
 ar4.push(result["tv-channels"].channel[a].number);
  ar5.push(result["tv-channels"].channel[a].name + " - " + result["tv-channels"].channel[a].number);
 }
spn2.SetList( ar5 );
  app.WriteFile( app.GetAppPath()+"/tvchannelsNames.txt", ar3.join("\r") );
  app.WriteFile( app.GetAppPath()+"/tvchannelsNumber.txt", ar4.join("\r") );
}

function Click()
{
app.Vibrate( "0,100,30,100,50,300" );
var self = this;
self.Animate("Rubberband", null, 950);
	if(self.GetText().includes("Power")) btnCurr = self;
	if(self.GetText() == "Up") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Down") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Left") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Right") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Ok") HandleCommand("select");
	if(self.GetText() == "Sleep") HandleCommand("sleep");
	if(self.GetText() == "Back") HandleCommand("back");
	if(self.GetText() == "Return") HandleCommand("instantreplay");
	if(self.GetText() == "Play") HandleCommand("play");

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
	if(self.GetText() == "Netflix") {
	self.Animate( "Tada", null, 1200 );
    app.ShowPopup("Launching " + "Netflix");
    HandleCommand("launch/"+Netflix);
	}
	if(self.GetText() == "YouTube") {
	self.Animate( "Tada", null, 1200 );
    app.ShowPopup("Launching " + "YouTube");
    HandleCommand("launch/"+YouTube);
	}

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
     } else if (command.includes("instantreplay")) {
        SendCommand(baseUrl + "InstantReplay");
      } else if (command.includes("play")) {
        SendCommand(baseUrl + "Play");
      } else if (command.includes("ok")) {
        SendCommand(baseUrl + "Ok");
      } else if (command.includes("okay")) {
        SendCommand(baseUrl + "Ok");
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