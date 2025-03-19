document.addEventListener('DOMContentLoaded', () => {
    console.log('Скрипт catalog.js отработал корректно');

    /*
     * 1. Управление корзиной товаров: добавление, изменение количества, удаление.
     *
     * Алгоритм:
     * 1. Начало.
     * 2. Инициализация:
     *    2.1. Получаем ссылки на элементы DOM (cartCountSpan).
     *    2.2. Создаем объект cart для хранения товаров в корзине (productId: quantity).
     * 3. Загрузка данных о корзине из localStorage:
     *    3.1. Проверяем наличие данных в localStorage.
     *    3.2. Если данные есть, загружаем их в объект cart.
     *    3.3. Обновляем отображение количества товаров и общее количество в корзине.
     * 4. Функции обновления отображения:
     *    4.1. updateCartCount():
     *       4.1.1. Подсчитывает общее количество товаров в корзине.
     *       4.1.2. Обновляет текст элемента cartCountSpan.
     *    4.2. updateQuantityDisplays():
     *       4.2.1. Проходит по всем элементам product-controls.
     *       4.2.2. Для каждого товара проверяет, есть ли он в корзине.
     *       4.2.3. Если товар есть, отображает кнопки "+" и "-" и количество товара.
     *       4.2.4. Если товара нет, отображает кнопку "Купить".
     * 5. Обработчик событий клика:
     *    5.1. Вешаем обработчик на document для делегирования событий.
     *    5.2. Определяем, на какой элемент был произведен клик:
     *       5.2.1. Кнопка "Купить": вызываем addToCart().
     *       5.2.2. Кнопка "+": вызываем increaseQuantity().
     *       5.2.3. Кнопка "-": вызываем decreaseQuantity().
     * 6. Функции управления корзиной:
     *    6.1. addToCart(productId):
     *       6.1.1. Увеличивает количество товара в корзине или добавляет его, если его не было.
     *       6.1.2. Вызывает updateCartAndDisplay() для сохранения в localStorage и обновления отображения.
     *    6.2. increaseQuantity(productId):
     *       6.2.1. Увеличивает количество товара в корзине.
     *       6.2.2. Вызывает updateCartAndDisplay() для сохранения в localStorage и обновления отображения.
     *    6.3. decreaseQuantity(productId):
     *       6.3.1. Уменьшает количество товара в корзине.
     *       6.3.2. Если количество товара равно 0, удаляем товар из корзины.
     *       6.3.3. Вызывает updateCartAndDisplay() для сохранения в localStorage и обновления отображения.
     *    6.4. removeFromCart(productId):
     *       6.4.1. Удаляет товар из корзины.
     *       6.4.2. Вызывает updateCartAndDisplay() для сохранения в localStorage и обновления отображения.
     *    6.5. updateCartAndDisplay(productId):
     *       6.5.1. Сохраняет объект cart в localStorage.
     *       6.5.2. Вызывает updateCartCount() для обновления общего количества в корзине.
     *       6.5.3. Вызывает updateQuantityDisplays() для обновления отображения количества товаров.
     * 7. Функция отображения кнопок "+" и "-" и количества товара:
     *    7.1. showQuantityControls(productId):
     *       7.1.1. Находит элемент product-controls для данного товара.
     *       7.1.2. Заменяет содержимое элемента кодом с кнопками "+" и "-", и отображением количества.
     * 8. Конец.
     */

    const cartCountSpan = document.getElementById('cart-count');
    let cart = {}; // {productId: quantity}

    // Загрузка данных из localStorage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartCount();
        updateQuantityDisplays();
    }

    // Функции для обновления отображения
    function updateCartCount() {
        if (cartCountSpan) {
            let totalItems = 0;
            for (const productId in cart) {
                totalItems += cart[productId];
            }
            cartCountSpan.textContent = totalItems;
        }
    }

    function updateQuantityDisplays() {
        const productControls = document.querySelectorAll('.product-controls');
        productControls.forEach(controls => {
            const productId = controls.dataset.productId;
            const quantityDisplay = controls.querySelector('.quantity-display');

            if (cart[productId]) {
                if (quantityDisplay) {
                    quantityDisplay.textContent = cart[productId];
                } else {
                    showQuantityControls(productId);
                }

            } else {
                // Если товара нет в корзине, показываем кнопку "Купить"
                if (quantityDisplay) {
                    controls.innerHTML = `<button class="product__button buy-button">Купить</button>`;
                }
            }
        });
    }

    // Обработчик кликов
    document.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('buy-button')) {
            const productId = target.closest('.product-controls').dataset.productId;
            addToCart(productId);
        } else if (target.classList.contains('plus-button')) {
            const productId = target.closest('.product-controls').dataset.productId;
            increaseQuantity(productId);
        } else if (target.classList.contains('minus-button')) {
            const productId = target.closest('.product-controls').dataset.productId;
            decreaseQuantity(productId);
        }
    });

    // Функции для управления корзиной
    function addToCart(productId) {
        cart[productId] = (cart[productId] || 0) + 1; // Добавляем или увеличиваем количество
        updateCartAndDisplay(productId);
    }

    function increaseQuantity(productId) {
        cart[productId]++;
        updateCartAndDisplay(productId);
    }

    function decreaseQuantity(productId) {
        if (cart[productId] > 1) {
            cart[productId]--;
            updateCartAndDisplay(productId);
        } else {
            removeFromCart(productId);
        }
    }

    function removeFromCart(productId) {
        delete cart[productId];
        updateCartAndDisplay(productId);
    }

    function updateCartAndDisplay(productId) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateQuantityDisplays();
    }

    function showQuantityControls(productId) {
        const productControls = document.querySelector(`.product-controls[data-product-id="${productId}"]`);
        if (!productControls) return;

        const quantity = cart[productId] || 0;
        productControls.innerHTML = `
            <button class="minus-button">-</button>
            <span class="quantity-display">${quantity}</span>
            <button class="plus-button">+</button>
        `;
    }
});