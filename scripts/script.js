let allPokemon = [];
let currentPokemon = [];
let currentOffset = 0;
let currentOverlayIndex = 0;
const LIMIT = 30;
const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';


async function init() {
  await loadPokemon();
}


async function loadPokemon() {
  showLoadingState();
  try {
    let pokemonList = await fetchPokemonList();
    await loadPokemonDetails(pokemonList);
  } catch (error) {
    console.error('Error loading Pokemon:', error);
  }
  currentPokemon = allPokemon.slice();
  renderPokemonList();
  hideLoadingState();
}


async function fetchPokemonList() {
  let url = BASE_URL + '?limit=' + LIMIT + '&offset=' + currentOffset;
  let response = await fetch(url);
  let data = await response.json();
  currentOffset += LIMIT;
  return data.results;
}


async function loadPokemonDetails(pokemonList) {
  for (let i = 0; i < pokemonList.length; i++) {
    let cached = findCachedPokemon(pokemonList[i].name);
    if (!cached) {
      let pokemon = await fetchPokemonDetails(pokemonList[i].url);
      allPokemon.push(pokemon);
    }
  }
}


function findCachedPokemon(name) {
  for (let i = 0; i < allPokemon.length; i++) {
    if (allPokemon[i].name === name) return allPokemon[i];
  }
  return null;
}


async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}


function renderPokemonList() {
  let container = document.getElementById('pokemon-container');
  container.innerHTML = '';
  for (let i = 0; i < currentPokemon.length; i++) {
    container.innerHTML += pokemonCardTemplate(currentPokemon[i], i);
  }
}


function showLoadingState() {
  let container = document.getElementById('pokemon-container');
  container.innerHTML += loadingSpinnerTemplate();
  let btn = document.getElementById('load-more-btn');
  btn.disabled = true;
}


function hideLoadingState() {
  let btn = document.getElementById('load-more-btn');
  btn.disabled = false;
}


function openOverlay(index) {
  currentOverlayIndex = index;
  let overlay = document.getElementById('overlay');
  let pokemon = currentPokemon[index];
  overlay.innerHTML = pokemonDetailTemplate(pokemon, index);
  overlay.classList.remove('d-none');
  document.body.classList.add('no-scroll');
}


function closeOverlay(event) {
  if (event.target.id !== 'overlay') return;
  let overlay = document.getElementById('overlay');
  overlay.classList.add('d-none');
  document.body.classList.remove('no-scroll');
}


function navigateOverlay(direction) {
  let newIndex = currentOverlayIndex + direction;
  if (newIndex < 0 || newIndex >= currentPokemon.length) return;
  openOverlay(newIndex);
}


function handleSearchInput() {
  let input = document.getElementById('search-input');
  let btn = document.getElementById('search-btn');
  let value = input.value.trim();
  btn.disabled = value.length < 3;
  if (value.length === 0) {
    resetSearch();
  }
}


function searchPokemon() {
  let input = document.getElementById('search-input');
  let searchTerm = input.value.trim().toLowerCase();
  if (searchTerm.length < 3) return;
  currentPokemon = allPokemon.filter(p => p.name.includes(searchTerm));
  renderPokemonList();
  showSearchResults();
}


function showSearchResults() {
  let container = document.getElementById('pokemon-container');
  let loadMoreBtn = document.getElementById('load-more-btn');
  loadMoreBtn.classList.add('d-none');
  if (currentPokemon.length === 0) {
    container.innerHTML = noResultsTemplate();
  }
}


function resetSearch() {
  currentPokemon = allPokemon.slice();
  renderPokemonList();
  let loadMoreBtn = document.getElementById('load-more-btn');
  loadMoreBtn.classList.remove('d-none');
}


async function loadMore() {
  await loadPokemon();
}
