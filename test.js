const ws = require("ws")

const socket = new ws("wss://localhost-njg5.onrender.com")


socket.on("open", () => {
	socket.send(JSON.stringify({
		method:"server-log", 
		data:{
			id:"host-1"
		}
	}))
})

socket.on("message", msg => {

	msg = JSON.parse(msg.toString())

	
	let {method, data} = msg;

	if(method === "client-req"){


		socket.send(JSON.stringify({
			method:"server-res",
			data:{
				requestid:data.requestid,
				response:"hello there"
			}
		}))
	}
	

	console.log(msg)
})

setInterval(() => {

	socket.send(JSON.stringify({
		method:"keepalive", 
		data:{}
	}))

}, 3000)
