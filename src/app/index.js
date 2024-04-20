// https://rickandmortyapi.com/api

// fetch  Используется для отправки запросов на сервер и получение данных.

async function getData(url) {
  const result = await fetch(url); //почитать
  if (!result.ok) {
    throw new Error(`Ошибка:${result.status}`);
  }
  return result.json();
}

const gridNode = document.querySelector(".grid-wrapp");
let totalPage = 1;

function rendersCards(character) {
  const gridNode = document.querySelector(".grid-wrapp");
  gridNode.innerHTML = "";
  character.forEach((elem) => {
    gridNode.innerHTML += `  <article class="character">
            <img class="character__img" src="${elem.image}" alt="#" />
            <div class="character__description">
              <h3 class="character__name">${elem.name}</h3>
              <p class="character__location-name">${elem.location.name}</p>
              <button class="character__btn"onclick="modalWindow(${elem.id})">More</button>
            </div>
          </article>`;
  });
}

function searchCards(data) {
  const inputeNode = document.querySelector(".header__input");
  inputeNode.addEventListener("input", (e) => {
    const value = e.target.value;
    const filter = data.filter((elem) => {
      return elem.name.toLowerCase().includes(value.toLowerCase()); //!!!
    });
    rendersCards(filter);
  });
}

function modalWindow(id) {
  modalWindowOpen();
  getData(`https://rickandmortyapi.com/api/character/${id}`).then((data) => {
    const cardNode = document.querySelector(".card");

    cardNode.innerHTML = "";
    cardNode.innerHTML += `<div class="card__img-wrapp">
            <img class="card__img" src="${data.image}" alt="#" />
          </div>
          
          <div class="card__info">
            <div class="card__description">
              <p class="card__text">Status</p>
              <p class="card__text">${data.status}</p>
            </div>
            <div class="card__description">
              <p class="card__text">Gender:</p>
              <p class="card__text">${data.gender}</p>
            </div>
            <div class="card__description">
              <p class="card__text">Species:</p>
              <p class="card__text">${data.species}</p>
            </div>
            <div class="card__description">
              <p class="card__text">Location:</p>
              <p class="card__text">${data.location.name}</p>
            </div>
          </div>
          <div class="card__close"onclick="modalWindowClose()">✖</div>`;
  });
}

function modalWindowOpen() {
  const modalNode = document.querySelector(".modal");
  const btnNode = document.querySelectorAll(".character__btn");
  btnNode.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      modalNode.style.display = "flex";
    });
  });
}

function modalWindowClose() {
  const modalNode = document.querySelector(".modal");
  const modalClose = document.querySelector(".card__close");
  modalClose.addEventListener("click", (e) => {
    modalNode.style.display = "none";
  });
}

function changePage(page) {
  getData(`https://rickandmortyapi.com/api/character?page=${page}`).then(
    (data) => {
      gridNode.innerHTML = ``;
      rendersCards(data.results);
    }
  );
}

const backNode = document.querySelector(".arrow__left");
const rightNode = document.querySelector(".arrow__right");
const countNode = document.querySelector(".arrow__count");

function nextPage(page) {
  rightNode.addEventListener("click", (e) => {
    if (totalPage === page) {
      e.stopPropagation();
    } else {
      totalPage++;
      countNode.textContent = totalPage;
      changePage(totalPage);
    }
  });
}

function prevPage() {
  backNode.addEventListener("click", (e) => {
    if (totalPage === 1) {
      e.stopPropagation();
    } else {
      totalPage--;
      countNode.textContent = totalPage;
      changePage(totalPage);
    }
  });
}

getData("https://rickandmortyapi.com/api/character").then((data) => {
  rendersCards(data.results);
  // modalWindow();
  searchCards(data.results);
  // modalWindowClose();
  nextPage(data.info.pages);
  prevPage();
  // modalWindowOpen();
});
