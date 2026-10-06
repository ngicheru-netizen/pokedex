# Pokédex Explorer

Pokédex Explorer is a responsive, browser-based Pokédex that retrieves Pokémon data from the [PokéAPI](https://pokeapi.co/) and presents it in an interactive card grid.

## Features

- Loads Pokémon in pages of 20.
- Displays each Pokémon's official artwork, ID, name, types, height, and weight.
- Searches the currently loaded page by Pokémon name.
- Provides previous and next page navigation.
- Shows loading skeletons while data is being fetched.
- Opens a detail modal with:
  - Official artwork
  - The Pokémon's abilities
  - A highlighted primary ability
  - A button for playing the Pokémon's latest or legacy cry when available
- Displays an error message when the API request fails.
- Uses responsive styling for desktop and smaller screens.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- [PokéAPI](https://pokeapi.co/)
- [Font Awesome](https://fontawesome.com/)
- Google Fonts:
  - Plus Jakarta Sans
  - Press Start 2P

## Project Structure

```text
pokedex/
├── index.html   # Page structure and application markup
├── script.js    # API requests, rendering, search, pagination, and modal logic
├── styles.css   # Layout, responsive styles, animations, and theme colors
└── README.md    # Project documentation
```

## Getting Started

### Prerequisites

No build tools or package installation are required. You only need:

- A modern web browser
- An internet connection, because Pokémon data and assets are loaded from external services

### Run locally

From this directory, start a local development server. For example, with Python:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

You can also open `index.html` directly in a browser, although a local server is recommended for more consistent browser behavior.

## How to Use

1. Open the application in a browser.
2. Browse the first page of Pokémon cards.
3. Use **Next** and **Prev** to move between pages.
4. Enter a name in the search field to filter the Pokémon currently loaded.
5. Select **Meet [Pokémon]** to view abilities and play the Pokémon's cry when one is available.
6. Close the detail modal using the close button or by clicking outside the modal.

## API Usage

The application uses two PokéAPI endpoints:

```text
https://pokeapi.co/api/v2/pokemon?limit=20&offset=<offset>
https://pokeapi.co/api/v2/pokemon/<name-or-id>
```

The first request retrieves a page of Pokémon references. The application then requests the full details for each Pokémon in parallel using `Promise.all`.

## Notes

- Search filters only the Pokémon on the page currently loaded; it does not search the complete PokéAPI catalogue.
- The **Next** button is intentionally available for continued pagination.
- External fonts, icons, artwork, and API data require network access.
- This project is a static front-end assignment and does not include a backend or database.

## License

This project is intended for educational use. Pokémon names, artwork, sounds, and related data are provided by their respective owners and the PokéAPI service.
