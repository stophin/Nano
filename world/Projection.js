//Projection.js
//Stophin
//20160417


var DEF_OFFSETX = 100;
var e = 0.7;
var degree = 30 * PI / 180;
var degree1 = 45 * PI / 180;
var cos45 = -Math.cos(degree1);
var sin45 = Math.sin(degree1);
var tan45 = sin45/cos45;
var parameter = Math.sqrt(1 - e * e) / Math.sqrt(1 - e * e * cos45 * cos45);
var offset = DEF_OFFSETX;

function projectShow(x, y)
{
	if (x == 0)
	{
		x = DEF_ZERO;
	}
	var h = Math.atan(y/x);
	
	if (y > 0)
	{
		if (x < 0)
		{
			h += PI;
		}
	}
	else
	{
		if (x >= 0)
		{
			h += 2 * PI;
		}
		else if (x < 0)
		{
			h += PI;
		}
	}
	
	var r = Math.sqrt(x * x + y * y);
	
	var sx = r * Math.cos(h + degree);
	var sy = r * Math.sin(h + degree);
	
	var dx = offset + sx + sy * parameter * cos45;
	var dy = sy * parameter * sin45;
	return new PointF(dx, dy);
}

function projectFlat(x, y)
{
	var sy = y / (sin45 * parameter);
	var sx = x - offset - sy * parameter * cos45;
	
	if (sx == 0)
	{
		sx = DEF_ZERO;
	}
	var gh = Math.atan(sy/sx);
	
	if (sy > 0)
	{
		if (sx < 0)
		{
			gh += PI;
		}
	}
	else
	{
		if (sx > 0)
		{
			gh += 2 * PI;
		}
		else if (sx < 0)
		{
			gh += PI;
		}
	}
	
	var r = Math.sqrt(sx * sx + sy * sy);
	
	var dx = r * Math.cos(gh - degree);
	var dy = r * Math.sin(gh - degree);
	
	return new PointF(dx, dy);
}

function adjustCursor(x, y, role, irole) {
	var pot = projectFlat(x, y);
	var cx = irole.flatting.X + irole.flatting.Width / 2;
	var cy = irole.flatting.Y + irole.flatting.Height / 2;
	var dx = pot.X - cx;
	var dy = pot.Y - cy;
	var ddy = (irole.flatting.Height / 2 + role.flatting.Height / 2);
	var ddx = (irole.flatting.Width / 2 + role.flatting.Width / 2);
    var rx = pot.X;
    var ry = pot.Y;
    var flag = 0;
	if (dx == 0) {
		if (dy > 0) {
			rx = cx + dx;
            ry = cy + ddy;
            flag = 1;
		} else if (dy < 0) {
			rx = cx + dx ;
            ry = cy - ddy;
            flag = 1;
		}
	}
	if (dy == 0) {
		if (dx > 0) {
            rx = cx + ddx ;
            ry = cy + dy;
            flag = 1;
		} else if (dx < 0) {
            rx = cx - ddx ;
            ry = cy + dy;
            flag = 1;
		} else {
			return new PointF(x, y);
		}
	}
	if (!flag) {
        var k = dy / dx;
        if (k < 0) {
            k = -k;
        }
        var tk = irole.flatting.Height / irole.flatting.Width;
        if (k > tk) {
            if (dy > 0) {
                if (dx > 0) {
                    window.document.all.Log.innerHTML+=  "1";
                    rx = cx + ddy / k;
                    ry = cy + ddy;
                } else {
                    window.document.all.Log.innerHTML+=  "2";
                    rx = cx - ddy / k;
                    ry = cy + ddy;
                }
            } else {
                if (dx > 0) {
                    window.document.all.Log.innerHTML += "3";
                    rx = cx + ddy / k;
                    ry = cy - ddy;
                } else {
                    window.document.all.Log.innerHTML+=  "4";
                    rx = cx - ddy / k;
                    ry = cy - ddy;
                }
            }
        } else {
            if (dx > 0) {
                if (dy > 0) {
                    window.document.all.Log.innerHTML+= "5";
                    rx = cx + ddx;
                    ry = cy + ddx * k;
                } else {
                    window.document.all.Log.innerHTML+= "6";
                    rx = cx + ddx;
                    ry = cy - ddy * k;
                }
            } else {
                if (dy > 0) {
                    rx = cx - ddx;
                    ry = cy + ddx * k;
                } else {
                    rx = cx - ddx;
                    ry = cy - ddy * k;
                }
            }
        }
        return projectShow(rx, ry);
	}
}
function adjustCursor_old(x, y, role, irole)
{
	var dx = 0;
	var dy = 0;
	var pot = projectFlat(x, y);
	var sx = pot.X;
	var sy = pot.Y;
	var flag = 0;
	var rangW = role.flatting.Width * (role.range.X - 1);
	var rangH = role.flatting.Height * (role.range.Y - 1);
	if (irole.flatting.Width < rangW * 2 && irole.flatting.Height < rangH * 2)
	{
		sx = role.flatting.X;
		sy = role.flatting.Y;
		flag = 1;
	}
	var vx = (irole.flatting.Width) / 2 + rangW;
	var vy = (irole.flatting.Height) / 2 + rangH;
	if (sx > - DEF_ZERO && sx < DEF_ZERO)
	{
		if (sy > 0)
		{
			dx = 0;
			dy = vy;
		}
		else
		{
			dx = 0;
			dy = -vy;
		}
	}
	else
	{
		var ex = irole.flatting.X + irole.flatting.Width / 2 - rangW / 4;
		var ey = irole.flatting.Y - irole.flatting.Height / 2 - rangH / 4;
		var k = (sy - ey) / (sx - ex);
		var c = irole.flatting.Height / ((irole.flatting.Width > - DEF_ZERO && irole.flatting.Width < DEF_ZERO)? 1: irole.flatting.Width);
		if (sx - ex > 0)
		{
			if (k > c)
			{
				dx = flag ? (vy / k ): (sx - ex);
				dy = vy;
			}
			else if (k > -c )
			{
				dx = vx;
				dy = flag ? (vx * k) : (sy - ey);
			}
			else
			{
				dx = flag ? (-vy / k) : (sx - ex);
				dy = -vy;
			}
		}
		else
		{
			if (-k > c)
			{
				dx = flag ? (vy / k) : (sx - ex);
				dy = vy;
			}
			else if (-k > -c )
			{
				dx = -vx;
				dy = flag ? (vx * (-k)) : (sy - ey);
			}
			else
			{
				dx = flag ? (-vy / k) : (sx - ex);
				dy = -vy;
			}
		}
	}
	
	return projectShow(ex + dx, ey + dy);
}