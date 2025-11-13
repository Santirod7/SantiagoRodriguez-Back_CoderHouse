const { Router } = require('express');
const ProductManager = require('../managers/ProductManager.js');
const manager = new ProductManager(__dirname + '/../data/Productos.json');
const router = Router();


// Leer todos los productos (GET /api/products)
router.get('/', async (req, res) => {
    try {
        const products = await manager.getAllProducts();
        res.json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Leer producto por ID (GET /api/products/:pid)
router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await manager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Pproducto no encontrado' });
        }
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Crear producto (POST /api/products)
router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await manager.addProduct(productData);
        
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

module.exports = router;