# macOS Tahoe

<img width="1064" height="370" alt="macOS Tahoe" src="../images/macos-tahoe.png" />

*Da wären wir – das letzte für Intel-Macs*

macOS 26 Tahoe ist die letzte große macOS-Version, die Apple für Intel-Macs veröffentlicht. Sie lässt viele Intel-Macs fallen, die meisten davon mit T2-Sicherheitschip – deshalb steht sie im Mittelpunkt von OpenCore Legacy Patcher T2.

Die Unterstützung für macOS Tahoe in OpenCore Legacy Patcher T2 befindet sich derzeit im **Alpha**-Stadium. Rechne mit Fehlern und melde sie bitte in den [GitHub Discussions](https://github.com/albert-mueller/OpenCore-Legacy-Patcher-T2/discussions).


## Neu nicht mehr unterstützte Hardware

* MacBookAir9,1 :       MacBook Air (Retina, 13 Zoll, 2020)
* MacBookPro15,1 :      MacBook Pro (15 Zoll, 2018 und 2019)
* MacBookPro15,2 :      MacBook Pro (13 Zoll, 2018 und 2019, 4 Thunderbolt 3 Anschlüsse)
* MacBookPro15,3 :      MacBook Pro (15 Zoll, 2018 und 2019, Vega-Grafik)
* MacBookPro15,4 :      MacBook Pro (13 Zoll, 2019, 2 Thunderbolt 3 Anschlüsse)
* MacBookPro16,3 :      MacBook Pro (13 Zoll, 2020, 2 Thunderbolt 3 Anschlüsse)
* Macmini8,1 :          Mac mini (Ende 2018)
* iMac19,1 :            iMac (Retina 5K, 27 Zoll, 2019)
* iMac19,2 :            iMac (Retina 4K, 21,5 Zoll, 2019)
* iMacPro1,1 :          iMac Pro (2017)

Alle diese Modelle außer dem iMac (2019) haben einen T2-Sicherheitschip.

Die einzigen Intel-Macs, auf denen Tahoe noch nativ läuft, sind das MacBook Pro (16 Zoll, 2019), das MacBook Pro (13 Zoll, 2020, 4 Thunderbolt 3 Anschlüsse), der iMac (Retina 5K, 27 Zoll, 2020) und der Mac Pro (2019).

## Aktueller Stand

Auf Macs **ohne** T2-Chip kann OpenCore Legacy Patcher T2 macOS Tahoe installieren und Root-Patches anwenden, einige Herausforderungen bleiben aber bestehen. Informationen dazu findest du weiter unten auf dieser Seite.

Auf **T2-Macs** funktioniert Tahoe noch nicht. Den aktuellen Stand findest du unten unter [T2-Sicherheitschip](#t2-sicherheitschip) und unter [T2-Macs und macOS Tahoe](MODELS.md#t2-macs-und-macos-tahoe).

## Nicht funktionierende Funktionen

Auf den meisten gepatchten Macs funktionieren iPhone-Synchronisierung und Apple Intelligence nicht.

iPhone-Synchronisierung benötigt den T2 für die Attestierung und Apple Intelligence eine NPU, die es nur in Apple Silicon gibt. Da es sich um Hardwareanforderungen handelt, kann der Patcher dafür keine Lösung bieten.

## Probleme

* [T2-Sicherheitschip](#t2-sicherheitschip)
* [Audiounterstützung](#audiounterstutzung)
* [Dual-Socket-CPUs in Mac Pros und Xserve](#dual-socket-cpus-im-mac-pro-2008-und-xserve-2008)
* [Unterstützung für USB 1.1 (OHCI/UHCI)](#unterstutzung-fur-usb-1-1-ohci-uhci)
* [Grafikunterstützung und -probleme](#grafikunterstutzung-und-probleme)


### T2-Sicherheitschip

Das Booten nicht unterstützter T2-Macs über OpenCorePkg endete früher in einer Kernel Panic, weil AppleKeyStore.kext bei der Kommunikation mit dem T2-Chip in Timeouts lief:

```
"AppleKeyStore":3212:0: sks timeout strike 18
"AppleKeyStore":3212:0: sks timeout strike 19
"AppleKeyStore":3212:0: sks timeout strike 20
panic(cpu 0 caller 0xffffff801cd12509): "AppleSEPManager panic for "AppleKeyStore": sks request timeout" @AppleSEPManagerIntel.cpp:809
```

**Diese Panic tritt nicht mehr auf.** OpenCore Legacy Patcher T2 kommt auf nicht unterstützten T2-Macs inzwischen über die AppleKeyStore-Timeouts hinweg, sodass die Geräte in den Tahoe-Installer booten.

Das verbleibende Problem: Die macOS-Installation endet derzeit vor dem Abschluss mit „Failed to install a software update“. Wann T2-Installationen vollständig funktionieren, können wir noch nicht abschätzen.

Wenn du beim Testen helfen oder Ergebnisse teilen möchtest, nutze bitte die [GitHub Discussions](https://github.com/albert-mueller/OpenCore-Legacy-Patcher-T2/discussions).

### Audiounterstützung

macOS Tahoe enthält AppleHDA.kext nicht mehr, den Treiber für den integrierten Ton auf Intel-Macs. Auf betroffenen Macs stellt OpenCore Legacy Patcher T2 den Ton über den Root-Patch „Modern Audio“ wieder her – führe nach der Installation von Tahoe also unbedingt das Root-Patching aus.

### Dual-Socket-CPUs im Mac Pro 2008 und Xserve 2008

Wie schon unter macOS Sequoia verursacht das Booten von Tahoe auf einem Mac Pro 2008 (MacPro3,1) oder Xserve 2008 (Xserve2,1) mit mehr als 4 Kernen eine Kernel Panic. OpenCore Legacy Patcher T2 deaktiviert die zusätzlichen Kerne automatisch.

**Wenn du OpenCore für ein älteres Betriebssystem erstellst, kannst du diese Einschränkung unter Settings -> Build -> „MacPro3,1/Xserve2,1 Workaround“ deaktivieren.**

::: warning Hinweis

Aus den oben genannten Gründen ist ein Dualboot von Tahoe und älteren Versionen mit allen aktivierten Kernen nicht möglich. In diesem Fall bist du auf 4 Kerne beschränkt.

:::

### Unterstützung für USB 1.1 (OHCI/UHCI)

Bei Penryn-Systemen, Mac Pros vor 2013 und Xserve wurde die USB-1.1-Unterstützung in macOS Ventura komplett entfernt; das gilt daher bis einschließlich Tahoe.
USB 1.1 mag unwichtig erscheinen, steuert aber viele wichtige Geräte deines Systems, darunter:

* Tastatur und Trackpad bei Laptops
* Infrarotempfänger
* Bluetooth

Wie du das Problem umgehst, erfährst du auf [der Seite zur Fehlerbehebung](TROUBLESHOOT-HARDWARE.md#tastatur-maus-und-trackpad-funktionieren-im-installer-oder-nach-einem-update-nicht).


### Grafikunterstützung und -probleme

Dieser Build enthält sowohl Legacy-Metal- als auch Nicht-Metal-Patches für macOS Tahoe auf Basis der Upstream-Patches von Dortania. Weitere Informationen zur Legacy-Metal- und Nicht-Metal-Unterstützung und den jeweiligen Problemen findest du unter folgenden Links:

* [Legacy Metal](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/1008)
* [Nicht-Metal](https://github.com/dortania/OpenCore-Legacy-Patcher/issues/108)

::: warning AMD Vega auf T2-Macs

Für die AMD-Vega-GPUs im iMac Pro (2017) und im MacBook Pro mit Vega-Grafik (15 Zoll, 2018 und 2019) gibt es unter Tahoe derzeit keine Grafikbeschleunigung.

:::
