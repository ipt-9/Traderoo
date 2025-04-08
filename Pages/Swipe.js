const card = document.querySelector('.card');
  const swipeLeftBtn = document.querySelector('.SwipeRight'); // ist rechtes Icon (X)
  const swipeRightBtn = document.querySelector('.SwipeLeft'); // ist linkes Icon (Herz)

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

    setTimeout(() => {
      msg.remove();
    }, 2000);
  };

  const swipeCard = (direction) => {
    card.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    card.style.transform = `translateX(${direction === 'right' ? '1000px' : '-1000px'}) rotate(${direction === 'right' ? '15' : '-15'}deg)`;
    card.style.opacity = 0;

    showMessage(direction === 'right' ? 'Erfolgreich gematched!' : 'Not interested', direction === 'right' ? '#5cb85c' : '#d9534f');

    setTimeout(() => {
      card.style.display = 'none';
    }, 600);
  };

  swipeRightBtn.addEventListener('click', () => swipeCard('left'));
  swipeLeftBtn.addEventListener('click', () => swipeCard('right'));

  // Swipe detection
  let startX = 0;
  let isDragging = false;

  card.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  card.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - startX;
    if (diffX > 100) {
      swipeCard('right');
    } else if (diffX < -100) {
      swipeCard('left');
    }
  });

  card.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  card.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;
    if (diffX > 100) {
      swipeCard('right');
    } else if (diffX < -100) {
      swipeCard('left');
    }
});