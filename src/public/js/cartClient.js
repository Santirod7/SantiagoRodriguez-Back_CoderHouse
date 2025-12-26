document.addEventListener('DOMContentLoaded', () => {
    const cartId = window.location.pathname.split('/').pop(); // Obtenemos el ID del carrito desde la URL
    const emptyCartBtn = document.getElementById('empty-cart-btn');

    // Lógica para vaciar el carrito
    if (emptyCartBtn) {
        emptyCartBtn.addEventListener('click', async () => {
            if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                try {
                    const response = await fetch(`/api/carts/${cartId}`, { method: 'DELETE' });
                    const data = await response.json();
                    if (data.status === 'success') {
                        alert('Carrito vaciado con éxito.');
                        window.location.reload(); // Recargamos la página para verla vacía
                    } else {
                        alert('Error al vaciar el carrito: ' + data.message);
                    }
                } catch (error) {
                    alert('Error de conexión al vaciar el carrito.');
                }
            }
        });
    }

    // Lógica para eliminar un producto individual
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const card = event.target.closest('.cart-item-card');
            const productId = card.dataset.productId;

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'DELETE' });
                const data = await response.json();
                if (data.status === 'success') {
                    alert('Producto eliminado del carrito.');
                    card.remove(); // Eliminamos la tarjeta del producto de la vista sin recargar
                    window.location.reload(); 
                } else {
                    alert('Error al eliminar el producto: ' + data.message);
                }
            } catch (error) {
                alert('Error de conexión al eliminar el producto.');
            }
        });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', async (event) => {
            const card = event.target.closest('.cart-item-card');
            const productId = card.dataset.productId;
            const newQuantity = parseInt(event.target.value);

            if (newQuantity < 1) {
                event.target.value = 1; 
                return;
            }

            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity: newQuantity })
                });
                const data = await response.json();
                if (data.status === 'success') {
                    window.location.reload();
                } else {
                    alert('Error al actualizar la cantidad: ' + data.message);
                }
            } catch (error) {
                alert('Error de conexión al actualizar la cantidad.');
            }
        });
    });
});