
# Universal Control auf nicht unterstützten Macs

Universal Control wurde mit macOS 12 Monterey eingeführt. Mit dieser Funktion kann ein Mac andere Macs und/oder iPads steuern, Eingabegeräte gemeinsam nutzen und gleichzeitig Dateien zwischen ihnen austauschen. Mit OpenCore und FeatureUnlock lässt sich Universal Control auf den meisten nicht unterstützten Macs freischalten, sofern sie die auf dieser Seite aufgeführten technischen Voraussetzungen erfüllen.

::: warning Hinweis

Diese Funktionen werden nicht aktiv getestet und können jederzeit kaputtgehen. Diese Seite richtet sich vor allem an Bastler; über den Discord-Support hinaus (siehe Ende der Seite) gibt es keine richtige Unterstützung.

:::

## Universal Control aktivieren

Wenn du alle Voraussetzungen erfüllst, kannst du in den meisten Fällen in den Bildschirmeinstellungen die Optionen für Universal Control anhaken, um es zu aktivieren. Wenn du Universal Control mit einem iPad nutzen möchtest, aktiviere es auch auf dem iPad.


| Bildschirmeinstellungen | Einstellungen für Universal Control |
| :--- | :--- |
| ![](../images/UC-enable-1.png) | ![Einstellungen für Universal Control](../images/UC-enable-2.png) |


Die meisten Mac-Modelle ab 2011 sollten sofort funktionieren. Ältere Macs wie die MacBook Pros von 2008–2011 benötigen jedoch eine neuere WLAN-/Bluetooth-Karte. Mehr dazu im [Abschnitt zu den Voraussetzungen](#voraussetzungen-fur-universal-control).

Einige Modelle, die Monterey nativ unterstützen, sind gesperrt; mehr dazu im [Abschnitt zu gesperrten Modellen](#gesperrte-modelle).

## Voraussetzungen für Universal Control

Technische Voraussetzungen:

* WLAN 4 (802.11n)
* Bluetooth 4.0
* macOS Monterey 12.4 oder neuer
* iPadOS 15.4 oder neuer (falls zutreffend)
* OpenCore Legacy Patcher 0.4.3 oder neuer

In der [Modelltabelle](#modelltabelle) unten siehst du, ob du Hardware aufrüsten musst und welche Hardware bei den betroffenen Macs genau getauscht werden muss. Hilfe zum Tausch der WLAN-Karte in älteren Modellen von 2008–2011 bekommst du bei Bedarf im Kanal `#hardware` auf dem [Discord-Server](https://discord.gg/rqdPgH8xSN).



Weitere Voraussetzungen:

* Alle Geräte sind mit demselben iCloud-Account angemeldet.
* Die Zwei-Faktor-Authentifizierung ist für deine Apple-ID aktiviert.
* Bluetooth und WLAN sind eingeschaltet. Eine Verbindung ist nicht nötig, es reicht, wenn beide aktiviert sind.
* Handoff ist in den iCloud-Einstellungen aktiviert.
* Die Geräte befinden sich in unmittelbarer Nähe zueinander.


### Modelltabelle

Diese Tabelle zeigt, welche Modelle Universal Control ab Werk (out of the box, OOB) unterstützen und welche nicht, und was nötig ist, um Unterstützung zu erhalten.
Hinweis: Bei AirPort-Upgrades sind nur die besten/neuesten Karten aufgeführt.

::: details MacBook

|   SMBIOS   | WLAN/BT-Version | UC ab Werk | Kommentar |
|------------|-----------------|------------|---------|
| MacBook5,1 | Wi-Fi 4 / BT 2.0 EDR |  <span style="color:red"> NEIN </span> | Broadcom-USB-Bluetooth-Dongle (4.0+) verwenden |
| MacBook5,2 | WiFi 4 / BT 2.1 EDR  | ^^ | Originale AirPort-Karte durch eine mPCIe-+-USB-Adapterplatine mit einer Karte vom Typ BCM94360CS2 ersetzen  |
| MacBook6,1 | ^^ | ^^ | Originale AirPort-Karte durch eine Karte vom Typ BCM94331PCIEBT4CAX/BCM94331PCIEBT4 ersetzen |
| MacBook7,1 | ^^ | ^^ | ^^ |
| MacBook8,1 | WiFi 4 + BT 4.2 | <span style="color:#30BCD5"> JA </span> | Universal Control funktioniert. |

:::

::: details MacBook Air

| SMBIOS | WLAN/BT-Version | UC ab Werk | Kommentar |
|--------|-----------------|------------|---------|
| MacBookAir2,1 | Wi-Fi 4 / BT 2.1 EDR | <span style="color:red"> NEIN </span> | Broadcom-USB-Bluetooth-Dongle (4.0+) verwenden |
| MacBookAir3,1 | ^^ | ^^ | Originale AirPort-Karte durch eine Karte vom Typ BCM94360CS2 ersetzen |
| MacBookAir3,2 | ^^ | ^^ | ^^ |
| MacBookAir4,1 | Wi-Fi 4 +  BT 4.0 | <span style="color:#30BCD5"> JA </span> | Universal Control funktioniert. |
| MacBookAir4,2 | ^^ | ^^ | ^^ |
| MacBookAir5,1 | ^^ | ^^ | ^^ |
| MacBookAir5,2 | ^^ | ^^ | ^^ |
| MacBookAir6,1 | Wi-Fi 5 + BT 4.0 | ^^ | ^^ |
| MacBookAir6,2 | ^^ | ^^ | ^^ |
| MacBookAir7,1 | ^^ | <span style="color:red"> NEIN </span> | Hardware unterstützt UC. <br> [**Spoofing erforderlich.**](#gesperrte-modelle)|
| MacBookAir7,2 | ^^ | ^^ | ^^ |


:::

::: details MacBook Pro

| SMBIOS | WLAN/BT-Version | UC ab Werk | Kommentar |
|--------|-----------------|-------------|---------|
| MacBookPro4,1 | Wi-Fi 4   /   BT 2.1 EDR | <span style="color:red"> NEIN </span> | Originale AirPort-Karte durch eine mPCIe-+-USB-Adapterplatine mit einer Karte vom Typ BCM94360CS2 ersetzen |
| MacBookPro5,1 | ^^ | ^^ | Broadcom-USB-Bluetooth-Dongle (4.0+) verwenden |
| MacBookPro5,2 | ^^ | ^^ | ^^ |
| MacBookPro5,3 | ^^ | ^^ | ^^ |
| MacBookPro5,4 | ^^ | ^^ | ^^ |
| MacBookPro5,5 | ^^ | ^^ | ^^ |
| MacBookPro6,1 | ^^ | ^^ | ^^ |
| MacBookPro6,2 | ^^ | ^^ | Originale AirPort-Karte durch eine Karte vom Typ BCM94331PCIEBT4CAX/BCM94331PCIEBT4 ersetzen |
| MacBookPro7,1 | ^^ | ^^ | Broadcom-USB-Bluetooth-Dongle (4.0+) verwenden |
| MacBookPro8,1 | Wi-Fi 4 + BT 2.1 EDR | ^^ | Originale AirPort-Karte durch eine Karte vom Typ BCM94331PCIEBT4CAX/BCM94331PCIEBT4 ersetzen |
| MacBookPro8,2 | ^^ | ^^ | ^^ |
| MacBookPro9,1 | Wi-Fi 4 + BT 4.0 | <span style="color:#30BCD5"> JA </span> | Universal Control funktioniert. |
| MacBookPro9,2 | ^^ | ^^ | ^^ |
| MacBookPro10,1 | ^^ | ^^ | ^^ |
| MacBookPro10,2 | ^^ | ^^ | ^^ |
| MacBookPro11,1 | Wi-Fi 5 + BT 4.0 | ^^ | ^^ |
| MacBookPro11,2 | ^^ | ^^ | ^^ |
| MacBookPro11,3 | ^^ | ^^ | ^^ |
| MacBookPro11,4 | Wi-Fi 5 + BT 4.2 | <span style="color:red"> NEIN </span> | Hardware unterstützt UC. <br> [**Spoofing erforderlich.**](#gesperrte-modelle) |
| MacBookPro11,5 | ^^ | ^^ | ^^ |
| MacBookPro12,1 | ^^ | ^^ | ^^ |
:::

:::details Mac mini

| SMBIOS | WLAN/BT-Version | UC ab Werk | Kommentar |
|--------|-----------------|------------|---------|
| Macmini3,1 | Wi-Fi 4 + BT 2.1 EDR  |  <span style="color:red"> NEIN </span>  | Ein Upgrade erfordert aufwendige elektrische und Gehäuseumbauten; verwende stattdessen einen Broadcom-USB-Bluetooth-Dongle (4.0+). |
| Macmini4,1 | ^^ |  ^^ | ^^ |
| Macmini5,1 | Wi-Fi 4 + BT 4.0 | <span style="color:#30BCD5"> JA </span> | Universal Control funktioniert. |
| Macmini5,2 | ^^ | ^^ | ^^ |
| Macmini5,3 | ^^ | ^^ | ^^ |
| Macmini6,1 | ^^ | ^^ | ^^ |
| Macmini6,2 | ^^ | ^^ | ^^ |
| Macmini7,1 | Wi-Fi 5 + BT 4.0 | <span style="color:red"> NEIN </span> | Hardware unterstützt UC. <br> [**Spoofing erforderlich.**](#gesperrte-modelle) |

:::


:::details iMac

|  SMBIOS  | WLAN/BT-Version | UC ab Werk | Kommentar |
|----------|-----------------|------------|---------|
| iMac7,1  | Wi-Fi 4 + BT 2.0 EDR  | <span style="color:red"> NEIN </span> | Originale AirPort-Karte durch eine mPCIe-+-USB-Adapterplatine mit einer Karte vom Typ BCM94360CD ersetzen
| iMac8,1  | ^^ | ^^ | ^^ |
| iMac9,1  | Wi-Fi 4 / BT 2.1 EDR  | ^^ | ^^ |
| iMac10,1 | ^^ | ^^ | ^^ |
| iMac11,1 | ^^ | ^^ | ^^ |
| iMac11,2 | ^^ | ^^ | ^^ |
| iMac11,3 | ^^ | ^^ | ^^ |
| iMac12,1 | ^^ | ^^ | Originale AirPort-Karte durch eine mPCIe-+-USB-Adapterplatine mit einer Karte vom Typ BCM943602CD ersetzen
| iMac12,2 | ^^ | ^^ | ^^ |
| iMac13,1 | Wi-Fi 4 + BT 4.0 | <span style="color:#30BCD5"> JA </span> | Universal Control funktioniert. |
| iMac13,2 | ^^ | ^^ | ^^ |
| iMac13,3 | ^^ | ^^ | ^^ |
| iMac14,1 | Wi-Fi 5 + BT 4.0 | ^^ | ^^ |
| iMac14,2 | ^^ | ^^ | ^^ |
| iMac14,3 | ^^ | ^^ | ^^ |
| iMac14,4 | ^^ | ^^ | ^^ |
| iMac15,1 | ^^ | ^^ | ^^ |
| iMac16,1 | Wi-Fi 5 + BT 4.2 | <span style="color:red"> NEIN </span> | Hardware unterstützt UC. <br> [**Spoofing erforderlich.**](#gesperrte-modelle) |
| iMac16,2 | ^^ | ^^ | ^^ |

:::

:::details Mac Pro

| SMBIOS    | WLAN/BT-Version | UC ab Werk | Kommentar |
|-----------|-----------------|---------|---------|
| MacPro3,1 | Wi-Fi 4 + BT 2.0 EDR | <span style="color:red"> NEIN </span> | Originale AirPort-Karte durch eine mPCIe-Adapterplatine mit einer Karte vom Typ BCM943602CD ersetzen |
| MacPro4,1 | Wi-Fi 4 + BT 2.1 EDR | ^^ | Originale AirPort-Karte durch eine mPCIe-+-USB-Adapterplatine mit einer Karte vom Typ BCM943602CD ersetzen |
| MacPro5,1 | ^^ | ^^ | ^^ |
| MacPro6,1 | Wi-Fi 5 + BT 4.0 | ^^ | Hardware unterstützt UC. <br> [**Spoofing erforderlich.**](#gesperrte-modelle) |

* Hinweis: Einige ältere Mac-Pro-Konfigurationen wurden in der Basisausstattung möglicherweise ohne WLAN-Karte ausgeliefert


:::


:::details Xserve ;p

| SMBIOS    | WLAN/BT-Version | UC ab Werk | Kommentar |
|-----------|-----------------|---------|---------|
| Xserve2,1 | N/A | <span style="color:red"> NEIN </span> | PCIe-Karte vom Typ BCM943602CD einbauen |
| Xserve3,1 | ^^ | ^^ | ^^ |

:::

## Gesperrte Modelle

Folgende Modelle hat Apple für die Nutzung von Universal Control gesperrt:

- MacBookAir7,x – MacBook Air Anfang 2015 11" / 13"
- MacBookPro11,4 – MacBook Pro Mitte 2015 15" (Intel Iris)
- MacBookPro11,5 – MacBook Pro Mitte 2015 15" (dGPU)
- MacBookPro12,x – MacBook Pro Anfang 2015 13"
- iMac16,x – iMac Ende 2015 21"
- Macmini7,x – Mac mini 2014
- MacPro6,x – Mac Pro Ende 2013

Die Hardware dieser Modelle kann Universal Control zwar unterstützen, wegen der Sperre ist SMBIOS-Spoofing aber die einzige Möglichkeit, Universal Control auf ihnen zu nutzen. Beim SMBIOS-Spoofing wird macOS in einigen Bereichen vorgegaukelt, es laufe auf einem anderen Gerät.

Mit SMBIOS-Spoofing erkennt der Universal-Control-Handshake ein anderes SMBIOS und erlaubt so auch einem gesperrten Mac, sich per Universal Control mit anderen Macs und iPads zu verbinden.

| Situation | Bedingung | Lösung |
|-----------|-----------|---------|
| Verbindung Mac <-> Mac | Nicht von Monterey unterstützt | Kein Spoofing nötig |
| Verbindung Mac <-> iPad | Nicht von Monterey unterstützt | Kein Spoofing nötig |
| Verbindung Mac <-> Mac | Einer oder beide sind gesperrt | Spoofing auf den gesperrten Macs erforderlich |
| Verbindung Mac <-> iPad | Gesperrter Mac | Spoofing auf dem gesperrten Mac erforderlich |

:::warning Achtung

Bevor wir fortfahren: SMBIOS-Spoofing ist eine fortgeschrittene Funktion von OpenCore. Unbedachter Einsatz kann wichtige Funktionen beschädigen und deine Installation unbrauchbar machen. Wenn du einmal mit Spoofing gebootet hast, wird dringend empfohlen, dabei zu bleiben und macOS nicht ohne OpenCore zu booten.

:::

### So funktioniert das Spoofing


::: details macOS Sequoia

Starte zuerst OpenCore Legacy Patcher T2.

Gehe dann zu **Settings** und in den Tab **SMBIOS**, setze „SMBIOS Spoof Level“ auf **Moderate** und „SMBIOS Spoof Model“ auf **das Modell, das in der Tabelle der Spoof-Modelle unten neben deinem nativen Modell steht.**

Beachte, dass „Allow native models“ und „Allow Native Spoofs“ – anders als unter Monterey – **NICHT** aktiviert sind. Das ist Absicht: Unter Sonoma sind diese Optionen nicht mehr relevant, und ihre Aktivierung verursacht Bootprobleme.

| Hauptansicht der Einstellungen | SMBIOS-Einstellungen |
| :--- | :--- |
| ![](../images/ventura_uc1.png) | ![](../images/ventura_uc2.png) |



::: details Tabelle der Spoof-Modelle (zum Aufklappen klicken)

Spoofing auf jedes Modell mit nativer Sequoia-Unterstützung sollte funktionieren; dies sind aber die ältesten Macs, die Sequoia nativ unterstützen, und wurden der Einfachheit halber gewählt.

**Zur Erinnerung:** Macs, die nicht in dieser Tabelle stehen, funktionieren ohne Spoofing – auch Systeme, die Sequoia nicht nativ unterstützen –, sofern die übrigen Voraussetzungen erfüllt sind, da sie nicht gesperrt sind.


| Mac (Name) | Natives SMBIOS | Spoof-SMBIOS |
|-------------|---------------|--------------|
| MacBook Air Anfang 2015 11" / 13" | MacBookAir7,x | MacBookAir9,1 |
| MacBook Pro Anfang 2015 13" | MacBookPro12,x | MacBookPro15,2 |
| MacBook Pro Mitte 2015 15" | MacBookPro11,4 / 11,5 | MacBookPro15,2 |
| iMac Ende 2015 21" | iMac16,x | iMac19,2 |
| Mac mini Ende 2014  | Macmini7,x | MacMini8,1 |
| Mac Pro Ende 2013 | MacPro6,x | MacPro7,1 |

:::

::: details macOS Sonoma

Starte zuerst OpenCore Legacy Patcher T2.

Gehe dann zu **Settings** und in den Tab **SMBIOS**, setze „SMBIOS Spoof Level“ auf **Moderate** und „SMBIOS Spoof Model“ auf **das Modell, das in der Tabelle der Spoof-Modelle unten neben deinem nativen Modell steht.**

Beachte, dass „Allow native models“ und „Allow Native Spoofs“ – anders als unter Monterey – **NICHT** aktiviert sind. Das ist Absicht: Unter Sonoma sind diese Optionen nicht mehr relevant, und ihre Aktivierung verursacht Bootprobleme.

| Hauptansicht der Einstellungen | SMBIOS-Einstellungen |
| :--- | :--- |
| ![](../images/ventura_uc1.png) | ![](../images/ventura_uc2.png) |



::: details Tabelle der Spoof-Modelle (zum Aufklappen klicken)

Spoofing auf jedes Modell mit nativer Sonoma-Unterstützung sollte funktionieren; dies sind aber die ältesten Macs, die Sonoma nativ unterstützen, und wurden der Einfachheit halber gewählt.

**Zur Erinnerung:** Macs, die nicht in dieser Tabelle stehen, funktionieren ohne Spoofing – auch Systeme, die Sonoma nicht nativ unterstützen –, sofern die übrigen Voraussetzungen erfüllt sind, da sie nicht gesperrt sind.


| Mac (Name) | Natives SMBIOS | Spoof-SMBIOS |
|-------------|---------------|--------------|
| MacBook Air Anfang 2015 11" / 13" | MacBookAir7,x | MacBookAir8,1 |
| MacBook Pro Anfang 2015 13" | MacBookPro12,x | MacBookPro15,2 |
| MacBook Pro Mitte 2015 15" | MacBookPro11,4 / 11,5 | MacBookPro15,2 |
| iMac Ende 2015 21" | iMac16,x | iMac19,2 |
| Mac mini Ende 2014  | Macmini7,x | MacMini8,1 |
| Mac Pro Ende 2013 | MacPro6,x | MacPro7,1 |

:::

::: details macOS Ventura

Starte zuerst OpenCore Legacy Patcher T2.

Gehe dann zu **Settings** und in den Tab **SMBIOS**, setze „SMBIOS Spoof Level“ auf **Moderate** und „SMBIOS Spoof Model“ auf **das Modell, das in der Tabelle der Spoof-Modelle unten neben deinem nativen Modell steht.**

Beachte, dass „Allow native models“ und „Allow Native Spoofs“ – anders als unter Monterey – **NICHT** aktiviert sind. Das ist Absicht: Unter Ventura sind diese Optionen nicht mehr relevant, und ihre Aktivierung verursacht Bootprobleme.

| Hauptansicht der Einstellungen | SMBIOS-Einstellungen |
| :--- | :--- |
| ![](../images/ventura_uc1.png) | ![](../images/ventura_uc2.png) |



::: details Tabelle der Spoof-Modelle (zum Aufklappen klicken)

Spoofing auf jedes Modell mit nativer Ventura-Unterstützung sollte funktionieren; dies sind aber die ältesten Macs, die Ventura nativ unterstützen, und wurden der Einfachheit halber gewählt.

**Zur Erinnerung:** Macs, die nicht in dieser Tabelle stehen, funktionieren ohne Spoofing – auch Systeme, die Ventura nicht nativ unterstützen –, sofern die übrigen Voraussetzungen erfüllt sind, da sie nicht gesperrt sind.


| Mac (Name) | Natives SMBIOS | Spoof-SMBIOS |
|-------------|---------------|--------------|
| MacBook Air Anfang 2015 11" / 13" | MacBookAir7,x | MacBookAir8,1 |
| MacBook Pro Anfang 2015 13" | MacBookPro12,x | MacBookPro14,1 |
| MacBook Pro Mitte 2015 15" | MacBookPro11,4 / 11,5 | MacBookPro14,3 |
| iMac Ende 2015 21" | iMac16,x | iMac18,2 |
| Mac mini Ende 2014  | Macmini7,x | MacMini8,1 |
| Mac Pro Ende 2013 | MacPro6,x | MacPro7,1 |

:::

::: details macOS Monterey

Starte zuerst OpenCore Legacy Patcher T2. Gehe dann zu **Settings**, in den Tab **App**, und hake **Allow native models** an.

[](../images/OCLP-App-Allow-Native-Models.png)

Gehe anschließend in den Tab **SMBIOS**, hake **Allow spoofing native Macs** an und setze „SMBIOS Spoof Level“ auf **Moderate**. Setze „SMBIOS Spoof Model“ auf **das Modell, das in der Tabelle der Spoof-Modelle unten neben deinem nativen Modell steht.**


| Hauptansicht der Einstellungen | SMBIOS-Einstellungen |
| :--- | :--- |
| ![](../images/OCLP-SMBIOS-Allow-Native-Spoof.png) | ![](../images/OCLP-smbios-settings.png) |


::: details Tabelle der Spoof-Modelle (zum Aufklappen klicken)

Jedes Modell nach der Liste der offiziell gesperrten Macs sollte unterstützt werden; dies sind aber die ältesten Macs mit Universal-Control-Unterstützung und wurden der Einfachheit halber gewählt.

**Zur Erinnerung:** Macs, die nicht in dieser Tabelle stehen, funktionieren ohne Spoofing – auch Systeme, die Monterey nicht nativ unterstützen –, sofern die übrigen Voraussetzungen erfüllt sind, da sie nicht gesperrt sind.


| Mac (Name) | Natives SMBIOS | Spoof-SMBIOS |
|-------------|---------------|--------------|
| MacBook Air Anfang 2015 11" / 13" | MacBookAir7,x | MacBookAir8,1 |
| MacBook Pro Anfang 2015 13" | MacBookPro12,x | MacBookPro13,1 |
| MacBook Pro Mitte 2015 15" | MacBookPro11,4 / 11,5 | MacBookPro13,3 |
| iMac Ende 2015 21" | iMac16,x | iMac18,2 |
| Mac mini Ende 2014  | Macmini7,x | MacMini8,1 |
| Mac Pro Ende 2013 | MacPro6,x | MacPro7,1 |

:::

**Hinweis:** Ändere das Modell in der Hauptansicht der Einstellungen **nicht**, es sei denn, du erstellst OpenCore auf einem anderen Gerät als dem Zielgerät. Wichtig: OCLP richtet sich nach diesem Modell, unabhängig davon, worauf du gespooft hast – dein Mac ist ja weiterhin das, was das native SMBIOS angibt.

Erstelle und installiere OpenCore zum Schluss erneut und starte das Betriebssystem neu. Aktiviere Universal Control wie im Abschnitt [Universal Control aktivieren](#universal-control-aktivieren) beschrieben.



Dein Mac sollte dich jetzt auffordern, dich erneut bei iCloud anzumelden. Erscheint diese Aufforderung, hast du das SMBIOS-Spoofing erfolgreich eingerichtet. Andernfalls prüfe, ob du die obigen Schritte korrekt befolgt hast, oder bitte auf dem Discord-Server in [#misc-help](https://discord.gg/rqdPgH8xSN) um weitere Hilfe.
