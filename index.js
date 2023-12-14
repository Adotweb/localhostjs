const app = require("./localhost")

const path = require("path")

app.rest.get("/", (req, res) => {

		
	res.sendFile(path.join(__dirname, "index.html"))
})

app.rest.get("/get", (req, res) => {


	res.sendFile(path.join(__dirname, "get.html"))
})

app.listen({
	id:"host-1",
	secret:"secret-1"
})
