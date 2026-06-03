# Teams AlwaysThere Firefox

Extension Firefox pour maintenir une activité périodique sur les onglets Microsoft Teams lorsque l'extension est activée.

## Fonctionnement

L'extension ajoute un bouton dans la barre d'outils Firefox. Depuis ce bouton, il est possible d'activer ou de désactiver le suivi d'activité.

Quand elle est activée, l'extension recherche régulièrement les onglets Microsoft Teams ouverts sur les domaines suivants :

- `teams.cloud.microsoft`
- `teams.microsoft.com`

Sur ces onglets, elle injecte une petite action côté page qui simule une activité légère. L'état activé ou désactivé est mémorisé localement par Firefox, afin d'être conservé entre deux ouvertures du navigateur.

## Installation temporaire

1. Ouvrir Firefox.
2. Aller sur `about:debugging#/runtime/this-firefox`.
3. Cliquer sur `Charger un module complémentaire temporaire`.
4. Sélectionner le fichier `sources/manifest.json`.
5. Ouvrir Microsoft Teams dans Firefox.
6. Cliquer sur le bouton de l'extension, puis sur `Activer`.

Firefox doit autoriser l'extension à accéder aux domaines Teams pour que le suivi fonctionne.

## Utilisation

- `Activer` lance le suivi périodique sur les onglets Teams ouverts.
- `Désactiver` arrête immédiatement le suivi.
- Le statut affiché dans le popup indique l'état actuel de l'extension.

L'extension n'agit que sur les onglets Teams correspondant aux domaines déclarés dans ses permissions.

## Créer le package

```bash
./package-extension.sh
```

Le package Firefox est généré dans `dist/` avec le nom suivant :

```text
dist/teams-alwaysthere-firefox-v1.0.0.xpi
```

## Fichiers

- `sources/manifest.json` décrit l'extension et ses permissions.
- `sources/background.js` gère l'état actif et l'action périodique.
- `sources/popup.html` affiche l'interface du bouton.
- `sources/popup.js` gère l'interaction avec le bouton.

## Permissions

- `alarms` permet de déclencher l'action périodique.
- `scripting` permet d'exécuter l'action dans les onglets Teams.
- `storage` permet de mémoriser si l'extension est activée ou désactivée.
- Les permissions de site limitent l'accès aux domaines Microsoft Teams.
