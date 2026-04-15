function pokemonCardTemplate(pokemon, index) {
  let typeBadges = '';
  for (let i = 0; i < pokemon.types.length; i++) {
    let typeName = pokemon.types[i].type.name;
    typeBadges += `<span class="type-badge bg-${typeName}">${typeName}</span>`;
  }
  let mainType = pokemon.types[0].type.name;
  return `
    <div class="pokemon-card bg-${mainType}" onclick="openOverlay(${index})">
      <span class="card-id">#${pokemon.id}</span>
      <span class="card-name">${pokemon.name}</span>
      <div class="card-types">${typeBadges}</div>
      <img class="card-img" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
    </div>`;
}


function pokemonDetailTemplate(pokemon, index) {
  let mainType = pokemon.types[0].type.name;
  let typeBadges = getOverlayTypeBadges(pokemon);
  let statsHtml = getStatsHtml(pokemon);
  let prevBtn = getPrevButton(index);
  let nextBtn = getNextButton(index);
  return `
    <div class="overlay-inner">
      ${prevBtn}
      <div class="overlay-card">
        <div class="overlay-top bg-${mainType}">
          <span class="overlay-id">#${pokemon.id}</span>
          <span class="overlay-name">${pokemon.name}</span>
          <div class="overlay-types">${typeBadges}</div>
          <img class="overlay-img" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
        </div>
        <div class="overlay-bottom">
          <h3>Base Stats</h3>
          ${statsHtml}
        </div>
      </div>
      ${nextBtn}
    </div>`;
}


function getOverlayTypeBadges(pokemon) {
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
    let percent = Math.min((value / 255) * 100, 100);
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


function statRowTemplate(name, value, percent, color) {
  return `
    <div class="stat-row">
      <span class="stat-name">${name}</span>
      <span class="stat-value">${value}</span>
      <div class="stat-bar-bg">
        <div class="stat-bar" style="width: ${percent}%; background-color: ${color};"></div>
      </div>
    </div>`;
}


function getPrevButton(index) {
  if (index <= 0) return '<div class="overlay-nav nav-left" style="visibility:hidden;">&#8592;</div>';
  return `<div class="overlay-nav nav-left" onclick="navigateOverlay(-1)">&#8592;</div>`;
}


function getNextButton(index) {
  if (index >= currentPokemon.length - 1) return '<div class="overlay-nav nav-right" style="visibility:hidden;">&#8594;</div>';
  return `<div class="overlay-nav nav-right" onclick="navigateOverlay(1)">&#8594;</div>`;
}


function loadingSpinnerTemplate() {
  return `<div class="loading-spinner"><div class="spinner"></div></div>`;
}


function noResultsTemplate() {
  return `<div class="no-results">No Pokemon found. Try a different search.</div>`;
}
