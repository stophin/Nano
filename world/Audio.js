//Audio.js
//Stophin
//20160508

function Audio(id, src) {
	if (!src) src = "";
	this.audio = document.getElementById(id);
	this.audio.src = src;
	
	Audio.prototype.setAudio = function(src){
		this.audio.src = src;
	}
	Audio.prototype.playOrPause = function(){
		if(this.audio.paused){
			this.audio.play();
			return;
		}
		this.audio.pause();
	}
	Audio.prototype.stop = function() {
		this.audio.stop();
	}
	
	Audio.prototype.vol = function(type){
		if(type == 'up'){
			var volume = this.audio.volume  + 0.1;
			if(volume >=1 ){
				volume = 1 ;
			}
			this.audio.volume = volume;
		}else if(type == 'down'){
			var volume = this.audio.volume  - 0.1;
			if(volume <=0 ){
				volume = 0 ;
			}
			this.audio.volume =  volume;
		}
	}
	Audio.prototype.muted = function(){
		if(this.audio.muted){
			this.audio.muted = false;
		}else{
			this.audio.muted = true; ;
		}
	}
}