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

### Windows (ohne pip, ohne PowerShell-Skripte)

Einfach `build_mcaddon.bat` doppelklicken **oder** in `cmd` ausführen:

```cmd
build_mcaddon.bat
```

### Alle Systeme mit Python 3 (ohne pip)

```bash
python build_mcaddon.py
```

### Linux/macOS (Bash-Variante)

```bash
bash build_mcaddon.sh
```

Ausgabe:

- `build/MorphBP.mcpack`
- `build/MorphRP.mcpack`
- `build/MorphAddon_v1.0.0.mcaddon`

## Dein Bild als Mod-Profilbild (Pack-Icon)

1. Speichere dein Bild als `custom/pack_icon.png`.
2. Starte den Build (`build_mcaddon.bat` oder `python build_mcaddon.py`).
3. Das Bild wird automatisch als `pack_icon.png` in **beide** Packs eingebaut.

> Empfohlen: PNG in 256x256 Pixel.

## Import in Minecraft

1. `build/MorphAddon_v1.0.0.mcaddon` doppelklicken
2. Welt öffnen und **Behavior Pack + Resource Pack** aktivieren
3. In den Welteinstellungen **Beta APIs / Script API** aktivieren (je nach Version benannt)
## Hinweis zu Binärdateien

Dieses Repository speichert **keine** `.mcpack`/`.mcaddon`-Dateien im Git-Verlauf, damit Plattformen ohne Binär-Support problemlos arbeiten können. Erzeuge die Pakete lokal mit `build_mcaddon.bat` (Windows) oder `python build_mcaddon.py` (ohne pip).

