const express = require('express');
const cors = require('cors');
require('dotenv').config();
const usersRouter = require('./routes/users')

class Server {
    constructor() {
        this.app = express(); // Se instancia Express
        this.port = process.env.PORT; //Definimos el puerto

        //Paths     http://localhost:3000/api/v1/spotify50
        this.basePath = '/api/v1'; //Ruta Base 

        this.usersPath = `${this.basePath}/spotify50`; 
        
        this.middlewares(); //Invocacion de los middlewares

        this.routes(); //Invocacion de las rutas
    }

    
    middlewares(){
        this.app.use(cors());
        this.app.use(express.json()); //Para poder interpretar texto en formato JSON
    }

    routes(){
        this.app.use(this.usersPath, usersRouter); //EndPoint de Users
    }

    listen(){
        this.app.listen(this.port,() => {
            console.log("Server listening on port" +this.port)
        });
    }
}

module.exports = Server;