const { Router } = require('express');
const ProductManager = require('../managers/ProductManager.js'); // Necesitamos el manager para obtener los productos
const path = require('path');

// Creamos una instancia del router
const viewsRouter = Router();

const productManager = new ProductManager(path.join(__dirname, '../data/Productos.json'));

// --- DEFINIMOS LAS RUTAS PARA LAS VISTAS ---

// Ruta para la vista "home.handlebars"
viewsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        
        // La función res.render() toma dos argumentos:
        res.render('home', { 
            title: 'Home | Lista de Productos', // Un título para la pestaña del navegador
            products: products 
        });

    } catch (error) {
        console.error("Error al obtener productos para la vista home:", error);
        res.status(500).send('Error interno del servidor');
    }
});


// Ruta para la vista "realTimeProducts.handlebars"
viewsRouter.get('/realtimeproducts', (req, res) => {
    try {
        res.render('realTimeProducts', {
            title: 'Productos en Tiempo Real' // Título para la pestaña
        });

    } catch (error) {
        console.error("Error al renderizar la vista de tiempo real:", error);
        res.status(500).send('Error interno del servidor');
    }
});


module.exports = viewsRouter;