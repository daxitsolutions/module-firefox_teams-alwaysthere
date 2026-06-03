# Teams Status Tracker Firefox

Extension Firefox WebExtension Manifest V3 pour maintenir une activité périodique sur les onglets Microsoft Teams lorsque l'extension est activée depuis le popup.

## Structure

- `teams-status-tracker-firefox/` contient les sources de l'extension.
- `package-extension.sh` crée un paquet `.xpi` dans `dist/`.

## Corrections Firefox

- Le manifest déclare `background.scripts` en plus de `background.service_worker`, car Firefox utilise les scripts/event pages pour le background MV3.
- Les permissions `storage` et `alarms` sont déclarées parce que le code utilise `chrome.storage.local` et `chrome.alarms`.
- Le timer global `setInterval` a été remplacé par `chrome.alarms`, plus fiable avec les backgrounds MV3 non persistants.
- Les erreurs d'accès aux onglets ou d'injection sont gérées via `chrome.runtime.lastError`.

## Créer le package

```bash
./package-extension.sh
```

Le fichier généré sera placé dans `dist/`, par exemple :

```text
dist/teams-status-tracker-firefox-v1.0.0.xpi
```

## Tester dans Firefox

1. Ouvrir `about:debugging#/runtime/this-firefox`.
2. Cliquer sur `Charger un module complémentaire temporaire`.
3. Sélectionner `teams-status-tracker-firefox/manifest.json`.
4. Ouvrir Teams dans Firefox, puis activer l'extension depuis son popup.

Les permissions de site Teams doivent être accordées dans Firefox pour que l'injection fonctionne.
