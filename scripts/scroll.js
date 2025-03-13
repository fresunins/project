'use strict';

document.addEventListener("DOMContentLoaded", () => {
    console.log('Скрипт отработал корректно1');

    /* 
        *   Алгоритм
        *
        *   1. Начало.
        *   2. Получаем кнопку.
        *   3. Проверка условия (навешиваем слушатели событий на click на кнопку): есть ли клик на кнопку.
        *       3.1. Да: Смотрим, нажата ли кнопка.
        *           3.1.1 Проверка условия.
        *               3.1.1.1. Да (кнопка уже нажата): смена цвета и текста кнопки в исходное положение.
        *               3.1.1.2. Нет (кнопка еще не нажата): смена цвета и текста кнопки.
        *       3.2. Нет: Конец.
        *   4. Конец.
        * 
        *   Блок-схема: img/diagram2.png 
        */

 

    // Scroll up
    const scrollUpButton = document.querySelector('.scroll-up');

    if (!scrollUpButton) return; // Если кнопки нет, выходим


    const windowHeight = document.documentElement.clientHeight; // Высота видимой части окна

    // Показать кнопку при прокрутке вниз на высоту экрана
    document.addEventListener('scroll', () => {
        let scrollPageY = window.scrollY; // Исправлено с this.scrollY

        if (scrollPageY >= windowHeight) {
        
            scrollUpButton.classList.add('scroll-up--show');
        } else {
            scrollUpButton.classList.remove('scroll-up--show');
       
        }
    });

    // Плавная прокрутка наверх при нажатии на кнопку
    scrollUpButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});