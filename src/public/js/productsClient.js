document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // IMPORTANTE: Aquí necesitas el ID del carrito para agregar productos.
    // En un entregable, puedes hardcodearlo temporalmente si no tienes sesiones.
    // REEMPLAZA ESTO CON EL ID DE TU CARRITO CREADO EN POSTMAN
    const CART_ID = '694dcfe4235738d528554e5f'; 

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.productId;
            try {
                const response = await fetch(`/api/carts/${CART_ID}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.status === 'success') {
                    alert('Producto agregado al carrito con éxito!');
                    console.log('Carrito actualizado:', data.payload);
                } else {
                    alert('Error al agregar producto al carrito: ' + data.message);
                    console.error('Error:', data.message);
                }

            } catch (error) {
                console.error('Error de red o del servidor:', error);
                alert('Hubo un problema al conectar con el servidor.');
            }
        });
    });
});