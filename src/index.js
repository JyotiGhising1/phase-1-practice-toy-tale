let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector('.add-toy-form')
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  fetchToys()

  toyForm.addEventListener('submit', handleFormSubmit)
});

function fetchToys(){
  fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(toys => {
    const toyCollection = document.getElementById('toy-collection')
    toys.forEach(toy => {
      const toyCard = createToyCard(toy)
      toyCollection.appendChild(toyCard)
    })
  })
  .catch(error => console.error('Error fetching toys: ' , error))
}

function createToyCard(toy){
  const card = document.createElement('div')
  card.className = 'card'

  const h2 = document.createElement('h2')
  h2.textContent = toy.name 

  const img = document.createElement('img')
  img.src = toy.image
  img.className ='toy-avatar'

  const p = document.createElement('p')
  p.textContent = `${toy.likes} likes`

  const button = document.createElement('button')
  button.className = 'like-btn'
  button.id = toy.id
  button.textContent = 'Like ❤️'
  button.addEventListener('click', ()=> handleLikeButton(toy))

  card.appendChild(h2)
  card.appendChild(img)
  card.appendChild(p)
  card.appendChild(button)

  return card

}

function handleFormSubmit(event){
  event.preventDefault()
  
  const toyForm = event.target 
  const toyName = toyForm.name.value 
  const toyImage = toyForm.image.value

  const toyData = {
    name : toyName,
    image: toyImage,
    likes: 0
  }

  fetch('http://localhost:3000/toys', {
    method : 'POST',
    headers:{
      'Content-type' : 'application/json',
      'Accept': 'application/json'
    },
    body :JSON.stringify(toyData)
  })
  .then(response => response.json())
  .then(newToy => {
    const toyCollection = document.getElementById('toy-collection')
    const toyCard = createToyCard(newToy)
    toyCollection.appendChild(toyCard)
    toyForm.reset()

  })
  .catch(error => console.error('Error adding toy:', error));

}
function handleLikeButton(toy){
  const newLikes = toy.likes + 1

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method : 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept' : 'application/json'
    },
    body: JSON.stringify({
      likes: newLikes
    })

  })
  .then(response => response.json())
  .then(updatedToy => {
    toy.likes = updatedToy.likes
    const toyCard = document.getElementById(toy.id).parentElement
    const likeText = toyCard.querySelector('p')
    likeText.textContent = `${updatedToy.likes} Likes`
  })
  .catch(error => console.error('Error updating likes: ', error))
}