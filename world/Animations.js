//Animations.js
//Stophin
//20160417

function Animations()
{
	this.delay = 0;
	this.delayCount = 0;
	
	this.mode = Animation_Mode.Still;
	
	this.objects = new LinkList();
	
	Animations.prototype.addSequence = function (objects, uniqueID)
	{
		objects.uniqueID = uniqueID;
		this.objects.insertLink(objects);
		return objects;
	}
	Animations.prototype.removeSequence = function (objects)
	{
		this.objects.removeLink(objects);
	}
	Animations.prototype.drawSequence = function (graphics)
	{
		if (this.objects.link == null)
		{
			return;
		}
		var temp = this.objects.link;
		do
		{
			temp.drawStep(graphics);
			temp = temp.next;
		} while (temp && temp != this.objects.link);
	}
	Animations.prototype.nextSequence = function (lParam, moving)
	{
		if (this.objects.link == null)
		{
			return;
		}
		if (this.mode == Animation_Mode.Still)
		{
			return;
		}
		if (this.delayCount++ >= this.delay)
		{
			this.delayCount = 0;
			var temp = this.objects.link;
			do
			{
				temp.object.link = temp.object.link.next;
				
				// when lParam is not null and mode is Step
				// do trigger when sequence is done
				if (lParam)
				{
					// Do not do trigger when moving if mode is Step
					// even if sequence is done
					if (lParam && moving)
					{
						temp.objectCount = -1;
					}
					if (this.mode == Animation_Mode.Step)
					{
						// Force trigger every step
						// Thus change animation whenever stopped
						if (temp.objectCount > 0)
						{
							temp.objectCount = temp.object.linkcount;
						}
						temp.triggerFunction(lParam);
					}
					else if (this.mode == Animation_Mode.Auto)
					{
						temp.triggerFunction(lParam);
					}
				}
				
				temp = temp.next;
			} while (temp && temp != this.objects.link);
		}
	}
	Animations.prototype.moveSequence = function (directionX, directionY)
	{
		if (this.objects.link == null)
		{
			return;
		}
		var temp = this.objects.link;
		do
		{
			temp.moveStep(directionX, directionY);

			temp = temp.next;
		} while (temp && temp != this.objects.link);
	}
	
	this.uniqueID = 0;
	this.prev = null;
	this.next = null;
}