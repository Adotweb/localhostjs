const app = require("./localhost")

const path = require("path")


app.onClientChange(clients => {

	app.server.send({
		event:"clientschanged",
		addressList:[...clients.keys()]
	
	})
})


app.rest.get("*", (req, res) => {

	res.send("hello there")
})

app.rest.get("/", (req, res) => {
	

		
		
	res.sendFile(path.join(__dirname, "index.html"))
})

app.rest.get("/get", (req, res) => {
	res.send({hello:"hello"})
})


app.listen({
	id:process.env.app_id,
	id:process.env.api_key
})
