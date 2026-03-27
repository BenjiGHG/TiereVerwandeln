# Morph Add-on (Bedrock)

Dieses Repo erzeugt eine importierbare `mcaddon`-Datei mit:

- `MorphBP` (Behavior Pack + Script)
- `MorphRP` (Resource Pack)

## Features

- Freischaltung von Mobs durch Kills (pro Spieler via Dynamic Properties)
- Morph-Menü über `Morph-Menü`-Item (Slot 1 / Hotbar 1)
- Auswahl: zurück zum Spieler oder in freigeschalteten Mob morphen
- Laufende Morph-Synchronisierung (Spieler unsichtbar + Mob-Modell folgt dem Spieler)

> Hinweis: Direkte Tastenerkennung für Taste `1`/D-Pad Down ist in Bedrock Scripting nicht zuverlässig verfügbar, daher wird das Fallback-Item verwendet.

## Bauen

```bash
bash build_mcaddon.sh
```

Ausgabe:

- `build/MorphBP.mcpack`
- `build/MorphRP.mcpack`
- `build/MorphAddon_v1.0.0.mcaddon`

## Import in Minecraft

1. `build/MorphAddon_v1.0.0.mcaddon` doppelklicken
2. Welt öffnen und **Behavior Pack + Resource Pack** aktivieren
3. In den Welteinstellungen **Beta APIs / Script API** aktivieren (je nach Version benannt)
## Hinweis zu Binärdateien

Dieses Repository speichert **keine** `.mcpack`/`.mcaddon`-Dateien im Git-Verlauf, damit Plattformen ohne Binär-Support problemlos arbeiten können. Erzeuge die Pakete lokal mit `bash build_mcaddon.sh`.

