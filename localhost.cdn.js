function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}



let socket = {

	register: (url) => {
		
		let id = crypto.randomUUID()
		
		socket.id = id

		if(!url){

			url = window.location.href.replace(window.location.protocol, window.location.protocol == "https:" ? "wss:" : "ws:")

		}
		socket.connection = new WebSocket(url)		
		
		socket.connection.onopen = () => {


			socket.connection.send(JSON.stringify({
				
				event:"client.login",
				data:{
					id
				}

			}))
			

			socket.onopens.forEach(func => func())
		}


		socket.connection.onmessage = msg => {

			const {event, data} = JSON.parse(msg.data)


			socket.ons.forEach(on => {
				
				if(event === on._event){

					on.func(data)
				}
			})


		}

	},
	onopens:[],
	onopen: (func) => socket.onopens.push(func),
	connection: undefined,
	ons:[],
	on: (_event, func) => {
		socket.ons.push({
			_event,
			func
		})
	},
	sendToServer:(event, data, receiver) => {
		
		let cookie = getCookie("currenthost");

		if(!receiver && cookie){

			receiver = cookie

		}else{
			throw new Error("send needs receiver!")
		}

	
		socket.connection.send(JSON.stringify({

			event:"ws.message.tohost",
			data:{
				event,
				data,
				host:receiver,
			}
				
		}))
	

	}


}
