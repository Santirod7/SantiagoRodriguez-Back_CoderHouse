const path = require("path");
const express = require("express");
const ProductManager = require("./managers/ProductManager");
const CartManager = require("./managers/CartManager");
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/cart.routes");
const app = express();

app.get("/", (req, res) => {
  res.send("Hola mundazoooooooo!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

module.exports = app;

//TESTEO CARRITO
const testCartManager = async () => {
  try {
    const cartsFilePath = path.join(__dirname, "./data/Carrito.json");
    const manager = new CartManager(cartsFilePath);
    console.log("--> TEST");
    console.log("creo carrito");
    const nuevoCarrito = await manager.createCart();
    console.log("creado con éxito:", nuevoCarrito);
    const cartId = nuevoCarrito.id;
    const productId = "f8a4b-c3d2-e1f0-g9h8-i7j6k5l4m3n2";
    await manager.addProductToCart(cartId, productId);
    console.log("agrego producto por primera vez");
    console.log(`agrego el mismo producto ${productId}`);
    await manager.addProductToCart(cartId, productId);
    console.log("producto agregado por segunda vez.");

    const carritoFinal = await manager.getCartById(cartId);
    console.log("carrito:", carritoFinal);
  } catch (error) {
    console.error("Ocurrió un error durante la prueba:", error.message);
  }
};

// TESTEO PRODUCTOS

const testProductManager = async () => {
  try {
    const productsFilePath = path.join(__dirname, "data", "Productos.json");
    const manager = new ProductManager(productsFilePath);
    console.log("agrego un producto");
    const prod1 = await manager.addProduct({
      title: "compu pro",
      description: "Una compu excelente para desarrolladores",
      code: "LP123",
      price: 1500,
      stock: 25,
      category: "electronica",
    });

    await manager.addProduct({
      title: "Mouse Gamer",
      description: "Mouse con luces RGB",
      code: "MG456",
      price: 75,
      stock: 100,
      category: "accesorios",
    });
    console.log("\n lista inicial");
    console.log(await manager.getAllProducts());
    console.log(`\n actualizo el stock de la compu (ID: ${prod1.id})`);
    await manager.updateProductById(prod1.id, { stock: 20, price: 1450 });
    console.log("\n busco compu para ver si se cambió: ");
    console.log(await manager.getProductById(prod1.id));
    console.log("\n elimino el mouse ");
    const allProducts = await manager.getAllProducts();
    const mouse = allProducts.find((p) => p.code === "MG456");
    if (mouse) {
      await manager.deleteProductById(mouse.id);
    }
    console.log("\n lista final");
    console.log(await manager.getAllProducts());
  } catch (error) {
    console.error("Ocurrió un error durante la prueba:", error.message);
  }
};

testCartManager();
testProductManager();
