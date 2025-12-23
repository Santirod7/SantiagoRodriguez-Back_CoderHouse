// src/models/Product.model.js

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); // Importamos el plugin

// modelado del esquema de productos
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true 
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true // No puede haber dos productos con el mismo código.
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true 
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: [String],
        default: []
    }
});
// plugin de paginación al schema.
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;