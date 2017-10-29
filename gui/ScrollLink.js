//ScrollLink.js
//Stophin
//20160904

function ScrollLink(linkList, start, width, height, uniqueID) {
	if (!uniqueID) {
		uniqueID = 100;
	}
	this.mode = 1;
	this.uniqueID = uniqueID;
	this.linkList = linkList;		// make sure your link list has image element
	this.linkStart = this.linkList.link;
	this.distanceY = 0;
	this.start = start;
	this.end = 0;
	this.offset = new PointF(0, 0);
	this.geom = new RectF(0, 0, width, height);
	ScrollLink.prototype.show = function(){
		var g = graphics.getContext("2d");
		g.fillRect(this.geom.X, this.geom.Y, this.geom.Width, this.geom.Height);
		if (this.linkList.link) {
			var ratY = 0;
			var temp = this.linkStart || this.linkList.link;
			var disY = this.distanceY;
			this.end = disY;
			do
			{
				ratY = this.geom.Width * temp.image.height / temp.image.width;
				if (disY <= this.start - ratY) {
				} else if (disY < this.start + this.geom.Height) {
					if (!this.linkStart) {
						this.linkStart = temp;
						this.distanceY = disY;
					}
					g.drawImage(temp.image, 0, 0, temp.image.width, temp.image.height,
						this.geom.X + this.offset.X, this.geom.Y + this.offset.Y + disY, this.geom.Width, ratY);
				} else {
				}
				this.end += ratY;
				disY += ratY;
				temp = temp.next;
			} while (temp && temp != this.linkList.link);
		}
	}
	ScrollLink.prototype.scroll = function(dir, skip) {
		if (!skip || skip <= 0) {
			skip = 1;
		}
		var jump = dir * skip;
		this.start = jump;
		if (this.start < 0) {
			this.start = 0;
		} else if (this.start > this.end - this.geom.Height) {
			this.start = this.end - this.geom.Height;
		} else {
		}
		this.linkStart = null;
		this.distanceY = 0;
	}
	ScrollLink.prototype.spread = function(height) {
		if (!height || height <= 0) {
			height = this.geom.Height;
		}
		this.geom.Height = height;
	}
}