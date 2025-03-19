document.addEventListener('DOMContentLoaded', () => {
    console.log('Скрипт corzina.js отработал корректно');

    const corzinaItems = document.getElementById('corzina-items');
    const totalPriceElement = document.getElementById('total-price');
    const minSumToOrderElement = document.getElementById('min-sum-to-order');

    let cart = {}; //  { productId: quantity }

    // Загрузка данных из localStorage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }

    // Функция для отображения товаров в корзине
    function renderCartItems() {
        if (corzinaItems) {  // Проверка, что элемент существует
            corzinaItems.innerHTML = ''; // Очищаем текущее содержимое
        } else {
            console.error("Элемент с id 'corzina-items' не найден!");
            return; // Прекращаем выполнение функции, если элемента нет
        }

        let totalPrice = 0;
        for (const productId in cart) {
            const quantity = cart[productId];
            const price = 23; // Цена одного товара (замените на получение цены из данных о товаре)
            const itemTotal = quantity * price;
            totalPrice += itemTotal;

            // Создаем строку таблицы для каждого товара
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>
                        <div class="product-item">
                            <img src="" alt="Полянка" width="80">  <!-- Замените на правильное изображение -->
                            <span>«Полянка»</span> <!-- Замените на название товара -->
                        </div>
                    </td>
                    <td>23 руб.</td>
                    <td>
                        <div class="quantity-controls" data-product-id="${productId}">
                            <button class="minus-button">-</button>
                            <span class="quantity-display">${quantity}</span>
                            <button class="plus-button">+</button>
                        </div>
                    </td>
                    <td><span class="item-total">${itemTotal}</span> руб.</td>
                    <td>
                        <button class="remove-item">
                            <img src="" alt="Удалить" width="16" height="16">
                        </button>
                    </td>
                `;
            corzinaItems.appendChild(row);
        }

        // Обновляем общую стоимость
        if (totalPriceElement) {
            totalPriceElement.textContent = totalPrice;
        }

        // Обновляем информацию о минимальной сумме заказа (если нужно)
        if (minSumToOrderElement) {
            const minOrderSum = 250;
            const remaining = Math.max(0, minOrderSum - totalPrice); // Осталось до минимальной суммы
            minSumToOrderElement.textContent = remaining;
        }
    }

    // Отображаем товары в корзине при загрузке страницы
    renderCartItems();

    // Обработчики событий (делегирование событий)
    if (corzinaItems) {  // Проверяем, что элемент corzinaItems существует, прежде чем добавлять к нему обработчик событий
        corzinaItems.addEventListener('click', (event) => {
            const target = event.target;
            const productId = target.closest('.quantity-controls')?.dataset.productId;

            if (!productId) return; //  Если не нашли product-id, выходим

            if (target.classList.contains('plus-button')) {
                increaseQuantity(productId);
            } else if (target.classList.contains('minus-button')) {
                decreaseQuantity(productId);
            } else if (target.classList.contains('remove-item')) {
                removeItem(productId);
            }
        });
    }

    // Функции для управления количеством и удаления товаров
    function increaseQuantity(productId) {
        cart[productId]++;
        updateCart();
    }

    function decreaseQuantity(productId) {
        if (cart[productId] > 1) {
            cart[productId]--;
            updateCart();
        } else {
            removeItem(productId);
        }
    }

    function removeItem(productId) {
        delete cart[productId];
        updateCart();
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems(); // Перерисовываем корзину после изменений
    }
});