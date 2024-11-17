document.addEventListener("DOMContentLoaded", () => console.log())

function fetchData() {
    fetch('url')
    .then((resp) => resp.json())
    .then(() => console.log(data))
}

const cocktailContainer = document.getElementById('cocktail-container');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const randomBtn = document.getElementById('random-btn');

// Fetch and display cocktails by name
async function fetchCocktailsByName(name) {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
    const data = await response.json();

    // Handle case where no drinks are found
    if (!data.drinks) {
      console.log('No cocktails found');
      displayCocktails(null);
      return;
    }

    displayCocktails(data.drinks);
  } catch (error) {
    console.error('Error fetching cocktails:', error);
    cocktailContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
  }
}
async function fetchCocktailsByCategory(category) {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();

    // Handle case where no drinks are found
    if (!data.drinks) {
      console.log('No cocktails found for this category');
      displayCocktails(null);
      return;
    }

    displayCocktails(data.drinks);
  } catch (error) {
    console.error('Error fetching cocktails by category:', error);
    cocktailContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
  }
}
categoryFilter.addEventListener('change', () => {
  const category = categoryFilter.value === 'All' ? '' : categoryFilter.value;
  fetchCocktailsByCategory(category);
});


// Fetch and display a random cocktail
async function fetchRandomCocktail() {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`);
  const data = await response.json();
  displayCocktails(data.drinks);
}

// Display cocktails in the DOM
function displayCocktails(cocktails) {
  cocktailContainer.innerHTML = '';
  if (!cocktails || !Array.isArray(cocktails)) {
    cocktailContainer.innerHTML = '<p>No cocktails found!</p>';
    return;
  }

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  cocktails.forEach((cocktail) => {
    const isFavorite = favorites.includes(cocktail.idDrink);
    const cocktailCard = document.createElement('div');
    cocktailCard.className = 'cocktail-card';
    cocktailCard.innerHTML = `
      <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
      <h3>${cocktail.strDrink}</h3>
      <button data-id="${cocktail.idDrink}" class="details-btn">View Details</button>
      <button data-id="${cocktail.idDrink}" class="favorite-btn">${isFavorite ? '❤️' : '♡'}</button>
    `;
    cocktailContainer.appendChild(cocktailCard);
  });

  // Add event listeners for "View Details" buttons
  document.querySelectorAll('.details-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      fetchCocktailDetails(e.target.dataset.id);
    });
  });

  // Add event listeners for "Favorite" buttons
  document.querySelectorAll('.favorite-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      toggleFavorite(e.target.dataset.id);
    });
  });
}
function toggleFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.includes(id)) {
    // Remove from favorites
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    // Add to favorites
    favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));

  // Re-fetch and display cocktails to update the DOM
  fetchCocktailsByName(searchInput.value);
}
function fetchFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.length) {
    cocktailContainer.innerHTML = '<p>No favorites added!</p>';
    return;
  }

  Promise.all(
    favorites.map((id) =>
      fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((resp) => resp.json())
        .then((data) => data.drinks[0])
    )
  )
    .then((drinks) => displayCocktails(drinks))
    .catch((error) => {
      console.error('Error fetching favorites:', error);
      cocktailContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    });
}

// Add event listener for a "View Favorites" button
document.getElementById('view-favorites-btn').addEventListener('click', fetchFavorites);


// Fetch and display cocktail details
async function fetchCocktailDetails(id) {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();
  const cocktail = data.drinks[0];
  cocktailContainer.innerHTML = `
    <div class="cocktail-details">
      <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
      <h2>${cocktail.strDrink}</h2>
      <p><strong>Category:</strong> ${cocktail.strCategory}</p>
      <p><strong>Alcoholic:</strong> ${cocktail.strAlcoholic}</p>
      <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
      <h3>Ingredients:</h3>
      <ul>
        ${Object.keys(cocktail)
          .filter((key) => key.startsWith('strIngredient') && cocktail[key])
          .map((key) => `<li>${cocktail[key]}</li>`)
          .join('')}
      </ul>
      <button id="back-btn">Back</button>
    </div>
  `;

  // Add event listener for the back button
  document.getElementById('back-btn').addEventListener('click', () => {
    fetchCocktailsByName(searchInput.value);
  });
}

// Event listeners
searchInput.addEventListener('input', () => {
  fetchCocktailsByName(searchInput.value);
});

categoryFilter.addEventListener('change', () => {
  const category = categoryFilter.value === 'All' ? '' : categoryFilter.value;
  fetchCocktailsByCategory(category);
});

randomBtn.addEventListener('click', fetchRandomCocktail);

// Initial fetch
fetchCocktailsByName('');