function pokemonCardTemplate(id, name, mainType, typeBadges, imgSrc, index) {
  return `
    <div class="pokemon-card bg-${mainType}" onclick="openOverlay(${index})">
      <span class="card-id">#${id}</span>
      <span class="card-name">${name}</span>
      <div class="card-types">${typeBadges}</div>
      <img class="card-img" src="${imgSrc}" alt="${name}">
    </div>`;
}


function pokemonDetailTemplate(prevBtn, nextBtn, topHtml, bottomHtml) {
  return `
    <div class="overlay-inner">
      ${prevBtn}
      <div class="overlay-card">${topHtml}${bottomHtml}</div>
      ${nextBtn}
      <div class="overlay-arrows">${prevBtn}${nextBtn}</div>
    </div>`;
}


function overlayTopTemplate(id, name, mainType, typeBadges, imgSrc) {
  return `
    <div class="overlay-top bg-${mainType}">
      <span class="overlay-id">#${id}</span>
      <span class="overlay-name">${name}</span>
      <div class="overlay-types">${typeBadges}</div>
      <img class="overlay-img" src="${imgSrc}" alt="${name}">
    </div>`;
}


function overlayBottomTemplate(statsHtml) {
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
