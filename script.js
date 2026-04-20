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
    container.innerHTML += buildPokemonCard(currentPokemon[i], i);
  }
}


function appendPokemonCards(pokemonList, startIndex) {
  let container = document.getElementById('pokemon-container');
  let newCardsHtml = '';
  for (let i = 0; i < pokemonList.length; i++) {
    newCardsHtml += buildPokemonCard(pokemonList[i], startIndex + i);
  }
  container.insertAdjacentHTML('beforeend', newCardsHtml);
}


function showLoadingState() {
  let spinner = document.getElementById('loading-spinner');
  spinner.classList.remove('d-none');
  let btn = document.getElementById('load-more-btn');
  btn.disabled = true;
}


function hideLoadingState() {
  let spinner = document.getElementById('loading-spinner');
  spinner.classList.add('d-none');
  let btn = document.getElementById('load-more-btn');
  btn.disabled = false;
}


function openOverlay(index) {
  currentOverlayIndex = index;
  let overlay = document.getElementById('overlay');
  let pokemon = currentPokemon[index];
  overlay.innerHTML = buildPokemonDetail(pokemon, index);
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
  showLoadingState();
  try {
    let pokemonList = await fetchPokemonList();
    let startIndex = allPokemon.length;
    await loadPokemonDetails(pokemonList);
    let newPokemon = allPokemon.slice(startIndex);
    currentPokemon = allPokemon.slice();
    appendPokemonCards(newPokemon, startIndex);
  } catch (error) {
    console.error('Error loading Pokemon:', error);
  }
  hideLoadingState();
}


function buildPokemonCard(pokemon, index) {
  let mainType = pokemon.types[0].type.name;
  let typeBadges = getTypeBadgesHtml(pokemon);
  let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
  return pokemonCardTemplate(pokemon.id, pokemon.name, mainType, typeBadges, imgSrc, index);
}


function buildPokemonDetail(pokemon, index) {
  let prevBtn = getPrevButton(index);
  let nextBtn = getNextButton(index);
  let topHtml = buildOverlayTop(pokemon);
  let bottomHtml = buildOverlayBottom(pokemon);
  return pokemonDetailTemplate(prevBtn, nextBtn, topHtml, bottomHtml);
}


function buildOverlayTop(pokemon) {
  let mainType = pokemon.types[0].type.name;
  let typeBadges = getTypeBadgesHtml(pokemon);
  let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
  return overlayTopTemplate(pokemon.id, pokemon.name, mainType, typeBadges, imgSrc);
}


function buildOverlayBottom(pokemon) {
  let statsHtml = getStatsHtml(pokemon);
  return overlayBottomTemplate(statsHtml);
}


function getTypeBadgesHtml(pokemon) {
  let badges = '';
  for (let i = 0; i < pokemon.types.length; i++) {
    let typeName = pokemon.types[i].type.name;
    badges += `<span class="type-badge bg-${typeName}">${typeName}</span>`;
  }
  return badges;
}


function getStatsHtml(pokemon) {
  let html = '';
  for (let i = 0; i < pokemon.stats.length; i++) {
    let stat = pokemon.stats[i];
    let name = formatStatName(stat.stat.name);
    let value = stat.base_stat;
    let percent = (value / 255) * 100;
    if (percent > 100) percent = 100;
    let color = getStatBarColor(value);
    html += statRowTemplate(name, value, percent, color);
  }
  return html;
}


function formatStatName(name) {
  if (name === 'hp') return 'HP';
  if (name === 'special-attack') return 'Sp. Atk';
  if (name === 'special-defense') return 'Sp. Def';
  return name.charAt(0).toUpperCase() + name.slice(1);
}


function getStatBarColor(value) {
  if (value < 50) return '#EE8130';
  if (value < 80) return '#F7D02C';
  if (value < 120) return '#7AC74C';
  return '#6390F0';
}


function getPrevButton(index) {
  if (index <= 0) return '<div class="overlay-nav nav-left" style="visibility:hidden;"><span class="arrow arrow-left"></span></div>';
  return `<div class="overlay-nav nav-left" onclick="navigateOverlay(-1)"><span class="arrow arrow-left"></span></div>`;
}


function getNextButton(index) {
  if (index >= currentPokemon.length - 1) return '<div class="overlay-nav nav-right" style="visibility:hidden;"><span class="arrow arrow-right"></span></div>';
  return `<div class="overlay-nav nav-right" onclick="navigateOverlay(1)"><span class="arrow arrow-right"></span></div>`;
}
