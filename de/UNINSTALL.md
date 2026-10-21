# Deinstallieren

Diese Anleitung zeigt dir verschiedene Wege, OCLP und/oder die Patches zu deinstallieren.

## Alles löschen und zu nativem macOS zurückkehren

1. Erstelle einen USB-Stick mit dem neuesten offiziell unterstützten macOS-Installer oder nutze alternativ [auf den meisten Macs](https://apple.stackexchange.com/questions/383985/which-macs-support-macos-internet-recovery) die Internetwiederherstellung.
   * Halte `cmd` + `Option (Alt)` + `R` für die Internetwiederherstellung.
   * Wenn du die Internetwiederherstellung nutzt, überspringe Schritt 2.
   * Vorsicht: Die Internetwiederherstellung installiert nicht immer die neueste offiziell unterstützte macOS-Version.
3. Starte neu und boote den Computer vom Installer-USB-Stick, indem du `Option (Alt)` gedrückt hältst.
4. Öffne das Festplattendienstprogramm und wähle Darstellung -> Alle Geräte einblenden.
5. Lösche das gesamte Laufwerk, indem du in der Seitenleiste links den obersten Laufwerkseintrag auswählst und auf „Löschen“ klickst.
6. Starte die macOS-Installation.
7. Wenn sie abgeschlossen ist, starte noch einmal neu und [setze den NVRAM zurück](https://support.apple.com/HT204063), um ein vollständig sauberes Originalsystem zu erhalten.


## Manuelle Methoden

Die manuelle Deinstallation von OCLP besteht aus drei Teilen: der App, OpenCore und den Root-Patches. Wenn du OCLP und die Patches vollständig entfernen willst, gehe alle drei Teile nacheinander durch. Andernfalls erledige nur die Teile, die du brauchst.

### Root-Patches entfernen

Öffne die OCLP-App, gehe ins Menü „Post Install Root Patch“ und wähle „Revert Root Patches“.

*  **Wird ab Monterey unterstützt. Big Sur unterstützt das Zurücksetzen von Snapshots nicht und erfordert eine Neuinstallation. Diese kann ohne Löschen erfolgen, wenn die verwendete macOS-Installer-Version gleich oder neuer ist.**

### Die App deinstallieren

Um die OCLP-App inklusive LaunchAgent und PrivilegedHelperTool zu deinstallieren, lade das Deinstallationspaket von [der Releases-Seite](https://github.com/dortania/OpenCore-Legacy-Patcher/releases) herunter.

### Den Bootloader deinstallieren

1. Entferne OpenCore entweder vom USB-Stick oder vom internen Laufwerk

  * Hänge die EFI-Partition des Laufwerks ein und lösche die Ordner `EFI/OC` und `System`.
    * Hinweis: Lösche **nicht** den gesamten EFI-Ordner – das macht vorhandene Windows- und Linux-Installationen sehr wahrscheinlich unbrauchbar.
    * [Hier findest du ein Beispiel zum Einhängen](https://dortania.github.io/OpenCore-Post-Install/universal/oc2hdd.html)
    * Nutzer eines 5K-iMac löschen außerdem `boot.efi` im Wurzelverzeichnis der EFI-Partition.

2. [Setze den NVRAM zurück](https://support.apple.com/HT204063)

:::warning Achtung

Beachte, dass dein Mac nach dem Entfernen von OpenCore nicht mehr bootet und das „Verboten“-Symbol anzeigt. Halte einen bootfähigen USB-Stick mit OpenCore oder einer nativ unterstützten macOS-Version bereit, bevor du den Bootloader deinstallierst.

* Das gilt nicht für nativ unterstützte Macs, die OpenCore nur für Funktionen wie AirPlay zum Mac und Sidecar verwenden. Trotzdem empfehlen wir, macOS nach dem Entfernen von OpenCore neu zu installieren, wenn du SMBIOS-Spoofing genutzt hast, um Universal Control und andere Funktionen zu aktivieren.
:::
