// Carousel feature
const carouselTrack = document.querySelector('.carousel-track');
const carouselDots = document.querySelector('.carousel-dots');
const carouselButtons = document.querySelectorAll('.carousel-btn');

const slides = [
  {
    title: 'Responsive by design',
    description: 'Every section adjusts beautifully for desktop, tablet, and mobile screens.',
    image: createPlaceholderImage('Responsive Layout', '#0b7a75', '#cfeceb')
  },
  {
    title: 'Smooth interactions',
    description: 'Animated controls and polished transitions make browsing feel effortless.',
    image: createPlaceholderImage('Interactive UI', '#085f5b', '#ecfbfa')
  },
  {
    title: 'Live API content',
    description: 'The page also brings in fresh, public data through the Fetch API.',
    image: createPlaceholderImage('Live Data', '#2c9c93', '#f2fcfb')
  }
];

let currentSlideIndex = 0;
let autoRotateTimer;

function createPlaceholderImage(label, primaryColor, backgroundColor) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
      <rect width="900" height="600" fill="${backgroundColor}" />
      <rect x="70" y="90" width="760" height="420" rx="28" fill="${primaryColor}" opacity="0.18" />
      <rect x="130" y="150" width="220" height="140" rx="20" fill="${primaryColor}" opacity="0.85" />
      <rect x="380" y="150" width="360" height="220" rx="24" fill="white" opacity="0.95" />
      <rect x="130" y="330" width="610" height="90" rx="18" fill="white" opacity="0.9" />
      <text x="450" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" fill="${primaryColor}">${label}</text>
    </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function buildCarousel() {
  carouselTrack.innerHTML = '';
  carouselDots.innerHTML = '';

  slides.forEach((slide, index) => {
    const slideElement = document.createElement('div');
    slideElement.className = `slide${index === currentSlideIndex ? ' active' : ''}`;
    slideElement.innerHTML = `
      <img src="${slide.image}" alt="${slide.title}" />
      <div class="slide-content">
        <h3>${slide.title}</h3>
        <p>${slide.description}</p>
      </div>
    `;
    carouselTrack.appendChild(slideElement);

    const dotButton = document.createElement('button');
    dotButton.type = 'button';
    dotButton.className = index === currentSlideIndex ? 'active' : '';
    dotButton.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dotButton.addEventListener('click', () => {
      currentSlideIndex = index;
      updateCarousel();
    });
    carouselDots.appendChild(dotButton);
  });
}

function updateCarousel() {
  const slideElements = Array.from(carouselTrack.children);
  const dots = Array.from(carouselDots.children);

  slideElements.forEach((element, index) => {
    element.classList.toggle('active', index === currentSlideIndex);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlideIndex);
  });
}

function startAutoRotation() {
  clearInterval(autoRotateTimer);
  autoRotateTimer = setInterval(() => {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    updateCarousel();
  }, 5000);
}

function handleCarouselNavigation(direction) {
  currentSlideIndex = direction === 'next'
    ? (currentSlideIndex + 1) % slides.length
    : (currentSlideIndex - 1 + slides.length) % slides.length;
  updateCarousel();
  startAutoRotation();
}

carouselButtons.forEach((button) => {
  button.addEventListener('click', () => {
    handleCarouselNavigation(button.dataset.action);
  });
});

// API feature
const refreshButton = document.getElementById('refreshJoke');
const jokeLoader = document.getElementById('jokeLoader');
const jokeOutput = document.getElementById('jokeOutput');
const apiStatus = document.getElementById('apiStatus');

function setLoadingState(isLoading) {
  jokeLoader.hidden = !isLoading;
  refreshButton.disabled = isLoading;
  refreshButton.textContent = isLoading ? 'Loading...' : 'Load another joke';
}

async function fetchJoke() {
  setLoadingState(true);
  apiStatus.textContent = 'Loading...';
  apiStatus.className = 'status-pill';

  try {
    const response = await fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single');

    if (!response.ok) {
      throw new Error('Unable to reach the joke service.');
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message || 'The joke service returned an error.');
    }

    const jokeText = data.joke || `${data.setup} ${data.delivery}`;
    jokeOutput.textContent = jokeText;
    apiStatus.textContent = 'Live from API';
    apiStatus.className = 'status-pill success';
  } catch (error) {
    jokeOutput.textContent = 'Unable to load a joke right now. Please try again.';
    apiStatus.textContent = 'Request failed';
    apiStatus.className = 'status-pill error';
  } finally {
    setLoadingState(false);
  }
}

refreshButton.addEventListener('click', fetchJoke);

// Initialize all interactive features
buildCarousel();
updateCarousel();
startAutoRotation();
fetchJoke();
