const app = require("./src/app")
const http = require("http");
const { Server } = require("socket.io");
const ProductManager = require("./src/managers/ProductManager");
const path = require("path");
const connectDB = require("./src/config/dbConnection");

// Conectar a la base de datos MongoDB
connectDB();

const PORT=8080
const productManager = new ProductManager(path.join(__dirname, "./src/data/Productos.json"));

//Creo el servidor HTTP con la app de express
const server = http.createServer(app);

//  Creo el servidor de Websockets
const io = new Server(server);

// Middleware para hacer 'io' accesible a las rutas API
app.use((req, res, next) => {
    req.io = io;
    next();
});

//El PORT es el indicado en el entregable
server.listen(PORT, () => {
    console.log(`Estoy escuchando el puerto ${PORT}`)
})

//Conexión por sockets
io.on("connection", async  (socket) => {
    console.log("cliente conectado"); 

socket.emit("updateProducts", await productManager.getAllProducts());
socket.on("newProduct", async (productData) => { 
console.log("Nuevo producto recibido:", productData);
await productManager.addProduct(productData)
io.emit("updateProducts", await productManager.getAllProducts());
})

socket.on("deleteProduct", async (productId) => {
    console.log(`Elimino el producto ${productId}`)
    await productManager.deleteProductById(productId)
    io.emit("updateProducts", await productManager.getAllProducts());
})
});
