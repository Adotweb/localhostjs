const ws = require("ws")
const express = require("express"); 

const eapp = express()
const bodyparser = require("body-parser")
const cookieparser = require("cookie-parser")

eapp.use(express.json())
eapp.use(bodyparser())
eapp.use(cookieparser())

let socket = null

let soc = {


	listeners : new Map(),
	on: (event, func) => {


		let current = soc.listeners.get(event)

		if(current){
			soc.listeners.set(event, [...current, func])
		}else{
			soc.listeners.set(event, [func])
		}


	},
	send:() => {}
}

const {BSON} = require("bson")

const rest = eapp 



function listen(auth, url, dev){
	
	eapp.listen(3999)

	if(dev) return

	if(!url) url = "wss://localhost-njg5.onrender.com/";

	socket = new ws(url)

	


	socket.Send = msg => socket.send(JSON.stringify(msg))

	soc.send = (event, data, receivers=[]) => {
	


		socket.Send({

			event:"ws.message.toclient",
			data:{
				event,
				data,
				clientList:receivers
			}

		})

	}

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
		
			case "toclient.failed":
				throw new Error("toclient failed!");
			case "ws.message.tohost":
					
			
				

				let funcs = soc.listeners.get(data.event) 

				delete data.event; 

				if(!funcs) {break};

				funcs.forEach(func => func(data.data))

				break;


			case "server.login.unauthorized":

				throw new Error(msg.event);


			case "client.rest.request":


				const {method, request, route, requestid} = data	



				switch(method){
					
					case "GET": 

						response = await fetch("http://localhost:3999" + route, {

							headers: request.headers

						})
				
						break;


					case "POST":

						response = await fetch("http://localhost:3999" + route, {
							method:"POST",
							headers:{
								"Content-Type":"application/json"
							},
							body:JSON.stringify(request.body)
						})

						break;
				}



										

				let {headers, redirected, status, ok, statusText, url, type} = response

				console.log(headers)
				headers = Object.fromEntries(headers.entries());
					

				const meta = {headers, redirected, status, ok, statusText, url, type}		
				


				response = await response.arrayBuffer();
				
				response = {buf:[...new Uint8Array(response)], meta}

				socket.Send({

					event:"host.rest.response",
					data:{
						requestid,
						response
					}

				})

				break;		}
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
	socket:soc,
	listen,
}

module.exports = app

//should evaluate to 
