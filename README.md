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
const app = require("localhostjs")

app.rest.get("/", (req, res) => {
    
    //your calculations

    res.send({
            body:"some body"
    })

})

app.listen({
    id:process.env.id,//this is your localhost project id
    secret:process.env.secret //your localhost project secret
}, "http://localhost:5000")
// your app will automatically connect to 
// localhost servers if you don't specify the url 
``
