# Localhostjs

## Philosophy
Serverless has without a doubt helped deploying apps to the web. However sometimes it's useful to own the infra you're using. This is where we jump in, localhostjs allows you to use the localhost website in combination with working id and secret to deploy your app from a local machine using the expressjs server framework. 


## Installation
to install just install using npm or your package manager of choice: 

```bash
npm install localhostjs 
```

## Usage 
Currently the framework only allows for http requests (namely `GET` and `POST`) but we are working on websockets as well (maybe in 1.0).

### HTTP requests
HTTP requests are easily instantiated using express syntax (it is actually exactly the same as we use express to handle http)

```js 

const app = require("localhostjs");
const exp = app.express
const path = require("path")
require("dotenv").config();


app.rest.use(exp.static(path.join(__dirname, "static")));


app.socket.on("event", data => {

    processData(data); 


    app.socket.send("event", {...somedata}, [
        data.id, //original sender
        receiver1, 
        receiver2, 
        receiver3, 
    ])

})

app.listen({
        id:process.env.id,
        secret:process.env.secret
}, "http://localhost:5000") 
//leave out url if you connect to localhostjs

```


## Websockets and client lib 
To use the websocket functionality you have to use our websocket client lib (the file with cdn in the name...) or simply use the cdn: 


```html 
<script src="https://cdn.jsdelivr.net/gh/Adotweb/localhostjs/localhost.cdn.js"></script>
```


in said client lib things behave similar to the `socket.send` and `socket.on` function in the server library: 


```js 

socket.register() //connects to the currently connected url

socket.on("event", data => {

    handleData(data)

})

socket.send("event", {...somedata})

```
