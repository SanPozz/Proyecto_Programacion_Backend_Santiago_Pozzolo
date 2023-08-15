import { Router } from "express";
import { CartsManager } from "../controllers/cartsManager.js";

const routerCarts = Router();
const cartsManager = new CartsManager('./src/models/carts.json', './src/models/products.json')

routerCarts.post('/', async (req, res) => {
    await cartsManager.createCart();
    res.status(200).send("El carrito se ha creado correctamente")
})

routerCarts.get('/:cid', async (req, res) => {
    const { cid } = req.params
    const products = await cartsManager.getProductsByCart(parseInt(cid))

    if (products) {
        res.status(200).send(products)
    } else {
        res.status(400).send("Carrito inexistente")
    }
})

routerCarts.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    const status = await cartsManager.addProductToCart(parseInt(cid), parseInt(pid))

    if (status) {
        res.status(200).send(`El producto con id: ${pid} fue agregado correctamnte a el carrito con id ${cid}`)
    } else {
        res.status(400).send("El carrito o el producto son inexistentes")
    }
})

export default routerCarts;