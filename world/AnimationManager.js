//AnimationManager.js
//Stophin
//20160417

function AnimationManager()
{
	this.animation = new LinkList();
	
	AnimationManager.prototype.addAnimation = function (animation, uniqueID)
	{
		animation.uniqueID = uniqueID;
		this.animation.insertLink(animation);

		return animation;
	}
	AnimationManager.prototype.moveAnimation = function (directionX, directionY)
	{
		if (this.animation.link == null)
		{
			return;
		}
		var temp = this.animation.link;
		do
		{
			temp.moveSequence(directionX, directionY);

			temp = temp.next;
		} while (temp && temp != this.animation.link);
	}
	AnimationManager.prototype.removeAnimation = function (animation)
	{
		this.animation.removeLink(animation);
	}
	AnimationManager.prototype.drawAnimation = function (graphics)
	{
		if (this.animation.link == null)
		{
			return;
		}
		this.animation.link.drawSequence(graphics);
	}
	AnimationManager.prototype.nextAnimation = function (lParam, moving)
	{
		if (this.animation.link == null)
		{
			return;
		}
		this.animation.link.nextSequence(lParam, moving);
		//var temp = this.animation.link;
		//do
		//{
		//	temp.nextSequence(lParam);
			
			// Only the current animation can do trigger
			// When sequence is done
			// Simply set lParam to null
			// will prevent other animations do trigger
		//	lParam = null;
		//	temp = temp.next;
		//} while (temp && temp != this.animation.link);
	}
	
	this.uniqueID = 0;
	this.prev = null;
	this.next = null;
}