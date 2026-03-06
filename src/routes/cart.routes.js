import { Router } from 'express';
import CartManager from '../dao/managers/CartManager.js';
const router = Router();
const cartManager = new CartManager(); 

// POST Crear un nuevo carrito vacío.
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET Obtener un carrito por ID, populando sus productos.
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

// POST Agregar un producto a un carrito.
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

// PUT Actualizar todo el carrito con un array de productos.
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body; 

        if (!Array.isArray(products)) {
            return res.status(400).json({ status: 'error', message: 'El body debe contener un array de productos.' });
        }

        const updatedCart = await cartManager.updateAllProductsInCart(cid, products);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

// PUT Actualizar SÓLO la cantidad de un producto.
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body; 

        if (typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un número mayor o igual a cero.' });
        }

        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

// DELETE Eliminar un producto específico del carrito.
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.deleteProductFromCart(cid, pid);
        res.json({ status: 'success', payload: updatedCart, message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

// DELETE Vaciar todos los productos de un carrito.
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = await cartManager.emptyCart(cid);
        res.json({ status: 'success', payload: updatedCart, message: 'El carrito ha sido vaciado' });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});
export default router;