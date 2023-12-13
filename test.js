const ws = require("ws")

const socket = new ws("wss://localhost-njg5.onrender.com")


const restFunctions = []

function get(route, responseFunction){
		
}

const rest = {

	
}

const task = {
	
}

function listen(auth){

	socket.on("open", () => {

	
		socket.send(JSON.stringify({
			method:"server-log",
			data:{
				id:auth.id,
				secret:auth.secret
			}
		}))
	})

	setInterval(() => {
		socket.send(JSON.stringify({
			method:"keepalive",
			data:{}
		}))
	}, 5000)
}

const app = {
	rest,
	task,
	listen
}




socket.on("message", msg => {

	msg = JSON.parse(msg.toString())


	let {method, data} = msg;

	console.log(msg)	

	if(method === "client-req"){

		
		restFunctions.forEach(restFunction => {
			
			const {route, func} = restFunction

			let response = func(route)	
									
			socket.send(JSON.stringify({
				method:"server-res",
				data:{
					requestid:data.requestid,
					response	
				}
			}))						
		
		})

	}
	
})


app.listen({
	id:"host-1"
})
