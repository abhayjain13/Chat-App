var port = process.env.port;
var http=require('http').createServer(createServer).listen(port);
var io=require('socket.io')(http);
var fs=require('fs');

function createServer(req,res){
fs.readFile('index.html',function(err,data){
if(err){
    return;
}
res.write(data);
res.end();
});
}

var skt=[];
var totalUser=0;
var user=[];

io.on('connection',function(socket){
    console.log("Connected");
    io.emit('connected');
    skt.push(socket);
    socket.on('send',function(data){
    for(var i=0;i<skt.length;i++){
        if(skt[i].id==data.from){
        skt[i].emit('receive',data);
        }
    }
    });

    socket.on('saveUser',function(name){
        totalUser++;
        user.push({name:name,chatId:socket.id});
        for(var i=0;i<skt.length;i++){
            skt[i].emit('getActiveUsers',user);
        }
    });

    socket.on('typing_from',function(name){
        for(var i=0;i<skt.length;i++){
            skt[i].emit('typing',name+" is typing...");
        }   
    });

});



