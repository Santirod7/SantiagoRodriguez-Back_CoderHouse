const { Router } = require('express');
const ProductManager = require('../managers/ProductManager.js');
const manager = new ProductManager(__dirname + '/../data/Productos.json');
const productsRouter = Router();


// Leer todos los productos (GET /api/products)
productsRouter.get('/', async (req, res) => {
    try {
        const products = await manager.getAllProducts();
        res.json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Leer producto por ID (GET /api/products/:pid)
productsRouter.get('/:pid', async (req, res) => {
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
productsRouter.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await manager.addProduct(productData);
        
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});
// Actualizar producto
productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const dataToUpdate = req.body;
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ status: 'error', message: 'Debe enviar al menos un campo para actualizar' });
        }
        const updatedProduct = await manager.updateProductById(productId, dataToUpdate);
        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado para actualizar' });  }
    res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// eliminar producto (DELETE /api/products/:pid)
productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const result = await manager.deleteProductById(productId);
        if (!result) {
            return res.status(404).json({ status: 'error', message: 'producto no encontrado para eliminar' });      }
        res.json({ status: 'success', message: `Producto con id '${productId}' eliminado correctamente.` });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = productsRouter;