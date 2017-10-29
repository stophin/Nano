//LinkList.js
//Stophin
//20160417

function LinkList()
{
	this.link = null;
	this.linkcount = 0;
	
	LinkList.prototype.insertLink = function(link, before, after)
	{
		if (!before)
		{
			before = null;
		}
		if (!after)
		{
			after = null;
		}
		if (this.link == null)
		{
			this.link = link;
			this.link.prev = link;
			this.link.next = link
			this.linkcount = this.linkcount + 1;
			return;
		}
		else
		{
			if (before == null && after == null)
			{
				before = this.link;
				after = this.link.prev;
			}
			else if (before == null)
			{
				before = after.next;
			}
			else if (after == null)
			{
				after = before.prev;
			}
			else // before != null && after != null
			{
				if (before.prev != after || adter.next != before)
				{
					return;
				}
			}
			
			link.prev = after;
			link.next = before;
			after.next = link;
			before.prev = link;
			
			this.linkcount = this.linkcount + 1;
		}
	}
	
	LinkList.prototype.removeLink = function(link)
	{
		if (link.prev == null || link.next == null)
		{
			return;
		}
		var before = link.prev;
		var after = link.next;

		before.next = after;
		after.prev = before;
		link.prev = null;
		link.next = null;

		if (this.link == link)
		{
			this.link = before;
		}
		if (this.link == link)
		{
			this.link = null;
		}

		this.linkcount = this.linkcount - 1;
	}
	
	LinkList.prototype.getLink = function(uniqueID, m)
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
				break;
			}
			temp = temp.next;
		} while (temp && temp != this.link);
		return temp;
	}
}