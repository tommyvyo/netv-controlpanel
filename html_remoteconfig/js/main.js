var o = new DOMParser();
o = o.parseFromString("<data>null</data>", "text/xml");
var keyPressedArray = new Array();



var mData = {
	eventtickerstyledata : {
		mLoaded : null,
		mBottomOffset : ""
	},
	cpanel_cmodel : {
		mLoaded : null,
		EVENTTICKER_SPEED : "",
		EVENTTICKER_LINECOUNT : ""
	}
};

var mSystemData = {
	mMemory : {
		mTotal : -1,
		mUsed : -1,
		mFree : -1
	}
}

// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	window.onload function
// -------------------------------------------------------------------------------------------------
$(function() {
	fDbg("onload...");
	
	// -------- remove layerX and layerY --------
    // ------------------------------------------
	//~ keyboard_init();
	//~ fCheckForRedirection();
		
	
	// TODO : make up a input textfield and kept it in focus, capture the keydown stroke within that input textfield
	// Native keyboard events
	$(document).keydown(function(event)
	{
		fDbg("*** key code: " + event.which);
		var keycode = event.which;
		var isRepeat = (keyPressedArray[""+keycode] == true) ? true : false;
		keyPressedArray[""+keycode] = true;
		
		//event.preventDefault();
		if (keycode == 37)			fButtonPress('left', 1, isRepeat);
		else if (keycode == 39)		fButtonPress('right', 1, isRepeat);
		else if (keycode == 38)		fButtonPress('up', 1, isRepeat);	
		else if (keycode == 40)		fButtonPress('down', 1, isRepeat);
		else if (keycode == 13)		fButtonPress('center', 1, isRepeat);
		else if (keycode == 33)		fButtonPress('cpanel', 1, isRepeat);
		else if (keycode == 34)		fButtonPress('widget', 1, isRepeat);
		return true;
	});
	
	$(document).keyup(function(event)
	{
		keyPressedArray[""+event.which] = false;
		return true;
	});
	
	
	
	
	// prrodically refresh system data
	var mSystemDataInterval = setInterval(function() {
		fRefreshSystemData();
	}, 5000);
	
	
	
	
	cProxy.xmlhttpPost("", "post", {cmd : "hello", data: null}, function(vData) {
		fDbg(vData);
		
		o = vData.split("</mac>")[0].split("<mac>")[1];
		$($($($($("#div_info").children()[0]).children()[0]).children()[0]).children()[2]).html(o);
		
		o = vData.split("</ip>")[0].split("<ip>")[1];
		$($($($($("#div_info").children()[0]).children()[0]).children()[1]).children()[2]).html(o);
		
		o = vData.split("</fwver>")[0].split("<fwver>")[1];
		$($($($($("#div_info").children()[0]).children()[0]).children()[2]).children()[2]).html(o);
		
		o = vData.split("</hwver>")[0].split("<hwver>")[1].split("</response>")[0].split("success\">")[1];
		$($($($($("#div_info").children()[0]).children()[0]).children()[3]).children()[2]).html(o);
		
		
		o = vData.split("</internet>")[0].split("<internet>")[1];
		$($($($($("#div_info").children()[0]).children()[1]).children()[0]).children()[2]).html(o);
	});
	
	
	
	
	// 0001, get existing parameters
	fGetParameter();
	
	
	
	
	
	
	
	$("#btn_submit").click(function() {
		fSaveParameter(function() {
			fRestartBrowser();
		});
	});
	// 0003, restart browser
	
});




// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	remote configuration
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	fSaveParameter
// -------------------------------------------------------------------------------------------------
function pDate(
	v
)
{
	if (!v)
		return mData;
}


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	remote configuration
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	fSaveParameter
// -------------------------------------------------------------------------------------------------
function fGetParameter(
)
{
	cProxy.fGetParams("eventtickerstyledata", function(vData) {
		//~ fDbg(vData);
		if (!vData || vData.length < 1)
			return;	
		vData = jQuery.parseJSON(vData);
		mData["eventtickerstyledata"]["mLoaded"] = vData;
		
		// 0002, save new parameters
		mData["eventtickerstyledata"]["mBottomOffset"] = vData.mBottomOffset;
		
		$("#ip_ticketbottomoffset").attr("value", mData["eventtickerstyledata"]["mBottomOffset"]);
	});
	
	
	
	
	cProxy.fGetParams("cpanel_cmodel", function(vData) {
		fDbg(vData);
		if (!vData || vData.length < 1)
			return;	
		vData = jQuery.parseJSON(vData);
		mData["cpanel_cmodel"]["mLoaded"] = vData;
		
		// 0002, save new parameters
		mData["cpanel_cmodel"]["EVENTTICKER_SPEED"] = vData.EVENTTICKER_SPEED;
		mData["cpanel_cmodel"]["EVENTTICKER_LINECOUNT"] = vData.EVENTTICKER_LINECOUNT;
		
		$("#ip_ticketspeed").attr("value", mData["cpanel_cmodel"]["EVENTTICKER_SPEED"]);
		$("#ip_ticketNrows").attr("value", mData["cpanel_cmodel"]["EVENTTICKER_LINECOUNT"]);
	});
}

function fSaveParameter(
	vReturnFun
)
{
	var o;
	
	// 0002.1, parse/adjust input values
	// 0002.2, retrive user input values (from input fields)
	o = $("#ip_ticketbottomoffset").attr("value");
	if (o != String(parseInt(o)))
		$("#ip_ticketbottomoffset").attr("value", mData["eventtickerstyledata"]["mBottomOffset"]);
	mData["eventtickerstyledata"]["mBottomOffset"] = parseInt(o);
		
	
	o = $("#ip_ticketspeed").attr("value");
	if (o != String(parseInt(o)))
		$("#ip_ticketspeed").attr("value", mData["cpanel_cmodel"]["EVENTTICKER_SPEED"]);
	else
	{
		if (parseInt(o) > 5)
			$("#ip_ticketspeed").attr("value", 5);
		if (parseInt(o) < 1)
			$("#ip_ticketspeed").attr("value", 1);
			
		o = $("#ip_ticketspeed").attr("value");
	}
	mData["cpanel_cmodel"]["EVENTTICKER_SPEED"] = parseInt(o);
	
	
	o = $("#ip_ticketNrows").attr("value");
	if (o != String(parseInt(o)))
		$("#ip_ticketNrows").attr("value", mData["cpanel_cmodel"]["EVENTTICKER_LINECOUNT"]);
	else
	{
		if (parseInt(o) > 2)
			$("#ip_ticketNrows").attr("value", 2);
		if (parseInt(o) < 1)
			$("#ip_ticketNrows").attr("value", 1);
			
		o = $("#ip_ticketspeed").attr("value");
	}
	mData["cpanel_cmodel"]["EVENTTICKER_LINECOUNT"] = parseInt(o);
	
	
	
	
	mData["eventtickerstyledata"]["mLoaded"]["mBottomOffset"] = mData["eventtickerstyledata"]["mBottomOffset"];
	o = JSON.stringify(mData["eventtickerstyledata"]["mLoaded"]);
	cProxy.fSaveParams("eventtickerstyledata", o, function(vData) {
		fDbg(vData);
	});
	
	
	mData["cpanel_cmodel"]["mLoaded"]["EVENTTICKER_SPEED"] = mData["cpanel_cmodel"]["EVENTTICKER_SPEED"];
	mData["cpanel_cmodel"]["mLoaded"]["EVENTTICKER_LINECOUNT"] = mData["cpanel_cmodel"]["EVENTTICKER_LINECOUNT"];
	o = JSON.stringify(mData["eventtickerstyledata"]["mLoaded"]);
	cProxy.fSaveParams("eventtickerstyledata", o, function(vData) {
		fDbg(vData);
		if (vReturnFun)
			vReturnFun();
		if (vData && vData.split("</status>")[0].split("<status>")[1] == "1")
			alert("Saved and Reloaded.");
	});
}




function fRestartBrowser(
)
{
	cProxy.xmlhttpPost("", "post", {cmd : "NECOMMAND", value: "/etc/init.d/chumby-netvbrowser restart", xmlescape: true}, function(vData) {
		
	});
}

function fRefreshSystemData(
)
{
	cProxy.xmlhttpPost("", "post", {cmd : "NECOMMAND", value: "/usr/bin/free | grep Mem", xmlescape: true}, function(vData) {
		var vList;
		vList = [];
		o = vData.split("-/+")[0].split("Mem:")[1].split(" ");
		for (p in o)
			if (o[p].length > 1)
				vList.push(o[p]);
		mSystemData["mMemory"]["mTotal"] = vList[0];
		mSystemData["mMemory"]["mUsed"] = vList[1];
		mSystemData["mMemory"]["mFree"] = vList[2];
		
		$($($("#div_system").children()[0]).children()[1]).html(mSystemData["mMemory"]["mTotal"] + " KB");
		$($($("#div_system").children()[1]).children()[1]).html(mSystemData["mMemory"]["mUsed"] + " KB");
		$($($("#div_system").children()[2]).children()[1]).html(mSystemData["mMemory"]["mFree"] + " KB");
	});
}












// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	MISC functions
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	override fDbg() function
// -------------------------------------------------------------------------------------------------
function fDbg(v)
{
	console.log("|~|" + v);
}

// -------------------------------------------------------------------------------------------------
//	fLoadScript
// -------------------------------------------------------------------------------------------------
function fLoadExtJSScript(
	vFileList,
	vReturnFun
)
{
	var vUrl = vFileList.pop();
//~ fDbg("cJSCore, fLoadExtJSScript()" + vUrl);
	var script = document.createElement("script");
	
	script.type = "text/javascript";
	script.src = vUrl;
	
	script.onload = function() {
//~ fDbg2("*** fLoadScript(), loaded");
		if (vFileList.length == 0)
			vReturnFun();
		else
			fLoadExtJSScript(vFileList, vReturnFun);
	};
	
	document.getElementsByTagName("head")[0].appendChild(script);
}

// -------------------------------------------------------------------------------------------------
//	fCheckForRedirection	
// -------------------------------------------------------------------------------------------------
function fCheckForRedirection(
)
{
	if (location.search.indexOf("standalone") > -1)
	{
		$("#div_tempBg").hide();
		$("body").css("background-color", "#FFFFFF");
		return true;
	}
		
	// redirect
	if (location.href.indexOf("localhost") == -1)
		if (location.href.indexOf("usr/share") == -1)
			if (location.href.indexOf("index_autotest.html") == -1)
				location.href = "./html_config/";
}





// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	system API functions
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	server reset - browser start, and sconnected to NeTVServer
// -------------------------------------------------------------------------------------------------
function fServerReset(
	vData		// true | false
)
{
//~ fDbg2("fServerReset(), " + vData);
	if (vData == "true" || vData == true)
		location.href = "http://localhost/";

	return true;
}

// -------------------------------------------------------------------------------------------------
//	press button on D-pad / android
// -------------------------------------------------------------------------------------------------
function fButtonPress(
	vButtonName,
	vCount,
	vOnHold
)
{
//~ fDbg("*** NeTV, fButtonPress(), " + vButtonName + ", " + vCount);

	if (vOnHold && (vButtonName == "cpanel" || vButtonName == "widget" || vButtonName == "widget" || vButtonName == "setup"))
		return true;
		
	switch (vButtonName)
	{
		case "cpanel": mJSCore.fOnSignal(cConst.SIGNAL_TOGGLE_CONTROLPANEL); break;
		case "widget": mJSCore.fOnSignal(cConst.SIGNAL_TOGGLE_WIDGETENGINE); break;
		case "left": mJSCore.fOnSignal(cConst.SIGNAL_BUTTON_LEFT); break;
		case "right": mJSCore.fOnSignal(cConst.SIGNAL_BUTTON_RIGHT); break;
		case "center": mJSCore.fOnSignal(cConst.SIGNAL_BUTTON_CENTER); break;
		case "up": mJSCore.fOnSignal(cConst.SIGNAL_BUTTON_UP); break;
		case "down": mJSCore.fOnSignal(cConst.SIGNAL_BUTTON_DOWN); break;
		
		case "setup":
			if (vCount == 3)
			{
				// fDbg("switched to demo(AP) mode");
			}
			else if (!vCount || vCount == 1)
			{	
				mCPanel.fOnSignal("signal_goto_controlpanel", ["help"], null);
			}
			break;
	}
	//~ keyboard_onRemoteControl(vButtonName, "input_username");
	return true;
}

function fWidgetMsg(
	vMessage
)
{
//~ fDbg("*** fWidgetMdgEvent(), " + vMessage);
	mJSCore.fOnSignal(cConst.SIGNAL_MESSAGE_WIDGETMSG, vMessage, null);
}


function fTickerEvents(
	vEventMessage,
	vEventTitle,
	vEventImage,
	vEventType,
	vEventLevel,
	vEventVer
)
{
//~ fDbg("*** fTickerEvents(), ");
	if (vEventType && vEventType == "foroauth")
	{
		if (vEventMessage == "false")
			fWidgetMsg("false");
		else
		{
			vEventMessage = decodeURIComponent(vEventMessage);
			fWidgetMsg(vEventMessage);
		}
		return;
	}

//~ fDbg("----- message just received ----");
//~ fDbg(vEventMessage);
//~ fDbg("----- image just received ----");
//~ fDbg(vEventImage);
vEventMessage = decodeURIComponent(vEventMessage);
vEventTitle = decodeURIComponent(vEventTitle);
vEventImage = decodeURIComponent(vEventImage);
vEventType = decodeURIComponent(vEventType);
vEventLevel = decodeURIComponent(vEventLevel);
vEventVer = decodeURIComponent(vEventVer);
//~ fDbg("----- message decoded ----");
//~ fDbg(vEventMessage);
//~ fDbg("----- image path decoded ----");
//~ fDbg(vEventImage);
	
	mJSCore.fOnSignal(cConst.SIGNAL_MESSAGE_EVENTMSG, [vEventMessage, vEventTitle, vEventImage, vEventType, vEventLevel, vEventVer], null);	
}

// -------------------------------------------------------------------------------------------------
//	events from HDMI/FPGA
// -------------------------------------------------------------------------------------------------
function fHDMIEvents( vEventName )
{
	//To be decided
	if (vEventName == "unsupported");
	if (vEventName == "attach");
	if (vEventName == "detach");
	if (vEventName == "trigger");
}

// -------------------------------------------------------------------------------------------------
//	events from DBus/NetworkManager
// -------------------------------------------------------------------------------------------------
function fNMStateChanged( vEventName )
{
	switch (vEventName)
	{
		case "unknown":			break;
		case "sleeping":		break;
		case "connecting":		break;
		case "disconnected":	mCPanel.fOnSignal(cConst.SIGNAL_NETWORKEVENT_DISCONNECTED); break;
		case "connected":		break;
	}
}

function fNMDeviceAdded(  )
{
	//Switching back FROM Access Point mode
}

function fNMDeviceRemoved(  )
{
	//Switching TO Access Point mode
}

// -------------------------------------------------------------------------------------------------
//	events from system update machanism
// -------------------------------------------------------------------------------------------------
function fUPDATECOUNTEvent( newPackageCount )
{
	fDbg("-------------------------------------------");
	fDbg("Downloading " + newPackageCount + " packages....");
	fDbg("-------------------------------------------");
	
	//Show a small downloading icon here (like Android)
	
	return "ok";
}

function fUPDATEEvents( vEventName, vEventData )
{
fDbg("fUPDATEEvents: " + vEventName + "," + vEventData);
	
	if (vEventName == "starting")
	{
		var needReboot = (vEventData == "1") ? "true" : "false";
		
		fDbg("-------------------------------------------");
		fDbg("  Update Starting");
		if (needReboot == "true")		fDbg("  Reboot required");
		else							fDbg("  Reboot NOT required");
		fDbg("-------------------------------------------");
	
		//Gracefully hide everything here
		mCPanel.fOnSignal(cConst.SIGNAL_TOGGLE_WIDGETENGINE);
		// TODO: hide whatever on the screen
		// 
		
		
		//Redirect to update page after all animations are done
		var locationString = "http://localhost/html_update/index.html?dummy=0";
		if (needReboot != null && needReboot != "") 				locationString += "&reboot=" + needReboot;
		setTimeout("location.href=\"" + locationString + "\"", 1000);
	}
	else
	{
		//Let html_update handle the rest
	}
	return "ok";
}

// -------------------------------------------------------------------------------------------------
//	events from Android app
// -------------------------------------------------------------------------------------------------
function fAndroidEvents( vEventName, vEventData )
{
	//User has just started the Android app & Switch to remote control view
	if (vEventName == "changeview" && vEventData == "remote")
	{
	}
	
	//User has just started the Android app & select an unconfigured device
	if (vEventName == "changeview" && vEventData == "loading")
	{
		mCPanel.fOnSignal(cConst.SIGNAL_ANDROID_START_CONFIGURING);
	}
}

// -------------------------------------------------------------------------------------------------
//	events from iOS app (To be decided)
// -------------------------------------------------------------------------------------------------
function fIOSEvents( vEventName, vEventData )
{
	//User has just started the iOS app & Switch to remote control view
	if (vEventName == "changeview" && vEventData == "remote")
	{
	}
	
	//User has just started the iOS app & select an unconfigured device
	if (vEventName == "changeview" && vEventData == "loading")
	{
		mCPanel.fOnSignal(cConst.SIGNAL_IOS_START_CONFIGURING);
	}
}


function fCheckAlive(
)
{
	return true;
	
	/*
	try {
		var jscore = cJSCore.fGetInstance();
		if (!jscore)
			return false;
		var jscore_alive = jscore.fOnSignal("checkalive");	
		if (!jscore_alive)
			return false;

		var cpanel = cCPanel.fGetInstance();
		if (!cpanel)
			return false;
		var cpanel_alive = cpanel.fOnSignal("checkalive");
		if (!cpanel_alive)
			return false;
	}
	catch (e) {
		return false;
	}
	return true;
	*/
}


function fMultitab(
	vOption,
	vParam,
	vTab
)
{
	//pass everything to cCPanel
	cCPanel.fGetInstance().fOnSignal("multitab", [vOption, vParam, vTab], null);
}
