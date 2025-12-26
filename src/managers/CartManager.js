const Cart = require('../models/Cart.model.js'); 

class CartManager {
    constructor() {
    }

    async createCart() {
        try {
            // Simplemente creamos un nuevo carrito. El modelo se encarga de que 'products' sea un array vacío por defecto.
            const newCart = await Cart.create({});
            return newCart;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }

    async getCartById(id) {
        try {
            // Buscamos el carrito por su ID.
            // la propiedad 'products' vendrá automáticamente "populada" con los datos completos de los productos.
        const cart = await Cart.findById(id).populate('products.product').lean();
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            // Primero, buscamos el carrito.
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            // buscamos si el producto ya existe en el carrito.
            // .equals() para comparar ObjectIDs de Mongoose de forma segura.
            const productIndex = cart.products.findIndex(p => p.product.equals(productId));

            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado.');

            const initialLength = cart.products.length;
            cart.products = cart.products.filter(p => !p.product.equals(productId));

            if (cart.products.length === initialLength) {
                throw new Error('Producto no encontrado en el carrito para eliminar.');
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
        }
    }

    // actualizar la cantidad de un producto
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado.');

            const productIndex = cart.products.findIndex(p => p.product.equals(productId));
            if (productIndex === -1) throw new Error('Producto no encontrado en el carrito.');

            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                // Si la cantidad es 0, eliminamos el producto.
                cart.products.splice(productIndex, 1);
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
        }
    }

    // actualizar todo el carrito con un nuevo array
    async updateAllProductsInCart(cartId, newProducts) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado.');

            cart.products = newProducts;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al actualizar el carrito: ${error.message}`);
        }
    }

    // vaciar el carrito
    async emptyCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado.');
            
            cart.products = []; 
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error(`Error al vaciar el carrito: ${error.message}`);
        }
    }
}

module.exports = CartManager;