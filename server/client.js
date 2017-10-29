(function(){
	//定义客户端操作对象
	var Client = function(server,socket)
	{
		//绑定服务器
		this.srv = server;
		//绑定的socket
		this.so = socket;
		//用户信息
		this.user = {"uniqueID": 0, "worldID": 0, damage: 0, protect: 0, health: 0};
		//绑定事件
		this.bindEvent();
		
		this.prev = null;
		this.next = null;
		this.uniqueID = 0;
	};
	//定义客户端各操作函数
	Client.prototype = {
		//绑定事件
		bindEvent:function()
		{
			if(this.so)
			{
				var self = this;
				//注册断开连接事件
				this.so.on("disconnect",function(){self.doDisconnect();});
				//注册登陆事件
				this.so.on("login",function(data,fn){self.doLogin(data,fn);});
				//注册连接事件
				this.so.on("connect",function(data){self.doConnect(data);});
				//注册老用户连接事件
				this.so.on("oldclient",function(data){self.doOldClient(data);});
				/////////////////////////////////////////////////////////////////////////////
				//绑定用户事件
				this.so.on("clientEvent",function(data){self.broadcastEvent(data);});
			}
		},
		//处理连接事件
		doConnect:function(data)
		{
			this.so.broadcast.emit("createclient",data);
		},
		//处理断开连接
		doDisconnect:function()
		{
			this.srv.log(this.so.id + ": (remove) " + "client logout:" + this.user.uniqueID + "@" + this.user.worldID);
			var tmp = this.srv.removeClientByID(this.so.id);
			if (tmp)
			{
				this.srv.broadcastEvent("removeclient", {
					"worldID":this.user.worldID,
					"role":{
						"uniqueID":this.user.uniqueID
					}
				});
			}
		},
		//处理用户登录
		doLogin:function(data, fn)
		{
			if(data)
			{
				var isExists = this.srv.isUserExists(this);
				//通知客户端;
				if(isExists)
				{
					this.user.uniqueID = data.uniqueID;
					this.user.worldID = data.worldID;
					
					this.doRespawn(data);
					
					this.srv.log(this.so.id + ":" + "client login:" + this.user.uniqueID + "@" + this.user.worldID);
					fn(0);
				} 
				else 
	        	{
					this.srv.log(this.so.id + ": (not existed) " + "client logout:" + this.user.uniqueID + "@" + this.user.worldID);
					fn(1);
					this.srv.removeClientByID(this.so.id);
				}
			}        
		},
		//处理老用户连接事件
		doOldClient:function(data)
		{
			//this.srv.log(data);
			
			if (data.irole)
			{
				var user = this.srv.findUser({"uniqueID": data.irole.uniqueID, "worldID": data.worldID});
				if (user)
				{
					this.srv.log(user.user.uniqueID);
					
					user.so.emit("createclient", data);
				}
			}
		},
		///////////////////////////////////////////////////////
		//处理用户事件
		doRespawn:function(data)
		{
			//Get damage and protect and so on from DB
			// TODO
			this.user.damage = 100;
			this.user.health = 500;
		},
		broadcastEvent:function(data)
		{
			this.srv.log(data);
			if (data.eventName == "attack")
			{
				var user = this.srv.findUser({"uniqueID": data.data.role.uniqueID, "worldID": data.data.worldID});
				iuser = this.srv.findUser({"uniqueID": data.data.irole.uniqueID, "worldID": data.data.worldID});
				
				if (user)
				{
					this.srv.log(user.user.uniqueID);
					
					data.data.damage = user.user.damage;
					
					if (iuser)
					{
						this.srv.log(iuser.user.uniqueID);
						
						iuser.user.health -= data.data.damage;
						data.data.health = iuser.user.health;
					}
				}
				
				// Broadcast to all user including the sender
				this.srv.broadcastEvent(data.eventName, data.data);
			}
			else if (data.eventName == "respawn")
			{
				console.log(data);
			
				var user = this.srv.findUser({"uniqueID": data.data.role.uniqueID, "worldID": data.data.worldID});
				if (user)
				{
					user.doRespawn(data.data);
				}
				else
				{
					this.doRespawn(data.data);
				}
				
				// Broadcast to all user including the sender
				this.srv.broadcastEvent(data.eventName, data.data);
			}
			else
			{
				// Broadcast to other user except for the sender
				this.so.broadcast.emit(data.eventName, data.data);
			}
		}
	}
	//输出模块
	exports.newClient = function(server, socket)
	{
		return new Client(server,socket);
	}
}())