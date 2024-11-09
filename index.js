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

  cocktails.forEach((cocktail) => {
    const cocktailCard = document.createElement('div');
    cocktailCard.className = 'cocktail-card';
    cocktailCard.innerHTML = `
      <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
      <h3>${cocktail.strDrink}</h3>
      <button data-id="${cocktail.idDrink}" class="details-btn">View Details</button>
    `;
    cocktailContainer.appendChild(cocktailCard);
  });

  // Add event listeners for "View Details" buttons
  document.querySelectorAll('.details-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      fetchCocktailDetails(e.target.dataset.id);
    });
  });
}

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
