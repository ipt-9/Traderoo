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

const originalCardsHTML = [];

document.addEventListener('DOMContentLoaded', () => {
  // Save original cards
  document.querySelectorAll('.card').forEach(card => {
    originalCardsHTML.push(card.outerHTML);
  });
});

const checkIfEmpty = () => {
  const cards = document.querySelectorAll('.card-container .card');
  if (cards.length === 0) {
    showReloadButton();
  }
};

const showReloadButton = () => {
  if (document.getElementById('reload-button')) return;

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

  document.body.appendChild(reloadBtn);

  reloadBtn.addEventListener('click', () => {
    const container = document.querySelector('.card-container');
    originalCardsHTML.forEach(html => {
      const temp = document.createElement('div');
      temp.innerHTML = html.trim();
      container.appendChild(temp.firstChild);
    });
    reloadBtn.remove();
  });
};

const swipeCard = (direction) => {
  const cards = document.querySelectorAll('.card-container .card');
  const topCard = cards[cards.length - 1];
  if (!topCard) return;

  topCard.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
  topCard.style.transform = `translateX(${direction === 'right' ? '1000px' : '-1000px'}) rotate(${direction === 'right' ? '15' : '-15'}deg)`;
  topCard.style.opacity = 0;

  showMessage(
    direction === 'right' ? 'Match <3' : 'Not interested',
    direction === 'right' ? '#5cb85c' : '#d9534f'
  );

  setTimeout(() => {
    topCard.remove();
    checkIfEmpty();
  }, 600);
};

document.addEventListener('click', (e) => {
  if (e.target.closest('.SwipeRight')) swipeCard('right');
  if (e.target.closest('.SwipeLeft')) swipeCard('left');
});
