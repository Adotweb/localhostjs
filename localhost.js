const ws = require("ws")
const fs = require("fs")

const socket = new ws("wss://localhost-njg5.onrender.com/")
//const socket = new ws("ws://localhost:5000")




const routes = {
}


function constructRoute(route, method, func){
	let P = route.split("/").map(s => "/" + s) 

	let C = routes

	for(let i = 0; i < P.length; i++){
		routes[P[i]] = {}	
		C = routes[P[i]]		
	}	

	console.log(C)

	C[method] = func

	console.log(C)
}

constructRoute("/", "get", () => {})

const route1 = "/"

const getRoutes = new Map();

const postRoutes = new Map();

function get(route, responseFunction){

//	let routePath = route.split("/").map(s => "/" + s)

	




	getRoutes.set(route, responseFunction)	
}


function post(route, responseFunction){
	postRoutes.set(route, responseFunction)
}

	
let clients = new Map()


function static(){
	

}

const rest = {
	get,
	post,
	static
}

const clientChangeFunctions = []
function onClientChange(func){
	clientChangeFunctions.push(func)
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

function send(d){


	

	socket.send(JSON.stringify({
		method:"server-ws",
		data:d	
	}))
}

const server = {
	send
}

const app = {
	onClientChange,
	rest,
	listen,
	clients,
	server	
}
socket.on("message", msg => {

	msg = JSON.parse(msg.toString())


	let {method, data} = msg;


	
	if(method==="connect-client"){

		const {clientid} = data; 


		clients.set(clientid, {})

		clientChangeFunctions.forEach(f => f(clients))
	}

	if(method === "disconnect-client"){
		const {clientid} = data;

		clients.delete(clientid)
			
		clientChangeFunctions.forEach(f => f(clients))
	}


	if(method === "client-req"){

		
		const {route, requestid, method, request} = data; 

		const res = {};

		console.log(route)

		const req = {
			...request, 
			method, 
		}

		
		res.send = (response) => {
			socket.send(JSON.stringify({
				method:"server-res",
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

			if(!routeHandler) {
				
				res.send({
					err:404
				})
				return
			}

			routeHandler(req, res)
		}
		if(method ==="post"){
			let routeHandler = postRoutes.get(route)

			if(!routeHandler) {
				res.send({
					err:404
				})
			} 

			routeHandler(req, res)
		}


		if(method === "task"){
			let computeFunction = computeFunctions.get(route) 

			if(!computeFunction) return; 


			

			computeFunction(req, taskres)
		}
			
				
		

	}
	
})


module.exports =  app
