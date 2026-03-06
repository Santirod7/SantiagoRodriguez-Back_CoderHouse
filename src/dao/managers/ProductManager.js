
import Product from '../models/Product.model.js';

class ProductManager {
    constructor() {
    }
    async addProduct(productData) {
        try {
            const newProduct = await Product.create(productData);
            return newProduct;
        } catch (error) {
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    }

async getAllProducts(params = {}) {
            try {
            // Extraemos los parámetros de la consulta
            const limit = parseInt(params.limit) || 10;
            const page = parseInt(params.page) || 1;
            const sort = params.sort; // 'asc' o 'desc'
            const query = params.query || {}; // Filtro de búsqueda

            // Opciones de paginación y ordenamiento
            const options = {
                page: page,
                limit: limit,
                lean: true // lean:true para obtener objetos JSON simples en lugar de documentos de Mongoose
            };

            if (sort) {
                options.sort = { price: sort === 'asc' ? 1 : -1 };
            }

            // El primer argumento es el filtro, el segundo son las opciones de paginación.
            const products = await Product.paginate(query, options);
            return products;
        } catch (error) {
            throw new Error(`Error al obtener los productos: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id).lean();
            if (!product) {
                throw new Error('Producto no encontrado.');
            }
            return product;
        } catch (error) {
            throw new Error(`Error al obtener el producto: ${error.message}`);
        }
    }

    async updateProductById(id, dataToUpdate) {
        try {
            // asegura que el método devuelva el documento ya actualizado.
            const updatedProduct = await Product.findByIdAndUpdate(id, dataToUpdate, { new: true }).lean();
            if (!updatedProduct) {
                throw new Error('Producto no encontrado para actualizar.');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    async deleteProductById(id) {
        try {
            // 'findByIdAndDelete' busca y elimina un documento por su ID.
            const deletedProduct = await Product.findByIdAndDelete(id).lean();
            if (!deletedProduct) {
                throw new Error('Producto no encontrado para eliminar.');
            }
            return deletedProduct;
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

export default ProductManager;