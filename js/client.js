(function(){
	//定义客户端
	var Client = 
	{
		//客户端socket
		so:null,
		isFirstConnect:true,
		loggedin: false,
		//当前用户
		user:{"uniqueID": 0, "worldID": 0}
	};

	//连接服务器
	Client.connect = function(host, port)
	{
		var p = port || 80,
		self = this;
		if(this.so == null)
		{
			// socket.io
			this.so = io.connect("http://" + host + ":" + p, {'reconnect':false});
			if(this.so)
			{
				//绑定连接socket事件
				this.so.on("connect", function(){
					self.doConnect();
				});
				//绑定错误处理
				this.so.on("error",function(data){
					this.so = null;
				});
			}
		}
		else
		{
			this.so.socket.reconnect();
		}
	}; 
	//连接事件 
	Client.doConnect = function()
	{
		//如果是第一次连接，注册事件
		 if(this.isFirstConnect)
		 {
			this.isFirstConnect = false;
			this.bindEvent();
		 }
		 else
		 {
			//重新连接
			this.so.socket.reconnect();
		}
	};
	//登陆
	Client.login = function(callback)
	{
		if (this.so != null)
		{
	 		//通知服务端login事件
			this.so.emit("login", {"uniqueID": this.user.uniqueID, "worldID": this.user.worldID}, function(data){
				callback(data);
			});
		}
	};
	//绑定客户端socket事件
	Client.bindEvent = function()
	{
		var self = this;
		//注册创建用户事件
		this.so.on("createclient",function(data){self.doCreateClient(data);});
		//删除用户事件
		this.so.on("removeclient",function(data){self.doRemoveClient(data);});
		///////////////////////////////////////////////////////////////////////
		//注册移动事件
		this.so.on("position",function(data){self.position(data)});
		//注册动作事件
		this.so.on("status",function(data){self.status(data)});
		//注册方向事件
		this.so.on("direction",function(data){self.direction(data)});
		//注册互动事件
		this.so.on("interaction",function(data){self.interaction(data)});
		//注册攻击事件
		this.so.on("attack",function(data){self.attack(data)});
		//注册重生事件
		this.so.on("respawn",function(data){self.respawn(data)});
	};
	//////////////////////////////////////////////////////////////////////////////
	//被动调用
	/////////////////////////////////////////////////////////////////////////////
	//创建用户
	Client.doCreateClient = function(data)
	{
		//alert(data);
		// createclient -> worldID, role{uniqueID, roleString, scale, position{x, y}}, [irole{uniqueID}]
		if (world && world.uniqueID != data.worldID)
		{
			return;
		}
		var role = world.binTree.getRole(data.role.uniqueID);
		if (role == null)
		{
			var role = createRole(data.role.roleString, data.role.scale);
			if (role)
			{
				role.uniqueID = data.role.uniqueID;
				world.addRole(role, Role_Type.Player);
				role.moveFlat(data.role.position.X + world.geometry.X, data.role.position.Y + world.geometry.Y);
				
				if (!data.irole)
				{
					Client.emitEvent("oldclient",  {
						"worldID":world.uniqueID,
						"role":{
							"uniqueID":world.focus.uniqueID,
							"roleString":g_roles["player.txt"],
							"scale":world.focus.scale,
							"position":{
								"X":(world.focus.flatting.X - world.geometry.X),
								"Y":(world.focus.flatting.Y - world.geometry.Y)
							}
						},
						"irole": {
							"uniqueID": role.uniqueID
						}
					});
				}
			}
		}
	}
	//删除用户信息
	Client.doRemoveClient = function(data)
	{
		//alert(data);
		//removeclient -> worldID, role {uniqueID}
		if ( world && world.uniqueID != data.worldID)
		{
			return;
		}
		//var role = world.roles.getLink(data.role.uniqueID));
		var role = world.binTree.getRole(data.role.uniqueID);
		if (role != null)
		{
			world.removeRole(role);
		}
	};
	/////////////////////////////////////////////////////////////////////////////
	//动作事件
	Client.status = function(data)
	{
		//status -> worldID, role{uniqueID, base}
		if (world && world.uniqueID != data.worldID)
		{
			return;
		}
		//var role = world.roles.getLink(data.role.uniqueID);
		var role = world.binTree.getRole(data.role.uniqueID);
		if (role != null)
		{
			role.base = data.role.base;
			role.selectAnimation(role.base + role.direction);
		}
	};
	//方向事件
	Client.direction = function(data)
	{
		//status -> worldID, role{uniqueID, direction}
		if (world && world.uniqueID != data.worldID)
		{
			return;
		}
		//var role = world.roles.getLink(data.role.uniqueID);
		var role = world.binTree.getRole(data.role.uniqueID);
		if (role != null)
		{
			role.direction = data.role.direction;
			role.selectAnimation(role.base + role.direction);
		}
	};
	//移动事件
	Client.position = function(data)
	{
		//position -> worldID, role{uniqueID, position{x, y}}
		if (world && world.uniqueID != data.worldID)
		{
			return;
		}
		//var role = world.roles.getLink(data.role.uniqueID);
		var role = world.binTree.getRole(data.role.uniqueID);
		if (role != null)
		{
			role.moveFlat(data.role.position.X - role.flatting.X + world.geometry.X, data.role.position.Y - role.flatting.Y + world.geometry.Y);
			world.refreshDepth(role);
		}
	};
	//互动事件
	Client.interaction = function(data)
	{
		//interaction -> worldID, role{uniqueID}, irole{uniqueID}
		if (world && world.uniqueID != data.worldID)
		{
			return;
		}
		//var role = world.roles.getLink(data.role.uniqueID);
		var role = world.binTree.getRole(data.role.uniqueID);
		if (role != null)
		{
			if (data.irole)
			{
				var irole = world.binTree.getRole(data.irole.uniqueID);
				//var irole = world.roles.getLink(data.irole.uniqueID);
				role.irole = irole;
			}
			else
			{
				role.irole = null;
			}
		}
	};
	//攻击事件
	Client.attack = function(data)
	{
		//attack -> worldID, role{uniqueID}, irole{uniqueID}
		if (world && world.uniqueID != data.worldID)
		{
			return;
		}
		//var role = world.roles.getLink(data.role.uniqueID);
		var role = world.binTree.getRole(data.role.uniqueID);
		if (role != null)
		{
			if (data.irole)
			{
				var irole = world.binTree.getRole(data.irole.uniqueID);
				//var irole = world.roles.getLink(data.irole.uniqueID);
				role.irole = irole;
			}
			
			if (role.irole)
			{
				if (role.irole.type == Role_Type.Player)
				{
					role.irole.health = data.health;
					role.irole.attacked = 1;
					if (role.irole.health > 0)
					{
						// Sound
						var src = "audio/sword1.wav";
						//alert(src);
						audioSoundEffect.setAudio(src);
						audioSoundEffect.playOrPause();
					}
					else
					{
						// Sound
						var src = "audio/dead1.wav";
						//alert(src);
						audioSoundEffect.setAudio(src);
						audioSoundEffect.playOrPause();
						
						if (role.equal(world.focus))
						{
							role.base = Animation_Base.Still;
							role.selectAnimation(role.base, role.direction);
							Client.emitClientEvent("status", {
								"worldID": world.uniqueID,
								"role": {
									"uniqueID": role.uniqueID,
									"base":role.base
								}
							});
						}
						
						if (role.irole.equal(world.focus))
						{
							Client.emitClientEvent("respawn", {
								"worldID": world.uniqueID,
								"role": {
									"uniqueID": role.irole.uniqueID
								}
							});
						}
					}
				}
				else
				{
					role.irole.health -= data.damage;
					role.irole.attacked = 1;
					if (role.irole.health > 0)
					{
						// Sound
						var src = "audio/trunc" + Math.ceil(Math.random() * 3) + ".wav";
						//alert(src);
						audioSoundEffect.setAudio(src);
						audioSoundEffect.playOrPause();
					}
					else
					{
						var src = "";
						if (role.irole.scale > 1)
						{
							// Sound
							src = "audio/down1.wav";
						}
						else
						{
							// Sound
							src = "audio/down2.wav";
						}
						//alert(src);
						audioSoundEffect.setAudio(src);
						audioSoundEffect.playOrPause();
							
						role.irole.base  = Animation_Base.Dead;
						role.irole.selectAnimation(role.irole.base + role.irole.direction);
						
						if (role.equal(world.focus))
						{
							role.base  = Animation_Base.Still;
							role.selectAnimation(role.base + role.direction);
							Client.emitClientEvent("status", {
								"worldID": world.uniqueID,
								"role": {
									"uniqueID": role.uniqueID,
									"base":role.base
								}
							});
						}
					}
				}
			}
		}
	};
	Client.respawn = function(data)
	{
		//respawn -> worldID, role{uniqueID}
		if (world && world.uniqueID != data.worldID)
		{
			return;
		}
		//var role = world.roles.getLink(data.role.uniqueID);
		var role = world.binTree.getRole(data.role.uniqueID);
		if (role != null)
		{
			if (role.equal(world.focus))
			{
				role.moveFlat(Math.random() * 3400 - role.flatting.X + world.geometry.X, Math.random() * 1000 - role.flatting.Y + world.geometry.Y);
				role.base = Animation_Base.Still;
				role.selectAnimation(role.base + role.direction);
				role.attacked = 0;
				world.refreshDepth(role);
				role.center();
			
				Client.emitClientEvent("position", {
					"worldID":world.uniqueID,
					"role":{
						"uniqueID": role.uniqueID,
						"position": {
							"X": (role.flatting.X - role.world.geometry.X) ,
							"Y": (role.flatting.Y - role.world.geometry.Y)
						}
					}
				});
			}
		}
	}
	//////////////////////////////////////////////////////////////////////////////
	//主动调用
	/////////////////////////////////////////////////////////////////////////////
	//发送事件
	Client.emitEvent = function(eventName, data)
	{
		if (!data)
		{
			data = {};
		}
		data.random = Math.random() * 1000;
	  	this.so.emit(eventName, data);
	};
	//发送用户事件
	Client.emitClientEvent = function(eventName, data)
	{
		if (!data)
		{
			data = {};
		}
		data.random = Math.random() * 1000;
	  	this.so.emit("clientEvent", {"eventName": eventName, "data": data});
	};
	/////////////////////////////////////////////////////////////////////////////
	
	window.Client = Client;
}())