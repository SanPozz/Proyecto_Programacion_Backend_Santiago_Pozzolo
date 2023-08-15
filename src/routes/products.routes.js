import { Router } from "express";
import { ProductManager } from "../controllers/productManager.js";

const routerProducts = Router();
const productManager = new ProductManager('./src/models/products.json')

routerProducts.get('/', async (req,res) => {
    const { limit } = req.query;
    const productos = await productManager.getProducts();

    if (limit) {
        res.status(200).send(productos.slice(0, limit));
    } else {
        res.status(200).send(productos);
    }
})

routerProducts.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductById(parseInt((pid)));

    if (product) {
        res.status(200).send(product);
    } else {
        res.status(404).send(`No Existe el Producto`);
    }
})

routerProducts.post('/', async (req, res) => {
    const status = await productManager.addProduct(req.body)

    if (status === 1) {
        res.status(400).send("El producto debe incluir los campos title, description, price, code, status, stock y category")
    } else if (status === 2){
        res.status(400).send("El producto ya existe")
    } else if (status === 3){
        res.status(200).send("Producto agregado correctamente!")
    } else {
        res.status(400).send("Hubo algun inconveniente al crear el producto")
    }
})

routerProducts.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const status = await productManager.updateProduct(parseInt(pid), req.body)

    if (status) {
        res.status(200).send("Producto actualizado correctamente");
    } else {
        res.status(400).send("Producto no encontrado, id incorrecto");
    }
})

routerProducts.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const status = await productManager.deleteProduct(parseInt(pid))

    if (status === 1) {
        res.status(400).send("Producto no encontrado, id incorrecto")
    } else if (status === 2){
        res.status(200).send("El producto fue eliminado correctamente")
    } else {
        res.status(400).send("Hubo algun inconveniente al borrar el producto")
    }
})

export default routerProducts;