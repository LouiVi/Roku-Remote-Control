
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
    app.ShowPopup( "Please speak more clearly!" )
}

function speech_OnReady()
{
    app.ShowPopup( "Listening...", "Short" )
}