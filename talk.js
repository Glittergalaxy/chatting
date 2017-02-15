var express = require('express'),
	io = require('socket.io');

var app = express();

app.use(express.static(__dirname));

var server = app.listen(8888);
var ws = io.listen(server);

ws.on('connection',function(client){
	console.log('some one is connect');
	//有新人加入时校验昵称
	client.on('join',function(msg){
		if(checkNickname(msg)){
			client.emit('nickname','昵称有重复');
		}else{
			client.nickname = msg;
			ws.sockets.emit('annoucement','系统',msg+'加入');
		}
	});

	client.on('send.message',function(msg){
		client.broadcast.emit('send.message',client.nickname,msg);
	})

	client.on('disconnect',function(){
		if(client.nickname){
			client.broadcast.emit('send.message','系统',client.nickname + 'go out');
		}
	})
})

var checkNickname = function(name){
	for(var k in ws.sockets.sockets){
		if(ws.sockets.sockets.hasOwnProperty(k)){
			if(ws.sockets.sockets[k] && ws.sockets.sockets[k].nickname == name){
				return true;
			}
		}
	}
	return false;
}