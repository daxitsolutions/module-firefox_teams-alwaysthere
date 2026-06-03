const ALARM_NAME = "teams-status-tracker";
const TEAMS_URLS = [
  "*://teams.cloud.microsoft/*",
  "*://teams.microsoft.com/*"
];

chrome.runtime.onInstalled.addListener(syncAlarmWithStoredState);
chrome.runtime.onStartup.addListener(syncAlarmWithStoredState);

chrome.runtime.onMessage.addListener((message) => {
  if (message.action !== "toggle") {
    return;
  }

  chrome.storage.local.set({ active: Boolean(message.active) }, () => {
    if (message.active) {
      startKeepingAwake();
    } else {
      stopKeepingAwake();
    }
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    keepTeamsTabsAwake();
  }
});

function syncAlarmWithStoredState() {
  chrome.storage.local.get({ active: false }, (data) => {
    if (data.active) {
      startKeepingAwake();
    } else {
      stopKeepingAwake();
    }
  });
}

function startKeepingAwake() {
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: 0.1,
    periodInMinutes: 0.75
  });

  keepTeamsTabsAwake();
}

function stopKeepingAwake() {
  chrome.alarms.clear(ALARM_NAME);
}

function keepTeamsTabsAwake() {
  chrome.tabs.query({ url: TEAMS_URLS }, (tabs) => {
    const runtimeError = chrome.runtime.lastError;

    if (runtimeError) {
      console.warn("Impossible de rechercher les onglets Teams:", runtimeError.message);
      return;
    }

    tabs.forEach((tab) => {
      if (!tab.id) {
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: simulateActivity
      }, () => {
        const scriptingError = chrome.runtime.lastError;

        if (scriptingError) {
          console.warn("Impossible d'injecter le script dans l'onglet Teams:", scriptingError.message);
        }
      });
    });
  });
}

function simulateActivity() {
  const x = Math.max(1, Math.floor(Math.random() * window.innerWidth));
  const y = Math.max(1, Math.floor(Math.random() * window.innerHeight));
  const mouseEvent = new MouseEvent("mousemove", {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y
  });

  document.dispatchEvent(mouseEvent);
  window.dispatchEvent(new Event("focus"));
}
