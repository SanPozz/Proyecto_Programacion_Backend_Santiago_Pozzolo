import { Router } from "express";
import productModel from "../dao/models/products.models.js";

const routerStatic = Router();

routerStatic.get('/', async (req, res) => {

    const productsFind = await productModel.find()
    // console.log(productsFind);

    res.render('home', {
        rutaCSS: 'home',
        rutaJS: 'home',
        products: productsFind,
        productsLength: productsFind.length > 0
    })
})

routerStatic.get('/realtimeproducts', (req, res) => {

    res.render('realtimeProducts', {
        rutaCSS: 'realtimeProducts',
        rutaJS: 'realtimeProducts'
        })
})

routerStatic.get('/chat', (req,res) => {

    res.render('chat', {
        rutaCSS: 'chat',
        rutaJS:'chat',
    })
})
export default routerStatic