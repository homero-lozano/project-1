document.addEventListener("DOMContentLoaded", () => {
  const cocktailContainer = document.getElementById("cocktail-container");
  const searchBar = document.getElementById("search-bar");
  const toggleButton = document.getElementById("toggle-mode");
  // Fetch Cocktails from json-server
  async function fetchCocktails(query = "") {
    const response = await fetch(`http://localhost:3000/cocktails`);
    const data = await response.json();
    const filteredData = data.filter(cocktail =>
      cocktail.name.toLowerCase().includes(query.toLowerCase())
    );
    displayCocktails(filteredData);
  }

  // Display Cocktails
  function displayCocktails(cocktails) {
    cocktailContainer.innerHTML = ""; // Clear container
    if (cocktails.length > 0) {
      cocktails.forEach((cocktail) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <h3>${cocktail.name}</h3>
          <img src="${cocktail.image}" alt="${cocktail.name}" width="100">
          <p>Category: ${cocktail.category}</p>
          <p class="description" style="display: none;">${cocktail.description || "No description available."}</p>
        `;

        // Add mouseover event
        card.addEventListener("mouseover", () => {
          card.style.backgroundColor = "#f0f8ff"; // Light blue highlight
          card.style.cursor = "pointer";
        });

        // Add mouseout event to reset styles
        card.addEventListener("mouseout", () => {
          card.style.backgroundColor = ""; // Reset to default
          card.style.cursor = "default";
        });

        // Add click event to show description
        card.addEventListener("click", () => {
          const description = card.querySelector(".description");
          if (description.style.display === "none") {
            description.style.display = "block"; // Show description
          } else {
            description.style.display = "none"; // Hide description
          }
        });

        cocktailContainer.appendChild(card);
      });
    } else {
      cocktailContainer.innerHTML = `<p>No cocktails found.</p>`;
    }
  }

<<<<<<< HEAD
  // Event Listeners
  searchBar.addEventListener("input", () => {
    const query = searchBar.value;
    fetchCocktails(query);
=======
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
>>>>>>> 418ca7ed3d3a974d99b723f5548ac006ded59059
  });

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
<<<<<<< HEAD
=======

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

>>>>>>> 418ca7ed3d3a974d99b723f5548ac006ded59059

  // Initial Fetch
  fetchCocktails();
});

<<<<<<< HEAD
=======
categoryFilter.addEventListener('change', () => {
  const category = categoryFilter.value === 'All' ? '' : categoryFilter.value;
  fetchCocktailsByCategory(category);
});

randomBtn.addEventListener('click', fetchRandomCocktail);

// Initial fetch
fetchCocktailsByName('');
>>>>>>> 418ca7ed3d3a974d99b723f5548ac006ded59059
