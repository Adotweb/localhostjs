const ws = require("ws")
const fs = require("fs")
const socket = new ws("ws://localhost:5000")



const getRoutes = new Map();

const postRoutes = new Map();

function get(route, responseFunction){
	getRoutes.set(route, responseFunction)	
}


function post(route, responseFunction){
	postRoutes.set(route, responseFunction)
}




const rest = {
	get,
	post	
}

const computeFunctions = new Map();

function compute(route, computeFunction){
	computeFunctions.set(route, computeFunction)
}

const task = {
	compute	
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

		
		const {route, requestid, method, request} = data; 

		const res = {};

		res.send = (response) => {
			socket.send(JSON.stringify({
				method:"server-res",
	res.sendFile(path.join(__dirname), "get.html")
				data:{
					response,
					requestid
				}
			}))

		}

		res.sendFile = (path) => {
			let file = fs.readFileSync(path, "utf8");

			res.send(file)
		}

		

		let taskres = {};
					
		taskres.send = (response) => {
			socket.send(JSON.stringify({
				method:"server-res",
				data:{
					response,
					address:data.address
				}
			}))
		}	
		
		if(method === "get"){
			let routeHandler = getRoutes.get(route)

			if(!routeHandler) return

			routeHandler(request, res)
		}
		if(method ==="post"){
			let routeHandler = postRoutes.get(route)

			if(!routeHandler) return 

			routeHandler(request, res)
		}


		if(method === "task"){
			let computeFunction = computeFunctions.get(route) 

			if(!computeFunction) return; 


			

			computeFunction(request, taskres)
		}
			
				
		

	}
	
})


module.exports =  app
