cfg.MUI, cfg.Light, cfg.Portrait, cfg.Share;

app.DisableKeys( 'VOLUME_DOWN,VOLUME_UP' );

app.LoadPlugin( "Support" );
app.LoadPlugin( "Xml2Js" );
app.LoadPlugin( "Utils" );
app.LoadPlugin( "UIExtras" );
//app.LoadPlugin( "UIExtras" );
//alert(app.GetAppPath());
var ROKU_IP = app.ReadFile( "Remote.txt" );
var TV_CHANNELS = "http://" + ROKU_IP + ":8060/query/tv-channels";
var TV = "http://" + ROKU_IP + ":8060/launch/tvinput.dtv?ch=";
var ROKU_TV = "http://" + ROKU_IP + ":8060/";
var ROKU_SEARCH = "http://" + ROKU_IP + ":8060/search/browse/?keyword=";
var TV_ACTIVE_APP = "http://" + ROKU_IP + ":8060/query/tv-active-channel";
var found = false;

var btnCurr;

function tvInfo(title, data) {
	var template = "<fieldset>" + "	<legend>[TITLE]</legend>" + "	<h6>[VALUE]</h6>" + "</fieldset>";
	var results = template.replace("[TITLE]", title.toUpperCase()).replace("[VALUE]", data.slice( data.indexOf("<"+title+">")+title.length+2, data.indexOf("</"+title+">")));
	return results;
}

function tvInfo2(title, data) {
	var results = data.slice( data.indexOf("<"+title+">")+title.length+2, data.indexOf("</"+title+">"));
	return results;
}

async function OnStart()
{
	if(!app.FileExists( "/storage/emulated/0/​Android/data/com.luillosoftinc.rokuremotecontrol/files/Remote.txt")) app.ExtractAssets( "Remote.txt", app.GetAppPath()+"/storage/emulated/0/​Android/data/com.luillosoftinc.rokuremotecontrol/files/Remote.txt", false)
	app.SetOnKey( OnKey );
	utils = app.CreateUtils();
	plg = app.CreateXml2Js();
	speech = app.CreateSpeechRec();
	speech.SetOnReady( speech_OnReady );
	speech.SetOnResult( speech_OnResult );
	speech.SetOnError( speech_OnError );
	color3 = MUI.colors.deepPurple.darken4;
	color2 = utils.HexToLighterHex(color3, 0.53);
  app.InitializeUIKit(MUI.colors.deepPurple.darken1);
  utils.SetTheme(MUI.colors.deepPurple.lighten1);
  lay = layMain = app.CreateLayout( "Linear", "Top,HCenter,FillXY" );
  lay2 = app.CreateLayout( "Linear", "VCenter,FillXY" );
  lay2.SetBackGradient( utils.GetGradientColors(color2)[1], color2,  utils.GetGradientColors(color2)[0] );
  
  app.AddLayout( lay );
  //await Splash();
  var commands = ["","Power","Brand","Vol Up","Vol Down","Vol Mute","Back","Speech","Home","","Up","","Left","Ok","Right","","Down","","Return","Sleep","Menu","YouTube","Play","Netflix","YouTube","Netflix","Prime","Hulu","Apple TV","HBO"];
  apb = MUI.CreateAppBar("Roku Remote", "power_settings_new", "search, info");
  apb.SetOnControlTouch((btnTxt, index)=>{if(index==0) {SendCommand(ROKU_SEARCH + prompt("Search for:").split(" ").join("%20"));}else{dlg.Show();}});
  apb.SetOnMenuTouch(()=>{SendCommand("http://" + ROKU_IP + ":8060/keypress/Power");});
  var apbHeight = apb.GetHeight();
  lay.AddChild(apb);
  lay.AddChild( lay2 );
  sup = app.CreateSupport();
  grid = sup.CreateGridLayout();
  grid.SetColCount( 3);
  for( var i=0; i<24; i++ ) {
  	if( commands[i] != "") {
	  	if(commands[i] == "Power" || commands[i] == "Up" || commands[i] == "Left" || commands[i] == "Down" || commands[i] == "Right") {
  	  	btn = MUI.CreateButtonRaisedO( commands[i], 0.33, -1, "#ffffff", MUI.colors.deepPurple.darken1);
        btn.SetFontFile("Misc/Jaro-Regular-VariableFont_opsz.ttf");
      }else{
 			 if(commands[i] == "Brand") {
 			 	btn = brand = MUI.CreateTextH6("Brand", 0.33, -1, "hcenter", "#000000", "Light");
  				brand.SetFontFile("Misc/Rancho-Regular.ttf");
  		  } else {
  				if(commands[i] == "RIP") {
  					btn = ripT = MUI.CreateTextH6("IP", 0.33, -1, "hcenter", "#000000", "Light");
						ripT.SetFontFile("Misc/Rancho-Regular.ttf");
					  ripT.SetTextSize(13);
      			ripT.SetTextColor("#ffffff");
      			ripT.SetTextShadow(5, 0, 0, "#000000");
  			 } else {
  				btn = MUI.CreateButtonRaisedO( commands[i], 0.33, -1, MUI.colors.deepPurple.darken1);
  				btn.SetFontFile("Misc/Jaro-Regular-VariableFont_opsz.ttf");//Rancho-Regular.ttf");
				}
			}
  }
  if(commands[i] == "Power") btn.SetStyle(MUI.colors.gray.darken4, MUI.colors.gray.darken1, 5, "#efefef", 1, 1), btn.SetTextColor(MUI.colors.deepPurple.lighten4), btn.SetTextShadow(5, 0, 0, MUI.colors.deepPurple.darken4);
  if(commands[i] == "YouTube") btn.SetStyle(MUI.colors.red.lighten3, MUI.colors.red.darken3, 5, "#efefef", 1, 0.5), btn.SetTextColor("#ffffff"), btn.SetTextShadow(5, 0, 0, "#000000");
  if(commands[i] == "Netflix") btn.SetStyle(MUI.colors.gray.lighten4, MUI.colors.gray.lighten2, 5, "#ef0000", 1, 1), btn.SetTextColor(MUI.colors.red.darken1), btn.SetTextShadow(5, 0, 0, "#cdcdcd");
  btn.Animate("Jelly", null, 350*i);
  btn.SetOnTouch(Click);
 }else{
 btn = app.CreateButton( commands[i], 0.33, -1);
 btn.SetVisibility( "Gone"  );
 }
  grid.AddChild( btn );
  //app.ShowPopup( i )
 }

 lay2.AddChild( grid );
 
 tabs = app.CreateTabs( "Streaming Apps,TV Channels", 1, -1, "HCenter" );
    lay2.AddChild( tabs );
    tab1 = tabs.GetLayout( "Streaming Apps" );
    tab2 = tabs.GetLayout( "TV Channels" );
 web = app.CreateWebView( 1, -1 );
 web.SetBackAlpha( 256);
 web.SetBackColor( "#00000000" );
 web.Animate( "Newspaper", null, 1250 );
 

lay2.Animate( "BounceLeft", null, 500 )
/*
spn = MUI.CreateSpinner("", 1, 0.1);
spn.SetTextSize( 12 )
//alert(color2)


spn.SetBackGradient( utils.GetGradientColors(color2)[0], color2,  utils.GetGradientColors(color2)[1]);

        spn.SetOnChange(OnChange);
        spn.SetHint("Channels (Streaming Apps):");
        
        */
        
tab1.AddChild( web );
       
      // uix = app.CreateUIExtras();
 
// spn2 = uix.CreatePicker( "", 0.4 );
       
        //web.LoadUrl( TV_CHANNELS);
        //app.Wait( 10 )
 
//await GetRokuTVIp();

//wiz = app.CreateWizard( "Device Info: ", 0.87, 0.87, OnWizard );
dlg = app.CreateDialog( "Device Info: " );

    layDlg = app.CreateLayout( "linear", "Top,HCenter,FillXY" );
    layDlg.SetSize( 0.87, 0.43 );
    dlg.AddLayout( layDlg );
webCopy= app.CreateWebView( 1, -1 );
 webCopy.SetBackAlpha( 256);
 webCopy.SetBackColor( "#00000000" );
    //chk = app.CreateCheckBox( "Check Box" );
    //chk.SetMargins( 0, 0.02, 0, 0.02 );
    layDlg.AddChild( webCopy );

    btnDlg = app.CreateButton( "Close Dialog", 0.6, 0.1 );
    btnDlg.SetOnTouch( btnDlg_OnTouch );
    layDlg.AddChild( btnDlg );

await Tween1();
 
app.HttpRequest( "GET", "http://" + ROKU_IP + ":8060/query/apps", null, null, handleReply );
app.HttpRequest( "GET", TV_CHANNELS, null, null, handleReplyTV);
app.HttpRequest( "GET", ROKU_TV, null, null, handleReplyROKUTV);
si = setInterval(RokuAnim, 750);

app.HttpRequest( "GET", TV_ACTIVE_APP, null, null, handleActiveTVChannel );

}

function RokuAnim(){
 co = color.GetRandomColor();
 brand.SetTextColor(co);
 brand.Animate("Rubberband", null, 450);
 utils.SetTheme(co);//utils.RandomHexColor(true));
}

async function Splash() {
	app.SetOrientation( "Landscape");
	anim = app.CreateVideoView( 1, 1 );
	anim.SetOnReady( ()=>{anim.Play();} );
	anim.SetOnComplete( ()=>{} );
	anim.SetFile( "Misc/Roku Bootup Animation.mp4" );
	anim.Play();
	//im = app.CreateImage( "Img/Roku Remote Control.png", 1, 1 );
	lay2.AddChild( anim );
	app.Wait( 30, false );
	lay2.RemoveChild( anim );
	app.SetOrientation( "Portrait" );
}

async function OnKey(action, name, code, extra) {
    if(action == "Up"){
    	if(name == "VOLUME_UP"){
    		HandleCommand("Vol Up");
    	}else{
    		HandleCommand("Vol Down");
    	}
    }
}

function btnDlg_OnTouch()
{
    dlg.Dismiss();
}


function Tween1()
{
/*
    target = { x:0.5, y:0.5, sw:0.5, sh:0.5, rot:360 };
    spn.Tween( target, 2500, "Exponential.Out", 1, true, Tween2 )
    spn2.Tween( target, 2500, "Exponential.Out", 1, true, Tween3 )
    */
}

function Tween2()
{
 /*
       target = { x: 0.8, y:[0.6,0.3,0.6], rot: 360*3 };
    spn.Tween( target, 2000 )
    */
}

function Tween3()
{
    target = { x: 0.8, y:[0.6,0.3,0.6], rot: 360*3 };
    spn2.Tween( target, 2000 )
}

function OnChange(value, index)
{
		question = "You want to change the Roku device to " + value + "?";
		app.TextToSpeech( question, 1, 1,  ()=>{if(confirm(question)) {
			spn.Animate( "RubberBand", null, 1200 );
    	app.ShowPopup("Launching " + value);
    	HandleCommand("launch/"+ar2[index]);
    } else {
    	spn.Animate("FallRotate", null, 850);
    }})
		
}

var TV_ACTIVE_APP = "http://" + ROKU_IP + ":8060/query/tv-active-channel";;

function handleActiveTVChannel( error, reply )
{
//alert("handle");
    if( error ) alert( reply );
    else
    {
        active_tv_channel = parseFloat(reply.slice( reply.indexOf("<number>") + 8, reply.indexOf("</number>")) );
        
    }
}
function OnChange2(value, index)
{
question = "Do you want to change your Roku device to " + value + "?";
		app.TextToSpeech( question, 1, 1,  ()=>{if(confirm(question)) {

spn2.Animate( "Tada", null, 1200 );
spinChan2 = parseFloat(ar4[index]);
    app.ShowPopup("Launching TV Channel: " + value);
    //alert(ar4[index])
    app.HttpRequest( "POST", TV + ar4[index], null, "ch="+ar4[index], (error, reply)=>{});
  //alert(TV + ar4[index]);
  //HandleCommand("launch/"+"tvinput.dtv");
    //SendCommand(TV + ar4[index]);
    //app.Wait( 2, false );
    app.HttpRequest( "GET", TV_ACTIVE_APP, null, null, handleActiveTVChannel );
   }});
   //app.HttpRequest( "POST", TV + ar4[index], null, null, (error, reply)=>{});
   // HandleCommand("launch/"+ar2[index]);
}

function handleReplyActiveChannel( error, reply )
{
    if( error ) alert( reply );
    else
    {
    //app.HttpRequest( "GET", TV_ACTIVE_APP, null, null, handleReplyActiveChannel );
    //alert(reply);
    //plg.ParseString( reply, OnResult );
        funfact = parseFloat(reply.slice( reply.indexOf("<number>") + 8, reply.indexOf("</number>") ));
        l = app.ReadFile( "tvchannelsNumber.txt").split("\n");
        l.forEach((item, index) => {
        //alert(item);
    if (item.includes(spinChan2)) {
        //result.push(index);
        cha1 = index;
    }
    if (item.includes(funfact)) {
        //result.push(index);
        cha2 = index;
    }
});

//alert("Cha1"+cha1);
//alert("Cha2"+cha2);
        /*for(a=0;a<l.lenght;a++){
        if(parseFloat(l[a])==spinChan2) cha1 = a;
        if(parseFloat(l[a])==funfact) cha2 = a;
        }*/
       app.HttpRequest( "GET", TV_ACTIVE_APP, null, null, handleActiveTVChannel);
       if(spinChan2 < funfact){
       cha3 = cha2 - cha1;
       //alert(cha3);
       //for(b=0;b<cha3;b++){
       //app.Wait( 1, false );
       	RepeatCommand("ChannelDown", cha3);
       	//alert("");
       	//}
       }else{
       cha3 = cha1 - cha2;
       //app.Wait(1, false);
       RepeatCommand("ChannelUp", cha3);
       }
       app.HttpRequest( "GET", TV_ACTIVE_APP, null, null, handleReplyActiveChannel );
       }
       
       //alert( funfact );
    
}

function RepeatCommand(comm, times)
{
app.HttpRequest( "GET", TV_ACTIVE_APP, null, null, handleActiveTVChannel);
app.WriteFile( "logChange.txt", Date().toString()+", " + comm + "," + times+"\r", "Append" )
app.Wait(2, false);
while(active_tv_channel != spinChan2){
if(spinChan2 == funfact){
 alert("Fin");
 break;
 }
url = "http://192.168.70.236:8060/keypress/"+comm;
	var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    
    xhr.onload = function() {
    //alert(xhr.responseText);
        /*if (xhr.status == 200)
        app.ShowPopup("Command sent successfully!")
        else
       
            app.ShowPopup("Fail to send comm: "+url);
            
            app.WriteFile( "log.txt", Date().toString()+", " + xhr.status + "," + url+"\r", "Append" )*/
    };
    xhr.send();
    //ounter+=1;
    app.Wait( 1, false );
    }
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

function handleReplyROKUTV( error, reply )
{
    if( error ) alert( reply );
    else
    {
    //alert(reply);
    plg.ParseString( reply, OnResultROKUTV);
  //  app.WriteFile( app.GetAppPath()+"/rokutv.txt", reply );
        var funfact = reply.slice( reply.indexOf("<friendlyName>") + 14, reply.indexOf("</friendlyName>") );
        
      //  alert( '<img  src="' +ROKU_TV + tvInfo2("url", reply) + '" />' + tvInfo("friendlyName", reply) + "<br />" + tvInfo("modelDescription", reply));
        
        webCopy.LoadHtml(  "<div style='overflow:scroll;'><img  src='" +ROKU_TV + tvInfo2("url", reply) + "' />" + tvInfo("friendlyName", reply) + "<br />" + tvInfo("modelDescription", reply)+"</div>");
      brand.SetText(funfact.replace("&quot;",'"').replace("32", "32"));
      brand.SetTextSize(13);
      brand.SetTextColor("#ffffff");
      brand.SetTextShadow(5, 0, 0, "#000000");
      
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
 //ar.push("");
 //ar2.push("");
 }
 var stri = "";
 html='<script src="ds:/Sys/app.js"></script><style>img {-webkit-box-shadow: 2px 2px 2px 3px #666666; box-shadow: 2px 2px 2px 3px #666666; width:64px; height: 64px;}</style>' + app.ReadFile( app.GetAppPath()+"/Script.js" )+'<marquee  direction="left" behavior="alternate" scrolldelay="0.0037" scrollamount="10">';
 for(a=0;a<result.apps.app.sort().length;a++){
 stri += '<option value="' + result.apps.app.sort()[a].$.id +'">' + result.apps.app.sort()[a]._ + '</option>';
 //app.ShowPopup( result.apps.app.sort()[a]._ );
 if(result.apps.app.sort()[a]._ == "Netflix") Netflix = result.apps.app.sort()[a].$.id;
if(result.apps.app.sort()[a]._ == "YouTube") YouTube = result.apps.app.sort()[a].$.id;

  ar.push(result.apps.app.sort()[a]._);
 ar2.push(result.apps.app.sort()[a].$.id);
 
// app.WriteFile( app.GetAppPath()+"/channels.txt", ar.join("\r") );
 //if(!app.FileExists("/storage/emulated/0/Download/"+result.apps.app.sort()[a]._ + ".png"  ))// app.DownloadFile( "http://"+ROKU_IP+":8060/query/icon/"+ result.apps.app.sort()[a].$.id, "/storage/emulated/0/Download/"+result.apps.app.sort()[a]._ + ".png", "Downloading ...")
  html += "<img onClick='HandleCommand(\"launch/"+result.apps.app.sort()[a].$.id+"\")' height='92' hspace='8' vspace='5' src="+"'http://" + ROKU_IP + ":8060/query/icon/" + result.apps.app.sort()[a].$.id + "' />";
  //app.ShowPopup(result.apps.app[a]._);//.$.id);
  }
  app.WriteFile( "selectchannels.html", stri );
  html+="</marquee>";
  web.LoadHtml( html )
  webCopy.LoadHtml( html )
  app.WriteFile( app.GetAppPath()+"/text.txt", html );
  //spn.SetList( ar );
  
  uix= app.CreateUIExtras();
 
 spn = uix.CreatePicker( ar.join(","), 0.95, -1 );
 spn.SetOnChange( OnChange );
 spn.SetTextSize( 12 );
 spn.SetBackGradient("#efefef", "#cdcdcd", "#ffffff"  );
 //spn.SetOnTouch( spn_OnTouch )
spn.SetTextColor(MUI.colors.deepPurple.darken1 );

        tab1.AddChild(spn);
  app.WriteFile( app.GetAppPath()+"/channelsNames.txt", ar.join("\r") );
  app.WriteFile( app.GetAppPath()+"/channelsIds.txt", ar2.join("\r") );
}

function spn_OnTouch()
{
	self = this;
	self.Animate("Newspaper", null, 345);
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
 /*ar3.push("");
 ar4.push("");
 ar5.push("");*/
 }
 var stri = "";
 for(a=0;a<result["tv-channels"].channel.length;a++){
 //app.ShowPopup( result.apps.app.sort()[a]._ );
 stri += '<option value="' + result["tv-channels"].channel[a].number +'">' + result["tv-channels"].channel[a].name + '</option>';
  ar3.push(result["tv-channels"].channel[a].name);
 ar4.push(result["tv-channels"].channel[a].number);
  ar5.push(result["tv-channels"].channel[a].name + " - " + result["tv-channels"].channel[a].number);
 }
 app.WriteFile( "select.html", stri );
spn2 = uix.CreatePicker( ar5.join(","), 0.95, -1 );
 spn2.SetOnChange( OnChange2 );
spn2.SetTextColor(MUI.colors.deepPurple.darken1 );
//spn2 = MUI.CreateSpinner(ar5.join(","), 1, 0.1);
       //spn2.SetBackGradient( utils.GetGradientColors(MUI.colors.teal.darken1)[0], MUI.colors.teal.darken1,  utils.GetGradientColors(MUI.colors.teal.darken1)[1]);
spn2.SetBackGradient("#efefef", "#cdcdcd", "#ffffff"  );
 
        spn2.SetTextSize( 12 )
        tab2.AddChild( spn2 )
         
        //spn2.SetHint("Channels (TV):");
         //spn2.SetOnChange(OnChange2);
  app.WriteFile( app.GetAppPath()+"/tvchannelsNames.txt", ar3.join("\r") );
  app.WriteFile( app.GetAppPath()+"/tvchannelsNumber.txt", ar4.join("\r") );
}

function OnResultROKUTV( err, result )
{

//alert(utils.Stringify(result["root"].device));
//alert(utils.Stringify(result.root));

}
function Click()
{
app.Vibrate( "0,100,30,100,50,300" );
var self = this;
self.Animate("Rubberband", null, 350);
	if(self.GetText().includes("Power")) btnCurr = self;
	if(self.GetText() == "Up") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Down") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Left") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Right") HandleCommand(self.GetText().toLowerCase());
	if(self.GetText() == "Ok") HandleCommand("select");
	if(self.GetText() == "Sleep") HandleCommand("sleep");
	if(self.GetText() == "Menu") HandleCommand("info");
	if(self.GetText() == "Back") HandleCommand("back");
	if(self.GetText() == "Return") HandleCommand("instantreplay");
	if(self.GetText() == "Play") HandleCommand("play");
	if(self.GetText() == "Home") HandleCommand("home");
		if(self.GetText() == "Power") HandleCommand("power");
		if(self.GetText() == "Vol Up") HandleCommand("Vol Up");
		if(self.GetText() == "Vol Down") HandleCommand("Vol Down");
		if(self.GetText() == "Vol Mute") HandleCommand("Vol Mute");
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
         } else if (command.includes("down")) {
        SendCommand(baseUrl + "Down");
    
    } else if (command.includes("volume down")) {
        SendCommand(baseUrl + "VolumeDown");
   } else if (command.includes("Vol Down")) {
        SendCommand(baseUrl + "VolumeDown");
   } else if (command.includes("Vol Up")) {
        SendCommand(baseUrl + "VolumeUp");
    } else if (command.includes("Vol Mute")) {
        SendCommand(baseUrl + "VolumeMute");
      } else if (command.includes("power off")) {
        SendCommand(baseUrl + "PowerOff");
    } else if (command.includes("power on")) {
        SendCommand(baseUrl + "PowerOn");
      } else if (command.includes("power")) {
        SendCommand(baseUrl + "Power");
    } else if (command.includes("select")) {
        SendCommand(baseUrl + "Select");
    } else if (command.includes("back")) {
        SendCommand(baseUrl + "Back");
    } else if (command.includes("up")) {
        SendCommand(baseUrl + "Up");
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
    } else if (command.includes("info")) {
        SendCommand(baseUrl + "Info");
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
    
    xhr.onload = function() {
    //alert(xhr.responseText);
        if (xhr.status == 200)
        v = 1, app.ShowPopup("Command sent successfully!")
        else
       /* if(url.includes("PowerOn")) {
        btnCurr.SetText("Power Off");
        }else if(url.includes("PowerOff")){
        btnCurr.SetText("Power On");
        }*/
        
            alert("Fail to send comm: "+url);
            
            app.WriteFile( "log.txt", Date().toString()+", " + xhr.status + "," + url+"\r", "Append" )
    };
    xhr.send();
}

function SendCommand2(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.send();
    xhr.onload = function() {
    //alert(xhr.responseText);
        if (xhr.status == 200)
        v = 1, app.ShowPopup("Command sent successfully!")
        else
        /*if(url.includes("PowerOn")) {
        btnCurr.SetText("Power Off");
        }else if(url.includes("PowerOff")){
        btnCurr.SetText("Power On");
        }*/
         app.WriteFile( "log.txt", Date().toString()+", " + xhr.status + "," + url+"\r", "Append" )
            alert("Fail to send comm: "+url);
    };
}


// Function to start listening for speech
function StartListening() {
	speech.Recognize();
    app.ShowProgress("Listening...");
     app.WriteFile( "log.txt", Date().toString()+", " + "Speech"+ "," + "Command"+"\r", "Append" )
}

function speech_OnResult( results )
{
    //An array of recognition results is returned
    //here, with the most probable at the front
    //of the array.
    
    //Show the top result.
    app.ShowPopup( results[0].toLowerCase());
        app.HideProgress();
        app.WriteFile( "log.txt", Date().toString()+", " + "Speech"+ "," + results[0].toLowerCase() +"\r", "Append" )

        if(results[0].toLowerCase() == "okay") 
        HandleCommand("select")
        else
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

async function GetRokuTVIp() {
    ip = app.GetRouterAddress();
    parts = ip.split(".");
    size = parts.length;
    fromNum = parseInt(parts[size - 1]);
    toNum = 145;

    for (c = toNum; c > fromNum; c--) {
        if (found) {
            break;
        }
				rIp = `${parts[0]}.${parts[1]}.${parts[2]}.${c}`
        url = `http://${parts[0]}.${parts[1]}.${parts[2]}.${c}:8060/query/device-info`;

        try {
            app.ShowPopup(`Checking URL: ${url}`);
            await sendHttpRequest(url);
        } catch (error) {
            app.ShowPopup(`Error at ${url}: ${error}`);
        }
    }
}

function sendHttpRequest(url) {
    return new Promise((resolve, reject) => {
        app.HttpRequest("GET", url, null, null, (error, reply, status) => {
            if (status === 200) {
                found = true;
                //txtIp.SetText(url);
                ripT.SetText(rIp);
               deviceName = reply.slice( reply.indexOf("<friendly-device-name>") + 22, reply.indexOf("</friendly-device-name>") );
                ROKU_IP = rIp;//"192.168.70.236";
TV_CHANNELS = "http://" + ROKU_IP + ":8060/query/tv-channels";
TV = "http://" + ROKU_IP + ":8060/launch/tvinput.dtv?ch=";
ROKU_TV = "http://" + ROKU_IP + ":8060/";
               //txtDN.SetText( deviceName );
               //app.WriteFile( app.GetAppPath()+"/device-info.txt", reply );
                resolve(reply);
            } else {
                reject(error || "Request failed");
            }
        });
    });
}

function OnWizard( lay, page )
{
    switch( page ) {
    case 0:
        wizTxt = app.CreateText( "", -1, -1, "MultiLine" );
        wizTxt.SetTextSize( 19 );
        lay.AddChild( wizTxt );

        wizFlag = app.CreateText( "[fa-flag-checkered]", -1, -1, "FontAwesome" );
        wizFlag.SetMargins( 0, 0.05, 0, 0 );
        wizFlag.SetTextSize( 64 );
        wizFlag.Gone();
        lay.AddChild( wizFlag );
    break;

    case 1:
        var msg = "This is the first page of your wizard";
        wizTxt.SetText( msg );
    break;

    case 2:
    		lay.RemoveChild( wizTxt )
        lay.AddChild( layMain );
        //var msg = "You can put any controls you like here, including"
            + " a webview and have as many pages as you like";
        //wizTxt.SetText( "" /*msg*/ );
        wizFlag.Gone();
    break;

    case 3:
        wizTxt.SetText( "Wizard complete!" );
        wizFlag.Show();
        wiz.Finish();
    break;

    case 4:
        wiz.Dismiss();
        app.ShowPopup( "Wizard finished" );
    break;

    case -1:
        app.ShowPopup( "Wizard cancelled" );
    }
}