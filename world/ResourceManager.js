//ResourceManager.js
//Stophin
//20160417

function ResourceManager()
{
	this.resource = new LinkList();
	ResourceManager.prototype.addResource = function(resource)
	{
		this.resource.insertLink(resource);
	}
	ResourceManager.prototype.createResource = function(filename, resourceID)
	{
		return new Resources(filename, resourceID);
	}
	ResourceManager.prototype.getResource = function(resourceID)
	{
		return this.resource.getLink(resourceID);
	}
	ResourceManager.prototype.removeResource = function(resourceID)
	{
		var resource = this.resource.getLink(resourceID);
		if (resource == null)
		{
			return null;
		}
		this.resource.removeLink(resource);
		return resource;
	}
}