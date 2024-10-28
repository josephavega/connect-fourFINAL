
const popup = document.getElementById("howToPlayPopup");
const instructionImage = document.getElementById("instructionImage");
const dots = document.querySelectorAll(".dot");

const images = [
  "assets/instruction1.png",  // Placeholder .pngs
  "assets/instruction2.png",
  "assets/instruction3.png",
  "assets/instruction4.png"
];

let currentImageIndex = 0;

function openHowToPlay() {
  popup.style.display = "flex";
}

function closeHowToPlay() {
  popup.style.display = "none";
}

function setImage(index) {
  currentImageIndex = index;
  instructionImage.src = images[currentImageIndex];
  updateDots();
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  instructionImage.src = images[currentImageIndex];
  updateDots();
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  instructionImage.src = images[currentImageIndex];
  updateDots();
}

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentImageIndex);
  });
}

