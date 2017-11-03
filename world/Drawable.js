//Drawable.js
//Stophin
//20160417

var isTouch = 0;
function onResize(width, height)
{
	world.resize(width, height);
	
	graphics = document.getElementById("myCanvas");
	graphics.width = world.geometry.Width;
	graphics.height = world.geometry.Height;
	var scrollLink = gui.getComponent(100);
	if (scrollLink) {
		scrollLink.spread(world.geometry.Height);
	}
}

function onPaint()
{
	var role = world.focus;
	if (1)
	{
		var ctx = graphics.getContext("2d");
		ctx.clearRect(0, 0, world.geometry.Width, world.geometry.Height);	
	}
	
	//world.refreshRole();

	world.drawRole(graphics);
	ctx.clearRect(preview.display.X, preview.display.Y, preview.geometry.Width, preview.geometry.Height);
	preview.drawRole(graphics);
	gui.update();

	ctx.rect(preview.display.X, preview.display.Y, preview.display.X + preview.geometry.Width, preview.display.Y + preview.geometry.Height);

	if (role)
	{
		role.fetchPath();
	}
	role = preview.focus;
	if (role)
	{
		role.fetchPath();
	}
}

function onAStar(x, y)
{
	var pworld = world;
	prevt.set(preview.display.X, preview.display.Y, preview.geometry.Width, preview.geometry.Height);
	if (prevt.atPointXY(x, y)) {
		pworld = preview;
	}
	var role = pworld.focus;
	if (role == null)
	{
		return;
	}
	role.srole = null;
	var irole = pworld.getRoleFlat(x, y);
	if (role.equal(irole))
	{
		irole = null;
	}
	if (irole)
	{
		var pos = adjustCursor(x, y, role, irole);
		x = pos.X;
		y = pos.Y;
	}
	if (irole != role.irole)
	{
		if (irole)
		{
			Client.emitClientEvent("interaction", {
				"worldID":pworld.uniqueID,
				"role":{
					"uniqueID": role.uniqueID
				},
				"irole":{
					"uniqueID": irole.uniqueID
				}
			});
		}
		else
		{
			Client.emitClientEvent("interaction", {
				"worldID":pworld.uniqueID,
				"role":{
					"uniqueID": role.uniqueID
				}
			});
		}
	}
	role.irole = irole;
		
	pt = projectFlat(x - pworld.display.X, y - pworld.display.Y);
	var dest = new Paths((pt.X - role.flatting.X) / role.flatting.Width, (pt.Y - role.flatting.Y) / role.flatting.Height);
	role.astarPath(dest, DEF_ASTAR_LIMIT);

	if (pworld.cursor)
	{
		pworld.cursor.moveFlat(pt.X - pworld.cursor.flatting.X, pt.Y - pworld.cursor.flatting.Y);
	}
}

function trigger(lParam, wParam)
{
	var role = lParam;
	if (!role)
	{
		return;
	}
	// It's necessary beacause there's only one client
	// that can handle emit
	if (!role.equal(world.focus))
	{
		return;
	}
	if (role.irole)
	{
		if (role.irole.type == Role_Type.Disabled)
		{
			role.irole = null;
		}
		else
		{
			var x = role.flatting.X + role.flatting.Width / 2;
			var y = role.flatting.Y + role.flatting.Height / 2;
			var rangW = role.range.X * role.flatting.Width;
			var rangH = role.range.Y * role.flatting.Height;
			var relation = getRelationExternal(
									role.irole.flatting.X, role.irole.flatting.Y /* + role.irole.flatting.Height*/,
									role.irole.flatting.Width, role.irole.flatting.Height,
									x - rangW, y - rangH +  2 * rangH, 2 * rangW, 2 * rangH);
	  		if (!isRelationD(relation))
			{
				// Lost interaction
				role.irole = null;
			}
		}
		if (role.irole)
		{
			var oldbase = role.base;
			role.base = Animation_Base.Attack;
			if (oldbase != role.base)
			{
				Client.emitClientEvent("status", {
					"worldID":world.uniqueID,
					"role":{
						"uniqueID": role.uniqueID,
						"base":role.base
					}
				});
			}
			
			var olddirection = role.direction;
			role.direction = role.getDirection(role.irole.flatting.X - role.flatting.X, role.irole.flatting.Y - role.flatting.Y);
			if (olddirection != role.direction)
			{
				Client.emitClientEvent("direction", {
					"worldID":world.uniqueID,
					"role":{
						"uniqueID": role.uniqueID,
						"direction":role.direction
					}
				});
			}
			
			Client.emitClientEvent("attack", {
				"worldID":world.uniqueID,
				"role":{
					"uniqueID": role.uniqueID
				},
				"irole":{
					"uniqueID": role.irole.uniqueID
				}
			});
		}
		else
		{
			Client.emitClientEvent("interaction", {
				"worldID":world.uniqueID,
				"role":{
					"uniqueID": role.uniqueID
				}
			});
		}
	}
	else
	{
		var oldbase = role.base;
		role.base = Animation_Base.Still;
		if (oldbase != role.base)
		{
			Client.emitClientEvent("status", {
				"worldID":world.uniqueID,
				"role":{
					"uniqueID": role.uniqueID,
					"base":role.base
				}
			});
		} 
	}
	role.selectAnimation(role.base + role.direction);
}

var start = new PointF();
var prevt = new RectF();
function onDrag(x, y, mode)
{
	var pworld = world;
	prevt.set(preview.display.X, preview.display.Y, preview.geometry.Width, preview.geometry.Height);
	if (prevt.atPointXY(x, y)) {
		pworld = preview;
	}
	if (mode == 1)
	{
		start.X = x - pworld.leftTop.X;
		start.Y = y - pworld.leftTop.Y;
	}
	else if (mode == 2)
	{
		if (start.X != 0 || start.X != 0)
		{
			pworld.offset(x - pworld.leftTop.X - start.X, y - pworld.leftTop.Y - start.Y);
			isDrag = 1;
		} 
	}
	else
	{
		start.X = 0;
		start.Y = 0;
	}
}

function Initialize(worldID, roleID)
{
	preview = new World(worldID);
	world = new World(worldID);
	resm = new ResourceManager();
	gui = new GUI();
	
	resize();
	preview.resize(300, 300);
	preview.display.X = 500;
	preview.display.Y = 100;
	if (world.quadTree)
	{
		world.quadTree.drawable = 0;
	}
	
	loadResources(resm);
	loadMap(world, resm);
	
	role = loadRole(0.5);
	role.uniqueID = roleID;
	role.moveFlat(100, 100);
	world.focus = role;
	world.addRole(role, Role_Type.Player);
	
	
	var cursor = loadRole(1, "cursor.txt");
	world.addRole(cursor, Role_Type.Cursor);

	role = loadRole(0.5);
	role.uniqueID = roleID;
	role.moveFlat(100, 100);
	preview.focus = role;
	preview.addRole(role, Role_Type.Player);
	cursor = loadRole(1, "cursor.txt");
	preview.addRole(cursor, Role_Type.Cursor);
	
	loadScene(world);
	loadScene(preview, "scene1.txt");

	preview.offset(0, 0);
	
	var scrollLink = new ScrollLink(resm.resource, 0, 100, world.geometry.Height, 100);
	gui.addComponent(scrollLink);
	$(document).mousedown(function(e){mousedown(e);});
	$(document).mousemove(function(e){mousemove(e);});
	$(document).mouseup(function(e){mouseup(e);});
	$(window).resize(function(e){resize(e);});
	$(document).keydown(function(e){key_press(e);});
	// jquery <fH]5D9vBVJB<~
	$(document).on("mousewheel DOMMouseScroll", function(e) {mousewheel(e);});
	try {
		document.createEvent("TouchEvent");
		window.document.addEventListener("touchstart", touchstart);
		window.document.addEventListener("touchmove", touchmove);
		window.document.addEventListener("touchend", touchend);
		isTouch = 1;
	}
	catch (e) {
		$(document).mousedown(function(e){mousedown(e);});
		$(document).mousemove(function(e){mousemove(e);});
		$(document).mouseup(function(e){mouseup(e);});
		$(window).resize(function(e){resize(e);});
		$(document).keydown(function(e){key_press(e);});
	}
}

function onTimer()
{
	world.refreshRole();
}