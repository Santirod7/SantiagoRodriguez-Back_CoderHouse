const fs = require("fs/promises");
const crypto = require("crypto");
const path = require("path");
const ProductManager = require('./ProductManager.js');
const productManager = new ProductManager(path.join(__dirname, '../data/Productos.json'));

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }
    async #readFile() {
        try {
            const data = await fs.readFile(this.filePath, "utf-8");
            if (data.trim() === "") return [];
            return JSON.parse(data);
        } catch (error) {
            if (error.code === "ENOENT") return [];
            throw error;
        }
    }

    async #writeFile(carts) {
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    }

  
    // POST /api/carts/ -> CREA CARRITO
    async createCart() {
        const carts = await this.#readFile();
        const newCart = {
            id: crypto.randomUUID(),
            products: []  };

        carts.push(newCart);
        await this.#writeFile(carts);
        return newCart;
    }

    // GET /api/carts/:cid -> DEVUELVE PRODUCTOS DE UN CARRITO
    async getCartById(cartId) {
        const carts = await this.#readFile();
        const cart = carts.find(c => c.id === cartId);

        if (!cart) {
            throw new Error(`Carrito con id '${cartId}' no encontrado.`);
        }
        return cart;
    }

    // POST /api/carts/:cid/product/:pid -> Agrega un producto a un carrito
    async addProductToCart(cartId, productId) {
        const product = await productManager.getProductById(productId);
        if (!product) {
            throw new Error(`Producto con id '${productId}' no encontrado.`);
        }
        const carts = await this.#readFile();
        const cartIndex = carts.findIndex(c => c.id === cartId);
        if (cartIndex === -1) {
            throw new Error(`Carrito con id '${cartId}' no encontrado.`);}
        const cart = carts[cartIndex];
        // busco si ya estaba agregado
        const productIndexInCart = cart.products.findIndex(p => p.product === productId);

        if (productIndexInCart !== -1) {
            // si esta, incremento
            cart.products[productIndexInCart].quantity++;
        } else {
            // sino la cantidad es 1
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }
        //actualizo carrito
        carts[cartIndex] = cart; 
        await this.#writeFile(carts);
        return cart;   }}

module.exports = CartManager;