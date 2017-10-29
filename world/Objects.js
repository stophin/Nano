//Objects.js
//Stophin
//20160417

function Objects(resource, destination, truncation, scale)
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
	this.resource = resource;
	this.destination = destination;
	this.truncation = truncation;
	this.destination.scale(scale);
	this.reverse = 0;

	this.world = null;
	
	Objects.prototype.drawObject = function (graphics)
	{
		if (!this.resource || !this.resource.image)
		{
			return;
		}
		if (!this.world) {
			return;
		}
		try
		{
			var g = graphics.getContext("2d");
			if (this.reverse)
			{
				g.translate(world.geometry.Width, 0);
				g.scale(-1,1);
				
				g.drawImage(this.resource.image, this.truncation.X, this.truncation.Y, this.truncation.Width, this.truncation.Height,
				world.geometry.Width - this.destination.Width - this.destination.X - this.world.display.X, this.destination.Y + this.world.display.Y, this.destination.Width, this.destination.Height);
				
				g.translate(world.geometry.Width, 0);
				g.scale(-1,1);
			}
			else
			{
				g.drawImage(this.resource.image, this.truncation.X, this.truncation.Y, this.truncation.Width, this.truncation.Height,
				this.destination.X + this.world.display.X, this.destination.Y + this.world.display.Y, this.destination.Width, this.destination.Height);
			}
		}
		catch(e)
		{
			g.strokeRect(this.destination.X, this.destination.Y, this.destination.Width, this.destination.Height);
		}
	}
	Objects.prototype.moveObject = function(directionX, directionY)
	{
		this.destination.X += directionX;
		this.destination.Y += directionY;
	}
	
	this.uniqueID = 0;
	this.prev = null;
	this.next = null;
}