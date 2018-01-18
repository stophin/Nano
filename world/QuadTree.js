//QuadTree.js
//Stophin
//20160417

var QuadTree_Link =
{
	RightTop:0,
	LeftTop:1,
	LeftBottom:2,
	RightBottom:3
};

function QuadTree(level, bounds, parent, position)
{
	if (!level)
	{
		level = 0;
	}
	if (!bounds)
	{
		bounds = new RectF();
	}
	this.maxObjects = 5;
	this.maxLevels = 10;
	this.level = level;
	this.position = position || 0;
	this.bounds = bounds;
	//this.objects = new MultiLinkList(Role_Link.QuadTree);
	this.objects = new MultiLinkList(level + Role_Link.End - 1);
	
	this.uniqueID = 0;
	this.parent = parent || null;
	this.hasChild = 0;
	this.children = [null, null, null, null];
	
	this.drawable = 1;
	
	// 1 0
	// 2 3
	QuadTree.prototype.split = function()
	{
		var subWidth = this.bounds.Width / 2;
		var subHeight = this.bounds.Height / 2;
		var x = this.bounds.X;
		var y = this.bounds.Y;
		
		this.children[QuadTree_Link.RightTop] = new QuadTree(this.level + 1, new RectF(x + subWidth, y, subWidth, subHeight), this, QuadTree_Link.RightTop);
		this.children[QuadTree_Link.LeftTop] = new QuadTree(this.level + 1, new RectF(x, y, subWidth, subHeight), this, QuadTree_Link.LeftTop);
		this.children[QuadTree_Link.LeftBottom] = new QuadTree(this.level + 1, new RectF(x, y + subHeight, subWidth, subHeight), this, QuadTree_Link.LeftBottom);
		this.children[QuadTree_Link.RightBottom] = new QuadTree(this.level + 1, new RectF(x + subWidth, y + subHeight, subWidth, subHeight), this, QuadTree_Link.RightBottom);
		this.hasChild = true;
	}
	QuadTree.prototype.getIndex = function(rect)
	{
		var index = -1;
		var xMidPoint = this.bounds.X + world.geometry.X + this.bounds.Width / 2;
		var yMidPoint = this.bounds.Y + world.geometry.Y + this.bounds.Height / 2;
		
		var topQuad = (rect.Y > this.bounds.Y + world.geometry.Y && rect.Y + rect.Height < yMidPoint);
		var bottomQuad = (rect.Y > yMidPoint && rect.Y + rect.Height < this.bounds.Y + world.geometry.Y + this.bounds.Height);
		
		if (rect.X > this.bounds.X + world.geometry.X && rect.X + rect.Width < xMidPoint) //Left Quad
		{
			if (topQuad) // Left top
			{
				index = 1;
			}
			else if (bottomQuad)		// Left bottom
			{
				index = 2;
			}
		}
		else if(rect.X > xMidPoint && rect.X + rect.Width < this.bounds.X + world.geometry.X + this.bounds.Width) // Right Quad
		{
			if (topQuad)	//Right top
			{
				index = 0;
			}
			else if (bottomQuad)		//Right bottom
			{
				index = 3;
			}
		}
		return index;
	}
	QuadTree.prototype.insert = function(role)
	{
		if (this.hasChild)
		{
			var index = this.getIndex(role.flatting);
			if (index != -1)
			{
				this.children[index].insert(role);
			}
			else
			{
				this.objects.insertLink(role);
				role.quadTree = this;
			}
			return;
		}
		this.objects.insertLink(role);
		role.quadTree = this;
		if (this.objects.linkcount > this.maxObjects && this.level < this.maxLevels)
		{
			this.split();

			var _obj = this.objects.link;
			var _next;
			if (_obj) {
				do {
					_next = this.objects.next(_obj);

					index = this.getIndex(_obj.flatting);
					if (index != -1) {
						this.objects.removeLink(_obj);
						this.children[index].insert(_obj);
					}

					_obj = _next;
				} while(_obj && _obj != this.objects.link);
			}
		}
	}
	
	QuadTree.prototype.collision = function(role, collision)
	{
		if (!collision)
		{
			return;
		}
		if (!role.quadTree)
		{
			return;
		}
		if (!role.quadTree.parent)
		{
			return;
		}
		role.count = 0;
		//role.quadTree.parent.collisionInternal(role, collision);
		this.collisionInternal(role, collision);
		//console.log(role.count);
	}
	
	QuadTree.prototype.collisionInternal = function(role, collision)
	{
		if (!collision)
		{
			return;
		}
		if (this.hasChild)
		{
			var index = this.getIndex(role.flatting);
			if (index != -1)
			{
				this.children[index].collisionInternal(role, collision);
			}
		}
		if (!this.objects.link)
		{
			return;
		}
		var _role = this.objects.link;
		var relation;
		do
		{
			role.count ++;
			_role.count = role.count + 50;
			
			if (_role != role)
			{
				relation = getRelation(_role, role);
				if (isRelationD(relation))
				{
					_role.relation = relation;
					collision.insertLink(_role);
				}
			}
			
			_role = this.objects.next(_role);
		}while(_role && _role != this.objects.link);
	}
	QuadTree.prototype.move = function(role)
	{
		if (!role.quadTree)
		{
			this.insert(role);
		}
		else
		{
			role.quadTree.objects.removeLink(role);
			if (role.quadTree.parent)
			{
				role.quadTree.parent.insert(role);
			}
			else
			{
				this.insert(role);
			}
		}
	}
	QuadTree.prototype.draw = function(graphics, drawable)
	{
		if (!drawable)
		{
			return;
		}
		if (!graphics)
		{
			return;
		}
		if (this.hasChild)
		{
			for (var i = 0; i < 4; i++)
			{
				this.children[i].draw(graphics, drawable);
			}
		}
		var g = graphics.getContext("2d");
		if (drawable >= 2)
		{
			g.beginPath();
			g.fillText(this.level + ":" + this.position,this.bounds.X + world.geometry.X, this.bounds.Y + 20 * this.level + world.geometry.Y);
			g.rect(this.bounds.X + world.geometry.X, this.bounds.Y + world.geometry.Y, this.bounds.Width, this.bounds.Height);
			
			g.stroke();
		}
		
		if (!this.objects.link)
		{
			return;
		}
		var _role = this.objects.link;
		g.beginPath();
		g.font="20px Georgia";
		do
		{
			if (_role.count > 0)
			{
				if (drawable >= 4)
				{
					g.fillRect(_role.flatting.X , _role.flatting.Y, _role.flatting.Width, _role.flatting.Height);
					g.rect(_role.position.X, _role.position.Y, _role.position.Width, _role.position.Height);
				}
				g.moveTo(_role.leftTop.X, _role.leftTop.Y);
				g.lineTo(_role.leftTop.X + _role.vRightTop.X, _role.leftTop.Y + _role.vRightTop.Y);
				g.lineTo(_role.leftTop.X + _role.vRightBottom.X, _role.leftTop.Y + _role.vRightBottom.Y);
				g.lineTo(_role.leftTop.X + _role.vLeftBottom.X, _role.leftTop.Y + _role.vLeftBottom.Y);
				g.lineTo(_role.leftTop.X, _role.leftTop.Y);
				
				_role.count --;
			}
			else if (drawable >= 2)
			{
				g.rect(_role.flatting.X , _role.flatting.Y, _role.flatting.Width, _role.flatting.Height);
			}
			if (drawable >= 3)
			{
				g.fillText(_role.uniqueID + ":" + this.level + ":" + this.position, _role.flatting.X, _role.flatting.Y);
			}
			
			_role = this.objects.next(_role);
		}while(_role && _role != this.objects.link);
		g.stroke();
	}
}