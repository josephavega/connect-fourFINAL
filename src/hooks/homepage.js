function joinLobby() {
  window.location.href = "components/lobby.html"; 
}

function loadHowToPlay() {
  const howToPlayContainer = document.getElementById('howToPlayContainer');
  
  // Fetch howtoplay.html content and insert into popup container
  fetch('howtoplay.html')
    .then(response => response.text())
    .then(data => {
      howToPlayContainer.innerHTML = data;  // Insert the HTML content into the page
      openHowToPlay();  // Open the popup after loading the content
    })
    .catch(error => console.error('Error loading How to Play Popup:', error));
}

function leaderboard() {
  window.location.href = "components/leaderboard.html";  
}
