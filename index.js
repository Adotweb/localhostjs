const app = require("./localhost")
require("dotenv").config()
const path = require("path")

const {static} = app.express


app.rest.use(static(path.join(__dirname, "static")))



app.listen({
	id:process.env.id,
	secret:process.env.secret
}, "http://localhost:5000")
