app.LoadPlugin( "Xml2Js" );

function OnStart()
{
  lay = app.CreateLayout( "Linear", "VCenter,FillXY" );

  btn = app.CreateButton( "Press Me" );
  btn.SetOnTouch( Parse );
  lay.AddChild( btn );

  plg = app.CreateXml2Js();

  app.AddLayout( lay );
}

function Parse()
{
  var xml = "<top id='fred' size='33'>Hello xml2js!</top>";
  plg.ParseString( xml, OnResult );
}

function OnResult( err, result )
{
  alert( JSON.stringify(result) );
}
var address = "http://www.randomfunfacts.com";

app.HttpRequest( "GET", address, null, null, handleReply );

function handleReply( error, reply )
{
    if( error ) alert( reply );
    else
    {
        var funfact = reply.slice( reply.indexOf("<i>") + 3, reply.indexOf("</i>") );
        alert( funfact );
    }
}
