//World.js
//Stophin
//20160417

function compare(temp, link) {
	var ret = 0;
	if (DEF_ISZERO(link.flatting.Y - temp.flatting.Y)) {
		if (link.flatting.X > temp.flatting.X) {
			ret = 1;
		}
	}
	return ret;
}

function World(uniqueID)
{
	this.uniqueID = uniqueID;

	this.display = new PointF();
	
	this.geometry = new RectF();
	this.leftTop = new PointF();
	this.vLeftBottom = new PointF();
	this.vRightBottom = new PointF();
	this.vRightTop = new PointF();
	
	this.focus = null;
	this.cursor = null;
	
	this.roles = new MultiLinkList(Role_Link.Role);			// Roles, Except the Land
	this.sorts = new MultiLinkList(Role_Link.Sort);			// Sort Link
	this.objects = new MultiLinkList(Role_Link.Object);		// All the objects
	this.backs = new MultiLinkList(Role_Link.Back);			// Land
	this.sortsbacks = new MultiLinkList(Role_Link.Sortsbacks);// Land's sorts
	this.fronts = new MultiLinkList(Role_Link.Front);		// Front objects, cursor, etc.
	this.players = new MultiLinkList(Role_Link.Player);		// Players, dynamic
	
	this.quadTree = new QuadTree(0, new RectF(0, 0, DEF_QUAD_W, DEF_QUAD_H), null, 0);
	this.binTree = new BinTree();
	
	World.prototype.resize = function (width, height)
	{
		this.geometry.Width = width;
		this.geometry.Height = height;

		this.leftTop = projectShow(this.geometry.X, this.geometry.Y);
		this.vLeftBottom = projectShow(this.geometry.X, this.geometry.Y + this.geometry.Height).minus(this.leftTop);
		this.vRightTop = projectShow(this.geometry.X + this.geometry.Width, this.geometry.Y).minus(this.leftTop);
		this.vRightBottom = projectShow(this.geometry.X + this.geometry.Width, this.geometry.Y + this.geometry.Height).minus(this.leftTop);
	}
	World.prototype.offset = function (offsetX, offsetY)
	{
		this.leftTop.X += offsetX;
		this.leftTop.Y += offsetY;
		
		var flat = projectFlat(this.leftTop.X, this.leftTop.Y);

		var flatX = flat.X - this.geometry.X;
		var flatY = flat.Y - this.geometry.Y;
		this.geometry.X = flat.X;
		this.geometry.Y = flat.Y;

		var temp;

		if (this.roles.link)
		{
			temp = this.roles.link;
			do
			{
				temp.moveRole(offsetX, offsetY);

				if (!this.geometryCut(temp))
				{
					//this.sorts.insertLink(temp);
					this.refreshDepth(temp);
				}
				else
				{
					this.sorts.removeLink(temp);
				}

				temp = this.roles.next(temp);
			} while (temp && temp != this.roles.link);
		}

		this.refreshGeometryCut(flatX, flatY);
	}
	World.prototype.offsetFlat = function (offsetX, offsetY)
	{
		this.geometry.X += offsetX;
		this.geometry.Y += offsetY;

		this.leftTop = projectShow(this.geometry.X, this.geometry.Y);

		var temp;
		if (this.roles.link)
		{
			temp = this.roles.link;
			do
			{
				temp.moveFlat(offsetX, offsetY);

				if (!this.geometryCut(temp))
				{
					//this.sorts.insertLink(temp);
					this.refreshDepth(temp);
				}
				else
				{
					this.sorts.removeLink(temp);
				}

				temp = this.roles.next(temp);
			} while (temp && temp != this.roles.link);
		}

		this.refreshGeometryCut(offsetX, offsetY);
	}
	World.prototype.addRole = function (role, type)
	{
		if (!type)
		{
			type = role.type;
		}
		role.type = type;

		if (this.roles.link == null)
		{
			this.focus = role;
		}
		if (role.type != Role_Type.Back) {
			this.roles.insertLink(role);
		}
		role.world = this;

		switch (type)
		{
		case Role_Type.Normal:
			this.sorts.insertLink(role);
			this.refreshDepth(role, 0);
			//this.refreshGeometryCut();
			this.objects.insertLink(role);
		
			this.quadTree.insert(role);
			this.binTree.insertNode(role);
			break;
		case Role_Type.Player:
			this.players.insertLink(role);
			this.objects.insertLink(role);
		
			this.quadTree.insert(role);
			this.binTree.insertNode(role);
			break;
		case Role_Type.Cursor:
			this.fronts.insertLink(role);
			this.cursor = role;
			break;
		default:
			this.backs.insertSortF(role, compare);
			if (!this.geometryCut(role))
			{
				this.insertSortsBacks(role, compare);
			}
		}
		//bind world to each role's animation's object
		var animation = role.animations.animation.link;
		if (animation) {
			do {
				var objectManager = animation.objects.link;
				if (objectManager) {
					do {
						var object = objectManager.object.link;
						if (object) {
							do {
								object.world = this;

								object = object.next;
							} while (object && object != objectManager.object.link);
						}

						objectManager = objectManager.next;
					} while (objectManager && objectManager != animation.objects.link);
				}

				animation = animation.next;
			} while (animation && animation != role.animations.animation.link);
		}
	}
	
	World.prototype.removeRole = function (role)
	{
		if (role == null)
		{
			return null;
		}
		if (this.roles.removeLink(role) == null)
		{
			return null;
		}
		switch (role.type)
		{
		case Role_Type.Normal:
			this.objects.removeLink(role);
			break;
		case Role_Type.Cursor:
			this.fronts.removeLink(role);
			this.cursor = null;
			break;
		case Role_Type.Player:
			this.players.removeLink(role);
			break;
		default:
			this.backs.removeLink(role);
			this.removeSortsBacks(role);
		}
		this.sorts.removeLink(role);
		role.world = null;

		if (role.equal(this.focus))
		{
			this.focus = null;
		}
		
		role.type = Role_Type.Disabled;
		
		return role;
	}
	World.prototype.drawRole = function (graphics)
	{
		var i = 0;
		var temp = null;
		if (this.sortsbacks.link)
		{
			temp = this.sortsbacks.link;
			do
			{
				temp.drawAnimation(graphics);

				i++;
				temp = this.sortsbacks.next(temp);
			} while (temp && temp != this.sortsbacks.link);
		}

		if (this.sorts.link)
		{
			temp = this.sorts.link;
			do
			{
				temp.drawAnimation(graphics);
				
				i++;
				if (temp.moving) {
					temp.nextAnimation();
				}
				temp = this.sorts.next(temp);
			} while (temp && temp != this.sorts.link);
		}
		if (this.fronts.link)
		{
			temp = this.fronts.link;
			do
			{
				temp.drawAnimation(graphics);
				i++;
				temp = this.fronts.next(temp);
			} while (temp && temp != this.fronts.link);
		}
		if (this.players.link)
		{
			temp = this.players.link;
			do
			{
				//temp.drawAnimation(graphics);
				temp.nextAnimation();
				i++;
				temp = this.players.next(temp);
			}while (temp && temp != this.players.link);
		}
		
		this.quadTree.draw(graphics, this.quadTree.drawable);
	}
	World.prototype.refreshRole = function ()
	{
		if (this.sorts.link == null)
		{
			return;
		}
		var temp = this.sorts.link;
		do
		{
			temp.nextAnimation();

			temp = this.sorts.next(temp);
		} while (temp && temp != this.sorts.link);

	}
	World.prototype.insertSortsBacks = function(role, fun) {
		/*
		for ( i = 0; i < 4; i++) {
			if (role.dir[i]) {
				var j = 0;
				switch (i) {
				case 0: j = 1; break;
				case 1: j = 0; break;
				case 2: j = 3; break;
				case 3: j = 2; break;
				}
				role._dir[i] = role.dir[i];
				role.dir[i]._dir[j] = role;
			}
		}
		*/

		this.sortsbacks.insertSortF(role, fun);

	}
	World.prototype.removeSortsBacks = function(role) {
		/*
		for ( i = 0; i < 4; i++) {
			if (role._dir[i]) {
				var j = 0;
				switch (i) {
				case 0: j = 1; break;
				case 1: j = 0; break;
				case 2: j = 3; break;
				case 3: j = 2; break;
				}
				role._dir[i]._dir[j] = null;
			}
			role._dir[i] = null;
		}
		*/

		this.sortsbacks.removeLink(role);
	}

	
	World.prototype.refreshGeometryCut = function (flatX, flatY)
	{
		var temp = null, _temph = null, _tempw = null;
		temp = this.backs.link;
		if (temp) {
			do {
				temp.moveFlat(flatX, flatY, 1);

				temp = this.backs.next(temp);
			} while (temp && temp != this.backs.link);
		}
		if (this.sortsbacks.link) {
			tempLink = new MultiLinkList(Role_Link.Temp1);
			temp = this.sortsbacks.link;
			var layw = (Math.floor(Math.abs(flatX) / temp.flatting.Width) + 2);
			var layh = (Math.floor(Math.abs(flatY) / temp.flatting.Height) + 2);
			var i, j, k;
			do
			{
				next = this.sortsbacks.next(temp);
				//if (temp->_up == NULL ||temp->_down == NULL ||temp->_left == NULL ||temp->_left == NULL)
				{
					_temph = temp;
					for (i = 0; i <= layh; i++) {
						if (_temph && _temph.down) {
							_temph = _temph.down;
						}
						else {
							break;
						}
					}
					for (i = -layh; i <= layh; i++) {
						if (_temph) {
							_tempw = _temph;
							for (j = 0; j <= layw; j++) {
								if (_tempw && _tempw.left) {
									_tempw = _tempw.left;
								}
								else {
									break;
								}
							}
							for (k = -layw; k <= layw; k++) {
								if (_tempw) {
									if (!tempLink.next(_tempw)) {
										//tempLink.insertSortF(_tempw, compare);
										tempLink.insertLink(_tempw);
									}
									_tempw.moveFlatEx();
									_tempw = _tempw.right;
								}
								else {
									break;
								}
							}
							_temph = _temph.up;
						}
						else {
							break;
						}
					}
				}
				temp.moveFlatEx();

				temp = next;
			} while (temp && temp != this.sortsbacks.link);
			temp = tempLink.link;
			if (temp) {
				do {
					if (this.geometryCut(temp))
					{
						this.removeSortsBacks(temp);
					}
					else
					{
						//if (!this.sortsbacks.isin(temp))
						if (!this.sortsbacks.next(temp))
						{
							this.insertSortsBacks(temp, compare);
						}
						else {
							temp = temp;
						}
					}
					temp = tempLink.next(temp);
				} while (temp && temp != tempLink.link);
			}
			tempLink.clearLink();
		}
		else {
			var temp = null;

			if (this.backs.link)
			{
				temp = this.backs.link;
				do
				{
					temp.moveFlat(flatX, flatY);

					if (this.geometryCut(temp))
					{
						this.removeSortsBacks(temp);
					}
					else
					{
						if (!this.sortsbacks.isin(temp))
						{
							this.insertSortsBacks(temp, compare);
						}
					}

					temp = this.backs.next(temp);
				} while (temp && temp != this.backs.link);
			}
		}
	}
	World.prototype.getCollision = function (item, collision)
	{
		if (collision == null)
		{
			return collision;
		}
		if (item == null)
		{
			return collision;
		}
		if (item.type != Role_Type.Normal && item.type != Role_Type.Player)
		{
			return collision;
		}
		
		if (this.quadTree)
		{
			this.quadTree.move(item);
			this.quadTree.collision(item, collision, graphics);
			return collision;
		}
		
		var linkList = this.objects;
		if (linkList.link == null)
		{
			return collision;
		}
		var tango = linkList.link;
		var relation;
		do
		{
			if (tango != item)
			{
				relation = getRelation(tango, item);
				if (isRelationD(relation))
				{
					tango.relation = relation;
					collision.insertLink(tango);
				}
			}
			tango = linkList.next(tango);
		} while (tango && tango != linkList.link);
		return collision;
	}
	
	World.prototype.refreshDepth = function (item, collision)
	{
		if (!collision)
		{
			collision = null;
		}
		if (item == null)
		{
			return collision;
		}
		if (this.sorts.link == null)
		{
			this.sorts.insertLink(item);
			return collision;
		}
		this.sorts.removeLink(item);
		if (this.sorts.link == null)
		{
			this.sorts.insertLink(item);
			return collision;
		}
		if (item.type != Role_Type.Normal && item.type != Role_Type.Player)
		{
			return collision;
		}
		
		var before = null;
		var after = null;
		var linkList = this.sorts;
		if (0 && item.quadTree)
		{
			linkList = item.quadTree.objects;
		}
		var tango = linkList.link;
		if (tango == null)
		{
			return collision;
		}
		var relation;
		do
		{
			relation = getRelation(tango, item);
			tango.relation = relation;
			if (isRelationD(relation))
			{
				if (collision)
				{
					collision.insertLink(tango);
				}
				if (tango.position.Y + tango.tall > item.position.Y + item.tall)
				{
					//this.sorts.insertLink(item, tango);
					before = tango;
					break;
				}
				else
				{
					//this.sorts.insertLink(item, null, tango);
					//after = tango;
				}
			}
			else if (relation == Relation.A)
			{
				//this.sorts.insertLink(item, tango);
				before = tango;
				break;
			}
			else if (relation == Relation.B || relation == Relation.C)
			{
				//this.sorts.insertLink(item, null, tango);
				//after = tango;
			}

			tango = linkList.next(tango);
		} while (tango && tango != linkList.link);
		
		this.sorts.insertLink(item, before, after);

		return collision;
	}
	
	World.prototype.geometryCut = function(item)
	{
		var px = item.position.X;
		var itemW = item.position.Width;

		var bondX = 10;

		if (px + itemW < bondX)
		{
			return 1;
		}
		if (px > this.geometry.Width - bondX)
		{
			return 1;
		}
		var py = item.position.Y;
		var itemH = item.position.Height;
		var bondY = 10;
		if (py + itemH < bondY)
		{
			return 1;
		}
		if (py > this.geometry.Height - bondY)
		{
			return 1;
		}
		return 0;
	}
	
	World.prototype.getRole = function(x, y)
	{
		if (this.sorts.link == null)
		{
			return null;
		}
		var temp = this.sorts.link;
		do
		{
			var object = null;
			try
			{
				object = temp.animations.animation.link.objects.link.object.link.destination;
			}
			catch(e)
			{
				object = temp.position;
			}
			
			if (object.atPointXY(x, y))
			{
				return temp;
			}
			temp = this.sorts.next(temp);
		}while(temp && temp != this.sorts.link);
		return null;
	}
	World.prototype.getRoleFlat = function(x, y)
	{
		if (this.sorts.link == null)
		{
			return null;
		}
		var flat = projectFlat(x, y);
		var temp = this.sorts.link;
        var object = null;
		do
		{
			object = temp.flatting;
			if (object.atPointXY(flat.X, flat.Y))
			{
				return temp;
			}
			temp = this.sorts.next(temp);
		}while(temp && temp != this.sorts.link);
		return null;
	}
}