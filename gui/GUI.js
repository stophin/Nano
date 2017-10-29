//GUI.js
//Stophin
//20160904

function GUI() {
	this.components = new LinkList();

	GUI.prototype.addComponent = function(comp) {
		this.components.insertLink(comp);
	}
	GUI.prototype.getComponent = function(uniqueID) {
		return this.components.getLink(uniqueID);
	}
	GUI.prototype.isin = function(x, y) {
		this.drag = null;
		if (this.components.link) {
			var temp = this.components.link;
			var bin = 0;
			do
			{
				if (temp.geom.atPointXY(x, y)) {
					this.drag = temp;
					return 1;
				}

				temp = temp.next;
			} while (temp && temp != this.components.link);
		}
		return 0;
	}
	this.drag = null;
	this.start = new PointF();
	this.isDrag = 0;
	GUI.prototype.onDrag = function(x, y, mode) {
		if (!this.drag) {
			return;
		}
			if (mode == 1)
			{
                if (this.drag.mode == 1) {
                    this.start.X = x - this.drag.offset.X;
                    this.start.Y = y - this.drag.offset.Y;
                } else {
                    this.start.X = x - this.drag.geom.X;
                    this.start.Y = y - this.drag.geom.Y;
                }
			}
			else if (mode == 2)
			{
				if (this.start.X != 0 || this.start.Y != 0)
				{
                    if (this.drag.mode == 1) {
                        this.drag.offset.Y = y  - this.start.Y;
                        this.drag.scroll(this.start.Y - y );
                    } else {
                        this.drag.geom.Y = y  - this.start.Y;
                        this.drag.geom.X = x  - this.start.X;
                    }
                    this.isDrag = 1;
				}
			}
			else
			{
                if (this.drag.offset.Y < this.drag.geom.Height -  this.drag.end) {
                    this.drag.offset.Y = this.drag.geom.Height - this.drag.end;
                    this.drag.scroll(this.drag.end - this.drag.geom.Height);
                } else if (this.drag.offset.Y > 0) {
                    this.drag.offset.Y = 0;
                }
				this.start.X = 0;
				this.start.Y = 0;
			}
	}
	GUI.prototype.onWheel = function(delta) {
	    if (!this.drag) {
	        return;
        }
	    if (this.drag.mode == 1) {
            gui.onDrag(0, delta, 1);
            var imgH = 1;
            var temp = this.drag.linkStart || this.drag.linkList.link;
            if (temp) {
                imgH = this.drag.geom.Width * temp.image.height / temp.image.width;
            }
            gui.onDrag(0, delta + imgH * delta, 2);
            gui.onDrag(0, 0, 0);
        }
    }
	GUI.prototype.update = function() {
		if (this.components.link) {
			var temp = this.components.link;
			do
			{
				temp.show();

				temp = temp.next;
			} while (temp && temp != this.components.link);
		}
	}
}