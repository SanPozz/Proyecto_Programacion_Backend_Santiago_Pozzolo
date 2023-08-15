import { promises as fs } from 'fs';

export class CartsManager {
    constructor(cartsPath, productsPath){
        this.carts = [];
        this.cartsPath = cartsPath;
        this.productsPath = productsPath;
    }

    async createCart() {
        this.carts = JSON.parse(await fs.readFile(this.cartsPath, 'utf-8'));

        const newCartId = this.getNewCartId()
        const newCart = {
            id: newCartId,
            products: []
        }
        
        this.carts.push(newCart);
        
        await fs.writeFile(this.cartsPath, JSON.stringify(this.carts));
    }

    async getProductsByCart(cid) {
        this.carts = JSON.parse(await fs.readFile(this.cartsPath, 'utf-8'));

        const cartFound = this.carts.find(cart => cart.id == cid)
        const products = cartFound.products

        if (cartFound) {
            return products
        } else {
            return false
        }
    }

    async addProductToCart(cid, pid) {
		this.carts = JSON.parse(await fs.readFile(this.cartsPath, 'utf-8'));
		const cart = this.carts.find(cart => cart.id === cid);

		const products = JSON.parse(await fs.readFile(this.productsPath, 'utf-8'));
		const product = products.find(prod => prod.id === pid);

		if (!product) {
			return false;
		}

		if (cart) {
			const productExist = cart.products.find(prod => prod.id === pid);
			productExist
				? productExist.quantity++
				: cart.products.push({ id: product.id, quantity: 1 });
			const writeCarts = JSON.stringify(this.carts);
			await fs.writeFile(this.cartsPath, writeCarts);
			return true;
		} else {
			return false;
		}
    }

    getNewCartId() {
        const highestId = this.carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0);
        return highestId + 1;
    }
}