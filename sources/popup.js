let isActive = false;
let settings = {
  intervalSeconds: 45,
  simulateMouse: true,
  simulateFocus: true
};

const toggleBtn = document.getElementById("toggle");
const statusDiv = document.getElementById("status");
const intervalInput = document.getElementById("intervalSeconds");
const simulateMouseInput = document.getElementById("simulateMouse");
const simulateFocusInput = document.getElementById("simulateFocus");

function normalizeSettings(rawSettings = {}) {
  const intervalSeconds = Number(rawSettings.intervalSeconds);

  return {
    intervalSeconds: Math.min(300, Math.max(30, Number.isFinite(intervalSeconds) ? intervalSeconds : 45)),
    simulateMouse: rawSettings.simulateMouse !== false,
    simulateFocus: rawSettings.simulateFocus !== false
  };
}

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

  intervalInput.value = String(settings.intervalSeconds);
  simulateMouseInput.checked = settings.simulateMouse;
  simulateFocusInput.checked = settings.simulateFocus;
}

toggleBtn.addEventListener("click", () => {
  isActive = !isActive;

  chrome.runtime.sendMessage({
    action: "toggle",
    active: isActive
  });

  updateUI();
});

function saveSettings() {
  settings = normalizeSettings({
    intervalSeconds: intervalInput.value,
    simulateMouse: simulateMouseInput.checked,
    simulateFocus: simulateFocusInput.checked
  });

  chrome.storage.local.set({ settings }, () => {
    chrome.runtime.sendMessage({
      action: "settingsUpdated",
      settings
    });
  });

  updateUI();
}

intervalInput.addEventListener("change", saveSettings);
simulateMouseInput.addEventListener("change", saveSettings);
simulateFocusInput.addEventListener("change", saveSettings);

chrome.storage.local.get({ active: false, settings }, (data) => {
  isActive = Boolean(data.active);
  settings = normalizeSettings(data.settings);
  updateUI();
});
