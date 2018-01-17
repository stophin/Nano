//Loading.js
//Stophin
//20160417

function loadMap(world, resourceManager, name)
{
	if (!name)
	{
		name = "map.txt";
	}
	var curPath = mainfolder + "/maps/" + name;
	
	var role = null;
	$.ajax(
	{
		url : 'file.php',
		type:'POST',
		timeout: 10000,
		async: false,
		data:{"filename": curPath, "mode": "read"},
		dataType : 'text',
		success : function(data)
		{
			createMap(data, world, resourceManager);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) 
		{
		},
		complete: function(XMLHttpRequest, textStatus)
		{
		}
	});
	
	return role;
}

function loadRole(scale, name)
{
	if (!name)
	{
		name = "player.txt";
	}
	var curPath = mainfolder + "/roles/" + name;
	
	var role = null;
	$.ajax(
	{
		url : 'file.php',
		type:'POST',
		timeout: 10000,
		async: false,
		data:{"filename": curPath, "mode": "read"},
		dataType : 'text',
		success : function(data)
		{
			g_roles[name] = data;
			role = createRole(data, scale);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) 
		{
		},
		complete: function(XMLHttpRequest, textStatus)
		{
		}
	});
	
	return role;
}

function parseParameter(lineString)
{
	lineString = lineString.split("\t");
	var retCount = 0;
	retString = "";
	for (var i = 0; i < lineString.length; i ++)
	{
		if (lineString[i] != "")
		{
			if (retCount == 0)
			{
				retString = lineString[i] + "@";
			}
			else
			{
				if (retCount >  1)
				{
					retString += "|";
				}
				retString +=  lineString[i];
			}
			retCount ++;
		}
	}
	return retString;
}

function createRole(roleString, scale)
{
	if (!scale)
	{
		scale = 1;
	}
	
	var lineString = roleString.split("\r\n");
	
	var role = new Roles();
	var animation = null;
	var objectManager = null;
	var resource = null;
	var destination = null;
	var truncation = null;
	var flatting = null;
	var tall = 0;
	var reverse = 0;
	
	var index;
	var paramCount = 0;
	var commandString;
	var command;
	var parameters;
	for (var i = 0; i < lineString.length; i++)
	{
		commandString = parseParameter(lineString[i]);
		commandString = commandString.split("@");
		command = commandString[0];
		if (command == "")
		{
			continue;
		}
		if (commandString.length > 1)
		{
			parameters = commandString[1].split("|");
			paramCount = parameters.length;
			if (parameters[0] == "")
			{
				parameters = null;
				paramCount = 0;
			}
		}
		else
		{
			parameters = null;
			paramCount = 0;
		}
		
		if (command == "animation")
		{
			if (role && animation)
			{
				role.animations.addAnimation(animation, animation.uniqueID);
				animation = null;
			}
			if (paramCount >= 1)
			{
				index = getDirection(parameters[0], parameters[1]);
				
				if (index >= 0)
				{
					animation = new Animations();
					animation.mode = Animation_Mode.Still;
					animation.uniqueID = index;
				}
			}
		}
		else if (command == "following")
		{
			if (role && paramCount >= 1)
			{
				index = eval(parameters[0]);
				if (index >= 0)
				{
					role.following = index;
				}
			}
		}
		else if (command == "step")
		{
			if (animation && objectManager)
			{
				animation.addSequence(objectManager, objectManager.uniqueID);
				objectManager = null;
			}
			if (paramCount >= 1)
			{
				index = eval(parameters[0]);
				if (index >= 0)
				{
					objectManager = new ObjectManager();
					objectManager.uniqueID = index;

					if (animation && objectManager)
					{
						if (animation.mode == Animation_Mode.Step || animation.mode == Animation_Mode.Auto)
						{
							objectManager.callbackFunction = trigger;
						}
					}
				}
			}
		}
		else if (command == "resource")
		{
			if (objectManager && resource)
			{
				var object = new Objects();
				object.reverse = reverse;
				objectManager.addStepExternal(object, resource, destination, truncation, resource.uniqueID, scale);
				resource = null;
			}
			if (paramCount >= 1)
			{
				index = eval(parameters[0]);
				if (index > 0)
				{
					resource = resm.getResource(index);
				}
				reverse = 0;
			}
		}
		else if (command == "reverse")
		{
			if (paramCount >= 1 && resource)
			{
				reverse = eval(parameters[0]);
			}
		}
		else if (command == "position")
		{
			if (paramCount >= 4)
			{
				destination = new RectF();
				destination.X = eval(parameters[0]);
				destination.Y = eval(parameters[1]);
				destination.Width = eval(parameters[2]);
				destination.Height = eval(parameters[3]);
			}
		}
		else if (command == "truncate")
		{
			if (paramCount >= 4)
			{
				truncation = new RectF();
				truncation.X = eval(parameters[0]);
				truncation.Y = eval(parameters[1]);
				truncation.Width = eval(parameters[2]);
				truncation.Height = eval(parameters[3]);
			}
		}
		else if (command == "flatting")
		{
			if (paramCount >= 4)
			{
				flatting = new RectF();
				flatting.X = eval(parameters[0]);
				flatting.Y = eval(parameters[1]);
				flatting.Width = eval(parameters[2]);
				flatting.Height = eval(parameters[3]);
			}
		}
		else if (command == "tall")
		{
			if (paramCount >= 1)
			{
				index = eval(parameters[0]);
				if (index >= 0)
				{
					tall = index;
				}
			}
		}
		else if (command == "scale")
		{
			if (paramCount >= 1)
			{
				scale = parameters[0] / 100.0;
				if (scale < 0)
				{
					scale = 1;
				}
			}
		}
		else if (command == "delay")
		{
			if (paramCount >= 1 && animation)
			{
				index = eval(parameters[0]);
				if (animation && index > 0)
				{
					animation.delay = index;
				}
			}
		}
		else if (command == "mode")
		{
			if (paramCount >= 1 && animation)
			{
				if (parameters[0] == "Animation_Step")
				{
					animation.mode = Animation_Mode.Step;
				}
				else if (parameters[0] == "Animation_Auto")
				{
					animation.mode = Animation_Mode.Auto;
				}
				else if (parameters[0] == "Animation_Loop")
				{
					animation.mode = Animation_Mode.Loop;
				}
			}
		}
	}
	
	if (flatting)
	{
		role.scale = scale;
		tall *= scale;
		flatting.scale(scale);
		role.setFlatting(flatting, tall);
	}
	
	return role;
}

function getDirection(base, direction)
{
	if (!base)
	{
		base = "0";
	}
	if (!direction)
	{
		direction = "0";
	}
	var index_base = -1;
	if (base == "still")
	{
		index_base = Animation_Base.Still;
	}
	else if (base == "move")
	{
		index_base = Animation_Base.Move;
	}
	else if (base == "run")
	{
		index_base = Animation_Base.Run;
	}
	else if (base == "attack")
	{
		index_base = Animation_Base.Attack;
	}
	else if (base == "dead")
	{
		index_base = Animation_Base.Dead;
	}
	else
	{
		index_base = eval(base);
	}
	
	var index = -1;
	if (direction == "down")
	{
		index = Animation_Direction.Down;
	}
	else if (direction == "left_down")
	{
		index = Animation_Direction.Left_Down;
	}
	else if (direction == "left")
	{
		index = Animation_Direction.Left;
	}
	else if (direction == "left_up")
	{
		index = Animation_Direction.Left_Up;
	}
	else if (direction == "up")
	{
		index = Animation_Direction.Up;
	}
	else if (direction == "right_up")
	{
		index = Animation_Direction.Right_Up;
	}
	else if (direction == "right")
	{
		index = Animation_Direction.Right;
	}
	else if (direction == "right_down")
	{
		index = Animation_Direction.Right_Down;
	}
	else if (direction == "still")
	{
		index = Animation_Direction.Undefined;
	}
	else
	{
		index = eval(direction);
	}
	
	return index_base + index;
}


function loadResources(resourceManager, name)
{
	if (!resourceManager)
	{
		resourceManager = new ResourceManager();
	}
	if (!name)
	{
		name = "resources.txt";
	}
	var curPath =  mainfolder + "/resources/" + name;
	
	$.ajax(
	{
		url : 'file.php',
		type:'POST',
		timeout: 10000,
		async: false,
		data:{"filename": curPath, "mode": "read"},
		dataType : 'text',
		success : function(data)
		{
			role = createResource(data, resourceManager);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) 
		{
		},
		complete: function(XMLHttpRequest, textStatus)
		{
		}
	});
	
	return resourceManager;
}

function createResource(resourceString, resourceManager)
{
	if (!resourceManager)
	{
		return;
	}
	var lineString = resourceString.split("\r\n");
	
	var paramCount = 0;
	var commandString;
	var command;
	var parameters;
	for (var i = 0; i < lineString.length; i++)
	{
		commandString = parseParameter(lineString[i]);
		commandString = commandString.split("@");
		command = commandString[0];
		if (command == "")
		{
			continue;
		}
		if (commandString.length > 1)
		{
			parameters = commandString[1].split("|");
			paramCount = parameters.length;
		}
		else
		{
			parameters = null;
			paramCount = 0;
		}
		
		if (paramCount >= 1 && paramCount < 2)
		{
			resourceManager.addResource(resourceManager.createResource(command, eval(parameters[0])));
		}
		else if (paramCount < 3)
		{
			resourceManager.addResource(resourceManager.createResource(command,eval(parameters[0]), null, eval(parameters[1])));
		}
		else if (paramCount < 4)
		{
			resourceManager.addResource(resourceManager.createResource(command, eval(parameters[0]), resourceManager.getResource(eval(parameters[1])), eval(parameters[2])));
		}
	}
}



function createMap(mapString, world, resourceManager)
{
	if (!world)
	{
		return;
	}
	if (!resourceManager)
	{
		return;
	}
	var lineString = mapString.split("\r\n");
	var indexString;
	
	var index;
	temp1 = new MultiLinkList(Role_Link.Temp1);
	temp2 = new MultiLinkList(Role_Link.Temp2);
	var tprole = null;
	var lprole = null;
	var temp = temp1;
	for (var i = 0; i < lineString.length; i++)
	{
		indexString = lineString[i].split("\t");
		for (var j = 0; j < indexString.length; j++)
		{
			index = eval(indexString[j]);
			role = new Roles();
			animation = new Animations();
			animation.delay = 1;
			role.animations.addAnimation(animation, 112)
				.addSequence(new ObjectManager(), 120)
				.addStep(new Objects(resourceManager.getResource(index), new RectF(0, 0, 96, 47), new RectF(0, 0, 96, 47)), 102);
			role.setFlatting(new RectF(j * 80, i * 45, 80, 45), 47);
			world.addRole(role, Role_Type.Back);

			if (lprole) {
				role.left = lprole;
				lprole.right = role;
			}
			lprole = role;

			if (temp == temp1) {
				temp2.insertLink(role);
			}
			else {
				temp1.insertLink(role);
			}
			if (i > 0) {
				if (tprole) {
					role.up = tprole;
					tprole.down = role;
					tprole = temp.next(tprole);
				}
			}
		}
		lprole = null;
		if (i > 0) {
			temp.clearLink();
		}
		if (temp == temp1) {
			temp = temp2;
		}
		else {
			temp = temp1;
		}
		tprole = temp.link;
	}
}

function loadScene(world, name)
{
	if (!world)
	{
		world = new World(0);
	}
	if (!name)
	{
		name = "scene.txt";
	}
	var curPath =  mainfolder + "/scenes/" + name;
	
	$.ajax(
	{
		url : 'file.php',
		type:'POST',
		timeout: 10000,
		async: false,
		data:{"filename": curPath, "mode": "read"},
		dataType : 'text',
		success : function(data)
		{
			createScene(data, world);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) 
		{
		},
		complete: function(XMLHttpRequest, textStatus)
		{
		}
	});
	
	return world;
}

var g_roles = new Array();
function createScene(sceneString, world)
{
	if (!world)
	{
		return;
	}
	var lineString = sceneString.split("\r\n");
	var indexString;
	
	var role = null;
	var scale = 1;
	var index = 0;
	var data = "";
	for (var i = 0; i < lineString.length; i++)
	{
		indexString = lineString[i].split("\t");
		if (indexString.length >= 3)
		{
			index = 0;
			if (indexString.length >= 4)
			{
				index = eval(indexString[3]);
			}
			if (index < 0)
			{
				index = 0;
			}
			scale = 1;
			if (indexString.length >= 5)
			{
				scale = eval(indexString[4]);
			}
			if (scale < 0 || scale > 10)
			{
				scale = 1;
			}
			data = g_roles[indexString[0] + ".txt"];
			if (!data)
			{
				role = loadRole(scale, indexString[0] + ".txt");
			}
			else
			{
				role = createRole(data, scale);
			}
			if (role)
			{
				role.uniqueID = index;
				role.moveFlat(eval(indexString[1]), eval(indexString[2]));
				world.addRole(role);
			}
		}
	}
}