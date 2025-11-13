const fs = require("fs/promises"); 
const crypto = require("crypto");   

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath; 
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      if (data.trim() === "") return []; 
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }
  async #writeFile(products) {
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
  }

  //* CREATE - CREAR UN PRODUCTO 
  async addProduct({ title, description, code, price, status = true, stock, category }) {
    // campos obligatorios
    if (!title || !description || !code || price === undefined || stock === undefined || !category) {
      throw new Error("Todos los campos son obligatorios");
    }

    const products = await this.#readFile();

    // validación para que el "code" no se repita
    if (products.some(p => p.code === code)) {
        throw new Error(`El código '${code}' ya existe. No se puede agregar el producto`);
    }

    // moldeado de producto
    const newProduct = {
      id: crypto.randomUUID(), // ID unico autogenerado
      title: String(title),
      description: String(description),
      code: String(code),
      price: Number(price), 
      status: Boolean(status), 
      stock: Number(stock),   
      category: String(category),
    };

    // agrego producto
    products.push(newProduct);
    await this.#writeFile(products);

    return newProduct;
  }

  // READ - LEER TODOS LOS PRODUCTOS
  async getAllProducts() {
    return await this.#readFile();
  }

  // READ - BUSCAR PRODUCTO POR ID
  async getProductById(id) {
    const products = await this.#readFile();
    const product = products.find((p) => p.id === id);

    if (!product) {
      console.log(`Producto con id '${id}' no encontrado`);
      return null;
    }

    return product;
  }

  // UPDATE - ACTUALIZAR UN PRODUCTO POR ID
  async updateProductById(id, dataToUpdate) {
    const products = await this.#readFile();
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      console.log(`Producto con id '${id}' no encontrado, no se puede actualizar`);
      return null;
    }
    // producto actualizado combinando el viejo con los datos nuevos
    const updatedProduct = { ...products[productIndex], ...dataToUpdate };
    // lo reemplazo
    products[productIndex] = updatedProduct;

    await this.#writeFile(products);
    console.log(`Producto con id '${id}' actualizado`);
    return updatedProduct;
  }

  // DELETE - ELIMINAR UN PRODUCTO POR ID
  async deleteProductById(id) {
    const products = await this.#readFile();
    const newProductsArray = products.filter((p) => p.id !== id);

    if (products.length === newProductsArray.length) {
      console.log(`Producto con id '${id}' no encontrado, no se eliminó nada`);
      return null;
    }

    await this.#writeFile(newProductsArray);
    console.log(`Producto con id '${id}' eliminado correctamente`);
    return true;
  }
}


module.exports = ProductManager;