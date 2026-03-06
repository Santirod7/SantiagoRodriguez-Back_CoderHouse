import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import connectDB from "./src/config/dbConnection.js"; 
import ProductManager from "./src/dao/managers/ProductManager.js";
import productsRouter from "./src/routes/products.routes.js"; 
import cartsRouter from "./src/routes/cart.routes.js";
import viewsRouter from "./src/routes/views.routes.js";
import sessionRouter from "./src/routes/sessions.routes.js";

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
app.use("/api/sessions", sessionRouter);
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