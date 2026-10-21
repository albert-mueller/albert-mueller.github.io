# macOS Sonoma

![](../images/sonoma.png)

*Da sind wir wieder – es ist uns immer ein Vergnügen~*

Apple hat erneut eine Reihe von Modellen fallen gelassen und setzt damit den Abschied von Intel-Macs fort. Mit OpenCore Legacy Patcher 1.0.0 wurde eine erste Unterstützung für macOS Sonoma eingeführt.

## Neu nicht mehr unterstützte Hardware

* MacBook10,1:       MacBook (Retina, 12 Zoll, 2017)
* MacBookPro14,1:    MacBook Pro (13 Zoll, 2017, Zwei Thunderbolt 3 Anschlüsse)
* MacBookPro14,2:    MacBook Pro (13 Zoll, 2017, Vier Thunderbolt 3 Anschlüsse)
* MacBookPro14,3:    MacBook Pro (15 Zoll, 2017)
* iMac18,1:          iMac (21,5 Zoll, 2017)
* iMac18,2:          iMac (Retina 4K, 21,5 Zoll, 2017)
* iMac18,3:          iMac (Retina 5K, 27 Zoll, 2017)

## Aktueller Stand

OpenCore Legacy Patcher 1.0.0 unterstützt Sonoma auf allen unten aufgeführten Modellen, einige Herausforderungen bleiben aber bestehen. Informationen dazu findest du weiter unten auf dieser Seite.

<img width="625" alt="" src="../images/OCLP-100-Initial-Support.png">

## Probleme

* [Bluetooth](#bluetooth)
* [T1-Sicherheitschip](#t1-sicherheitschip)
* [Unterstützung für USB 1.1 (OHCI/UHCI)](#unterstutzung-fur-usb-1-1-ohci-uhci)
* [Grafikunterstützung und -probleme](#grafikunterstutzung-und-probleme)


### Bluetooth

Auf Modellen vor 2012 funktioniert Bluetooth nach dem Booten manchmal nicht. Ein NVRAM-Reset kann helfen.

Bei Dualboot-Systemen kann das Problem auch nach dem Reset wieder auftreten.

### T1-Sicherheitschip

**Ab Version 1.1.0 behoben, ursprüngliche Erklärung unten**

::: details Unterstützung für den T1-Sicherheitschip

Sonoma hat die Unterstützung für den T1-Chip entfernt, der in den meisten Macs von 2016 und 2017 steckt. Auf diesen Systemen funktioniert daher Folgendes nicht:

* FileVault aktivieren oder deaktivieren
* Das Fenster mit den Passworteinstellungen öffnen
* Fingerabdrücke hinzufügen (bei einem Upgrade werden vorhandene Fingerabdrücke gelöscht)
* Karten zu Apple Pay hinzufügen

[Weitere Informationen hier](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1103)

:::

::: warning Achtung
Beachte, dass beim Löschen des gesamten Laufwerks die T1-Firmware entfernt und nicht wieder installiert wird. Weitere Informationen findest du unter [Fehlerbehebung](TROUBLESHOOT-HARDWARE.md#keine-t1-funktionen-nach-der-installation-von-sonoma-oder-neuer).
:::

### Unterstützung für USB 1.1 (OHCI/UHCI)

Bei Penryn-Systemen, Mac Pros vor 2013 und Xserve wurde die USB-1.1-Unterstützung in macOS Ventura komplett entfernt, und das setzt sich natürlich in Sonoma fort.
USB 1.1 mag unwichtig erscheinen, steuert aber viele wichtige Geräte deines Systems, darunter:

* Tastatur und Trackpad bei Laptops
* Infrarotempfänger
* Bluetooth

Wie du das Problem umgehst, erfährst du auf [der Seite zur Fehlerbehebung](TROUBLESHOOT-HARDWARE.md#tastatur-maus-und-trackpad-funktionieren-im-installer-oder-nach-einem-update-nicht).

### Grafikunterstützung und -probleme
Dieser Build enthält sowohl Legacy-Metal- als auch Nicht-Metal-Patches für macOS Sonoma. Weitere Informationen zur Legacy-Metal- und Nicht-Metal-Unterstützung und den jeweiligen Problemen findest du unter folgenden Links:

* [Legacy Metal](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008)
* [Nicht-Metal](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)
