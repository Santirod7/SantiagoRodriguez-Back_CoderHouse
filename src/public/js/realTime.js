// 1. Establecemos la conexión con el servidor de WebSockets.

const socket = io();

// 2. Obtenemos las referencias a los elementos del DOM con los que vamos a interactuar.
const productsContainer = document.getElementById('products-container');
const createForm = document.getElementById('create-product-form');
const deleteForm = document.getElementById('delete-product-form');

// 3. Definimos qué hacer cuando el servidor nos anuncie que la lista de productos ha cambiado.
socket.on('updateProducts', (products) => {
    productsContainer.innerHTML = '';
    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No hay productos para mostrar.</p>';
        return;
    }

// 4. Por cada producto en la nueva lista, creamos una tarjeta HTML y la añadimos al contenedor.
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card'; 
        productCard.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <div class="product-details">
                <span>Precio: $${product.price}</span>
                <span>Código: ${product.code}</span>
            </div>
            <strong class="product-id">ID: ${product.id}</strong>
        `;
        productsContainer.appendChild(productCard);
    });
});

// 5. Añadimos un listener al formulario de CREACIÓN.
createForm.addEventListener('submit', (event) => {
    event.preventDefault(); 

    // Creamos un objeto con los datos del formulario.
    const formData = new FormData(createForm);
    const newProduct = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        category: formData.get('category'),
    };
    
// 6. Emitimos el evento 'newProduct' al servidor, pasándole los datos.
    socket.emit('newProduct', newProduct);
    createForm.reset(); 
});

// 7. Añadimos un listener al formulario de ELIMINACIÓN.
deleteForm.addEventListener('submit', (event) => {
event.preventDefault();

// Obtenemos el ID del producto que el usuario escribió.
const productId = new FormData(deleteForm).get('id');

// 8. Emitimos el evento 'deleteProduct' al servidor, pasándole el ID.
    socket.emit('deleteProduct', productId);
    deleteForm.reset();
});