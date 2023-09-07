import { Router } from "express";
import productModel from "../dao/models/products.models.js";
// import { ProductManager } from "../controllers/productManager.js";

const routerProducts = Router();

// const productManager = new ProductManager('./src/models/products.json')

// routerProducts.get('/', async (req,res) => {
//     const { limit } = req.query;
//     const productos = await productManager.getProducts();

//     if (limit) {
//         res.status(200).send(productos.slice(0, limit));
//     } else {
//         res.status(200).send(productos);
//     }
// })

// routerProducts.get('/:pid', async (req, res) => {
//     const { pid } = req.params;
//     const product = await productManager.getProductById(parseInt((pid)));

//     if (product) {
//         res.status(200).send(product);
//     } else {
//         res.status(404).send(`No Existe el Producto`);
//     }
// })

// routerProducts.post('/', async (req, res) => {
//     const status = await productManager.addProduct(req.body)

//     if (status === 1) {
//         res.status(400).send("El producto debe incluir los campos title, description, price, code, status, stock y category")
//     } else if (status === 2){
//         res.status(400).send("El producto ya existe")
//     } else if (status === 3){
//         res.status(200).send("Producto agregado correctamente!")
//     } else {
//         res.status(400).send("Hubo algun inconveniente al crear el producto")
//     }
// })

// routerProducts.put('/:pid', async (req, res) => {
//     const { pid } = req.params;
//     const status = await productManager.updateProduct(parseInt(pid), req.body)

//     if (status) {
//         res.status(200).send("Producto actualizado correctamente");
//     } else {
//         res.status(400).send("Producto no encontrado, id incorrecto");
//     }
// })

// routerProducts.delete('/:pid', async (req, res) => {
//     const { pid } = req.params;
//     const status = await productManager.deleteProduct(parseInt(pid))

//     if (status === 1) {
//         res.status(400).send("Producto no encontrado, id incorrecto")
//     } else if (status === 2){
//         res.status(200).send("El producto fue eliminado correctamente")
//     } else {
//         res.status(400).send("Hubo algun inconveniente al borrar el producto")
//     }
// })

routerProducts.get('/', async (req,res) => {
    const { limit } = req.query;

    try {

        if (limit) {
            const productos = await productModel.find().limit(limit);
            res.status(200).send({status: "OK", result: productos});
        } else {
            const productos = await productModel.find();
            res.status(200).send({status: "OK", result: productos});
        }

    } catch (error) {
        res.status(400).send({error: `Error al consultar la base de datos: ${error}`});
    }

})

routerProducts.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        
        const product = await productModel.findById(pid);

        if (product) {
            res.status(200).send({status: "Product Found" + product});
        } else {
            res.status(400).send({status: "Product Not Found"});
        }

    } catch (error) {
        res.status(400).send({error: "Error al consultar la base de datos: " + error});
    }
})

routerProducts.post('/', async (req, res) => {
    const { title, description, stock, code, price, category } = req.body;

    try {
        const productToAdd = await productModel.create({
            title,
            description,
            category,
            stock,
            code,
            price
        });

        res.status(200).send({ status: "Product Created: " + productToAdd });
    } catch (error) {
        res.status(400).send({ Error: "Error creating product: " + error});
    }
})

routerProducts.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, stock, code, price, category } = req.body;

    try {
        const productToUpdate = await productModel.findByIdAndUpdate(pid, {
            title,
            description,
            category,
            stock,
            code,
            price
        });

        if (productToUpdate) {
            res.status(200).send({ status: "Product Updated: " + productToUpdate });
        } else {
            res.status(400).send({ status: "Product Not Found" });
        }
    } catch (error) {
        res.status(400).send({ status: "Error updating product: " + error });
    }
})

routerProducts.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const productToDelete = await productModel.findByIdAndDelete(pid);

        if (productToDelete) {
            res.status(200).send({ status: "Product Deleted: " + productToDelete })
        } else {
            res.status(400).send({ status: "Product Not Found: " + productToDelete })
        }
    } catch (error) {
        res.status(400).send({ status: "Error deleting product: " + error })
    }
})

export default routerProducts;