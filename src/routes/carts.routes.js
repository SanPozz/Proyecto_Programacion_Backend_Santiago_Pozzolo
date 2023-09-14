import { Router } from "express";
// import { CartsManager } from "../controllers/cartsManager.js";
import cartModel from "../dao/models/carts.models.js";
import productModel from "../dao/models/products.models.js";

const routerCarts = Router();
// const cartsManager = new CartsManager('./src/models/carts.json', './src/models/products.json')

// routerCarts.post('/', async (req, res) => {
//     const cartCreated = await cartModel.create({})
//     res.status(200).send({ status: "Cart Created" + cartCreated })
// })

// routerCarts.get('/:cid', async (req, res) => {
//     const { cid } = req.params
//     const products = await cartsManager.getProductsByCart(parseInt(cid))

//     if (products) {
//         res.status(200).send(products)
//     } else {
//         res.status(400).send("Carrito inexistente")
//     }
// })

// routerCarts.post('/:cid/products/:pid', async (req, res) => {
//     const { cid, pid } = req.params;

//     const status = await cartsManager.addProductToCart(parseInt(cid), parseInt(pid))

//     if (status) {
//         res.status(200).send(`El producto con id: ${pid} fue agregado correctamnte a el carrito con id ${cid}`)
//     } else {
//         res.status(400).send("El carrito o el producto son inexistentes")
//     }
// })

routerCarts.post('/', async (req, res) => {
    try {
        const cartCreated = await cartModel.create({});
        res.status(200).send({ status: "Cart Created" + cartCreated });
    } catch (error) {
        res.status(400).send({ status: "Error creating cart: " + error });
    }
    
})
routerCarts.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {

        const cart = await cartModel.findById(cid).populate('products');
        const product = await productModel.findById(pid);
        
        if (!product) {
            res.status(400).send({ status: "Product Not Found" });
            return
        } else if (!cart) {
            res.status(400).send({ status: "Cart Not Found" });
            return
        } else {
            const productExist = cart.products.find(product => product.id_prod == pid)
            
            productExist
            ? productExist.quantity++
            : cart.products.push({ id_prod: product._id, quantity: 1 });
            await cart.save();
            res.status(200).send({ status: `Product: ${product} Added to Cart: ${cart}` })
        }

    } catch (error) {
        res.status(400).send({ status: `Error adding product to cart` });
    }

})

routerCarts.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {

        const cart = await cartModel.findById(cid).populate('products');

        if (cart) {
            res.status(200).send({ status: "OK", result: cart });
        } else {
            res.status(400).send({ status: "Cart Not Found" });
        }

    } catch (error) {
        res.status(400).send({ status: "Error consulting database" + error});
    }
    
})

routerCarts.put('/:cid', async (req, res) => {

    const { cid } = req.params;
    const { dataToUpdate } = req.body;

    try {

        const cart = await cartModel.findByIdAndUpdate(
            cid,
            {$set: dataToUpdate},
            {new: true});

        if (cart) {
            res.status(200).send({ status: "OK", result: cart });
        } else {
            res.status(400).send({ status: "Cart Not Found" });
        }

    } catch (error) {
        res.status(400).send({ status: `Error: ${error}` });
    }
})

routerCarts.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        
        const cart = await cartModel.findById(cid);
        let productToUpdate = cart.products.find(prod => prod.id_prod == pid);

        productToUpdate.quantity = quantity;
        await cart.save();
        res.status(200).send({ status: "OK" , productToUpdate});

    } catch (error) {
        res.status(400).send({ status: `Error: ${error}` });
    }
})

routerCarts.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartModel.findById(cid);
        cart.products = []
        await cart.save()
    } catch (error) {
        res.status(400).send({ status: `Error: ${error}` });
    }
})

routerCarts.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {

        const cart = await cartModel.findById(cid);

        if (cart) {
            const productsFiltered = cart.products.filter(prod => prod.id_prod != pid);
            cart.products = productsFiltered;
            await cart.save()
            res.status(200).send({ status: `Product with ${pid} was deleted` })
        }

    } catch (error) {
        console.log(error);
    }
})

export default routerCarts;