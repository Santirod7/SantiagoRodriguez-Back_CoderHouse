const { Router } = require('express');
const ProductManager = require('../managers/ProductManager.js');
const CartManager = require('../managers/CartManager.js');

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();


router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // filtro
        const filter = {};
        if (query) {
            if (query.toLowerCase() === 'available') {
                filter.status = true;
            } else {
                filter.category = { $regex: query, $options: 'i' };
            }
        }

        const result = await productManager.getAllProducts({ limit, page, sort, query: filter });

        // links de paginación
        const buildLink = (p) => {
            const newParams = new URLSearchParams(req.query);
            newParams.set('page', p);
            return `/products?${newParams.toString()}`;
        };
        
        const prevLink = result.hasPrevPage ? buildLink(result.prevPage) : null;
        const nextLink = result.hasNextPage ? buildLink(result.nextPage) : null;

        //vista 'products.handlebars'
        res.render('products', {
            title: 'Catálogo de Productos',
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
            sort: sort,
            query: query
        });

        

    } catch (error) {
        console.error("Error al renderizar la vista de productos:", error);
        res.status(500).send('Error interno del servidor');
    }
});

// vista para mostrar un carrito específico
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }
        let total = 0;
        const productsWithSubtotal = cart.products.map(item => {
            const subtotal = item.product.price * item.quantity;
            total += subtotal; 
            return {
                ...item, 
                subtotal: subtotal.toFixed(2) 
            };
        });

        res.render('cart', {
            title: `Carrito ${cid}`,
            products: productsWithSubtotal, 
            total: total.toFixed(2) 
        });

    } catch (error) {
        console.error("Error al renderizar la vista del carrito:", error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/', (req, res) => res.render('home'));
router.get('/realtimeproducts', (req, res) => res.render('realTimeProducts'));


module.exports = router;