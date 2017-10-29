//BinTree.js
//Stophin
//20160417

function BinNode(role)
{
	this.role = role;
	this.value = role.uniqueID;
	
	this.left = null;
	this.right = null;
	this.parent = null;
	
	this.color = RB_Color.Black;
	
	BinNode.prototype.uncle = function()
	{
		if (this.parent == this.grandPa().left)
		{
			return this.grandPa().right;
		}
		return this.grandPa().left;
	}
	BinNode.prototype.grandPa = function()
	{
		return this.parent.parent;
	}
}

function BinTree()
{
	this.header = null;
	
	BinTree.prototype.insertNode = function(role)
	{
		var node = new BinNode(role);
		var target_pos = this.header;
		
		var parent = null;
		var be_in_left = 1;
		
		while(target_pos)
		{
			parent = target_pos;
			if (this.compare(node, target_pos))	// Insert into right tree
			{
				target_pos = target_pos.right;
				be_in_left = 0;
			}
			else								// Inser into left tree
			{
				target_pos = target_pos.left;
				be_in_left = 1
			}
		}
		
		node.parent = parent;
		if (parent)
		{
			if (be_in_left)
			{
				parent.left = node;
			}
			else
			{
				parent.right = node;
			}
		}
		else
		{
			this.header = node;
		}
		
		this.adjustPath(node);
	}
	
	BinTree.prototype.getRole = function(key)
	{
		var temp = this.getNode(key);
		if (temp)
		{
			return temp.role;
		}
		return null;
	}
	
	BinTree.prototype.getNode = function(key)
	{
		return this.traverse(this.header, key);
	}
	
	BinTree.prototype.traverse = function(node, key)
	{
		if (!node)
		{
			return null;
		}
		if (node.value == key)
		{
			return node;
		}
		if (key > node.value)
		{
			return this.traverse(node.right, key);
		}
		else
		{
			return this.traverse(node.left, key);
		}
	}
	
	BinTree.prototype.compare = function(l, r)
	{
		if (parseInt(l.value) > parseInt(r.value))
		{
			return 1;
		}
		return 0;
	}
	BinTree.prototype.adjustPath = function(node)
	{
		var w = null;
		while(node != this.header && node.parent.color == RB_Color.Red)
		{
			// Left tree
			if (node.parent == node.grandPa().left)
			{
				w = node.uncle();
				// If uncle is red then put unclue and paren to black
				// and grandpa to red, if grandpa's parent might be
				// red, which need to be adjusted later
				if (w != null && red == w.color)
				{
					w.color = RB_Color.Black;
					node.parent.color = RB_Color.Black;
					node.grandPa().color = RB_Color.Red;
					node = node.grandPa();
				}
				else
				{
					// Right tree
					if (node == node.parent.right)
					{
						node = node.parent;
						this.rotate_left(node);
					}
					
					node.parent.color = RB_Color.Black;
					node.grandPa().color = RB_Color.Red;
					
					this.rotate_right(node.grandPa());
				}
			}
			// Right tree
			else
			{
				w = node.uncle();
				
				// If uncle is red then put unclue and paren to black
				// and grandpa to red, if grandpa's parent might be
				// red, which need to be adjusted later
				if (w != null && red == w.color)
				{
					w.color = RB_Color.Black;
					node.parent.color = RB_Color.Black;
					node.grandPa().color = RB_Color.Red;
					node = node.grandPa();
				}
				else
				{
					// Right tree
					if (node == node.parent.left)
					{
						node = node.parent;
						this.rotate_right(node);
					}
					
					node.parent.color = RB_Color.Black;
					node.grandPa().color = RB_Color.Red;
					
					this.rotate_left(node.grandPa());
				}
			}
		}
		
		this.header.color = RB_Color.Black;
	}
	
	BinTree.prototype.rotate_left = function(node)
	{
		var parent = node.parent;
		var right = node.right;
		
		var rleft = right.left;
		
		// Put node as right tree's left tree, 
		// and right tree's left tree as node's right tree
		right.left = node;
		node.parent = right;
		node.right = rleft;
		
		// Replace node with right tree
		if (parent != null)
		{
			// If it's original left tree 
			if (node == parent.left)
			{
				parent.left = right;
			}
			else
			{
				parent.right = right;
			}
		}
		right.parent = parent;
		
		// Put right tree's original left tree into the root
		if (rleft)
		{
			rleft.parent = node;
		}
		if (parent == null)
		{
			this.header = right;
		}
	}
	
	BinTree.prototype.rotate_right = function(node)
	{
		var parent = node.parent;
		var left = node.left;
		
		var lrigt = left.right;
		
		// Put node as left tree's right tree
		left.right = node;
		node.parent = left;
		node.left = lrigt;
		
		// Replace node with left tree
		if (parent != null)
		{
			// If it's original left tree 
			if (node == parent.left)
			{
				parent.left = left;
			}
			else
			{
				parent.right = left;
			}
		}
		left.parent = parent;
		
		// Put left tree's original right tree into the root
		if (lrigt)
		{
			lrigt.parent = node;
		}
		if (parent == null)
		{
			this.header = left;
		}
	}
	
}