const app = require("./src/app")
const PORT=8080

//El PORT es el indicado en el entregable
app.listen(PORT, () => {
    console.log(`Estoy escuchando el puerto ${PORT}`)
})

