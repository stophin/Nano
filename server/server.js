(function(){ 
	//导入客户端模块
	var cli = require("./client");
	var lnk = require("./LinkList");
	var http=require("http");
	//定义服务端
	var Server = function(){
		//绑定的io对象
		this.io = null;
		//记录所有的客户端
		this.clients = lnk.newLinkList();
	};
	Server.prototype = {
		log:function(data)
		{
			console.log(data);
		},
		listen:function(port)
		{
			var srv = http.createServer(function(req, rep){
			});
			srv.setTimeout(10000);
			this.io = require("socket.io").listen(srv);
			//设置日志级别
			this.io.set('log level', 1);
			srv.listen(port);
			this.bindEvent();
		},
		//绑定事件
		bindEvent:function()
		{
			var self = this;
			//注册连接事件 
			this.io.sockets.on("connection", function(socket){self.doConnect(socket)});
		},
		//连接事件 
		doConnect:function(socket)
		{
			this.addClient(socket);
		},
		//添加一个socket客户端
		addClient:function(socket)
		{
			var client = cli.newClient(this, socket);
			client.uniqueID = socket.id;
			this.clients.insertLink(client);
			
			this.log(socket.id + ": " + "add new client: " + client.uniqueID);
		},
		//移出一个socket客户端
		removeClientByID:function(sID)
		{
			var tmp = this.clients.getLinkExternal(function(temp) {
				return temp.uniqueID == sID;
			});
			
			if (tmp)
			{
				this.log(tmp.uniqueID + "->" + tmp.uniqueID);
				
				this.clients.removeLink(tmp);
				
				this.log(tmp.uniqueID + " removed");
			}
			else
			{
				this.log(sID + "-> not found");
			}
			
			return tmp;
		},
		//判断用户是否存在
		isUserExists:function(client)
		{
			var tmp = this.clients.getLinkExternal(function(temp) {
				return temp.uniqueID == client.uniqueID;
			});
			
			if (tmp)
			{
				this.log(client.uniqueID + "->" + tmp.uniqueID);
			}
			else
			{
				this.log(client.uniqueID + "-> not found");
			}
			
			return tmp;
		},
		//查找用户
		findUser:function(user)
		{
			this.log( this.clients.linkcount);
			
			var tmp = this.clients.getLinkExternal(function(temp) {
				return temp.user.uniqueID == user.uniqueID && temp.user.worldID == user.worldID;
			});
			
			if (tmp)
			{
				this.log(user.uniqueID + "->" + tmp.user.uniqueID + "@" + user.worldID);
			}
			else
			{
				this.log(user.uniqueID + "-> not found" + "@" + user.worldID);
			}
			
			return tmp;
		},
		//广播消息
		broadcastMsg:function(msg)
		{
			this.io.sockets.send(msg);
		},
		//广播事件
		broadcastEvent:function(eventName, data)
		{
			this.io.sockets.emit(eventName, data);
		}
	}
	
	//启动服务
	new Server().listen(9005);
}())
