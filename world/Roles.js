//Roles.js
//Stophin
//20160417

function Roles()
{
	this.count = 0;
	
	this.attacked = 0;
	this.health = DEF_HEALTH;
	
	this.dir = [null, null, null, null];
	this._dir = [null, null, null, null];

	this.up = this.dir[0];
	this.down = this.dir[1];
	this.left = this.dir[2];
	this.right = this.dir[3];
	this._up = this._dir[0];
	this._down = this._dir[1];
	this._left = this._dir[2];
	this._right = this._dir[2];

	this.oFlat = new PointF(0, 0);
	this.oRole = new PointF(0, 0);

	this.irole = null;
	// Interactive range
	this.range = new PointF(DEF_RANGE_W, DEF_RANGE_H);
	
	this.base = Animation_Base.Still;
	this.direction = Animation_Direction.Down;
	
	this.scale = 1;
	
	this.world = null;
	this.type = Role_Type.Normal;
	this.relation = Relation.A;
	this.animations = new AnimationManager();
	
	this.quadTree = null;
	
	this.following = 0;
	this.tall = 0;
	this.position = new RectF();
	this.flatting = new RectF();
	this.leftTop = new PointF();
	this.vLeftBottom = new PointF();
	this.vRightBottom = new PointF();
	this.vRightTop = new PointF();
	
	this.fetchSpeed = DEF_FETCH_SPEED;
	this.fetchCount = 0;
	this.occupy = DEF_OCCUPY;
	
	this.prevPath = null;
	this.nextPath = null;
	this.pathCount = 0;
	this.paths = new MultiLinkList(Path_Link.Path);
	this.open = new MultiLinkList(Path_Link.Open);
	this.close = new MultiLinkList(Path_Link.Close);
	this.moving = 0;
	this.srole = null;
	this.speed = new PointF();
	this.enclose = new PointF();
	
	Roles.prototype.controlForce = function()
	{
		if (!this.srole)
		{
			return;
		}
		this.removePath();
		//this.speed.add(this.enclose);
		//this.enclose.minus(new PointF(1,1));
		this.enclose.X = this.position.X - this.srole.position.X ;
		this.enclose.Y = this.position.Y - this.srole.position.Y;
		this.speed.normalize().multipy( 1 / this.fetchSpeed);
		this.enclose.normalize();//.multipy(1 / this.fetchSpeed);
		var dx = this.speed.X + this.enclose.X;
		var dy = this.speed.Y + this.enclose.Y;
		this.moveDelta(dx, dy);
	}
	Roles.prototype.equal = function (role)
	{
		if (role == null)
		{
			return 0;
		}
		return (this.uniqueID == role.uniqueID);
	}
	Roles.prototype.drawAnimation = function (graphics)
	{
		this.animations.drawAnimation(graphics);
		
		if (0 && this.type == Role_Type.Player)
		{
			var g = graphics.getContext("2d");
			g.beginPath();
			var x = this.flatting.X + this.flatting.Width / 2;
			var y = this.flatting.Y + this.flatting.Height / 2;
			var rangW = (this.range.X -1)* this.flatting.Width;
			var rangH = (this.range.Y -1)* this.flatting.Height;
			
			
			lt = projectShow(x - rangW, y - rangH);
			lb = projectShow(x - rangW, y + rangH);
			rb = projectShow(x + rangW, y + rangH);
			rt = projectShow(x + rangW, y - rangH);
			
			g.moveTo(lt.X, lt.Y);
			g.lineTo(lb.X, lb.Y);
			g.lineTo(rb.X, rb.Y);
			g.lineTo(rt.X, rt.Y);
			g.lineTo(lt.X, lt.Y);
		
			g.strokeStyle = 'rgba(0,0,255,1)'; 
			g.stroke();
		}
		
		if (this.attacked && this.health > 0)
		{
			var g = graphics.getContext("2d");
			g.strokeStyleLast = g.strokeStyle;
			g.strokeStyle = 'rgba(255,0,0,1)';
			g.strokeText(this.health, this.position.X, this.position.Y);
			g.strokeStyle = g.strokeStyleLast;
		}
		
		if (0 && this.type != Role_Type.Back)
		{
			var g = graphics.getContext("2d");
			//g.strokeRect(this.position.X, this.position.Y, this.position.Width, this.position.Height);
			
			//var object = this.animations.animation.link.objects.link.object.link;
			//g.strokeRect(object.destination.X, object.destination.Y, object.destination.Width, object.destination.Height);
			g.beginPath();
			g.moveTo(this.leftTop.X, this.leftTop.Y);
			g.lineTo(this.leftTop.X + this.vRightTop.X, this.leftTop.Y + this.vRightTop.Y);
			g.lineTo(this.leftTop.X + this.vRightBottom.X, this.leftTop.Y + this.vRightBottom.Y);
			g.lineTo(this.leftTop.X + this.vLeftBottom.X, this.leftTop.Y + this.vLeftBottom.Y);
			g.lineTo(this.leftTop.X, this.leftTop.Y);
			g.stroke();
		}
	}
	Roles.prototype.setFlatting = function (flatting, tall)
	{
		this.tall = tall;
		this.flatting = flatting;

		this.updateFlatting();
	}
	Roles.prototype.updateFlatting = function ()
	{
		this.leftTop = projectShow(this.flatting.X, this.flatting.Y);
		this.vLeftBottom = projectShow(this.flatting.X, this.flatting.Y + this.flatting.Height).minus(this.leftTop);
		this.vRightTop = projectShow(this.flatting.X + this.flatting.Width, this.flatting.Y).minus(this.leftTop);
		this.vRightBottom = projectShow(this.flatting.X + this.flatting.Width, this.flatting.Y + this.flatting.Height).minus(this.leftTop);

		var directionX = this.position.X;
		var directionY = this.position.Y;

		this.position.X = this.leftTop.X + this.vLeftBottom.X;
		//this.position.Y = this.leftTop.Y - this.tall;
		this.position.Y = this.leftTop.Y  + this.vRightBottom.Y - this.tall;
		this.position.Width = this.vRightTop.X - this.vLeftBottom.X;
		//this.position.Height = this.vRightBottom.Y + this.tall;
		this.position.Height = this.tall;

		this.animations.moveAnimation(this.position.X - directionX, this.position.Y - directionY);
	}
	
	Roles.prototype.moveRole = function (directionX, directionY, mode)
	{
		this.oRole.X += directionX;
		this.oRole.Y += directionY;
		if (!mode) {
			this.moveRoleEx();
		}
	}
	Roles.prototype.moveRoleEx = function ()
	{
		if (DEF_ISZERO(this.oRole.X) && DEF_ISZERO(this.oRole.Y)) {
			return;
		}
		var directionX = this.oRole.X;
		var directionY = this.oRole.Y;
		this.oRole.X = 0;
		this.oRole.Y = 0;

		this.position.X += directionX;
		this.position.Y += directionY;
		this.animations.moveAnimation(directionX, directionY);

		directionX = this.flatting.X;
		directionY = this.flatting.Y;

		var point = projectFlat(this.position.X - this.vLeftBottom.X, this.position.Y + this.tall - this.vRightBottom.Y);
		this.flatting.X = point.X;
		this.flatting.Y = point.Y;

		directionX -= this.flatting.X;
		directionY -= this.flatting.Y;
		
		this.leftTop = projectShow(this.flatting.X, this.flatting.Y);
	}
	Roles.prototype.moveFlat = function (directionX, directionY, mode)
	{
		this.oFlat.X += directionX;
		this.oFlat.Y += directionY;

		if (!mode) {
			this.moveFlatEx();
		}
	}
	Roles.prototype.moveFlatEx = function ()
	{
		if (DEF_ISZERO(this.oFlat.X) && DEF_ISZERO(this.oFlat.Y)) {
			return;
		}
		var directionX = this.oFlat.X;
		var directionY = this.oFlat.Y;
		this.oFlat.X = 0;
		this.oFlat.Y = 0;

		this.flatting.X += directionX;
		this.flatting.Y += directionY;

		this.leftTop = projectShow(this.flatting.X, this.flatting.Y);

		directionX = this.position.X;
		directionY = this.position.Y;

		this.position.X = this.leftTop.X + this.vLeftBottom.X;
		//this.position.Y = this.leftTop.Y - this.tall;
		this.position.Y = this.leftTop.Y + this.vRightBottom.Y - this.tall;

		this.animations.moveAnimation(this.position.X - directionX, this.position.Y - directionY);
	}
	Roles.prototype.nextAnimation = function ()
	{
		this.animations.nextAnimation(this, this.moving);
		// Control Force
		this.controlForce();
	}
	Roles.prototype.selectAnimation = function (animationID)
	{
		if (this.animations.animation.link.uniqueID == animationID)
		{
			return this.animations.animation.link;
		}
		
		var animation = this.animations.animation.getLink(animationID);
		if (animation != null)
		{
			this.animations.animation.link = animation;
		}
		return animation;
	}
	Roles.prototype.astarPath = function (dest, limit)
	{
		this.removePath();

		var start = new Paths(0, 0);
		start.f = 0;
		this.open.insertLink(start);
		dest.f = Astar_Infinity;
		this.open.insertSort(dest);

		pt_l = new Paths(0, 0);
		pt_r = new Paths(0, 0);
		pt_t = new Paths(0, 0);
		pt_b = new Paths(0, 0);
		pt_lt = new Paths(0, 0);
		pt_lb = new Paths(0, 0);
		pt_rt = new Paths(0, 0);
		pt_rb = new Paths(0, 0);
		var pts = [ pt_l, pt_r, pt_t, pt_b, pt_lt, pt_lb, pt_rt, pt_rb];

		var t_pt, t_po, t_pc;
		while (this.open.linkcount > 0)
		{
			var pt = this.open.link;
			this.open.removeLink(pt);
			this.close.insertLink(pt);

			if (this.open.linkcount > limit || this.close.linkcount > limit)
			{
				this.close.clearLink();
				this.open.clearLink();
				break;
			}
			if (dest.atPointXY(new RectF(pt.x, pt.y, 1, 1)))
			{
				this.paths.insertLink(dest);
				var temp = pt.parent;
				while (temp)
				{
					this.paths.insertLink(temp);

					temp = temp.parent;
				}

				this.paths.removeLink(start);
				this.paths.insertLink(start);

				this.pathCount = this.paths.linkcount;

				this.close.clearLink();
				this.open.clearLink();
				break;
			}

			pt_l.set(pt.x - 1, pt.y);
			pt_r.set(pt.x + 1, pt.y);
			pt_t.set(pt.x, pt.y - 1);
			pt_b.set(pt.x, pt.y + 1);
			pt_lt.set(pt.x - 1, pt.y - 1);
			pt_lb.set(pt.x - 1, pt.y + 1);
			pt_rt.set(pt.x + 1, pt.y - 1);
			pt_rb.set(pt.x + 1, pt.y + 1);

			for (var i = 0; i < 8; i++)
			{
				t_pt = pts[i];
				t_pt.getF(this, dest);
				t_pt.parent = pt;

				t_pc = this.close.isin(t_pt);
				if (!t_pc)
				{
					t_po = this.open.isin(t_pt);
					if (!t_po)
					{
						this.open.insertSort(new Paths().clone(t_pt));
					}
					else if (t_pt.f < t_po.f)
					{
						//t_po.give(t_pt);
						t_po.f = t_pt.f;
						t_po.parent = t_pt.parent;

						this.open.removeLink(t_po);
						this.open.insertSort(t_po);
					}
				}
				else
				{
					if (t_pt.f < t_pc.f)
					{
						this.close.removeLink(t_pc);
						t_pc.give(t_pt);
						this.open.insertSort(t_pc);
					}
				}
			}
		}
	}
	Roles.prototype.removePath = function ()
	{
		if (this.nextPath)
		{
			delete this.nextPath;
			this.nextPath = null;
		}
		if (this.prevPath)
		{
			delete this.prevPath;
			this.prevPath = null;
		}

		this.paths.clearLink();
		this.pathCount = 0;
	}
	
	Roles.prototype.fetchPath = function ()
	{
		if (this.nextPath == null)
		{
			this.nextPath = this.paths.removeLink(this.paths.prev(this.paths.link));
			if (this.prevPath == null)
			{
				this.prevPath = this.nextPath;
				this.nextPath = this.paths.removeLink(this.paths.prev(this.paths.link));
			}
		}
		if (this.nextPath == null)
		{
			if (this.prevPath)
			{
				delete this.prevPath;
				this.prevPath = null;
			}
			this.moving = 0;
			return;
		}
		if (this.fetchCount++ >= this.fetchSpeed)
		{
			// When first in path, focus role
			if (this.following && this.paths.linkcount == this.pathCount - 2)
			{
				this.center();
			}

			this.fetchCount = 0;
			if (this . prevPath)
			{
				delete this.prevPath;
				this.prevPath = null;
			}
			this.prevPath = this.nextPath;
			this.nextPath = null;
		}
		else
		{
			var dx = (this.nextPath.x - this.prevPath.x) / this.fetchSpeed;
			var dy = (this.nextPath.y - this.prevPath.y) / this.fetchSpeed;
			
			this.moveDelta(dx, dy);
		}
	}
	Roles.prototype.moveDelta = function(dx, dy)
	{
			var oldbase = this.base;
			this.base = Animation_Base.Move;
			if (oldbase != this.base)
			{
				Client.emitClientEvent("status", {
					"worldID":this.world.uniqueID,
					"role":{
						"uniqueID": this.uniqueID,
						"base":this.base
					}
				});
			}

			
		var olddirection = this.direction;
			this.direction = this.getDirection(dx, dy);
			if (olddirection != this.direction)
			{
				Client.emitClientEvent("direction", {
					"worldID":this.world.uniqueID,
					"role":{
						"uniqueID": this.uniqueID,
						"direction":this.direction
					}
				});
			}
			var animationID = this.base + this.direction;
			if (animationID >= 0)
			{
				this.selectAnimation(animationID);
			}
			
			this.moveFlat(dx * this.flatting.Width, dy * this.flatting.Height);
			this.world.refreshDepth(this);
			
			this.world.quadTree.move(this);
			
			Client.emitClientEvent("position", {
				"worldID":this.world.uniqueID,
				"role":{
					"uniqueID": this.uniqueID,
					"position": {
						"X": (this.flatting.X - this.world.geometry.X) ,
						"Y": (this.flatting.Y - this.world.geometry.Y)
					}
				}
			});

			if (this.following)
			{
			this.world.offsetFlat(- dx * this.flatting.Width, - dy * this.flatting.Height);
			}
			
			this.moving = 1;
	}
	
	Roles.prototype.getDirection = function(dx, dy)
	{
		var animationID = 0;

		if (dx == 0)
		{
			dx = DEF_ZERO;
		}
		var h = Math.atan(-dy/dx);

		if (-dy > 0)
		{
			if (dx < 0)
			{
				h += PI;
			}
		}
		else
		{
			if (dx >= 0)
			{
				h += 2 * PI;
			}
			else if (dx < 0)
			{
				h += PI;
			}
		}

		if (h >= PI / 8)
		{
			if (h < 3 * PI / 8)
			{
				animationID = Animation_Direction.Right;
				this.speed.X = 1;
				this.speed.Y = -1;
			}
			else if (h < 5 * PI / 8)
			{
				animationID = Animation_Direction.Right_Up;
				this.speed.X = 0;
				this.speed.Y = -1;
			}
			else if (h < 7 * PI / 8)
			{
				animationID = Animation_Direction.Up;
				this.speed.X = -1;
				this.speed.Y = -1;
			}
			else if (h < 9 * PI / 8)
			{
				animationID = Animation_Direction.Left_Up;
				this.speed.X = -1;
				this.speed.Y = 0;
			}
			else if (h < 11 * PI / 8)
			{
				animationID = Animation_Direction.Left;
				this.speed.X = -1;
				this.speed.Y = 1;
			}
			else if (h < 13 * PI / 8)
			{
				animationID = Animation_Direction.Left_Down;
				this.speed.X = 0;
				this.speed.Y = 1;
			}
			else if (h < 15 * PI / 8)
			{
				animationID = Animation_Direction.Down;
				this.speed.X = 1;
				this.speed.Y = 1;
			}
			else
			{
				animationID = Animation_Direction.Right_Down;
				this.speed.X = 1;
				this.speed.Y = 0;
			}
		}
		else
		{
			animationID = Animation_Direction.Right_Down;
				this.speed.X = 0;
				this.speed.Y = 1;
		}
		
		return animationID;
	}
	
	Roles.prototype.center = function()
	{
		if (!this.world)
		{
			return;
		}
		this.world.offset(-(this.position.X - this.world.geometry.Width / 2 - this.world.display.X), -(this.position.Y - this.world.geometry.Height / 2 - this.world.display.Y));
	}
	
	this.uniqueID = 0;
	this.prev = [null, null, null, null, null, null, null, null, null, null, null];
	this.next = [null, null, null, null, null, null, null, null, null, null, null];
	Roles.prototype.isin = function(role)
	{
		return this == role;
	}
}