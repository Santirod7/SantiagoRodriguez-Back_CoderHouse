const { Router } = require('express');
const CartManager = require('../managers/CartManager.js');
const manager = new CartManager(__dirname + '/../data/Carritos.json');
const cartsRouter = Router();

// POST /api/carts/
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await manager.createCart();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET /api/carts/:cid
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await manager.getCartById(cartId);
        res.json({ status: 'success', payload: cart.products });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message }); }
});

// POST /api/carts/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await manager.addProductToCart(cartId, productId);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

module.exports = cartsRouter;