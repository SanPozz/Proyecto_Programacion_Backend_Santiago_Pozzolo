import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './path.js'
import path from 'path'
import routerProducts from './routes/products.routes.js';
import routerCarts from './routes/carts.routes.js';
import routerStatic from './routes/static.routes.js';
import productModel from './dao/models/products.models.js';
import messageModel from './dao/models/messages.models.js'
// import { ProductManager } from './controllers/productManager.js';


// Configuracion de Puerto
const PORT = 8080;

//Inicializacion de Express
const app = express();

//Conexion con Mongo Atlas DB
mongoose.connect("mongodb+srv://pozzolosanti:EA6zC62qdguqrzNE@e-commerce.3xurkop.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Database Connected"))
    .catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error));

//Inicializacion de server HTTP
const server = app.listen(PORT, () => {
    console.log(`Server on Port: ${PORT}`);
})

//Inicializacion de server socket.io
const io = new Server(server)

// const productManager = new ProductManager('./src/models/products.json')

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));


io.on('connection', socket => {
    console.log('Conexion con Socket.io');

    socket.on('loadProducts', async () => {
        const products = await productModel.find();
        socket.emit('sentProducts', products);
    })

    socket.on('addProduct', async productToAdd => { 
        // console.log(productToAdd);
        await productModel.create(productToAdd);
        const products = await productModel.find();
        socket.emit("sentProducts", products);
    })

    socket.on('productToDelete', async productIdDelete => {
        await productModel.findByIdAndDelete(productIdDelete)
        const products = await productModel.find();
        socket.emit("sentProducts", products)
    })

    //Chat App
    socket.on('loadMessages', async () => {
        const arrayMessages = await messageModel.find();
        socket.emit('messages', arrayMessages)
    })

    socket.on('sentMessage', async info => {
        console.log(info);
        const { userEmail, message } = info;
        await messageModel.create({
            userEmail,
            message
        })

        const arrayMessages = await messageModel.find();
        socket.emit('messages', arrayMessages)
    })
})

app.use('/static', express.static(path.join(__dirname, '/public')));
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/static', routerStatic)

app.get('*', (req, res) => {
    res.status(404).send({status:"Error", error:"Pagina no encontrada"})
})