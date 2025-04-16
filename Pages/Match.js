document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  console.log(params)
  const productID = params.get("id");
  console.log(productID)
  const username = localStorage.getItem("loggedInUser");
  const userID = localStorage.getItem("loggedInUserID");
  
    if (!productID || !username ) {
      console.log("Fehlende Daten:", { productID, username, userID });
      return;
    }
  
    fetch(`http://localhost:5000/api/products/match/${productID}`)
      .then(res => res.json())
      .then(product => {
        console.log("Produkt:", product);
  
        fetch(`http://localhost:5000/api/products/users/${userID}/items`)
          .then(res => res.json())
          .then(myItems => {
            console.log("Meine Items:", myItems);
  
            const options = myItems.map(item => `<option value="${item.productID}">${item.Title}</option>`).join("");
  
            document.querySelector(".title").innerHTML = `
            <p>Welcome <strong>${username}</strong></p>
            `
            document.querySelector(".tradeoffer").innerHTML = `
            <div>
                Trade 
                <select id="my-item-select">
                  ${options}
                </select> 
            </div>`
            document.querySelector(".trade").innerHTML = `
            <p>against <strong>${product.Title}</strong></p>
            `
            document.querySelector(".tradeuser").innerHTML = `
            <p>with <strong>${product.username}</strong></p>
            `
            document.querySelector(".tradeemail").innerHTML = `
            <p>Contact user: <strong>${product.email}</strong></p>
            `
      })
      
      .catch(err => {
        console.error("Fehler beim Laden:", err);
      });
    });
  });

  document.getElementById("accept-button").addEventListener("click", function () {
    alert("The user has been contacted");
    window.location.href = "AllTrades.html";
  });