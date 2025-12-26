const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app"); 
const connectDB = require("./src/config/dbConnection");
const ProductManager = require("./src/managers/ProductManager");
const productsRouter = require("./src/routes/products.routes.js"); 
const cartsRouter = require("./src/routes/cart.routes.js");
const viewsRouter = require("./src/routes/views.routes.js");

// base de datos
connectDB();

const PORT = 8080;
const productManager = new ProductManager();

// servidores
const server = http.createServer(app);
const io = new Server(server);

// middleware para sockets
app.use((req, res, next) => {
    req.io = io;
    next();
});

// rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// iniciamos el servidor
server.listen(PORT, () => {
    console.log(`Estoy escuchando el puerto ${PORT}`);
});

// lógica de los sockets
io.on("connection", async (socket) => {
    console.log("cliente conectado");

    try {
        const result = await productManager.getAllProducts({ limit: 100 }); 
    socket.emit("updateProducts", result.docs); 
} catch (error) {
        console.error("Error al enviar productos iniciales:", error.message);
    }
    socket.on("newProduct", async (productData) => { 
        try {    
  await productManager.addProduct(productData);
        const result = await productManager.getAllProducts({ limit: 100 });
        io.emit("updateProducts", result.docs); 
    } catch (error) {
            console.error("Error al agregar el producto:", error.message);
            socket.emit("productError", { message: `Error al crear producto: ${error.message}` });
        }
    });

    socket.on("deleteProduct", async (productId) => {
        try {
            await productManager.deleteProductById(productId);
        const result = await productManager.getAllProducts({ limit: 100 });
        io.emit("updateProducts", result.docs);
        } catch (error) {
            console.error("Error al eliminar el producto:", error.message);            socket.emit("productError", { message: `Error al eliminar producto: ${error.message}` });
            socket.emit("productError", { message: `Error al eliminar producto: ${error.message}` });
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});