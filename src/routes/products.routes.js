
const { Router } = require('express');
const ProductManager = require('../managers/ProductManager.js');

const router = Router();
const productManager = new ProductManager(); 

router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;

        const filter = {};
        if (query) {
            // Si el query es 'available', filtramos por status: true. Si no, asumimos que es una categoría.
            if (query.toLowerCase() === 'available') {
                filter.status = true;
            } else {
                // Usamos una expresión regular para buscar la categoría sin importar mayúsculas/minúsculas
                filter.category = { $regex: query, $options: 'i' };
            }
        }
        
        // Pasamos todos los parámetros al manager, que se encargará de la lógica.
        const result = await productManager.getAllProducts({
            limit: limit,
            page: page,
            sort: sort,
            query: filter
        });

        // Construimos los links de paginación
        const buildLink = (page) => {
            const Params = new SearchParams(req.query);
            Params.set('page', page);
            return `/api/products?${Params.toString()}`;
        };

        const prevLink = result.hasPrevPage ? buildLink(result.prevPage) : null;
        const nextLink = result.hasNextPage ? buildLink(result.nextPage) : null;

        // Construimos la respuesta final en el formato solicitado
        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        };

        res.json(response);

    } catch (error) {
        console.error("Error en GET /api/products:", error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

// Las demás rutas (GET por ID, POST, PUT, DELETE) son más simples,
// ya que simplemente llaman al método correspondiente del manager.

router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        const result = await productManager.getAllProducts({ limit: 100 });
    req.io.emit('updateProducts', result.docs);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProductById(req.params.pid, req.body);
        const result = await productManager.getAllProducts({ limit: 100 });
req.io.emit('updateProducts', result.docs);
        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProductById(req.params.pid);
        const result = await productManager.getAllProducts({ limit: 100 });
req.io.emit('updateProducts', result.docs);
        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

module.exports = router;