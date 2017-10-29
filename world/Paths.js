//Paths.js
//Stophin
//20160417

function Paths(x, y)
{
	this.f = 0;
	this.x = x;
	this.y = y;
	this.parent = null;
	
	this.collisions = new MultiLinkList(Role_Link.Collision);
	
	Paths.prototype.clone = function (path)
	{
		this.x = path.x;
		this.y = path.y;
		this.f = path.f;
		this.parent = path.parent;
		this.uniqueID = path.uniqueID;
		
		for (var i = 0; i < Path_Link.Max; i++)
		{
			this.prev[i] = path.prev[i];
			this.next[i] = path.next[i];
		}
		
		return this;
	}
	Paths.prototype.give = function (path)
	{
		this.x = path.x;
		this.y = path.y;
		this.f = path.f;
		this.parent = path.parent;
	}
	Paths.prototype.set = function (x, y)
	{
		this.x = x;
		this.y = y;
	}
	Paths.prototype.getF = function (role, path)
	{
		this.f = 0;

		var x = this.x * role.flatting.Width;
		var y = this.y * role.flatting.Height;

		this.collisions.clearLink();
		role.moveFlat(x, y);
		var cursor = role.world.cursor;
		var o_x, o_y;
		if (cursor)
		{
			o_x = cursor.flatting.X;
			o_y = cursor.flatting.Y;
			cursor.moveFlat(role.flatting.X - cursor.flatting.X, role.flatting.Y - cursor.flatting.Y);
			cursor.drawAnimation(graphics);
		}
		
		role.world.getCollision(role, this.collisions);
		if (this.collisions.link && this.collisions.linkcount > 0)
		{
			var collision = this.collisions.link;
			do
			{
				if (role.irole && collision.equal(role.irole))
				{
					continue;
				}
				this.f += collision.occupy;

				collision = this.collisions.next(collision);
			} while (collision && collision != this.collisions.link);
		}
		role.moveFlat(-x, -y);
		this.collisions.clearLink();
		if (cursor)
		{
			cursor.moveFlat(o_x - cursor.flatting.X, o_y - cursor.flatting.Y);
			cursor.drawAnimation(graphics);
		}

		this.f += Math.abs(this.x - path.x) + Math.abs(this.y - path.y);
	}
	Paths.prototype.atPointXY = function (rect)
	{
		if (this.x > rect.X - rect.Width && this.x < rect.X + rect.Width &&
		this.y > rect.Y - rect.Height && this.y < rect.Y + rect.Height)
		{
			return 1;
		}
		return 0;
	}
	Paths.prototype.isin = function (path)
	{
		return this.atPointXY(new RectF(path.x, path.y, 1, 1));
	}
	
	this.uniqueID = 0;
	this.prev = [null, null, null, null];
	this.next = [null, null, null, null];
}