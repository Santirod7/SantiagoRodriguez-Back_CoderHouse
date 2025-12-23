
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: {
        type: [ 
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'Product' 
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1 
                }
            }
        ],
        default: [] // Si no se especifica, el carrito se crea con un array de productos vacío.
    }
});


cartSchema.pre('findOne', function() {
    this.populate('products.product');
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;