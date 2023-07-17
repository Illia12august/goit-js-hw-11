import Notiflix from 'notiflix';
import axios from 'axios';
import './css/style.css';

const perPage = 20;
let page = 1;
let totalHits = 0;
const API_KEY = '37104201-a2ad5f6b4959c494d41dc31b6';

const inputEl = document.querySelector('input[name="searchQuery"]');
const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.more-btn');
loadMoreButton.style.display = 'none';
formEl.addEventListener('submit', async function (event) {
  event.preventDefault();
  clearGallery();
  page = 1;
  await getImage();
});

loadMoreButton.addEventListener('click', async function () {
  page++;
  await getImage();
});

function getApiUrl(searchQuery, page) {
  const baseUrl = 'https://pixabay.com/api/';
  const queryParams = `?key=${API_KEY}&q=${encodeURIComponent(
    searchQuery
  )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;
  return baseUrl + queryParams;
}

function clearGallery() {
  gallery.innerHTML = '';
}

function appendImages(data) {
  data.hits.forEach(image => {
    renderImageCard(image);
  });
}

function renderImageCard(image) {
  const photoCard = document.createElement('div');
  photoCard.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';
  img.classList.add('img');

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.innerHTML = `<b>Likes:</b> <b>${image.likes}</b>`;

  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>Views:</b> <b>${image.views}</b>`;

  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>Comments:</b> <b>${image.comments}</b>`;

  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b>Downloads:</b> <b>${image.downloads}</b>`;

  info.appendChild(likes);
  info.appendChild(views);
  info.appendChild(comments);
  info.appendChild(downloads);

  photoCard.appendChild(img);
  photoCard.appendChild(info);

  gallery.appendChild(photoCard);
}

async function getImage() {
  const searchQuery = inputEl.value;
  if (!searchQuery.trim()) {
    loadMoreButton.style.display = 'none';
  }
  if (searchQuery.trim()) {
    loadMoreButton.style.display = 'block';
    try {
      const response = await axios.get(getApiUrl(searchQuery, page));
      console.log(response);
      const data = response.data;

      if (data.totalHits === 0) {
        showNotification('No images found');
        loadMoreButton.style.display = 'none';
      } else {
        totalHits = data.totalHits;
        appendImages(data);

        if (page * perPage >= totalHits) {
          loadMoreButton.style.display = 'none';
          showNotification(
            "We're sorry, but you've reached the end of search results."
          );
        }
      }
    } catch (error) {
      console.log('Error:', error);
    }
  } else {
    showNotification('Empty search query');
  }
}

function showNotification(message) {
  Notiflix.Notify.info(message);
}
