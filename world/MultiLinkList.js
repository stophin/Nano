//MultiLinkList.js
//Stophin
//20160417

function MultiLinkList(linkindex)
{
	this.link = null;
	this.linkcount = 0;
	this.linkindex = linkindex;
	
	MultiLinkList.prototype.clearLink = function()
	{
		if (this.link)
		{
			var temp = this.link;
			do
			{
				if (this.removeLink(temp) == null)
				{
					break;
				}

				temp = this.link;
			} while (temp);
		}
	}
	MultiLinkList.prototype.insertSortF = function(link, fun)
	{
		if (link == null)
		{
			return;
		}

		if (this.link)
		{
			var temp = this.link;
			do
			{
				if (fun && fun(temp, link))
				{
					this.insertLink(link, temp);
					return;
				}

				temp = temp.next[this.linkindex];
			} while (temp && temp != this.link);
			this.insertLink(link);
		}
		else
		{
			this.insertLink(link);
		}
	}
	
	MultiLinkList.prototype.insertSort = function(link)
	{
		if (link == null)
		{
			return;
		}

		if (this.link)
		{
			var temp = this.link;
			do
			{
				if (temp.f > link.f)
				{
					this.insertLink(link, temp);
					return;
				}

				temp = temp.next[this.linkindex];
			} while (temp && temp != this.link);
			this.insertLink(link);
		}
		else
		{
			this.insertLink(link);
		}
	}
	
	MultiLinkList.prototype.insertLink = function(link, before, after)
	{
		if (link == null)
		{
			return;
		}
		if (this.link == null)
		{
			this.link = link;

			this.link.prev[this.linkindex] = link;
			this.link.next[this.linkindex] = link;

			this.linkcount = this.linkcount + 1;

			return;
		}
		else
		{
			var _link = null;
			if (before == this.link)
			{
				_link = link;
			}
			if (before == null && after == null)
			{
				before = this.link;
				after = this.link.prev[this.linkindex];
			}
			else if (before == null)
			{
				before = after.next[this.linkindex];
			}
			else if (after == null)
			{
				after = before.prev[this.linkindex];
			}
			else // before != null && after != null
			{
				if (before.prev[this.linkindex] != after || after.next[this.linkindex] != before)
				{
					return;
				}
			}
			if (before == null || after == null ||
				before.prev[this.linkindex] == null ||
				after.next[this.linkindex] == null)
			{
				return;
			}

			link.prev[this.linkindex] = after;
			link.next[this.linkindex] = before;
			after.next[this.linkindex] = link;
			before.prev[this.linkindex] = link;

			if (_link)
			{
				this.link = _link;
			}

			this.linkcount = this.linkcount + 1;
		}
	}
	
	MultiLinkList.prototype.removeLink = function(link)
	{
		if (link == null)
		{
			return null;
		}
		if (this.linkindex < 0)
		{
			return null;
		}
		if (link.prev[this.linkindex] == null || link.next[this.linkindex] == null)
		{
			return null;
		}
		var before = link.prev[this.linkindex];
		var after = link.next[this.linkindex];

		before.next[this.linkindex] = after;
		after.prev[this.linkindex] = before;
		link.prev[this.linkindex] = null;
		link.next[this.linkindex] = null;

		if (this.link == link)
		{
			this.link = after;
		}
		if (this.link == link)
		{
			this.link = null;
		}

		this.linkcount = this.linkcount - 1;

		return link;
	}
	
	MultiLinkList.prototype.getLink = function(uniqueID)
	{
		if (this.link == null)
		{
			return null;
		}
		var temp = this.link;
		do
		{
			if (temp.uniqueID == uniqueID)
			{
				return temp;
			}
			temp = temp.next[this.linkindex];
		} while (temp && temp != this.link);
		return null;
	}
	
	MultiLinkList.prototype.isin = function(link)
	{
		if (this.link == null)
		{
			return null;
		}
		var temp = this.link;
		do
		{
			if (temp.isin(link))
			{
				return temp;
			}
			temp = temp.next[this.linkindex];
		} while (temp && temp != this.link);
		return null;
	}
	MultiLinkList.prototype.topnLink = function(i)
	{
		if (!this.link)
		{
			return null;
		}
		if (i < 0 || i > this.linkcount)
		{
			return null;
		}
		var link = this.link.prev[this.linkindex];
		var j;
		for (j = i; j > 0; j--)
		{
			link = link.prev[this.linkindex];
		}
		return link;
	}
	
	MultiLinkList.prototype.next = function(link)
	{
		if (link == null)
		{
			return null;
		}
		return link.next[this.linkindex];
	}
	MultiLinkList.prototype.prev = function(link)
	{
		if (link == null)
		{
			return null;
		}
		return link.prev[this.linkindex];
	}
}