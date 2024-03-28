const URL = 'https://pokeapi.co/api/v2/pokemon/';

const searchInput = document.getElementById('search');
const pokedexContainer = document.getElementById('pokedex');

// mensaje de error
function showError(message) {
    pokedexContainer.innerHTML = `<p class="error">${message}</p>`;
}

// buscar un Pokémon
async function searchPokemon() {
    
    const searchedPokemon = searchInput.value.toLowerCase();

    try {
        //peticion exitosa
        const response = await fetch(URL + searchedPokemon);
        if (!response.ok) {
            // mostrar un mensaje de error en caso contrario
            showError(`No se encontró ningún Pokémon llamado "${searchedPokemon}"`);
            return;
        }

        // Convertir a JSON
        const data = await response.json();

        // datos del Pokémon 
        pokedexContainer.innerHTML = 
        `
            <h2>${data.name.toUpperCase()}</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <p>Número: ${data.id}</p>
            <p>Altura: ${data.height / 10}m</p>
            <p>Peso: ${data.weight / 10}km</p>
        `;
    } catch (error) {
        // si hay error mostrar mensaje
        showError('Ha ocurrido un error al buscar el Pokémon');
        console.error(error);
    }
}


// botón de búsqueda
document.querySelector('button').addEventListener('click', searchPokemon);


//tarjetas de pokemones parte2
const pokemonContainer = document.querySelector(".pokemon-container");
const spinner = document.querySelector("#spinner");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

//traer la cantidad de pokemones
let limit = 8;
let offset = 1;

//traer pokemones no repetidos
previous.addEventListener("click", () => {
  if (offset != 1) {
    offset -= 9;
    removeChildNodes(pokemonContainer);
    fetchPokemons(offset, limit);
  }
});

//traer los siguientes pokemones
next.addEventListener("click", () => {
  offset += 9;
  removeChildNodes(pokemonContainer);
  fetchPokemons(offset, limit);
});


function fetchPokemon(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())
    .then((data) => {
      createPokemon(data);
      spinner.style.display = "none";
    });
}

//traer pokemones
function fetchPokemons(offset, limit) {
  spinner.style.display = "block";
  for (let i = offset; i <= offset + limit; i++) {
    fetchPokemon(i);
  }
}

//mostrar informacion de los pokemones en su carta
function createPokemon(pokemon) {
  const flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  flipCard.appendChild(cardContainer);

  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");

  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default;

  spriteContainer.appendChild(sprite);

  const number = document.createElement("p");
  number.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = pokemon.name;

  card.appendChild(spriteContainer);
  card.appendChild(number);
  card.appendChild(name);

//parte atras de la carta
  const cardBack = document.createElement("div");
  cardBack.classList.add("pokemon-block-back");

  cardBack.appendChild(progressBars(pokemon.stats));

  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);
  pokemonContainer.appendChild(flipCard);
}

//contenido de la carta parte de atras
function progressBars(stats) {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  for (let i = 0; i < 4; i++) {
    const stat = stats[i];

    //porcentaje de ataque, defensa, etc, de pokemones
    const statPercent = stat.base_stat / 2 + "%";
    const statContainer = document.createElement("stat-container");
    statContainer.classList.add("stat-container");

    const statName = document.createElement("p");
    statName.textContent = stat.stat.name;

    const progress = document.createElement("div");
    progress.classList.add("progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.setAttribute("aria-valuenow", stat.base_stat);
    progressBar.setAttribute("aria-valuenow", 5);
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 200);
    progressBar.style.width = statPercent;

    progressBar.textContent = stat.base_stat;

    progress.appendChild(progressBar);
    statContainer.appendChild(statName);
    statContainer.appendChild(progress);

    statsContainer.appendChild(statContainer);
  }

  return statsContainer;
}

//remover pokemones 
function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

fetchPokemons(offset, limit);