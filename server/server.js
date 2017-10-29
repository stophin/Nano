(function(){ 
	//����ͻ���ģ��
	var cli = require("./client");
	var lnk = require("./LinkList");
	var http=require("http");
	//��������
	var Server = function(){
		//�󶨵�io����
		this.io = null;
		//��¼���еĿͻ���
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
			//������־����
			this.io.set('log level', 1);
			srv.listen(port);
			this.bindEvent();
		},
		//���¼�
		bindEvent:function()
		{
			var self = this;
			//ע�������¼� 
			this.io.sockets.on("connection", function(socket){self.doConnect(socket)});
		},
		//�����¼� 
		doConnect:function(socket)
		{
			this.addClient(socket);
		},
		//���һ��socket�ͻ���
		addClient:function(socket)
		{
			var client = cli.newClient(this, socket);
			client.uniqueID = socket.id;
			this.clients.insertLink(client);
			
			this.log(socket.id + ": " + "add new client: " + client.uniqueID);
		},
		//�Ƴ�һ��socket�ͻ���
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
		//�ж��û��Ƿ����
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
		//�����û�
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
		//�㲥��Ϣ
		broadcastMsg:function(msg)
		{
			this.io.sockets.send(msg);
		},
		//�㲥�¼�
		broadcastEvent:function(eventName, data)
		{
			this.io.sockets.emit(eventName, data);
		}
	}
	
	//��������
	new Server().listen(9005);
}())
