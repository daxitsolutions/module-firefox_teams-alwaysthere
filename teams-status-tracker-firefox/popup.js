let isActive = false;

const toggleBtn = document.getElementById("toggle");
const statusDiv = document.getElementById("status");

function updateUI() {
  if (isActive) {
    toggleBtn.textContent = "Désactiver";
    toggleBtn.style.backgroundColor = "#c42b1c";
    toggleBtn.style.borderColor = "#c42b1c";
    toggleBtn.style.color = "white";
    statusDiv.textContent = "Activé";
    statusDiv.style.color = "green";
  } else {
    toggleBtn.textContent = "Activer";
    toggleBtn.style.backgroundColor = "";
    toggleBtn.style.borderColor = "";
    toggleBtn.style.color = "";
    statusDiv.textContent = "Désactivé";
    statusDiv.style.color = "";
  }
}

toggleBtn.addEventListener("click", () => {
  isActive = !isActive;

  chrome.runtime.sendMessage({
    action: "toggle",
    active: isActive
  });

  updateUI();
});

chrome.storage.local.get({ active: false }, (data) => {
  isActive = Boolean(data.active);
  updateUI();
});
