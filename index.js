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

  // Event Listeners
  searchBar.addEventListener("input", () => {
    const query = searchBar.value;
    fetchCocktails(query);
  });

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  // Initial Fetch
  fetchCocktails();
});

