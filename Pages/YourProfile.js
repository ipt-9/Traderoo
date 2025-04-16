document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    console.log(params)
    const username = localStorage.getItem("loggedInUser");
    const userID = localStorage.getItem("loggedInUserID");
    const userMail = localStorage.getItem("loggedInUserMail");
    
      fetch(`http://localhost:5000/api/products/all`)
        .then(res => res.json())
        .then(product => {
          console.log("Produkt:", product);
    
          fetch(`http://localhost:5000/api/products/users/${userID}/items`)
            .then(res => res.json())
            .then(myItems => {
              console.log("Meine Items:", myItems);
              const container = document.getElementById('allproducts');
              myItems.forEach(product => {
                console.log(product)
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                  <img src="../Backend/uploads/${product.Pictures}" alt="${product.Title}" />
                  <h4>${product.Title}</h4>
                  <p>${product.Description}</p>
                  <p>Value: ${product.Estimated_Value} CHF</p>
                `;
                document.querySelector(".tradeuser").innerHTML = `
            <p>Hello, Im <strong>${username}</strong>! Feel free to checkout my trades</p>
            `
                container.appendChild(card);

                document.querySelector(".name").innerHTML = `
                <p><strong>${username}</strong></p>`
                
                document.querySelector(".email").innerHTML = `
                <p><strong>${userMail}</strong></p>`
              });
        })
        
        .catch(err => {
          console.error("Fehler beim Laden:", err);
        });
      });
    });
  
    