const ws = require("ws")



function appGenerator(){
		
	const url = "wss://localhost-njg5.onrender.com"
	
	let socket;	

	function listen(auth_obj){
		
		
		socket = 	

	}

	const rest = {
		get:(route, resFunc) => {
				
		} 
	}

	const task = {
		compute:(route, resFunc) => {

		}
	}

	return {
		listen, 
		rest,
		task
	}
}



module.exports = appGenerator()


const app = appGenerator();

app.rest.get("/", (req, res) => {
	
})

app.task.compute("/compute", (payload, response) => {
	
		
	response.send({body:"Hello there"})
})

app.ws.on("")

app.ws.send({
	
})

