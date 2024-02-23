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

		soc.listeners.set(event, [...soc.listeners.get(event), func])

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

				if(funcs.length > 0);

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
					

						let type = response.headers.get("Content-Type")


						response = await response.arrayBuffer();
				
						response = {type, buf:[...new Uint8Array(response)]}


						break;


					case "POST":

						response = await fetch("http://localhost:3999" + route, {
							method:"POST",
							headers:{
								"Content-Type":"application/json"
							},
							body:JSON.stringify(request.body)
						})
						

						response = await response.text()



						try {
							response = JSON.parse(response)
						}catch(e){

						}

				}



				

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
