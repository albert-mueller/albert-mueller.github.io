# macOS Ventura

![](../images/ventura.png)

Mit OpenCore Legacy Patcher v0.5.0 und neuer wurde für die meisten Metal-fähigen Macs eine erste Unterstützung für macOS Ventura eingeführt. Diese Seite informiert über aktuelle Probleme und wird aktualisiert, sobald neue Patch-Sets entwickelt und in unseren Patcher aufgenommen werden.

## Neu nicht mehr unterstützte Hardware

Mit Ventura hat Apple viele Intel-Geräte fallen gelassen. Daher ist OpenCore Legacy Patcher T2 auf folgenden Modellen nötig (zusätzlich zu bereits früher entfernten Modellen):

* iMac16,1 (21,5 Zoll, Ende 2015)
* iMac16,2 (21,5 Zoll und 21,5 Zoll 4K, Ende 2015)
* iMac17,1 (27 Zoll 5K, Ende 2015)
* MacBook9,1 (12 Zoll, Anfang 2016)
* MacBookAir7,1 (11 Zoll, Anfang 2015)
* MacBookAir7,2 (13 Zoll, Anfang 2015)
* MacBookPro11,4 (15 Zoll, Mitte 2015, iGPU)
* MacBookPro11,5 (15 Zoll, Mitte 2015, dGPU)
* MacBookPro12,1 (13 Zoll, Anfang 2015)
* MacBookPro13,1 (13 Zoll, Ende 2016)
* MacBookPro13,2 (13 Zoll, Ende 2016)
* MacBookPro13,3 (15 Zoll, Ende 2016)
* Macmini7,1 (Ende 2014)
* MacPro6,1 (Ende 2013)


## Aktueller Stand

OpenCore Legacy Patcher T2 unterstützt Ventura auf den unten aufgeführten Modellen, einige Herausforderungen bleiben aber bestehen. Informationen dazu findest du weiter unten auf dieser Seite.

<img width="625" alt="" src="../images/OCLP-060-Initial-Support.png">

Für ältere Hardware siehe die folgenden Abschnitte:

* [Aktuelle Probleme](#aktuelle-probleme)
  * [Unterstützung für AMD Polaris, Vega und Navi in Mac Pros vor 2019 und iMacs vor 2012](#unterstutzung-fur-amd-polaris-vega-und-navi-in-mac-pros-vor-2019-und-imacs-vor-2012)
  * [Unterstützung für USB 1.1 (OHCI/UHCI)](#unterstutzung-fur-usb-1-1-ohci-uhci)

Das Team tut sein Bestes, um die genannten Probleme zu untersuchen und zu beheben, kann aber keinen Zeitplan nennen.

## Aktuelle Probleme

### Unterstützung für AMD Polaris, Vega und Navi in Mac Pros vor 2019 und iMacs vor 2012

Nutzer von Mac Pros von 2008 bis 2013 (MacPro3,1–6,1) und iMacs von 2009 bis 2011 (iMac9,1–12,2) sollten beachten, dass macOS Ventura für die native Grafikbeschleunigung jetzt [AVX2.0-Unterstützung der CPU](https://de.wikipedia.org/wiki/Advanced_Vector_Extensions#AVX2) voraussetzt. Auch wenn deine GPU nativ unterstützt wird, kannst du Ventura mit diesen GPUs daher nicht offiziell nutzen.

* AVX2.0 unterstützen CPUs ab Haswell, und keiner der Mac Pros vor 2019 lässt sich mit einer solchen CPU aufrüsten.

Derzeit unterstützt OpenCore Legacy Patcher T2 nur das Patchen des Grafik-Stacks für AMD Polaris und Vega, sodass dieser kein AVX2.0 mehr benötigt. Wir haben kürzlich eine AMD RX 6600 gespendet bekommen und hoffen daher, dass das Projekt künftig auch AMD Navi auf Macs vor Haswell unterstützen kann. Einen Zeitplan können wir aber nicht nennen.

Betroffen sind folgende GPUs:

| GPU-Architektur | Modellfamilien | Unterstützt |
| :--- | :--- | :--- |
| AMD Polaris | RX 4xx/5xx (Serie 10/20) | <span style="color:#30BCD5"> Mit Patches unterstützt </span> |
| AMD Vega    | Vega 56/64/VII (Serie 10/20) | ^^ |
| AMD Navi    | RX 5xxx/6xxx (Serie 10/20) | <span style="color:red"> Nicht unterstützt </span> |


### Unterstützung für USB 1.1 (OHCI/UHCI)

Bei Penryn-Systemen und Mac Pros vor 2013 wurde die USB-1.1-Unterstützung in macOS Ventura komplett entfernt. USB 1.1 mag unwichtig erscheinen, steuert aber viele wichtige Geräte deines Systems, darunter:

* Tastatur und Trackpad bei Laptops
* Infrarotempfänger
* Bluetooth

Wie du das Problem umgehst, erfährst du auf [der Seite zur Fehlerbehebung](TROUBLESHOOT-HARDWARE.md#tastatur-maus-und-trackpad-funktionieren-im-installer-oder-nach-einem-update-nicht).

### Grafikunterstützung und -probleme

Weitere Informationen zur Legacy-Metal- und Nicht-Metal-Unterstützung und den jeweiligen Problemen findest du unter folgenden Links:

* [Legacy Metal](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008)
* [Nicht-Metal](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)

### Behobene Probleme

::: details Unterstützung älterer WLAN-Karten (behoben ab v0.6.0)

Bei Systemen, die unter macOS Monterey Root-Patches für die WLAN-Unterstützung benötigten, hat macOS Ventura dieses Patch-Set leider unbrauchbar gemacht. Derzeit werden folgende WLAN-Karten nicht unterstützt:

* Atheros: alle Modelle
* Broadcom: BCM94328 und BCM94322

Folgende Geräte wurden ab Werk mit diesen Karten ausgeliefert:

* iMac12,x und älter
* Macmini3,1 und älter
* MacBook5,x und älter
* MacBookAir2,1 und älter
* MacBookPro7,1 und älter
  * Ausgenommen MacBookPro6,x
* MacPro5,1 und älter


BCM943224, BCM94331, BCM94360 und BCM943602 werden von OpenCore Legacy Patcher T2 weiterhin vollständig unterstützt. Rüste nach Möglichkeit auf eine dieser Karten auf.

:::


::: details Grafikbeschleunigung für Nicht-Metal-GPUs (behoben ab v0.6.0)

Das Team arbeitet mit Hochdruck daran, Nicht-Metal-GPUs zum Laufen zu bringen – das ist allerdings unsere größte Herausforderung seit Big Sur.

Apple hat den Grafik-Stack stark verändert, um aufwendige Effekte und insbesondere Stage Manager zu ermöglichen. Wir halten dich über die Entwicklung auf dem Laufenden, aber jetzt ist nicht der richtige Zeitpunkt, nach einem Zeitplan zu fragen.

Betroffen sind folgende GPUs:

* NVIDIA:
  * Tesla (Serie 8000–300)
* AMD:
  * TeraScale (Serie 2000–6000)
* Intel:
  * Iron Lake
  * Sandy Bridge (Serie 2000–3000)


Folgende Geräte wurden ab Werk mit einer nicht unterstützten GPU ausgeliefert:

* iMac7,1 - iMac12,x
* MacBook5,1 - MacBook7,1
* MacBookAir2,1 - MacBookAir4,x
* MacBookPro4,1 - MacBookPro8,x
* Macmini3,1 - Macmini5,x
* MacPro3,1 - MacPro5,1
* Xserve2,1 - Xserve3,1

:::
