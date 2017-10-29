//PointF.js
//Stophin
//20160417

function PointF(x, y)
{
	if (!x) x = 0;
	if (!y) y = 0;
	this.X = x;
	this.Y = y;
	
	PointF.prototype.normalize = function()
	{
		var sa = this.X * this.X + this.Y * this.Y;
		var a = Math.sqrt(sa);
		var rX = Math.sqrt(1 / (1 + sa));
		var rY = Math.sqrt(a / (a + sa));
		if (this.X < 0)
		{
			rX = -rX;
		}
		if (this.Y < 0)
		{
			rY = -rY;
		}
		this.X = rX;
		this.Y = rY;
		return this;
	}
	PointF.prototype.add = function(pt)
	{
		this.X += pt.X;
		this.Y += pt.Y;
		return this;
	}
	PointF.prototype.minus = function(pt)
	{
		this.X -= pt.X;
		this.Y -= pt.Y;
		return this;
	}
	PointF.prototype.multipy = function(a)
	{
		this.X *= a;
		this.Y *= a;
		return this;
	}
	PointF.prototype.clone = function(pt)
	{
		this.X = pt.X;
		this.Y = pt.Y;
		return this;
	}
}