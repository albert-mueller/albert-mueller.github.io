# macOS-Installer erstellen

In diesem Abschnitt geht es darum, den macOS-Installer herunterzuladen und auf einen USB-Stick zu schreiben. Wenn du macOS auf einem anderen System installieren willst als dem, auf dem du gerade arbeitest, solltest du jetzt vor dem Fortfahren das Mac-Modell in den Einstellungen (Settings) auswählen, damit das automatische Root-Patching später korrekt funktioniert.

* Hinweis: Ein 32-GB-Stick wird empfohlen. Bei neueren Versionen von Sonoma und Sequoia passen Installer und Patches nicht mehr auf einen 16-GB-Stick. Für ältere Versionen kann ein 16-GB-Stick ausreichen.

Bevor du fortfährst, lies bitte die Anforderungen an die App und an die Erstellung des macOS-Installers [in der FAQ](FAQ.md#anforderungen-der-app). Neuere macOS-Versionen setzen ein neueres Ausgangssystem voraus, bevor du einen Installer erstellen kannst – das liegt an den Anforderungen von Apples Werkzeug `createinstallmedia`, auf dem OCLP aufbaut.


## Installer herunterladen

Zuerst brauchst du die App:

* [Release-Apps von OpenCore Legacy Patcher T2](https://github.com/albert-mueller/OpenCore-Legacy-Patcher-T2/releases)

Öffne die App nach dem Download – du solltest vom Hauptmenü begrüßt werden.

Wähle zuerst die Schaltfläche „Create macOS Installer“. Daraufhin werden dir zwei Optionen angezeigt.

In diesem Beispiel gehen wir davon aus, dass du einen Installer brauchst. Wähle „Download macOS installer“, um eine Liste verfügbarer Installer zu erhalten. Klicke auf die Version, die du herunterladen möchtest.

| Hauptmenü | Menü zur Installer-Erstellung | Verfügbare Installer |
| :--- | :--- | --- |
| ![OCLP-Hauptmenü](../images/OCLP-GUI-Main-Menu.png) | ![OCLP-Menü „Create macOS Installer“](../images/OCLP-GUI-Create-Installer-Menu.png) | ![OCLP-Liste der verfügbaren Installer](../images/OCLP-GUI-Installer-Download-Listed-Products.png) |


## Installer erstellen

Sobald der Download abgeschlossen ist, kannst du den Installer auf einen USB-Stick schreiben.

* Hinweis: Der gesamte USB-Stick wird formatiert.

| Heruntergeladenen Installer auswählen | Zu formatierendes Laufwerk auswählen |
| :--- | :--- |
| <img src="../images/OCLP-GUI-Installer-Select-Local-Installer.png" alt="Lokalen Installer auswählen" width="600" /> | <img src="../images/OCLP-GUI-Installer-Format-USB.png" alt="Zu formatierendes Laufwerk auswählen" width="600" /> |


Jetzt beginnt der Patcher, den Installer auf den Stick zu schreiben!

| Schreibvorgang | Erfolgsmeldung | Schreibvorgang abgeschlossen |
| :--- | :--- | :--- |
| ![](../images/OCLP-GUI-Installer-Flashing-Process.png) | ![](../images/OCLP-GUI-Installer-Sucess-Prompt.png) | ![](../images/OCLP-GUI-Installer-Finished-Script.png) |

# Wenn du fertig bist, geht es weiter mit [OpenCore erstellen und installieren](./BUILD.md)
