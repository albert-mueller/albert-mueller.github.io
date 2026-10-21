# Time-Machine-Backup wiederherstellen

OCLP installiert beim ersten Installieren vom USB-Stick automatisch die Root-Patches, damit die Ersteinrichtung reibungslos funktioniert. Ein unglücklicher Nebeneffekt: Eine vollständige Wiederherstellung über Time Machine schlägt fehl, solange Root-Patches installiert sind, und die Wiederherstellung erfordert ein paar Tricks, um eine Kernel Panic zu vermeiden. Unten findest du zwei verschiedene Methoden zur Wiederherstellung.

**Methode 2 wird nur ab Monterey unterstützt. Big Sur unterstützt das Zurücksetzen von Snapshots nicht.**

::: warning Warnung für Sequoia

Time Machine funktioniert unter Sequoia unter Umständen selbst nach dem Entfernen der Root-Patches nicht, was zu einer Schleife mit dem Fenster „Migration abgeschlossen“ führt. Falls das bei dir auftritt, stelle das Backup unter einem älteren Betriebssystem wieder her und aktualisiere danach auf Sequoia.

:::


## Methode 1 – Wiederherstellen mit installierten Root-Patches (teilweise)

**Warnung:** Beachte, dass bei dieser Methode Ordner **außer** „Schreibtisch“, „Dokumente“, „Programme“ usw. (die Hauptordner im Benutzerprofil) eventuell nicht wiederhergestellt werden. Wenn du eine vollständige Wiederherstellung willst, nutze Methode 2 unten.

1. Starte die Time-Machine-Wiederherstellung entweder im Systemassistenten (Ersteinrichtung) oder im Migrationsassistenten.
2. Wenn du gefragt wirst, welche Informationen übertragen werden sollen, **deaktiviere** „Andere Dateien und Ordner“, wie im Bild unten zu sehen.
3. Starte die Übertragung.

<div align="left">
             <img src="../images/TimeMachine-Transfer-Uncheck.png" alt="„Andere Dateien und Ordner“ deaktivieren" width="600" />
</div>

Jetzt sollten dein Benutzerprofil, deine Programme und Einstellungen wiederhergestellt sein.


## Methode 2 – Wiederherstellen ohne Root-Patches (vollständig)


1. Stelle bei der Ersteinrichtung (Systemassistent) das Backup nicht wieder her. Nimm stattdessen alle Einstellungen so vor, als würdest du neu anfangen.
2. Sobald du den Schreibtisch erreichst, öffne die OCLP-App und entferne die Root-Patches im Bereich „Post Install Volume Patches“.
3. Starte deinen Mac neu.
   * Hinweis: Dein Mac wird sich mangels Grafiktreibern langsam anfühlen und die Auflösung kann falsch sein. WLAN ist in den meisten Fällen ebenfalls nicht verfügbar – liegt dein Backup auf einem Netzlaufwerk, nutze Ethernet.
4. Melde dich an und starte den Migrationsassistenten.
5. Führe die Wiederherstellung durch.
6. Gehe danach in die OCLP-App und installiere die Root-Patches erneut.

Jetzt sollte dein System vollständig aus Time Machine wiederhergestellt sein und mit allen Patches laufen.
