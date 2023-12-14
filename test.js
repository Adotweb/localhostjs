const ws = require("ws")

const socket = new ws("ws://localhost:5000")



const routes = new Map()

function get(route, responseFunction){
	routes.set(route, responseFunction)	
}

const rest = {
	get,
	
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


	if(method === "client-req"){

		
		const {route, requestid} = data; 

				

		if(!routes.has("/" + route)){
			
				
			socket.send(JSON.stringify({
				method:"server-res",
				data:{
					response:{
						err:"no such route"
					},
					requestid
				}
			}))

			return
		}
		
		let response = routes.get("/" + route)()
		
		socket.send(JSON.stringify({
			method:"server-res",
			data:{
				response,
				requestid
			}
		}))	

	}
	
})



app.rest.get("/get", () => {
	
	const t = Date.now()

	return {t}
})


app.listen({
	id:"host-1",
	secret:"secret-1"
})
