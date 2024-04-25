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

const applyNode = document.querySelector("#selet-apply");
applyNode.addEventListener("click", async (e) => {
  const speciesNode = document.querySelector("#charater-species").value;
  const genderNode = document.querySelector("#charater-Gender").value;
  console.log(genderNode);
  const statusNode = document.querySelector("#charater-Status").value;
  let apiUrl = `https://rickandmortyapi.com/api/character/?`;

  if (speciesNode) {
    apiUrl += `species = ${speciesNode}&`;
  }
  if (genderNode) {
    apiUrl += `gender = ${genderNode}&`;
  }

  if (statusNode) {
    apiUrl += `status = ${statusNode}&`;
  }

  try {
    const data = await getData(apiUrl);

    console.log(data);
    const filterStatus = data.results.filter((elem) => {
      return elem.status.toLowerCase() === statusNode.toLowerCase();
    });
    const filterSpecies = data.results.filter((elem) => {
      return elem.species.toLowerCase() === speciesNode.toLowerCase();
    });
    const filterRender = data.results.filter((elem) => {
      return elem.gender.toLowerCase() === genderNode.toLowerCase();
    });
    const totalArr = [...filterStatus, ...filterSpecies, ...filterRender];
    // console.log(totalArr);
    rendersCards(totalArr);
  } catch (error) {
    console.error(`error`);
  }
});

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
  getData(`https://rickandmortyapi.com/api/character/${id}`).then((data) => {
    document.body.innerHTML += ` 
          <div class="popup"> 
              <div class="popup__body"> 
                  <div class="popup__content"> 
                      <img src="${data.image}"></img> 
                      
                      <table> 
                          <tr><td>Status:</td> <td>${data.status}</td></tr> 
                          <tr><td>Gender:</td> <td>${data.gender}</td></tr> 
                          <tr><td>Species:</td> <td>${data.species}</td></tr> 
                          <tr><td>Location:</td> <td>${data.location.name}</td></tr> 
                      </table> 
                      <button class="popup__close" onclick='modalWindowClose()'>✖</button> 
                  </div> 
              </div> 
          </div> 
          `;
  });
}

function modalWindowClose() {
  const modalCobtainer = document.querySelector(".popup");
  const modalClose = document.querySelector(".popup__close");
  modalClose.addEventListener("click", (e) => {
    modalCobtainer.remove();
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
  searchCards(data.results);
  nextPage(data.info.pages);
  prevPage();
});
