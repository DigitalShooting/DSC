var socket = io()
socket.on('newData', function(data){
	console.log(data)
	// $("#logs .box").append( data+" " )
});
