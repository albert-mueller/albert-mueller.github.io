# BridgePatcher-Terminologie

Bei BridgePatcher verwenden wir viele verschiedene Begriffe, um Hardware zu beschreiben, etwa `SSE4.1`, `32-Bit-Firmware` usw. Diese Seite soll dir helfen zu verstehen, was all diese verwirrenden Begriffe bedeuten.

# Begriffe

Begriff | Beschreibung
--- | ---
**macOS**        | Apples eigenes, UNIX-basiertes Betriebssystem für Macs – das, „was einen Mac zu einem Mac macht“.
**Windows**      | Microsofts proprietäres Betriebssystem, das auf einer Vielzahl von Geräten eingesetzt und unterstützt wird.
**Linux**        | Familie quelloffener, Unix-ähnlicher Betriebssysteme auf Basis des Linux-Kernels, eines Betriebssystemkerns, den Linus Torvalds am 17. September 1991 erstmals veröffentlichte. Linux wird typischerweise als Linux-Distribution ausgeliefert. Auch wenn macOS und Linux beide UNIX-basiert sein mögen, unterscheiden sie sich grundlegend.
**Bootloader**   | Software, die ein Betriebssystem lädt und meist vom Hersteller des Betriebssystems stammt. OpenCore ist streng genommen kein Bootloader (siehe die Erklärung zum Bootmanager unten). Apples Boot.efi ist der eigentliche Bootloader eines Macs.
**Bootmanager** | Software, die Bootloader verwaltet – davon gibt es viele: Clover, systemd-boot, OpenCore, rEFInd, rEFIt … Sie bereiten in der Regel das System für den eigentlichen Bootloader vor.
---
Begriff | Beschreibung
--- | ---
**OpenCore**   | Ein Bootmanager des [Acidanthera-Teams](https://github.com/acidanthera). Er lädt macOS auf Macs, die Apple nicht mehr unterstützt, bootet schneller und ist schlanker als ältere Bootmanager. OpenCore selbst kann macOS-Sicherheitsfunktionen wie SIP, FileVault und Apple Secure Boot funktionsfähig halten. **Mit BridgePatcher werden einige davon bewusst geschwächt:** Root-Patching erfordert, SIP und das versiegelte Systemvolume teilweise zu deaktivieren, AMFI kann deaktiviert sein, und auf T2-Macs wird Apple Secure Boot abgeschaltet. Dein Mac ist dadurch schlechter geschützt als ein unterstützter Mac mit unverändertem macOS – nutze es also nur, wenn du diesen Kompromiss akzeptierst.
**ACPI**   | In deiner Firmware definierte Tabellen, die deine Hardware und verschiedene Methoden beschreiben; direkt damit verknüpft, wie IOKit/IOService Geräte einrichtet.
**NVRAM**   | Nichtflüchtiger Speicher, in dem viele Variablen abgelegt sind, darunter Standard-Bootoptionen, Ruhezustandsschlüssel, Secure-Boot-Informationen usw.
---
Begriff | Beschreibung
--- | ---
**XNU**    | Steht für **X** is **N**ot **U**nix. XNU ist der „Kernel“ von macOS und das Herzstück, das macOS am Laufen hält.
**Kexts**   | Steht für **K**ernel **Ext**ensions (Kernel-Erweiterungen) – die Treiber von macOS. Sie erledigen verschiedene Aufgaben, etwa als Gerätetreiber oder (in diesem Patcher) für andere Zwecke wie das Patchen des Betriebssystems, das Einschleusen von Informationen oder das Ausführen von Aufgaben.
**KernelCollection**   | Auch bekannt als ImmutableKernel bzw. PrelinkedKernel: ein Paket aus Kernel (XNU) und Kernel-Erweiterungen (Kexts), mit dem macOS gebootet wird. Genau das patcht OpenCore im Arbeitsspeicher, um ein nahtloses Erlebnis zu ermöglichen <br/>- PrelinkedKernel: Standard-Caching-System seit 10.7 <br/>- ImmutableKernel: Secure-Boot-basiertes Caching-System seit 10.13 <br/>- KernelCollection: Zusammenführung von PrelinkedKernel und ImmutableKernel seit macOS 11 Big Sur
**IOKit**   | Grundgerüst dafür, wie Kernel-Erweiterungen (Kexts) Hardware erkennen und sich an sie anbinden; startet kurz nach der Initialisierung des Kernels.
**WindowServer**   | Grundgerüst der grafischen Oberfläche von macOS; eines der ersten benutzerseitigen Programme, die starten.
**OTA**   | Kurz für **O**ver **T**he **A**ir; bezeichnet native Betriebssystem-Updates über die Systemeinstellungen wie bei einem unterstützten Mac.
**DELTA**   | Oft im Zusammenhang mit OTA verwendet; bezeichnet Betriebssystem-Updates, die deutlich kleiner sind als vollständige Installer (meist ca. 3 GB). Deltas setzen ein unverändertes Root-Volume voraus, andernfalls werden Updates mit ca. 12 GB geladen.
---
Begriff | Beschreibung
--- | ---
**EFI**   | Kann zweierlei bedeuten: <br/>- Die Firmware des Macs, die UEFI entspricht, aber stark für Macs angepasst ist – also nicht ganz so „universell“ <br/>- Die Partition auf deinem Laufwerk, auf der Software liegt, die die UEFI-Firmware liest, um Betriebssysteme (etwa den Windows-Bootloader) oder UEFI-Anwendungen (etwa OpenCore) zu laden. Sie ist FAT32-formatiert und hat die Typ-ID EF00 (hexadezimal). Sie kann ESP oder SYSTEM heißen und ist meist zwischen 100 MB und 400 MB groß, wobei die Größe keine Rolle spielt.
**HFS+**   | Auch bekannt als Mac OS Extended (Journaled); bis macOS 10.13 das Standard-Dateisystem von macOS. Es wurde für Festplatten mit rotierenden Scheiben entworfen.
**APFS**   | Ab macOS 10.13 das Standard-Dateisystem für SSDs und ab Mojave Standard für alle Laufwerke. Dieses Format wurde vor allem für SSDs entworfen.
**32- und 64-Bit-CPU**   | Die Bitbreite einer CPU bestimmt, wie viele Daten sie adressieren kann. <br/>- 32-Bit-CPUs wurden nur bis Mac OS X 10.6 Snow Leopard unterstützt.
**32-Bit-Firmware**   | Die Bitbreite einer Firmware bestimmt, wie viele Daten die Firmware adressieren kann. Bei einigen älteren Macs ist eine 64-Bit-CPU mit einer 32-Bit-Firmware üblich<br/>- 32-Bit-Firmwares wurden nur bis Mac OS X 10.7 Lion unterstützt.
**SSE-Befehle**   | Steht für **S**IMD **S**ingle-Precision Floating-Point **I**nstructions – Befehlssätze, die deine CPU unterstützt. macOS benötigt für den normalen Betrieb bestimmte Befehlssätze: <br/>- SSE3: Erforderlich für alle Intel-CPUs seit Mac OS X 10.4 Tiger <br/>- SSSE3: Erforderlich für alle Intel-64-Bit-CPUs seit Mac OS X 10.6 Snow Leopard  <br/>- SSE4.1: Erforderlich für alle Intel-CPUs seit macOS 10.12 Sierra
---
