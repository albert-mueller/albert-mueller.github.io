# OpenCore erstellen und installieren

Jetzt, wo wir einen macOS-Installer haben, erstellen wir unsere OpenCore-Konfiguration!

Falls du OpenCore Patcher noch nicht heruntergeladen hast, hol das jetzt nach:

* [OpenCore Legacy Patcher T2 Releases](https://github.com/albert-mueller/OpenCore-Legacy-Patcher-T2/releases)

Starte als Nächstes die `OpenCore-Patcher-T2.app`.

Hier wählen wir `OpenCore` und klicken auf `Install OpenCore`:


<div align="left">
             <img src="../images/OCLP-GUI-Main-Menu.png" alt="OCLP-GUI Hauptmenü" width="700" />
</div>

::: warning Warnung
OpenCore-Konfigurationen sind hardwarespezifisch.
Wenn du OpenCore für ein anderes Modell erstellst als das, auf dem du gerade arbeitest, musst du unbedingt das richtige Modell in den Einstellungen auswählen.
:::


| Erstellung starten | Erstellung abgeschlossen |
| :--- | :--- |
| <img src="../images/OCLP-GUI-Build-Start.png" alt="Erstellung starten" width="600" /> | <img src="../images/OCLP-GUI-Build-Finished.png" alt="Erstellung abgeschlossen" width="600" /> |


Sobald die Erstellung abgeschlossen ist, wählst du das Laufwerk aus, auf dem installiert werden soll:

* Wenn du einen macOS-USB-Stick manuell erstellt hast und er nicht aufgelistet wird, stelle sicher, dass er entweder als GUID/GPT formatiert ist oder eine FAT32-Partition für OpenCore besitzt.


| Laufwerk auswählen | Partition auswählen |
| :--- | :--- |
| <img src="../images/OCLP-GUI-EFI-Select-Disk.png" alt="Laufwerk auswählen" width="600" /> | <img src="../images/OCLP-GUI-EFI-Select-Partition.png" alt="Partition auswählen" width="600" /> |



# Wenn du fertig bist, geht es weiter mit [OpenCore und macOS booten](./BOOT.md)
