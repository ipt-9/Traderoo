fetch('http://localhost:5000/api/products/all')
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById('product-list');

    products.forEach(product => {
      console.log(product)
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="../Backend/uploads/${product.Pictures}" alt="${product.Title}" />
        <h4>${product.Title}</h4>
        <p>${product.Description}</p>
        <p>Value: ${product.Estimated_Value} CHF</p>
        <a href="Item.html?id=${product.productID}"><button class="match-button">Match</button></a>
        <p>From: ${product.username}</p>
      `;
      container.appendChild(card);
    });
  });
