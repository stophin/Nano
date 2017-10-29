//External.js
//Stophin
//20160417

function getMousePos(evt)
{ 
	if (!evt)
	{
		return;
	}
	if (!graphics)
	{
		return;
	}
	var canvas = graphics;
	var rect = canvas.getBoundingClientRect();
	var x = (evt.clientX - rect.left) * (canvas.width / rect.width);
	var y = (evt.clientY - rect.top) * (canvas.height / rect.height);
	return {x:x, y:y}
}
var isDrag = 0;
var mousedown = function(event)
{
	isDrag = 0;
    gui.isDrag = 0;
	var ms = getMousePos(event);
	// Left mouse button
	if (event.button == 0)
	{
		if (gui.isin(ms.x, ms.y)) {
			gui.onDrag(ms.x, ms.y, 1);
		} else {
		onDrag(ms.x, ms.y, 1);
		}
	}
	// Right mouse button
	else if (event.button == 2)
	{
		if (gui.drag) {
			gui.isDrag = 2;
		} else {
		isDrag = 2;
		}
	}
}
var mousemove = function(event)
{
	var ms = getMousePos(event);
	if (gui.drag) {
		gui.onDrag(ms.x, ms.y, 2);
	} else {
	onDrag(ms.x, ms.y, 2);
	}
}
var mouseup = function(event)
{
    if (gui.drag) {
        gui.onDrag(0, 0, 0);
    } else {
	onDrag(0, 0, 0);
    }
	if (!isDrag && !gui.isDrag)
	{
		var ms = getMousePos(event);
		onAStar(ms.x, ms.y);
	}
}
var mousewheel = function(event) {
    var delta = (event.originalEvent.wheelDelta && (event.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
        (event.originalEvent.detail && (event.originalEvent.detail > 0 ? -1 : 1));              // firefox
    // wheel up
    if (delta > 0) {
    // wheel down
    } else if (delta < 0) {
    }
    gui.onWheel(delta);
}
var resize = function(event)
{
	var width = window.document.body.clientWidth;
	var height = window.document.body.clientHeight;
	onResize(width, height);
}
window.oncontextmenu = function(event)
{
	disableSystemMenu();
	var role = world.focus;
	if (!role)
	{
		return;
	}
	var ms = getMousePos(event);
	var irole = world.getRole(ms.x, ms.y);
	if (role.equal(irole))
	{
		irole = null;
	}
	if (irole)
	{
		role.srole = irole;
	}
	else
	{
		role.srole = null;
		role.center();
	}
}

function disableSystemMenu(event)
{
	if (!event)
	{
		event = arguments.callee.caller.arguments[0] || window.event;
	}
	
	if (event.preventDefault)
	{
		event.preventDefault();
	}
	if (event.stopPropagation)
	{
		event.stopPropagation();
	}
	else
	{
		event.cancelBubble = true;
		event.returnValue = false;
	}
}


//////Touch//////
var touchstart = function(event)
{
	isDrag = 0;
    gui.isDrag = 0;
	var touch = event.touches[0];  
	var x = Number(touch.pageX); 
	var y = Number(touch.pageY); 
	if (gui.isin(x, y)) {
		gui.onDrag(x, y, 1);
	} else {
	onDrag(x, y, 1);
	}
}
var touchmove = function(event)
{
	var touch = event.touches[0];  
	var x = Number(touch.pageX); 
	var y = Number(touch.pageY) 
	if (gui.drag) {
		gui.onDrag(x, y, 2);
	} else {
	onDrag(x, y, 2);
	}
}

var touchend = function(event)
{
    if (gui.drag) {
        gui.onDrag(0, 0, 0);
    } else {
	onDrag(0, 0, 0);
    }
	
	if (!isDrag && !gui.isDrag)
	{
		var touch = event.changedTouches[0];  
		var x = Number(touch.pageX); 
		var y = Number(touch.pageY);
		onAStar(x, y);
	}
}

//////Touch End//////

function key_press(event)
{
	if (!world)
	{
		return;
	}
	
	var code = event.keyCode;
	
	//alert(code);
	
	switch(code)
	{
		case 27:	// ESC
			Client.emitEvent("disconnect");
			break;
		case 49:	// 1, main role
			break;
		case 70:	// F
			break;
		case 71:	// G
			break;
		case 86:	// V
			break;
		case 82:	// R
			break;
		case 32:	//Space
			break;
		case 65:	// A
		case 37:	//Left
			break;
		case 83:	// S
		case 88:	// X
		case 40:	//Down
			break;
		case 68:	// D
		case 39:	//Right
			break;
		case 87:	// W
		case 38:	//Up
			break;
		case 81:	// Q
			preview.display.X++;
			break;
		case 69:	// E
			preview.display.Y++;
			break;
		case 90:	// Z
			break;
		case 67:	// C
			break;
	}
}