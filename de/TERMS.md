# OpenCore-Patcher-Begriffe

Bei OpenCore Legacy Patcher T2 verwenden wir viele verschiedene Begriffe für Hardware, etwa `SSE4.1`, `32-Bit-Firmware` usw. Diese Seite soll dir helfen zu verstehen, was all diese verwirrenden Wörter bedeuten.

# Begriffe

Begriff | Beschreibung
--- | ---
**macOS**        | Apples eigenes UNIX-basiertes Betriebssystem für Macs – das, „was einen Mac zum Mac macht“.
**Windows**      | Microsofts proprietäres Betriebssystem, das auf einer Vielzahl von Geräten genutzt und unterstützt wird.
**Linux**        | Familie quelloffener, Unix-ähnlicher Betriebssysteme auf Basis des Linux-Kernels, eines Betriebssystemkerns, den Linus Torvalds am 17. September 1991 erstmals veröffentlicht hat. Linux wird üblicherweise als Linux-Distribution ausgeliefert. Beachte: Auch wenn macOS und Linux UNIX-basiert sein mögen, unterscheiden sie sich stark.
**Bootloader**   | Software, die ein Betriebssystem lädt und meist von dessen Herstellern stammt. OpenCore ist technisch gesehen kein Bootloader im eigentlichen Sinn (siehe Erklärung zum Bootmanager unten). Apples Boot.efi ist der eigentliche Bootloader in einem Mac.
**Bootmanager** | Software, die Bootloader verwaltet – davon gibt es viele: Clover, systemd-boot, OpenCore, rEFInd, rEFIt … Sie bereiten in der Regel das System für den eigentlichen Bootloader vor.
---
Begriff | Beschreibung
--- | ---
**OpenCore**   | Ein Bootmanager vom [Acidanthera-Team](https://github.com/acidanthera). Er lädt macOS auf Macs, die Apple nicht mehr unterstützt, bootet schneller und ist schlanker als ältere Bootmanager. OpenCore selbst kann Sicherheitsfunktionen von macOS wie SIP, FileVault und Apple Secure Boot funktionsfähig halten. **Mit OpenCore Legacy Patcher T2 werden einige davon bewusst geschwächt:** Root-Patching erfordert, SIP und das versiegelte Systemvolume teilweise zu deaktivieren, AMFI kann deaktiviert sein, und auf T2-Macs ist Apple Secure Boot ausgeschaltet. Dein Mac ist dadurch weniger geschützt als ein unterstützter Mac mit unverändertem macOS – nutze ihn also nur, wenn du diesen Kompromiss akzeptierst.
**ACPI**   | In deiner Firmware definierte Tabellen, die deine Hardware und verschiedene Methoden beschreiben; sie hängen direkt damit zusammen, wie IOKit/IOService Geräte einrichtet.
**NVRAM**   | Nichtflüchtiger Speicher, in dem viele Variablen abgelegt werden, darunter Standard-Bootoptionen, Schlüssel für den Ruhezustand, Secure-Boot-Informationen usw.
---
Begriff | Beschreibung
--- | ---
**XNU**    | Steht für **X** is **N**ot **U**nix. XNU ist der „Kernel“ von macOS und das Herzstück, das macOS antreibt.
**Kexts**   | Steht für **K**ernel **Ext**ensions (Kernel-Erweiterungen); das sind die Treiber von macOS. Sie erledigen verschiedene Aufgaben, etwa als Gerätetreiber, oder dienen (in diesem Patcher) anderen Zwecken wie dem Patchen des Betriebssystems, dem Einschleusen von Informationen oder dem Ausführen von Aufgaben.
**KernelCollection**   | Auch ImmutableKernel und PrelinkedKernel genannt. Ein Bündel aus Kernel (XNU) und Kernel-Erweiterungen (Kexts), mit dem wir macOS booten. Genau das patcht OpenCore im Arbeitsspeicher, um ein nahtloses Erlebnis zu ermöglichen. <br/>- PrelinkedKernel: Standard-Caching-System seit 10.7 <br/>- ImmutableKernel: Secure-Boot-basiertes Caching-System seit 10.13 <br/>- KernelCollection: Zusammenführung von PrelinkedKernel und ImmutableKernel seit macOS 11 Big Sur
**IOKit**   | Grundgerüst dafür, wie Kernel-Erweiterungen (Kexts) Hardware erkennen und sich daran anbinden; startet kurz nach der Initialisierung des Kernels.
**WindowServer**   | Grundgerüst der grafischen Oberfläche von macOS; eines der ersten für den Nutzer sichtbaren Programme im Userspace, die starten.
**OTA**   | Kurz für **O**ver **T**he **A**ir; bezeichnet native Betriebssystem-Updates über die Systemeinstellungen wie bei einem unterstützten Mac.
**DELTA**   | Wird oft im Zusammenhang mit OTA verwendet und bezeichnet Betriebssystem-Updates, die deutlich kleiner sind als vollständige Installer (meist ca. 3 GB). Beachte: Delta-Updates setzen ein unverändertes Root-Volume voraus, sonst werden Updates mit ca. 12 GB geladen.
---
Begriff | Beschreibung
--- | ---
**EFI**   | Kann zweierlei bedeuten: <br/>- Die Firmware des Mac; im Grunde UEFI, aber stark für Macs angepasst, also nicht wirklich „universell“ <br/>- Die Partition auf deinem Laufwerk, auf der Software liegt, die die UEFI liest, um Betriebssysteme (wie den Windows-Bootloader) oder UEFI-Anwendungen (wie OpenCore) zu laden. Sie ist FAT32-formatiert und hat die Typ-ID EF00 (hexadezimal). Sie kann ESP oder SYSTEM heißen und ist meist 100 bis 400 MB groß, wobei die Größe keine Rolle spielt.
**HFS+**   | Auch „Mac OS Extended (Journaled)“ genannt; bis macOS 10.13 das Standard-Dateisystem von macOS. Es wurde für Festplatten mit rotierenden Scheiben entwickelt.
**APFS**   | Seit macOS 10.13 das Standard-Dateisystem von macOS für SSDs und seit Mojave für alle Laufwerke. Dieses Format wurde vor allem für SSDs entwickelt.
**32- und 64-Bit-CPU**   | Die Bit-Zahl einer CPU bestimmt, wie viele Daten sie adressieren kann. <br/>- 32-Bit-CPUs wurden nur bis Mac OS X 10.6 Snow Leopard unterstützt.
**32-Bit-Firmware**   | Die Bit-Zahl einer Firmware bestimmt, wie viele Daten sie adressieren kann. Bei einigen älteren Macs ist eine 64-Bit-CPU mit einer 32-Bit-Firmware üblich.<br/>- 32-Bit-Firmwares wurden nur bis Mac OS X 10.7 Lion unterstützt.
**SSE-Befehle**   | Steht für **S**IMD **S**ingle-Precision Floating-Point **I**nstructions; das sind von deiner CPU unterstützte Befehlssätze. macOS benötigt für den normalen Betrieb eine bestimmte Anzahl davon: <br/>- SSE3: Seit Mac OS X 10.4 Tiger für alle Intel-CPUs erforderlich <br/>- SSSE3: Seit Mac OS X 10.6 Snow Leopard für alle 64-Bit-Intel-CPUs erforderlich <br/>- SSE4.1: Seit macOS 10.12 Sierra für alle Intel-CPUs erforderlich
---
