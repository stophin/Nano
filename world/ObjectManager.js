//ObjectManager.js
//Stophin
//20160417

function ObjectManager()
{
	this.object = new LinkList();
	
	ObjectManager.prototype.addStep = function (object, uniqueID)
	{
		object.uniqueID = uniqueID;
		this.object.insertLink(object);
		return this;
	}
	ObjectManager.prototype.addStepExternal = function (object, resource, destination, truncation, uniqueID, scale)
	{
		if (!scale)
		{
			scale = 1;
		}
		if (!destination)
		{
			destination = new RectF();
		}
		if (!truncation)
		{
			truncation = new RectF();
		}
		
		object.resource = resource;
		object.destination = destination;
		object.truncation = truncation;
		object.destination.scale(scale);
		
		this.addStep(object, uniqueID);
		
		return this;
	}
	ObjectManager.prototype.removeStep = function (object)
	{
		this.object.removeLink(object);
	}
	ObjectManager.prototype.drawStep = function (graphics)
	{
		if (this.object.link == null)
		{
			return;
		}
		this.object.link.drawObject(graphics);
	}
	ObjectManager.prototype.moveStep = function (directionX, directionY)
	{
		if (this.object.link == null)
		{
			return;
		}
		var temp = this.object.link;
		do
		{
			temp.moveObject(directionX, directionY);

			temp = temp.next;
		} while (temp && temp != this.object.link);
	}
	
	this.objectCount = 0;
	this.callbackFunction = null;
	ObjectManager.prototype.triggerFunction = function (lParam)
	{
		this.objectCount++;
		if (this.callbackFunction && lParam && this.objectCount >= this.object.linkcount)
		{
			this.objectCount = 0;
			this.callbackFunction(lParam, this);
		}
		if (this.objectCount < 0)
		{
			this.objectCount = 0;
		}
	}
	
	this.uniqueID = 0;
	this.prev = null;
	this.next = null;
}