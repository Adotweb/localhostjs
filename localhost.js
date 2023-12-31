const ws = require("ws")
const express = require("express"); 

const eapp = express()
const bodyparser = require("body-parser")
const cookieparser = require("cookie-parser")

eapp.use(express.json())
eapp.use(bodyparser())
eapp.use(cookieparser())
let socket = null


const rest = eapp


function listen(auth, url){
	if(!url) url = "wss://localhost-njg5.onrender.com/";

	socket = new ws(url)

	eapp.listen(3999)



	socket.Send = msg => socket.send(JSON.stringify(msg))

	socket.onopen = () => {

		socket.Send(({

			event:"host.login",
			data:auth

		}))


	}

	socket.onmessage = async msg => {

		msg = JSON.parse(msg.data)	
	
		const {event, data} = msg
		

		switch(event){


			case "server.login.unauthorized":

				throw new Error(msg.event);


			case "client.rest.request":


				let {method, request, route, requestid} = data	

				method = method.toUpperCase();


				let res = await fetch("http://localhost:3999" + route, {
					headers:request.headers, 
					method,
					body:method=="POST" ? request.body : undefined,

				}) 
	

				console.log(res)

				res = await res.text();
				socket.Send({

					event:"host.rest.response",
					data:{
						requestid,
						response:res
					}

				})

				break;
		}
	}

	setInterval(() => {

		socket.Send(({

			event:"keepalive",
			data:{}

		}))

	}, 3000)

}






const app = {
	express,	
	rest, 
	listen,
}

module.exports = app

//should evaluate to 
