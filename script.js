const LIMIT = 20;
let currentOffset = 0;
let loadedPokemonList = []; // Array holding loaded detailed pokemon objects

// Type color dictionary
const TYPE_COLORS = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

// DOM elements
const pokemonGrid = document.getElementById("pokemonGrid");
const searchInput = document.getElementById("searchInput");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const modalBody = document.getElementById("modalBody");

// Fetch 20 Pokémon items with Promise.all for speed
async function fetchPokemonPage(offset) {
  renderSkeletons();
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`,
    );
    const data = await response.json();

    // Fetch full details in parallel
    const detailPromises = data.results.map((pokemon) =>
      fetch(pokemon.url).then((res) => res.json()),
    );
    loadedPokemonList = await Promise.all(detailPromises);

    renderCards(loadedPokemonList);
    updatePaginationControls();
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    pokemonGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <h3>Failed to load Pokémon</h3>
                        <p>Please check your internet connection and try again.</p>
                    </div>`;
  }
}

function renderSkeletons() {
  pokemonGrid.innerHTML = "";
  for (let i = 0; i < LIMIT; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton skeleton-card";
    pokemonGrid.appendChild(skeleton);
  }
}

function renderCards(list) {
  pokemonGrid.innerHTML = "";

  if (list.length === 0) {
    pokemonGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <h3>No Pokémon Found</h3>
                        <p>Try searching for a different name!</p>
                    </div>`;
    return;
  }

  list.forEach((pokemon) => {
    const primaryType = pokemon.types[0]?.type?.name || "normal";
    const mainColor = TYPE_COLORS[primaryType] || "#A8A878";

    // Get high quality official artwork sprite
    const imageSrc =
      pokemon.sprites.other["official-artwork"].front_default ||
      pokemon.sprites.front_default ||
      "https://via.placeholder.com/150";

    const card = document.createElement("div");
    card.className = "card";
    card.style.borderTop = `3px solid ${mainColor}`;

    // Formatted ID
    const formattedId = `#${String(pokemon.id).padStart(3, "0")}`;

    card.innerHTML = `
                    <span class="card-id">${formattedId}</span>
                    <div class="image-wrapper">
                        <div class="image-bg-glow" style="background-color: ${mainColor}"></div>
                        <img class="pokemon-img" src="${imageSrc}" alt="${pokemon.name}" loading="lazy">
                    </div>
                    <h2 class="pokemon-name">${pokemon.name}</h2>
                    <div class="types-container">
                        ${pokemon.types
                          .map(
                            (t) => `
                            <span class="type-badge" style="background-color: ${TYPE_COLORS[t.type.name] || "#777"}">
                                ${t.type.name}
                            </span>
                        `,
                          )
                          .join("")}
                    </div>
                    <div class="pokemon-stats-mini">
                        <span><i class="fa-solid fa-ruler-vertical"></i> ${(pokemon.height / 10).toFixed(1)}m</span>
                        <span><i class="fa-solid fa-weight-hanging"></i> ${(pokemon.weight / 10).toFixed(1)}kg</span>
                    </div>
                    <button class="action-btn" onclick="openDetails(${pokemon.id})">
                        <i class="fa-solid fa-sparkles"></i> Meet ${pokemon.name}
                    </button>
                `;

    pokemonGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  const filtered = loadedPokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query),
  );
  renderCards(filtered);
});

function updatePaginationControls() {
  prevBtn.disabled = currentOffset === 0;
  const pageNum = Math.floor(currentOffset / LIMIT) + 1;
  pageInfo.textContent = `Page ${pageNum}`;
}

prevBtn.addEventListener("click", () => {
  if (currentOffset >= LIMIT) {
    currentOffset -= LIMIT;
    searchInput.value = "";
    fetchPokemonPage(currentOffset);
  }
});

nextBtn.addEventListener("click", () => {
  currentOffset += LIMIT;
  searchInput.value = "";
  fetchPokemonPage(currentOffset);
});

window.openDetails = function (pokemonId) {
  const pokemon = loadedPokemonList.find((p) => p.id === pokemonId);
  if (!pokemon) return;

  const primaryType = pokemon.types[0]?.type?.name || "normal";
  const mainColor = TYPE_COLORS[primaryType] || "#A8A878";
  const firstAbility = pokemon.abilities[0]?.ability?.name || "unknown ability";

  const imageSrc =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  // Audio cry URL
  const cryAudioUrl = pokemon.cries?.latest || pokemon.cries?.legacy || null;

  modalBody.innerHTML = `
                <div class="image-wrapper" style="width: 160px; height: 160px;">
                    <div class="image-bg-glow" style="background-color: ${mainColor}; opacity: 0.5;"></div>
                    <img class="pokemon-img" src="${imageSrc}" alt="${pokemon.name}">
                </div>
                <h2 style="text-transform: capitalize; font-size: 1.8rem; margin-top: 0.5rem;">${pokemon.name}</h2>
                
                <div class="quote-box">
                    "I am <strong>${pokemon.name}</strong> and I have <strong>${firstAbility}</strong>."
                </div>

                <div style="width: 100%; text-align: left; margin-top: 0.5rem;">
                    <h4 style="color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase;">All Abilities</h4>
                    <div class="abilities-list">
                        ${pokemon.abilities.map((a) => `<span class="ability-tag">${a.ability.name}</span>`).join("")}
                    </div>
                </div>

                ${
                  cryAudioUrl
                    ? `
                    <button class="sound-btn" onclick="playCry('${cryAudioUrl}')">
                        <i class="fa-solid fa-volume-high"></i> Play Pokémon Cry
                    </button>
                `
                    : ""
                }
            `;

  modalOverlay.classList.add("active");
};

window.playCry = function (url) {
  const audio = new Audio(url);
  audio.volume = 0.5;
  audio.play().catch((e) => console.log("Audio playback prevented:", e));
};

closeModal.addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove("active");
  }
});

// Initialize first fetch
window.onload = function () {
  fetchPokemonPage(currentOffset);
};
