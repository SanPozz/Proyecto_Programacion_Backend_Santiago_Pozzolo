import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './path.js'
import path from 'path'

import routerProducts from './routes/products.routes.js';
import routerCarts from './routes/carts.routes.js';
import { ProductManager } from './controllers/productManager.js';

const PORT = 8080;
const app = express();

const server = app.listen(PORT, () => {
    console.log(`Server on Port: ${PORT}`);
})

const io = new Server(server)

const productManager = new ProductManager('./src/models/products.json')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));


io.on('connection', socket => {
    console.log('Conexion con Socket.io');

    socket.on('loadProducts', async () => {
        const products = await productManager.getProducts();
        socket.emit('sentProducts', products);
    })

    socket.on('addProduct', async productToAdd => { 
        console.log(productToAdd);
        await productManager.addProduct(productToAdd);
        const products = await productManager.getProducts()
        socket.emit("sentProducts", products)
    })

    socket.on('productToDelete', async productIdDelete => {
        await productManager.deleteProduct(productIdDelete)
        const products = await productManager.getProducts();
        socket.emit("sentProducts", products)
    })
})

app.use('/static', express.static(path.join(__dirname, '/public')));
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.get('/static', async (req, res) => {

    const products = await productManager.getProducts()

    res.render('home', {
        rutaCSS: 'home',
        rutaJS: 'home',
        products: products,
        productsLength: products.length > 0
    })
})

app.get('/static/realtimeproducts', (req, res) => {

    res.render('realtimeProducts', {
        rutaCSS: 'realtimeProducts',
        rutaJS: 'realtimeProducts'
        })
})



app.get('*', (req, res) => {
    res.status(404).send({status:"Error", error:"Pagina no encontrada"})
})