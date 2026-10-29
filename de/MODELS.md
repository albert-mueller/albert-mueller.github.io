# Unterstützte Modelle

Jeder unten aufgeführte Intel-Mac kann OpenCore Legacy Patcher T2 installieren und nutzen. Um dein Hardwaremodell herauszufinden, öffne die Systeminformationen und suche nach dem Eintrag `Modell-Identifizierung` (`Model Identifier`).
* Das gilt auch dann, wenn Apple das Modell nativ unterstützt.
* OpenCore Legacy Patcher T2 unterstützt keine Macs mit PowerPC oder Apple Silicon.
* Wenn dein Modell unten nicht aufgeführt ist, wird es von diesem Patcher nicht unterstützt.

::: warning Hinweis
Es wird **dringend empfohlen**, deinen Mac vor der Nutzung von OpenCore Legacy Patcher T2 auf seine neueste native macOS-Version zu aktualisieren, damit du die neueste Firmware hast.
:::

::: warning Mindestens 3 GB RAM für die Installation von macOS Sonoma und neuer erforderlich
Modelle mit 2 GB RAM können macOS Sonoma oder neuer nicht installieren; außerdem bootet macOS Sequoia darauf möglicherweise nicht. Diese Versionen lassen sich zwar per Laufwerkstausch installieren (die Installation erfolgt dabei auf einem anderen System), die Ergebnisse können aber stark variieren, und davon wird abgeraten.

Für diese Modelle empfehlen wir stattdessen macOS Mojave mit [dosdude1s Mojave Patcher](https://dosdude1.com/mojave/).
:::

## T2-Macs und macOS Tahoe

macOS 26 Tahoe unterstützt nativ nur diese Intel-Macs: MacBook Pro (16 Zoll, 2019), MacBook Pro (13 Zoll, 2020, 4 Thunderbolt 3 Anschlüsse), iMac (Retina 5K, 27 Zoll, 2020) und Mac Pro (2019). Alle anderen T2-Macs werden von Apple unter Tahoe nicht unterstützt:

* MacBook Air (Retina, 13 Zoll, 2018, 2019 und 2020)
* MacBook Pro (2018 und 2019, 13 und 15 Zoll)
* MacBook Pro (13 Zoll, 2020, 2 Thunderbolt 3 Anschlüsse)
* Mac mini (Ende 2018)
* iMac Pro (2017)

::: danger Alpha: Die Forschung läuft noch
macOS Tahoe auf diese T2-Macs zu bringen, ist das Hauptziel von OpenCore Legacy Patcher T2, und die Forschung daran läuft noch. Derzeit bricht der Tahoe-Installer beim Versiegeln des Root-Volumes mit „Failed to install a software update“ ab, daher können diese Modelle Tahoe noch nicht ausführen.

Wir hoffen, diese Macs bald bis zum Schreibtisch booten zu können. Bis dahin gilt OpenCore Legacy Patcher T2 als Alpha-Software.
:::

Anhand der folgenden Tabellen kannst du bekannte Probleme eines bestimmten Modells nachschlagen und sehen, welches Betriebssystem auf deinem Gerät am besten läuft.
* [MacBook](#macbook)
* [MacBook Air](#macbook-air)
* [MacBook Pro](#macbook-pro)
* [Mac mini](#mac-mini)
* [iMac](#imac)
* [Mac Pro](#mac-pro)
* [Xserve](#xserve)


### MacBook

| Modellname | Kennung | Weitere Infos |
| :--- | :--- | :--- |
| MacBook (13 Zoll, Anfang 2008)<br>MacBook (13 Zoll, Ende 2008) | `MacBook4,1` | - **Nur Root-Patching** (ab 4.0.0.1900019): OpenCore kann für dieses Modell nicht gebaut werden, weil sein Audio eine AppleALC-Version braucht, die nicht mit OpenCore 1.0.8 kompatibel ist. Das Bauen von OpenCore wird wieder unterstützt, sobald eine deutlich neuere AppleALC-Version dieses Modell unterstützt<br>- Root-Patches für Intel-GMA-X3100-Grafik, Display-Hintergrundbeleuchtung und Audio<br>- [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108) |
| MacBook (13 Zoll, Aluminium, Ende 2008) | `MacBook5,1` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021)|
| MacBook (13 Zoll, Anfang 2009)<br>MacBook (13 Zoll, Mitte 2009) | `MacBook5,2` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021)<br>- Trackpad-Gesten funktionieren teilweise nicht |
| MacBook (13 Zoll, Ende 2009) | `MacBook6,1` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021) |
| MacBook (13 Zoll, Mitte 2010) | `MacBook7,1` | ^^ |
| MacBook (Retina, 12 Zoll, Anfang 2015) | `MacBook8,1` | - [Legacy Metal (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008) |
| MacBook (Retina, 12 Zoll, Anfang 2016) | `MacBook9,1` | ^^ |
| MacBook (Retina, 12 Zoll, 2017) | `MacBook10,1` | - Native Grafikunterstützung |

### MacBook Air

| Modellname | Kennung | Weitere Infos |
| :--- | :--- | :--- |
| MacBook Air (13 Zoll, Ende 2008)<br>MacBook Air (13 Zoll, Mitte 2009) | `MacBookAir2,1` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021)|
| MacBook Air (11 Zoll, Ende 2010) | `MacBookAir3,1` | ^^ |
| MacBook Air (13 Zoll, Ende 2010) | `MacBookAir3,2` | ^^ |
| MacBook Air (11 Zoll, Mitte 2011) | `MacBookAir4,1` | ^^ |
| MacBook Air (13 Zoll, Mitte 2011) | `MacBookAir4,2` | ^^ |
| MacBook Air (11 Zoll, Mitte 2012) | `MacBookAir5,1` | - [Legacy Metal (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008) |
| MacBook Air (13 Zoll, Mitte 2012) | `MacBookAir5,2` | ^^ |
| MacBook Air (11 Zoll, Mitte 2013)<br>MacBook Air (11 Zoll, Anfang 2014) | `MacBookAir6,1` | ^^ |
| MacBook Air (13 Zoll, Mitte 2013)<br>MacBook Air (13 Zoll, Anfang 2014) | `MacBookAir6,2` | ^^ |
| MacBook Air (11 Zoll, Anfang 2015) | `MacBookAir7,1` | ^^ |
| MacBook Air (13 Zoll, Anfang 2015)<br>MacBook Air (13 Zoll, 2017) | `MacBookAir7,2` | ^^ |
| MacBook Air (Retina, 13 Zoll, 2018) | `MacBookAir8,1` | - Nativ unterstützt bis Sonoma<br>- [T2-Mac: macOS Tahoe funktioniert noch nicht](#t2-macs-und-macos-tahoe) |
| MacBook Air (Retina, 13 Zoll, 2019) | `MacBookAir8,2` | ^^ |
| MacBook Air (Retina, 13 Zoll, 2020) | `MacBookAir9,1` | - Nativ unterstützt bis Sequoia<br>- [T2-Mac: macOS Tahoe funktioniert noch nicht](#t2-macs-und-macos-tahoe) |

### MacBook Pro

| Modellname | Kennung | Weitere Infos |
| :--- | :--- | :--- |
| MacBook Pro (15 Zoll, Anfang 2008)<br>MacBook Pro (17 Zoll, Anfang 2008) | `MacBookPro4,1` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021)|
| MacBook Pro (15 Zoll, Ende 2008)<br>MacBook Pro (15 Zoll, Anfang 2009) | `MacBookPro5,1` | ^^ |
| MacBook Pro (17 Zoll, Anfang 2009)<br>MacBook Pro (17 Zoll, Mitte 2009) | `MacBookPro5,2` | ^^ |
| MacBook Pro (15 Zoll, Mitte 2009) | `MacBookPro5,3`<br>`MacBookPro5,4` | ^^ |
| MacBook Pro (13 Zoll, Mitte 2009) | `MacBookPro5,5` | ^^ |
| MacBook Pro (17 Zoll, Mitte 2010) | `MacBookPro6,1` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108) |
| MacBook Pro (15 Zoll, Mitte 2010) | `MacBookPro6,2` | ^^ |
| MacBook Pro (13 Zoll, Mitte 2010) | `MacBookPro7,1` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021) |
| MacBook Pro (13 Zoll, Anfang 2011)<br>MacBook Pro (13 Zoll, Ende 2011) | `MacBookPro8,1` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108) |
| MacBook Pro (15 Zoll, Anfang 2011)<br>MacBook Pro (15 Zoll, Ende 2011) | `MacBookPro8,2` | ^^ |
| MacBook Pro (17 Zoll, Anfang 2011)<br> | `MacBookPro8,3` | ^^ |
| MacBook Pro (15 Zoll, Mitte 2012) | `MacBookPro9,1` | - [Legacy Metal (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008) |
| MacBook Pro (13 Zoll, Mitte 2012) | `MacBookPro9,2` | ^^ |
| MacBook Pro (Retina, 15 Zoll, Mitte 2012)<br>MacBook Pro (Retina, 15 Zoll, Anfang 2013) | `MacBookPro10,1` | ^^ |
| MacBook Pro (Retina, 13 Zoll, Ende 2012)<br>MacBook Pro (Retina, 13 Zoll, Anfang 2013) | `MacBookPro10,2` | ^^ |
| MacBook Pro (Retina, 13 Zoll, Ende 2013)<br>MacBook Pro (Retina, 13 Zoll, Mitte 2014) | `MacBookPro11,1` | ^^ |
| MacBook Pro (Retina, 15 Zoll, Ende 2013)<br>MacBook Pro (Retina, 15 Zoll, Mitte 2014) | `MacBookPro11,2`<br>`MacBookPro11,3` | ^^ |
| MacBook Pro (Retina, 15 Zoll, Mitte 2015) | `MacBookPro11,4`<br>`MacBookPro11,5` | ^^ |
| MacBook Pro (Retina, 13 Zoll, Anfang 2015) | `MacBookPro12,1` | ^^ |
| MacBook Pro (13 Zoll, 2016, 2 Thunderbolt 3 Anschlüsse) | `MacBookPro13,1` | ^^ |
| MacBook Pro (13 Zoll, 2016, 4 Thunderbolt 3 Anschlüsse) | `MacBookPro13,2` | ^^ |
| MacBook Pro (15 Zoll, 2016) | `MacBookPro13,3` | ^^ |
| MacBook Pro (13 Zoll, 2017, 2 Thunderbolt 3 Anschlüsse) | `MacBookPro14,1` | - Native Grafikunterstützung |
| MacBook Pro (13 Zoll, 2017, 4 Thunderbolt 3 Anschlüsse) | `MacBookPro14,2` | ^^ |
| MacBook Pro (15 Zoll, 2017) | `MacBookPro14,3` | - [Legacy Metal (macOS 14+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008) |
| MacBook Pro (13 Zoll, 2018, 4 Thunderbolt 3 Anschlüsse)<br>MacBook Pro (13 Zoll, 2019, 4 Thunderbolt 3 Anschlüsse) | `MacBookPro15,2` | - Nativ unterstützt bis Sequoia<br>- [T2-Mac: macOS Tahoe funktioniert noch nicht](#t2-macs-und-macos-tahoe) |
| MacBook Pro (15 Zoll, 2018)<br>MacBook Pro (15 Zoll, 2019) | `MacBookPro15,1`<br>`MacBookPro15,3` | ^^ |
| MacBook Pro (13 Zoll, 2019, 2 Thunderbolt 3 Anschlüsse) | `MacBookPro15,4` | ^^ |
| MacBook Pro (16 Zoll, 2019) | `MacBookPro16,1`<br>`MacBookPro16,4` | - Von Apple unterstützt |
| MacBook Pro (13 Zoll, 2020, 4 Thunderbolt 3 Anschlüsse) | `MacBookPro16,2` | ^^ |
| MacBook Pro (13 Zoll, 2020, 2 Thunderbolt 3 Anschlüsse) | `MacBookPro16,3` | - Nativ unterstützt bis Sequoia<br>- [T2-Mac: macOS Tahoe funktioniert noch nicht](#t2-macs-und-macos-tahoe) |

### Mac mini

| Modellname | Kennung | Weitere Infos |
| :--- | :--- | :--- |
| Mac mini (Anfang 2009) | `Macmini3,1` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021) |
| Mac mini (Mitte 2010) | `Macmini4,1` | ^^ |
| Mac mini (Mitte 2011) | `Macmini5,1`<br>`Macmini5,2`<br>`Macmini5,3` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108) |
| Mac mini (Ende 2012) | `Macmini6,1`<br>`Macmini6,2` | - [Legacy Metal (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008) |
| Mac mini (Ende 2014) | `Macmini7,1` | ^^ |
| Mac mini (Ende 2018) | `Macmini8,1` | - Nativ unterstützt bis Sequoia<br>- [T2-Mac: macOS Tahoe funktioniert noch nicht](#t2-macs-und-macos-tahoe) |

### iMac
| Modellname | Kennung | Weitere Infos |
| :--- | :--- | :--- |
| iMac (20 Zoll, Mitte 2007)<br>iMac (24 Zoll, Mitte 2007) | `iMac7,1` | - [Erfordert SSE4.1-fähige CPU](https://lowendmac.com/2018/penryn-t9300-9500-cpu-upgrades-for-the-2007-imac/)<br>- [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021)<br>- Originales Bluetooth-Modul entfernen, um Kernel Panics zu vermeiden |
| iMac (20 Zoll, Anfang 2008)<br>iMac (24 Zoll, Anfang 2008) | `iMac8,1` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021) |
| iMac (20 Zoll, Anfang 2009)<br>iMac (24 Zoll, Anfang 2009)<br>iMac (20 Zoll, Mitte 2009) | `iMac9,1` | - [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021)<br>- [Aufrüstung auf Metal-GPU empfohlen](https://forums.macrumors.com/threads/2011-imac-graphics-card-upgrade.1596614/?post=17425857#post-17425857) |
| iMac (21,5 Zoll, Ende 2009)<br>iMac (27 Zoll, Ende 2009)| `iMac10,1` | ^^ |
| iMac (27 Zoll, Ende 2009) | `iMac11,1` | ^^ |
| iMac (21,5 Zoll, Mitte 2010) | `iMac11,2` | ^^ |
| iMac (27 Zoll, Mitte 2010) | `iMac11,3` | ^^ |
| iMac (21,5 Zoll, Mitte 2011)<br>iMac (21,5 Zoll, Ende 2011) | `iMac12,1` | ^^ |
| iMac (27 Zoll, Mitte 2011) | `iMac12,2` | ^^ |
| iMac (21,5 Zoll, Ende 2012) | `iMac13,1` | - [Legacy Metal (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008) |
| iMac (27 Zoll, Ende 2012) | `iMac13,2` | ^^ |
| iMac (21,5 Zoll, Anfang 2013) | `iMac13,3` | ^^ |
| iMac (21,5 Zoll, Ende 2013) | `iMac14,1` | ^^ |
| iMac (27 Zoll, Ende 2013) | `iMac14,2`<br>`iMac14,3` | ^^ |
| iMac (21,5 Zoll, Mitte 2014) | `iMac14,4` | ^^ |
| iMac (Retina 5K, 27 Zoll, Ende 2014)<br>iMac (Retina 5K, 27 Zoll, Mitte 2015) | `iMac15,1` | ^^ |
| iMac (21,5 Zoll, Ende 2015) | `iMac16,1` | ^^ |
| iMac (Retina 4K, 21,5 Zoll, Ende 2015) | `iMac16,2` | ^^ |
| iMac (Retina 5K, 27 Zoll, Ende 2015) | `iMac17,1` | ^^ |
| iMac (21,5 Zoll, 2017) | `iMac18,1` | - Native Grafikunterstützung |
| iMac (Retina 4K, 21,5 Zoll, 2017) | `iMac18,2` | ^^ |
| iMac (Retina 5K, 27 Zoll, 2017) | `iMac18,3` | ^^ |
| iMac (Retina 5K, 27 Zoll, 2019) | `iMac19,1` | - Nativ unterstützt bis Sequoia<br>- Native Grafikunterstützung |
| iMac (Retina 4K, 21,5 Zoll, 2019) | `iMac19,2` | ^^ |
| iMac (Retina 5K, 27 Zoll, 2020) | `iMac20,1`<br>`iMac20,2` | - Von Apple unterstützt |
| iMac Pro (2017) | `iMacPro1,1` | - Nativ unterstützt bis Sequoia<br>- [T2-Mac: macOS Tahoe funktioniert noch nicht](#t2-macs-und-macos-tahoe) |

### Mac Pro

| Modellname | Kennung | Weitere Infos |
| :--- | :--- | :--- |
| Mac Pro (Anfang 2008) | `MacPro3,1` | -  [Aufrüstung auf Metal-GPU empfohlen](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008)<br>- [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021)<br>- Originales Bluetooth-Modul entfernen, um Kernel Panics zu vermeiden |
| Mac Pro (Anfang 2009) | `MacPro4,1` | - [Aufrüstung auf Metal-GPU empfohlen](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008)<br>- [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021) |
| Mac Pro (Mitte 2010)<br>Mac Pro (Mitte 2012) | `MacPro5,1` | ^^ |
| Mac Pro (Ende 2013) | `MacPro6,1` | - [Legacy Metal (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008) |
| Mac Pro (2019) | `MacPro7,1` | - Von Apple unterstützt |

### Xserve

| Modellname | Kennung | Weitere Infos |
| :--- | :--- | :--- |
| Xserve (Anfang 2008) | `Xserve2,1` | - Aufrüstung auf Metal-GPU empfohlen<br>- [Nicht-Metal-GPU (macOS 11+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)<br>- [USB 1.1 (macOS 13+)](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1021)
| Xserve (Anfang 2009) | `Xserve3,1` | ^^ |

# Sobald du geprüft hast, dass deine Hardware unterstützt wird, geht es weiter mit [macOS-Installer herunterladen und erstellen](./INSTALLER.md)
