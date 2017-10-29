(function(){
	//����ͻ���
	var Client = 
	{
		//�ͻ���socket
		so:null,
		isFirstConnect:true,
		loggedin: false,
		//��ǰ�û�
		user:{"uniqueID": 0, "worldID": 0}
	};

	//���ӷ�����
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
				//������socket�¼�
				this.so.on("connect", function(){
					self.doConnect();
				});
				//�󶨴�����
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
	//�����¼� 
	Client.doConnect = function()
	{
		//����ǵ�һ�����ӣ�ע���¼�
		 if(this.isFirstConnect)
		 {
			this.isFirstConnect = false;
			this.bindEvent();
		 }
		 else
		 {
			//��������
			this.so.socket.reconnect();
		}
	};
	//��½
	Client.login = function(callback)
	{
		if (this.so != null)
		{
	 		//֪ͨ�����login�¼�
			this.so.emit("login", {"uniqueID": this.user.uniqueID, "worldID": this.user.worldID}, function(data){
				callback(data);
			});
		}
	};
	//�󶨿ͻ���socket�¼�
	Client.bindEvent = function()
	{
		var self = this;
		//ע�ᴴ���û��¼�
		this.so.on("createclient",function(data){self.doCreateClient(data);});
		//ɾ���û��¼�
		this.so.on("removeclient",function(data){self.doRemoveClient(data);});
		///////////////////////////////////////////////////////////////////////
		//ע���ƶ��¼�
		this.so.on("position",function(data){self.position(data)});
		//ע�ᶯ���¼�
		this.so.on("status",function(data){self.status(data)});
		//ע�᷽���¼�
		this.so.on("direction",function(data){self.direction(data)});
		//ע�ụ���¼�
		this.so.on("interaction",function(data){self.interaction(data)});
		//ע�ṥ���¼�
		this.so.on("attack",function(data){self.attack(data)});
		//ע�������¼�
		this.so.on("respawn",function(data){self.respawn(data)});
	};
	//////////////////////////////////////////////////////////////////////////////
	//��������
	/////////////////////////////////////////////////////////////////////////////
	//�����û�
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
	//ɾ���û���Ϣ
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
	//�����¼�
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
	//�����¼�
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
	//�ƶ��¼�
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
	//�����¼�
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
	//�����¼�
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
	//��������
	/////////////////////////////////////////////////////////////////////////////
	//�����¼�
	Client.emitEvent = function(eventName, data)
	{
		if (!data)
		{
			data = {};
		}
		data.random = Math.random() * 1000;
	  	this.so.emit(eventName, data);
	};
	//�����û��¼�
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