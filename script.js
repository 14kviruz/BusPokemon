document.getElementById('search-btn').addEventListener('click', async () => {
    const pokemonNameOrId = document.getElementById('pokemon-input').value.trim().toLowerCase();
    if (pokemonNameOrId) {
        // Obtener datos del Pokémon
        const pokemonData = await fetchPokemonData(pokemonNameOrId);
        if (pokemonData) {
            // Mostrar modal con información del Pokémon
            populateCarousel(pokemonData);
            const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
            pokemonModal.show();
        } else {
            alert('No se encontró el Pokémon');
        }
    } else {
        alert('Por favor, ingresa un nombre o ID de Pokémon');
    }
});

const words = document.querySelectorAll('.word');
words.forEach(word => {
  const randomSize = Math.floor(Math.random() * 20) + 20;  // Tamaños entre 20px y 40px
  word.style.fontSize = `${randomSize}px`;
  word.style.color = `#${Math.floor(Math.random()*16777215).toString(16)}`;  // Color aleatorio
});


// Función para obtener datos del Pokémon desde la PokeAPI
async function fetchPokemonData(nameOrId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
        const pokemonData = await response.json();
        return pokemonData;
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        return null;
    }
}

// Función para poblar el carrusel con las evoluciones del Pokémon
async function populateCarousel(pokemonData) {
    const carouselInner = document.getElementById('carousel-inner');
    carouselInner.innerHTML = '';  // Limpiar el carrusel

    // Slide 1: Mostrar imagen y características del Pokémon principal
    const firstSlide = createCarouselItem(pokemonData.sprites.front_default, pokemonData);
    carouselInner.appendChild(firstSlide);

    // Obtener evoluciones del Pokémon
    const speciesData = await fetch(pokemonData.species.url);
    const species = await speciesData.json();
    const evolutionChainData = await fetch(species.evolution_chain.url);
    const evolutionChain = await evolutionChainData.json();

    // Recorrer la cadena de evoluciones
    let evolutions = [evolutionChain.chain];
    while (evolutions.length > 0) {
        const currentEvolution = evolutions.shift();
        if (currentEvolution.evolves_to.length > 0) {
            evolutions = evolutions.concat(currentEvolution.evolves_to);
        }

        if (currentEvolution.species.name !== pokemonData.name) {
            const evolvedPokemonData = await fetchPokemonData(currentEvolution.species.name);
            const evolutionSlide = createCarouselItem(evolvedPokemonData.sprites.front_default, evolvedPokemonData);
            carouselInner.appendChild(evolutionSlide);
        }
    }

    // Hacer el primer slide activo
    carouselInner.firstElementChild.classList.add('active');
}

// Función para crear un item de carrusel con la imagen y características del Pokémon
function createCarouselItem(imgUrl, pokemonData) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('carousel-item');

    const imgElement = document.createElement('img');
    imgElement.src = imgUrl;
    imgElement.alt = pokemonData.name;
    imgElement.classList.add('d-block', 'w-100');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('pokemon-info', 'text-center');
    infoDiv.innerHTML = `
        <h5>${pokemonData.name.toUpperCase()} N°${pokemonData.id}</h5>
        <p><strong>Altura:</strong> ${pokemonData.height / 10} m</p>
        <p><strong>Peso:</strong> ${pokemonData.weight / 10} kg</p>
        <p><strong>Tipo:</strong> ${pokemonData.types.map(t => t.type.name).join(', ')}</p>
    `;

    itemDiv.appendChild(imgElement);
    itemDiv.appendChild(infoDiv);

    return itemDiv;
}

// Capturar el botón y el input
const searchBtn = document.getElementById('search-btn');
const pokemonInput = document.getElementById('pokemon-input');
const searchHistory = document.getElementById('search-history');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const errorAlert = document.getElementById('error-alert');

// Función para agregar al historial
function addToHistory(pokemonName) {
    // Crea un nuevo elemento de lista
    const li = document.createElement('li');
    li.textContent = pokemonName;
    
    // Agrega el nuevo elemento al historial
    searchHistory.appendChild(li);
}

// Al hacer clic en el botón de buscar
searchBtn.addEventListener('click', function() {
    const pokemonName = pokemonInput.value.trim();

    if (pokemonName) {
        // Agregar el nombre del Pokémon al historial
        addToHistory(pokemonName);
        
        // Limpiar el input
        pokemonInput.value = '';
    }
// Función para limpiar el historial
function clearHistory() {
    searchHistory.innerHTML = ''; // Eliminar todo el contenido del historial
}

// Agregar evento de clic para eliminar el historial
clearHistoryBtn.addEventListener('click', clearHistory);


// Función que simula la búsqueda de un Pokémon
function searchPokemon(pokemonName) {
    let found = false; // Simulamos que no se encuentra el Pokémon (modificar según tu lógica)

    if (!found) {
        // Mostrar alerta cuando no se encuentra el Pokémon
        errorAlert.style.display = 'block';

        // Después de 3 segundos (3000 ms), ocultar la alerta automáticamente
        setTimeout(function() {
            errorAlert.style.display = 'none';
        }, 3000); // Cambia el tiempo si quieres que dure más o menos tiempo
    } else {
        // Ocultar el mensaje si se encuentra el Pokémon
        errorAlert.style.display = 'none';
    }
}

// Evento para el botón de buscar Pokémon
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', function() {
    const pokemonInput = document.getElementById('pokemon-input').value;
    searchPokemon(pokemonInput);
});

});

