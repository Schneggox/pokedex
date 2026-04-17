function pokemonCardTemplate(pokemon, index) {
  let mainType = pokemon.types[0].type.name;
  let typeBadges = getTypeBadgesHtml(pokemon);
  let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
  return `
    <div class="pokemon-card bg-${mainType}" onclick="openOverlay(${index})">
      <span class="card-id">#${pokemon.id}</span>
      <span class="card-name">${pokemon.name}</span>
      <div class="card-types">${typeBadges}</div>
      <img class="card-img" src="${imgSrc}" alt="${pokemon.name}">
    </div>`;
}


function pokemonDetailTemplate(pokemon, index) {
  let prevBtn = getPrevButton(index);
  let nextBtn = getNextButton(index);
  let topHtml = overlayTopTemplate(pokemon);
  let bottomHtml = overlayBottomTemplate(pokemon);
  return `
    <div class="overlay-inner">
      ${prevBtn}
      <div class="overlay-card">${topHtml}${bottomHtml}</div>
      ${nextBtn}
      <div class="overlay-arrows">${prevBtn}${nextBtn}</div>
    </div>`;
}


function overlayTopTemplate(pokemon) {
  let mainType = pokemon.types[0].type.name;
  let typeBadges = getTypeBadgesHtml(pokemon);
  let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
  return `
    <div class="overlay-top bg-${mainType}">
      <span class="overlay-id">#${pokemon.id}</span>
      <span class="overlay-name">${pokemon.name}</span>
      <div class="overlay-types">${typeBadges}</div>
      <img class="overlay-img" src="${imgSrc}" alt="${pokemon.name}">
    </div>`;
}


function overlayBottomTemplate(pokemon) {
  let statsHtml = getStatsHtml(pokemon);
  return `
    <div class="overlay-bottom">
      <h3>Base Stats</h3>
      ${statsHtml}
    </div>`;
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


function noResultsTemplate() {
  return `<div class="no-results">No Pokemon found. Try a different search.</div>`;
}
