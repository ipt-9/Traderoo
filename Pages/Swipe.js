let allProducts = [];
let currentIndex = 0;

const showMessage = (message, color) => {
  const msg = document.createElement('div');
  msg.textContent = message;
  msg.style.position = 'fixed';
  msg.style.top = '20px';
  msg.style.left = '50%';
  msg.style.transform = 'translateX(-50%)';
  msg.style.backgroundColor = color;
  msg.style.color = 'white';
  msg.style.padding = '10px 20px';
  msg.style.borderRadius = '10px';
  msg.style.fontSize = '20px';
  msg.style.zIndex = 999;
  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 2000);
};

const loadProducts = async () => {
  const res = await fetch('http://localhost:5000/api/products/all');
  const products = await res.json();

  // Zufällige 4 Produkte wählen
  allProducts = products.sort(() => 0.5 - Math.random()).slice(0, 4);
  currentIndex = 0;
  renderCard();
};

const renderCard = () => {
  const container = document.querySelector('.card-container');
  container.innerHTML = '';

  if (currentIndex < allProducts.length) {
    const product = allProducts[currentIndex];
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="../Backend/uploads/${product.Pictures}" alt="${product.Title}" />
      <h4>${product.Title}</h4>
      <p>Posted by <strong>${product.username}</strong></p>
      <p>${product.Description}</p>
      <a class="SwipeLeft"><i class="fa-solid fa-xmark"></i></a>
      <a class="SwipeRight" data-id="${product.productID}"><i class="fa-solid fa-heart"></i></a>
    `;
    container.appendChild(card);
  } else {
    showReloadButton();
  }
};

const swipeCard = (direction) => {
  const card = document.querySelector('.card-container .card');
  if (!card) return;

  card.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
  card.style.transform = `translateX(${direction === 'right' ? '1000px' : '-1000px'}) rotate(${direction === 'right' ? '15' : '-15'}deg)`;
  card.style.opacity = 0;

  showMessage(
    direction === 'right' ? 'Match <3' : 'Not interested',
    direction === 'right' ? '#5cb85c' : '#d9534f'
  );

  setTimeout(() => {
    card.remove();
    currentIndex++;
    renderCard();
  }, 600);
};

const showReloadButton = () => {
  if (document.getElementById('reload-button')) return;

  const container = document.querySelector('.card-container');
  const reloadBtn = document.createElement('button');
  reloadBtn.id = 'reload-button';
  reloadBtn.textContent = 'Reload Cards';
  reloadBtn.style.position = 'fixed';
  reloadBtn.style.bottom = '100px';
  reloadBtn.style.left = '50%';
  reloadBtn.style.transform = 'translateX(-50%)';
  reloadBtn.style.padding = '15px 30px';
  reloadBtn.style.fontSize = '18px';
  reloadBtn.style.border = 'none';
  reloadBtn.style.borderRadius = '8px';
  reloadBtn.style.backgroundColor = '#5cb85c';
  reloadBtn.style.color = 'white';
  reloadBtn.style.cursor = 'pointer';
  reloadBtn.style.zIndex = 1000;

  reloadBtn.addEventListener('click', () => {
    reloadBtn.remove();
    loadProducts();
  });

  container.appendChild(reloadBtn);
};

// Event delegation for swipe buttons
document.addEventListener('click', (e) => {
  if (e.target.closest('.SwipeLeft')) swipeCard('left');
  if (e.target.closest('.SwipeRight')) {
    const productID = e.target.closest('.SwipeRight').dataset.id;
    window.location.href = `Item.html?id=${productID}`;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});
