let addToy = false;

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('#new-toy-btn');
  const toyFormContainer = document.querySelector('.container');

  addBtn.addEventListener('click', () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? 'block' : 'none';
  });

  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.querySelector('.add-toy-form');

  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToyCard(toy));
      });
  }

  function renderToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);
  }

  toyForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = toyForm.name.value;
    const image = toyForm.image.value;

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ name: name, image: image, likes: 0 }),
    })
      .then(response => response.json())
      .then(newToy => renderToyCard(newToy));

    toyForm.reset();
  });

  toyCollection.addEventListener('click', event => {
    if (event.target.classList.contains('like-btn')) {
      const toyId = event.target.dataset.id;
      const likesElement = event.target.previousElementSibling;
      let newLikes = parseInt(likesElement.innerText) + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ likes: newLikes }),
      })
        .then(response => response.json())
        .then(updatedToy => {
          likesElement.innerText = `${updatedToy.likes} Likes`;
        });
    }
  });

  fetchToys();
});