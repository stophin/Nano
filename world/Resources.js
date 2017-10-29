//Resources.js
//Stophin
//20160417

function Resources(filename, resourceID)
{
	this.image = new Image();
	this.image.src = filename;
	this.width = this.image.width;
	this.height = this.image.height;
	
	this.uniqueID = resourceID;
	this.prev = null;
	this.next = null;
}