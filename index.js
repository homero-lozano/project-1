document.addEventListener("DOMContentLoaded", () => {
  const cocktailContainer = document.getElementById("cocktail-container");
  console.log(cocktailContainer) 
  // Fetch Cocktails from json-server
  const fetchCocktails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cocktails`);
      const cocktails = await response.json();
      console.log("Fetched cocktails:", cocktails)
      displayCocktails(cocktails);
    } catch (error) {
      console.error("Error fetching cocktails:", error);
      cocktailContainer.innerHTML = "<p>Error loading cocktails. Please try again later.</p>";
    }
  };

  // Display cocktails
  const displayCocktails = (cocktails) => {
    cocktailContainer.innerHTML = ""; // Clear container
    if (cocktails.length > 0) {
      cocktailContainer.innerHTML = cocktails.map(createCard).join("");
      attachEventListeners();
    } else {
      cocktailContainer.innerHTML = "<p>No cocktails found.</p>";
    }
  };

  // Create a cocktail card
  const createCard = (cocktail) => `
    <div class="card">
      <h3>${cocktail.name}</h3>
      <img src="${cocktail.image}" alt="${cocktail.name}" width="100">
      <p>Category: ${cocktail.category}</p>
      <div class="details" style="display: none;">
        <p><strong>Description:</strong> ${cocktail.description || "No description available."}</p>
        <strong>Ingredients:</strong>
        <ul>
          ${(cocktail.ingredients || ["No ingredients listed."])
            .map((item) => `<li>${item}</li>`)
            .join("")}
        </ul>
        <p><strong>Instructions:</strong> ${cocktail.instructions || "No instructions available."}</p>
      </div>
    </div>
  `;

  // Attach event listeners to each card
  const attachEventListeners = () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.addEventListener("mouseover", () => {
        card.style.backgroundColor = "lightblue"; // Highlight only the hovered card
      });

      card.addEventListener("mouseout", () => {
        card.style.backgroundColor = ""; // Reset only the hovered card
      });

      card.addEventListener("click", () => {
        const details = card.querySelector(".details");
        if (details) {
          details.style.display = details.style.display === "none" ? "block" : "none";
        }
      });
    });
  };

  // Initial fetch of cocktails
  fetchCocktails();
});
