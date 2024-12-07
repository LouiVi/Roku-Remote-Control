cfg.Light
cfg.MUI

function OnStart()
{
    lay = MUI.CreateLayout("Linear", "VCenter,FillXY")
        text = "Lorem ipsum dolor set amit"
        h1 = MUI.AddText(lay, "text", 0.8, null, "h1,Medium")
        h2 = MUI.AddText(lay, "text", 0.8, null, "h2,Bold")
        h3 = MUI.AddText(lay, "text", 0.8, null, "h3,Light")
        h4 = MUI.AddText(lay, "text", 0.8, null, "h4,Regular")
        h5 = MUI.AddText(lay, "text", 0.8, null, "h5,Medium")
        h6 = MUI.AddText(lay, "text", 0.8, null, "h6")
        p = MUI.AddText(lay, "text", 0.8, null, "paragraph,thin")
        j = MUI.AddText(lay, "text", 0.8, null, "h1,Medium")
        s = MUI.AddText(lay, "text", 0.8, null, "secondary,light")
    app.AddLayout(lay)
}