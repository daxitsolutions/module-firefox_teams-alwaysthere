const ALARM_NAME = "teams-alwaysthere";
const TEAMS_URLS = [
  "*://teams.cloud.microsoft/*",
  "*://teams.microsoft.com/*"
];
const DEFAULT_SETTINGS = {
  intervalSeconds: 45,
  simulateMouse: true,
  simulateFocus: true
};

chrome.runtime.onInstalled.addListener(syncAlarmWithStoredState);
chrome.runtime.onStartup.addListener(syncAlarmWithStoredState);

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggle") {
    chrome.storage.local.set({ active: Boolean(message.active) }, () => {
      if (message.active) {
        startKeepingAwake();
      } else {
        stopKeepingAwake();
      }
    });
    return;
  }

  if (message.action === "settingsUpdated") {
    chrome.storage.local.get({ active: false }, (data) => {
      if (data.active) {
        startKeepingAwake();
      }
    });
  }
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

function normalizeSettings(rawSettings = {}) {
  const intervalSeconds = Number(rawSettings.intervalSeconds);

  return {
    intervalSeconds: Math.min(300, Math.max(30, Number.isFinite(intervalSeconds) ? intervalSeconds : DEFAULT_SETTINGS.intervalSeconds)),
    simulateMouse: rawSettings.simulateMouse !== false,
    simulateFocus: rawSettings.simulateFocus !== false
  };
}

function startKeepingAwake() {
  chrome.storage.local.get({ settings: DEFAULT_SETTINGS }, (data) => {
    const settings = normalizeSettings(data.settings);

    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 0.1,
      periodInMinutes: settings.intervalSeconds / 60
    });

    keepTeamsTabsAwake(settings);
  });
}

function stopKeepingAwake() {
  chrome.alarms.clear(ALARM_NAME);
}

function keepTeamsTabsAwake(settingsOverride) {
  chrome.tabs.query({ url: TEAMS_URLS }, (tabs) => {
    const runtimeError = chrome.runtime.lastError;

    if (runtimeError) {
      console.warn("Impossible de rechercher les onglets Teams:", runtimeError.message);
      return;
    }

    const runForTabs = (settings) => {
      tabs.forEach((tab) => {
        if (!tab.id) {
          return;
        }

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: simulateActivity,
          args: [settings]
        }, () => {
          const scriptingError = chrome.runtime.lastError;

          if (scriptingError) {
            console.warn("Impossible d'injecter le script dans l'onglet Teams:", scriptingError.message);
          }
        });
      });
    };

    if (settingsOverride) {
      runForTabs(settingsOverride);
      return;
    }

    chrome.storage.local.get({ settings: DEFAULT_SETTINGS }, (data) => {
      runForTabs(normalizeSettings(data.settings));
    });
  });
}

function simulateActivity(settings) {
  if (settings.simulateMouse) {
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
  }

  if (settings.simulateFocus) {
    window.dispatchEvent(new Event("focus"));
  }
}
