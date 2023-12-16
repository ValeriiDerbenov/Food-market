import {
  KEY_CART,
  addToCart,
} from '/js/cart-localestorage.js';
import axios from 'axios';
import iconsSvg from '/img/icons.svg';
import {updateCartNumber} from './header';
import {
  foodInfo,
  fetchAndRender,
  fetchFoodCategory,
  getCategoriesFromLS,
  KEY_CATEGORY,
  renderFoodItems,
  homManyLimit,
  add,
  // handleButtonClick,
  checkId,
} from './products.js';
import { openModalProduct } from '/js/modalwindow';

async function fetchPopularFood() {
  // Показываем лоадер перед запросом
  document.getElementById('overlay').style.display = 'flex';

  const url = `https://food-boutique.b.goit.study/api/products/popular`;
  try {
    const responce = await axios.get(url);
    return responce.data;
  } catch (error) {
    throw error;
  } finally {
    // Скрываем лоадер после выполнения запроса
    document.getElementById('overlay').style.display = 'none';
  }
}
 
const popularList = document.querySelector('.popular-list');
let prodList = [];

async function createMarkup() {
  const storage = localStorage.getItem(KEY_CART);
  const lim = 5;
  try {
    let responce = await fetchPopularFood();
    prodList = responce.slice(0, lim);
    const createProducts = prodList
      .map(({ img, name, popularity, category, size, _id }) => {

        const isIDInLocaleStorage = storage
        ? JSON.parse(storage).some(item => item._id === _id)
        : false;
      const svgHref = isIDInLocaleStorage
        ? `${iconsSvg}#icon-cart`
        : `${iconsSvg}#icon-shopping-cart`;

        const cleanedCategory = category.replace(/_/g, ' ');
        return `<li class="item-popular" data-id="${_id}">
        <div class="background-img-popular">
            <img src="${img}" alt="" class="img-popular" loading="lazy" />
        </div>
        <div class="popular-wrap">
        <h3 class="popular-name">${name}</h3>
        <div class="popular-info">
            <p class="popular-info-items">
                Category: <b class="value-popular">${cleanedCategory}</b>
            </p>
            <p class="popular-info-items">Size: <b class="value-popular">${size}</b></p>
            <p class="popular-info-items">Popularity: <b class="value-popular">${popularity}</b></p>
        </div>
        </div>
            <button class="popularBtn" aria-label="Add basket" data-_id="${_id}" ${
              isIDInLocaleStorage ? 'disabled' : ''
            }>
                <svg class="icon-popular" data-_id="${_id}" width="12" height="12">
                    <use class="use-popular" data-_id="${_id}"
                      href="${svgHref}"
                    ></use>
                </svg>
            </button>
    </li>`;
      })
      .join('');

    popularList.insertAdjacentHTML('beforeend', createProducts);
  } catch (error) {
    console.error(error);
  }
}

window.addEventListener('load', createMarkup);

const linkBag = document.querySelector('.popular-list');

linkBag.addEventListener('click', handleButtonClick);



function handleButtonClick(event) {
  // debugger;
  let noButton = 0;
  // отримуємо елемент, на якому відбувся клік
  const clickedElement = event.target;
  // Знаходимо найближчий батьківський елемнт типу button
  const closestButton = clickedElement.closest('button');
  // перевіряємо чи знайдено кнопку
  if (closestButton) {
    // Знаходимо найближчий батьківський елемент li
    const closestLi = closestButton.closest('li');
    // перевіряємо чи знайдено li
    if (closestLi) {
      // отримуємо значення data-id з li
      const dataId = closestLi.dataset.id;
      // знаходимо продукт за id в масиві prodList
      const clickedProduct = prodList.find(product => product._id === dataId);
      checkId(closestLi);
      // перевірка чи знайдено продукт
      if (clickedProduct) {
        // виклик функції на додавання в localeStorage
        noButton = 1;
        add(clickedProduct, prodList);
      }
    }
    // знаходимо елемент use в середині кнопки
    // const svg = closestButton.querySelector('.icon-pl use');
    // зміна svg
    // svg.setAttribute('href', `${iconSvg}#icon-cart`);
    // btn off
    closestButton.setAttribute('disabled', true);
  }
  const clickedLi = event.target.closest('li');
  if (clickedLi && !noButton) {
    const clickedId = clickedLi.dataset.id;
    openModalProduct(clickedId);
  }
}


// let btn;

// function addCart(evt) {
//   btn = evt.target.closest('.popularBtn');
//   if (evt.target.closest('.popularBtn')) {
//     addToCart(evt, prodList);
//   }

//   const svg = btn.querySelector('.icon-popular use');
//   svg.setAttribute('href', `${iconsSvg}#icon-cart`);
//   btn.setAttribute('disabled', true);
//   btn.style.cursor = 'auto';
//   btn.style.background = '#6d8434';
//   btn.style.border = '#6d8434';

//   updateCartNumber();
// }
