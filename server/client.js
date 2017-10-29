(function(){
	//����ͻ��˲�������
	var Client = function(server,socket)
	{
		//�󶨷�����
		this.srv = server;
		//�󶨵�socket
		this.so = socket;
		//�û���Ϣ
		this.user = {"uniqueID": 0, "worldID": 0, damage: 0, protect: 0, health: 0};
		//���¼�
		this.bindEvent();
		
		this.prev = null;
		this.next = null;
		this.uniqueID = 0;
	};
	//����ͻ��˸���������
	Client.prototype = {
		//���¼�
		bindEvent:function()
		{
			if(this.so)
			{
				var self = this;
				//ע��Ͽ������¼�
				this.so.on("disconnect",function(){self.doDisconnect();});
				//ע���½�¼�
				this.so.on("login",function(data,fn){self.doLogin(data,fn);});
				//ע�������¼�
				this.so.on("connect",function(data){self.doConnect(data);});
				//ע�����û������¼�
				this.so.on("oldclient",function(data){self.doOldClient(data);});
				/////////////////////////////////////////////////////////////////////////////
				//���û��¼�
				this.so.on("clientEvent",function(data){self.broadcastEvent(data);});
			}
		},
		//���������¼�
		doConnect:function(data)
		{
			this.so.broadcast.emit("createclient",data);
		},
		//����Ͽ�����
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
		//�����û���¼
		doLogin:function(data, fn)
		{
			if(data)
			{
				var isExists = this.srv.isUserExists(this);
				//֪ͨ�ͻ���;
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
		//�������û������¼�
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
		//�����û��¼�
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
	//���ģ��
	exports.newClient = function(server, socket)
	{
		return new Client(server,socket);
	}
}())