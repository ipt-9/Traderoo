window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productID = params.get("id");
    
    if (!productID) {
      alert("Kein Produkt ausgewählt.");
      return;
    }
  
    fetch(`http://localhost:5000/api/products/${productID}`)
      .then(res => res.json())
      .then(product => {
        console.log(product.Pictures)
        const card = document.createElement('div');
        document.querySelector(".heading").innerText = product.Title;
        document.querySelector(".pictures").innerHTML = `
        <img src="../Backend/uploads/${product.Pictures}" alt="${product.Title}" style = width:75% />;
        `
        document.querySelector(".profile-name").innerText = product.Username;
        document.querySelector(".description").innerText = product.Description;
        
  
        document.querySelector(".product-info").innerHTML = `
          <div>Brand: ${product.Brand}</div>
          <div>Weight: ${product.Weight}kg</div>
          <div>Condition: ${product.fk_Productcondition}</div>
          <div>Height: ${product.Height}cm</div>
          <div>Width: ${product.Width}cm</div>
          <div>Depth: ${product.Depth}cm</div>
        `;
        const matchContainer = document.querySelector(".match-button");

        matchContainer.innerHTML = `<a href="Match.html?id=${product.productID}">
            <button class="match-button">Match now with ${product.Username}</button>
        </a>`;
      })
      .catch(err => {
        console.error("Fehler beim Laden:", err);
        document.querySelector(".heading").innerText = "Fehler beim Laden des Produkts";
      });
      
  });
  