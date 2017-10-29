//RectF.js
//Stophin
//20160417

function RectF(x, y, w, h)
{
	if (!x) x = 0;
	if (!y) y = 0;
	if (!w) w = 0;
	if (!h) h = 0;
	
	this.X = x;
	this.Y = y;
	this.Width = w;
	this.Height = h;
	
	RectF.prototype.scale = function(rate)
	{
		this.Width *= rate;
		this.Height *= rate;
		this.X *= rate;
		this.Y *= rate;
		return this;
	}
	
	RectF.prototype.clone = function(rect)
	{
		this.Width = rect.Width;
		this.Height = rect.Height;
		this.X = rect.X;
		this.Y = rect.Y;
		return this;
	}
	
	RectF.prototype.atPointXY = function (x, y)
	{
		if (x > this.X && x < this.X + this.Width &&
		y > this.Y && y < this.Y + this.Height)
		{
			return 1;
		}
		return 0;
	}
	RectF.prototype.set = function(x, y, w, h) {
		this.X = x;
		this.Y = y;
		this.Width = w;
		this.Height = h;
	}
	
	return this;
}