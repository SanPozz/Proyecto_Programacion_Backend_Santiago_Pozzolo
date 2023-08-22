import { promises as fs } from 'fs'

export class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }


    async getProducts() {
        this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        // console.log(this.products);
        return this.products
    }

    async addProduct(product) {
        try {
            this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));

            const { title, description, price, code, status, stock, category, thumbnail} = product;

            if (!title || !description || !price || !code || !stock || !category) {
                return 1
            }
    
            if (this.products.find(producto => producto.code === code)) {
                return 2
            } else {
                product.id = this.products.length + 1;
                product.status = true;

                this.products.push(product);

                await fs.writeFile(this.path, JSON.stringify(this.products));

                console.log("Producto agregado correctamente");
                return 3
            }
        } catch (error) {
            console.error("Error al agregar el producto:", error.message);
            return 4
        }
    }

    async getProductById(id) {
        this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const prodSearch = this.products.find(producto => producto.id === id)
        if (prodSearch) {
            return prodSearch
        } else {
            return "Producto no existe"
        }
    }
    
    async updateProduct (id, { title, description, price, code, stock, status, category, thumbnail }) {

        this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));

        const indice = this.products.findIndex(prod => prod.id === id)
    
        if (indice != -1) {
            this.products[indice].title = title
            this.products[indice].description = description
            this.products[indice].price = price
            this.products[indice].code = code
            this.products[indice].stock = stock
            this.products[indice].status = status
            this.products[indice].category = category
            this.products[indice].thumbnail = thumbnail
            
            await fs.writeFile(this.path, JSON.stringify(this.products))

            return true
        
        } else {
            console.log("Producto no encontrado")
            return false
        }
    }
    
    async deleteProduct(id) {
        try {
            this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
            const index = this.products.findIndex((product) => product.id === id);

            if (index === -1) {
                console.log("Producto no encontrado");
                return 1;
            } else {
                this.products.splice(index, 1);

                await fs.writeFile(this.path, JSON.stringify(this.products));

                console.log("Producto eliminado correctamente");
                return 2
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error.message);
            return 3
        }
    }
}