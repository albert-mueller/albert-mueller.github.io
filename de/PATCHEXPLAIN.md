# Erklärung der Patches in OpenCore Legacy Patcher T2

In unserem Patcher kommen zahlreiche Patches zum Einsatz, um ein stabiles System sicherzustellen. Hier gehen wir durch, welche Patches verwendet werden und warum wir sie empfehlen oder sogar voraussetzen.

* [OpenCore-Einstellungen](#opencore-einstellungen)
* [Eingeschleuste Kexts](#eingeschleuste-kexts)
* [Patches auf dem Laufwerk](#patches-auf-dem-laufwerk)

## OpenCore-Einstellungen

Im Folgenden ein Überblick über die Hauptlogik, mit der OpenCore Legacy Patcher T2 native Unterstützung in macOS erreicht. Die Konfiguration von OpenCore ist in [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg) dokumentiert sowie in einer von uns bereitgestellten Online-Version:

* [OpenCorePkg-Online-Dokumentation](https://dortania.github.io/docs/latest/Configuration.html)

::: details Erklärung der Konfiguration

### ACPI -> Add

* SSDT-CPBG
  * Grund: Behebt eine Kernel Panic auf Arrandale-Macs in frühen Big-Sur-Builds
  * Logik: Deaktiviert das Dummy-Gerät CPBG in ACPI
  * Modelle: MacBookPro6,x und iMac11,x
* SSDT-PCI
  * Grund: Patcht die Audio-Unterstützung unter Windows für Sandy und Ivy Bridge
  * Logik: Entfernt die 32-Bit-Zuweisungsbeschränkung von PCI0
  * Modelle: Alle Sandy- und Ivy-Bridge-Macs außer MacPro6,1
* SSDT-DGPU
  * Grund: Ermöglicht das softwarebasierte Deaktivieren der dGPU per deMUX bei MacBook Pros von 2011
  * Logik: Sendet per ACPI eine Abschaltanforderung an die dGPU
  * Modelle: MacBookPro8,2 und MacBookPro8,3 mit defekter dGPU

### ACPI -> Patch

* `EHCx`- und `XHC1`-Patches
  * Grund: Erforderlich für korrekten USB-Betrieb
  * Logik: Verhindert, dass USB-Maps neuerer Modelle geladen werden und die USB-Anschlüsse unbrauchbar machen
  * Modelle: Für alle Modelle erforderlich, wenn SMBIOS-Spoofing mit Moderate oder Advanced verwendet wird
* Patch `BUF0` zu `BUF1`
  * Grund: Gehört zu SSDT-PCI
* Patch `_INI` zu `XINI`
  * Grund: Gehört zu SSDT-DGPU

### Booter -> Patch

* `HW_BID` auf `OC_BID` umleiten
  * Grund: Ermöglicht die Nutzung von macOS-Installern auf nicht unterstützten Modellen
  * Logik: Leitet die Board-ID-Prüfungen von macOS auf eine eigene Variable um
  * Modelle: Alle Systeme mit VMM-Spoofing

### Booter -> Quirks

* ForceBooterSignature
  * Grund: Erforderlich für die Unterstützung des Ruhezustands
  * Logik: Lässt boot.efi glauben, OpenCore sei Apples Firmware
  * Modelle: Für alle Modelle erforderlich

### DeviceProperties -> Add

* `PciRoot(0x0)/Pci(0x3,0x0)/Pci(0x0,0x0)`
* `PciRoot(0x0)/Pci(0x1,0x0)/Pci(0x0,0x0)`
  * Grund: Erforderlich, damit die Helligkeitssteuerung auf aufgerüsteten iMacs funktioniert
  * Logik: Setzt AppleBackLight-Eigenschaften
  * Modelle: iMac11,x und iMac12,x mit aufgerüsteten NVIDIA-Metal-GPUs
* `PciRoot(0x0)/Pci(0x2,0x0)`
  * Grund: Deaktiviert die interne GPU, um Ruhezustandsprobleme auf aufgerüsteten iMacs zu beheben
  * Logik: Lässt macOS glauben, die iGPU sei ein generisches PCI-Gerät
  * Modelle: iMac12,x mit aufgerüsteten Metal-GPUs

### Kernel -> Patch

* SMC-Patch
  * Grund: Erforderlich, um SMC-Firmware-Updates zu verhindern
  * Logik: Entfernt `smc-version` per Patch aus AppleSMC.kext; für die volle Funktion wird SMC-Spoof.kext benötigt
  * Modelle: Für alle Modelle mit SMBIOS-Spoofing erforderlich
* IOHIDFamily-Patch
  * Grund: Erforderlich für die Unterstützung von HID-Peripherie in macOS auf älterer Hardware
  * Logik: Lässt IOHIDFamily glauben, es werde immer in die Wiederherstellung gebootet
  * Modelle: Penryn-CPUs (Core-2-Serie)
* Patch „Force FileVault on Broken Seal“
  * Grund: Ermöglicht FileVault auf Macs mit Root-Patches
  * Logik: Zwingt APFS.kext, bei der FileVault-Unterstützung immer „true“ zurückzugeben
  * Modelle: Alle Modelle, die Root-Patches benötigen
* Patch „Disable Library Validation Enforcement“
  * Grund: Non-Metal-Root-Volume-Patches bestehen die Library-Validation-Prüfungen nicht
  * Logik: Zwingt die Library-Validation-Funktion, immer „nicht erforderlich“ zurückzugeben
  * Modelle: Non-Metal-GPUs
* SurPlus-Patch
  * Grund: macOS 11.3–12.0.1 setzt für einen stabilen Start RDRAND-Unterstützung in der CPU voraus
  * Logik: Zwingt den RDRAND-Code, einen festgelegten Wert zurückzugeben
  * Modelle: Alle Macs vor Ivy Bridge
* Patch zum Umleiten von `kern.hv_vmm_present`
  * Grund: Ermöglicht Installation und Updates von macOS auf nicht unterstützter Hardware
  * Logik: Lässt den Userspace das System als virtuelle Maschine sehen
  * Modelle: Alle Modelle mit VMM-Spoofing


### Kernel -> Quirks

* ThirdPartyDrives
  * Grund: Erforderlich, um Probleme beim Aufwachen aus dem Ruhezustand mit Laufwerken von Drittanbietern zu vermeiden
  * Logik: Patcht AppleAHCIPort.kext, um die Unterstützung zu aktivieren
  * Modelle: Alle Modelle mit Standard-SATA-Anschlüssen
* PanicNoKextDump
  * Grund: Verhindert den Kext-Dump bei Kernel Panics und erleichtert das Kernel-Debugging
  * Logik: Patcht den Kernel, damit er keine unnötigen Informationen ausgibt
  * Modelle: Wird nur gesetzt, wenn der Benutzer Verbose Boot aktiviert hat

### Misc -> Security

* SecureBootModel
  * Grund: Erforderlich, um native Betriebssystem-Updates beim Spoofing auf ein T2-Modell zu ermöglichen
  * Logik: Setzt die Secure-Enclave-Kennung des T2
  * Modelle: Für alle Modelle erforderlich, die mit Minimal oder höher ein T2-Modell vortäuschen

### NVRAM -> Add

* `-v keepsyms=1 debug=0x100`
  * Grund: Zeigt Debug-Informationen des macOS-Kernels und der Kexts an und verhindert Neustarts bei einer Panic
  * Logik: Fügt Argumente zum NVRAM hinzu
  * Modelle: Wird nur gesetzt, wenn der Benutzer Verbose Boot aktiviert hat
* `-liludbgall`
  * Grund: Aktiviert das Debug-Logging von Lilu und seinen Plugins
  * Logik: Fügt Argumente zum NVRAM hinzu
  * Modelle: Wird nur gesetzt, wenn der Benutzer Kext DEBUG aktiviert hat
* `msgbuf=1048576`
  * Grund: Setzt die Größe des Nachrichtenpuffers auf 1 MB, damit Boot-Logs erhalten bleiben
  * Logik: Fügt Argumente zum NVRAM hinzu
  * Modelle: Wird nur gesetzt, wenn der Benutzer Kext DEBUG aktiviert hat
* `agdpmod=pikera`
  * Grund: Behebt die GPU-Umschaltung beim MacBookPro9,x
  * Logik: Fügt Argumente zum NVRAM hinzu
  * Modelle: MacBookPro9,x
* `shikigva=80 unfairgva=1`
* `shikigva=128 unfairgva=1 -wegtree`
  * Grund: Behebt die DRM-Unterstützung auf Modellen mit aufgerüsteten AMD-Metal-GPUs
  * Logik: Fügt Argumente zum NVRAM hinzu
  * Modelle: Modelle mit aufgerüsteten AMD-Metal-GPUs
* `-revasset`
  * Grund: Aktiviert Inhaltscaching bei VMM-Spoofing
  * Logik: Fügt Argumente zum NVRAM hinzu
  * Modelle: Alle Modelle mit VMM-Spoofing
* `amfi=0x80`
  * Grund: Deaktiviert Apple Mobile File Integrity, um Root-Patches zu ermöglichen
  * Logik: Fügt Argumente zum NVRAM hinzu
  * Modelle: Alle Modelle, die unsignierte Root-Patches benötigen

### UEFI -> ProtocolOverrides

* GopPassThrough
  * Grund: Sorgt für korrekte Bildausgabe auf Geräten mit UGA-Firmware, aber GOP-GPU
  * Logik: Stellt GOP-Protokollinstanzen auf Basis der UGA-Protokollinstanzen bereit
  * Modelle: MacPro3,1, iMac7,1–8,1

:::

## Eingeschleuste Kexts

Im Folgenden wird erklärt, welche Kexts OpenCore Legacy Patcher T2 beim Start in den Arbeitsspeicher einschleust.

::: details Erklärung der eingeschleusten Kexts

### Acidanthera

* Lilu
  * Grund: Patch-Engine für andere Kexts
  * Modelle: Für alle Modelle erforderlich
* WhateverGreen
  * Grund: Patcht GPU-Frameworks und -Kexts, um korrekte Unterstützung sicherzustellen
  * Modelle: Für alle Modelle erforderlich, die Spoofing verwenden oder eine nicht originale GPU haben
* CPUFriend
  * Grund: Patcht IOx86PlatformPlugin, um frühere CPU-Profile wiederherzustellen
  * Modelle: Alle Modelle mit Spoofing der Stufe Minimal oder höher
* AirportBrcmFixup
  * Grund: Patcht IO80211 und verwandte Komponenten, um die Netzwerkunterstützung für nicht unterstützte Karten herzustellen und Fehler bei nativen Karten zu beheben (z. B. zufällig verschlechterte Netzwerkleistung)
  * Modelle: BCM943224, BCM94331, BCM94360 und BCM943602
* BlueToolFixup
  * Grund: Patcht BlueTool, um Bluetooth unter Monterey zu aktivieren
  * Modelle: Alle Modelle mit WLAN-Karten vor BCM94360 oder Chipsätzen von Drittanbietern
* Bluetooth-Spoof
  * Grund: Schleust zusätzliche Daten in bestimmte Bluetooth-Chipsätze ein, damit das System sie erkennt
  * Modelle: Modelle mit den Chipsätzen BCM2070 oder BCM2046
* FeatureUnlock (Night Shift)
  * Grund: Patcht CoreBrightness.framework, um Night Shift auf nicht unterstützten Modellen zu aktivieren
  * Modelle: 2011 oder älter
* FeatureUnlock (Sidecar/AirPlay)
  * Grund: Patcht SidecarCore.framework und AirPlaySupport.framework, um Sidecar und AirPlay zum Mac auf nicht unterstützten Modellen zu aktivieren
  * Modelle: Alle Modelle mit Metal-fähigen GPUs
* RestrictEvents
  * Grund: Deaktiviert Speicherfehlermeldungen beim MacPro7,1
  * Modelle: Mac Pros und Xserves
* CryptexFixup
  * Grund: Installiert ein Cryptex ohne AVX2.0 auf CPUs ohne AVX2.0
  * Modelle: Alle CPUs bis einschließlich Ivy Bridge
* AutoPkgInstaller
  * Grund: Ermöglicht automatisches Root-Patching
* NVMeFix
  * Grund: Behebt die Unterstützung für NVMe-Laufwerke von Drittanbietern
* RSRHelper
  * Grund: Behebt die Unterstützung für Rapid Security Responses auf Installationen mit Root-Patches
* 

### Ethernet

* nForceEthernet
  * Grund: Schleust den alten NVIDIA-Ethernet-Kext ein, um das Netzwerk ab Catalina wiederherzustellen
  * Modelle: Erforderlich für NVIDIA-Ethernet von 2010 und älter
* MarvelYukonEthernet
  * Grund: Schleust den alten Marvell-Ethernet-Kext ein, um das Netzwerk ab Catalina wiederherzustellen
  * Modelle: Erforderlich für Marvell-Ethernet von 2008 und älter
* CatalinaBCM5701Ethernet
  * Grund: Schleust den alten Broadcom-Ethernet-Kext ein, um das Netzwerk unter Big Sur wiederherzustellen
  * Logik: Entfernt kollidierende Symbole per Patch, damit es nicht mit dem vorhandenen BCM5701Ethernet in Konflikt gerät
  * Modelle: Erforderlich für Broadcom-Ethernet von 2011 und älter
* Intel82574L
  * Grund: Stellt die Ethernet-Unterstützung auf Mac Pros wieder her
  * Modelle: MacPro3,1–5,1
* CatalinaIntelI210Ethernet
  * Grund: Behebt die Unterstützung für Intel-i210/i225-Netzwerkkarten auf Macs vor Ivy Bridge
* AppleIntel8254XEthernet
  * Grund: Stellt die Ethernet-Unterstützung auf Mac Pros wieder her
  * Modelle: MacPro3,1–5,1

### FireWire

* IOFireWireFamily
  * Grund: Ermöglicht das Booten über FireWire
* IOFireWireSBP2
  * Grund: Ermöglicht das Booten über FireWire
* IOFireWireSerialBusProtoColTransport
  * Grund: Ermöglicht das Booten über FireWire

### Maps

* USBMap
  * Grund: Schleust alte USB-Map-Profile ein, um USB zu reparieren
  * Modelle: Für alle Modelle mit Spoofing der Stufe Moderate oder höher sowie für Modelle vor 2012 erforderlich

### SSE

* AAMouSSE
  * Grund: Übersetzt SSE4.2-Befehle in kompatiblen Code für SSE4.1-CPUs; erforderlich für AMD-Metal-Treiber
  * Modelle: MacPro3,1
* telemetrap
  * Grund: Stellt sicher, dass telemetry.plugin nicht ausgeführt wird; erforderlich für SSE4.1-CPUs
  * Modelle: Penryn-CPUs

### WLAN

* IO80211ElCap
  * Grund: Schleust die WLAN-Treiber aus El Capitan erneut ein
  * Modelle: Chipsätze BCM94328, BCM94322 und Atheros
* corecaptureElCap.kext
  * Grund: Schleust die WLAN-Treiber aus El Capitan erneut ein
  * Modelle: Chipsätze BCM94328, BCM94322 und Atheros

### Sonstiges

* AppleBackLightFixup
  * Grund: Patcht AppleBacklight für iMacs mit aufgerüsteten NVIDIA-Metal-GPUs
  * Modelle: iMac11,x, iMac12,x mit aufgerüsteten NVIDIA-Metal-GPUs
* AppleIntelPIIXATA
  * Grund: Behebt die IDE-Unterstützung beim MacPro3,1
  * Modelle: MacPro3,1
* AppleIntelMCEDisabler
  * Grund: Behebt die Dual-Socket-Unterstützung ab Catalina
  * Modelle: Mac Pros und Xserves
* SMC-Spoof
  * Grund: Täuscht die SMC-Version 9.9999 vor
  * Modelle: Für alle Modelle mit Spoofing der Stufe Minimal oder höher erforderlich
* AppleRAIDCard
  * Fügt Unterstützung für AppleRaidCard bei Xserves hinzu
* AMDGPUWakeHandler
  * Grund: Fügt softwarebasiertes Demux für MacBook Pros 15"/17" von 2011 hinzu
* AppleIntelCPUPowerManagement und AppleIntelCPUPowerManagementClient
  * Grund: Stellt die CPU-Energieverwaltung für Ivy Bridge und älter wieder her
* AppleUSBTopCase
  * Grund: Stellt die Unterstützung für USB-Tastaturen unter macOS Ventura wieder her
* AppleUSBMultitouch und AppleUSBTrackpad
  * Grund: Stellt die Unterstützung für USB-Trackpads unter macOS Ventura wieder her
* ASPP-Override
  * Grund: Sorgt dafür, dass ACPI_SMC_PlatformPlugin Vorrang vor X86PlatformPlugin erhält, und deaktiviert die Drosselung durch die Firmware
* BacklightInjector
  * Grund: Behebt die Helligkeitssteuerung in iMacs mit aufgerüsteten GPUs
* BigSurSDXC
  * Grund: Stellt die SDXC-Unterstützung auf Macs vor Ivy Bridge wieder her
* Bluetooth-spoof
  * Grund: Täuscht ältere Bluetooth-Chipsätze vor, damit sie ab Monterey funktionieren
* Innie
  * Grund: Lässt alle PCIe-Laufwerke als intern erscheinen
  * Modelle: MacPro3,1 und neuer sowie Xserve3,1 und neuer
* KDKlessWorkaround
  * Grund: Hilft bei macOS-Updates auf Systemen, die ohne KDK gepatcht wurden
* LegacyUSBVieoSupport
  * Grund: Behebt die Unterstützung älterer USB-iSight-Kameras
* MonteAHCIPort
  * Grund: Behebt die Unterstützung der Original-SSD im MacBookAir6,x
* NoAVXFSCompressionTypeZlib
  * Grund: Verhindert den AVXFSCompressionTypeZlib-Absturz auf Systemen vor AVX1.0 ab 12.4
* SimpleMSR
  * Grund: Deaktiviert BD PROCHOT, um die Drosselung durch die Firmware auf MacBooks ab Nehalem zu verhindern
* LegacyKeyboardInjector
  * Grund: Behebt die Funktionstasten beim MacBook5,2


:::

## Patches auf dem Laufwerk

Leider sind bestimmte Patches direkt auf dem Laufwerk nötig, um den vollen Funktionsumfang zu erreichen. Im Folgenden eine Übersicht der unterstützten Patches.

::: details Audio-Patches (11.0+)

### Extensions

* AppleHDA
  * Grund: Fügt AppleHDA aus El Capitan wieder hinzu, um Audio zu ermöglichen
  * Modelle: iMac7,1 und iMac8,1

:::

::: details Patches für ältere WLAN-Karten (12.0+)

Gilt für die WLAN-Karten BCM94328, BCM94322 und Atheros

### CoreServices

* WiFiAgent.app

### /usr/libexec

* airportd

:::

::: details Patches für Grafikbeschleunigung mit NVIDIA Kepler (12.0+)

### Extensions

* GeForce.kext
* GeForceAIRPlugin.bundle
* GeForceGLDriver.bundle
* GeForceMTLDriver.bundle
* GeForceVADriver.bundle
* NVDAGF100Hal.kext
* NVDAGK100Hal.kext
* NVDAResman.kext
* NVDAStartup.kext

### Frameworks

* OpenCL (libCLVMNVPTXPlugin.dylib, NVPTX.dylib)
  * Grund: Fügt die Hardwarebeschleunigung für Kepler wieder hinzu
* Metal
  * Grund: GPUs auf Basis von 3802 funktionieren seit 13.3 nicht mehr, daher ist ein Downgrade von Metal auf 13.2.1 nötig

### PrivateFrameworks

* MTLCompiler
  * Grund: GPUs auf Basis von 3802 funktionieren seit 13.3 nicht mehr, daher ist ein Downgrade von MTLCompiler auf 13.2.1 nötig
* GPUCompiler
  * Grund: GPUs auf Basis von 3802 funktionieren seit 13.3 nicht mehr, daher ist ein Downgrade von GPUCompiler auf 13.2.1 nötig

:::


::: details Patches für Grafikbeschleunigung mit Intel Ivy Bridge (12.0+)

### Extensions

* AppleIntelIVBVA.bundle
* AppleIntelFramebufferCapri.kext
* AppleIntelGraphicsShared.bundle
* AppleIntelHD4000Graphics.kext
* AppleIntelHD4000GraphicsGLDriver.bundle
* AppleIntelHD4000GraphicsMTLDriver.bundle
* AppleIntelHD4000GraphicsVADriver.bundle

### PrivateFrameworks

* AppleGVA/AppleGVACore
  * Grund: Aktiviert die DRM-Unterstützung
* MTLCompiler
  * Grund: GPUs auf Basis von 3802 funktionieren seit 13.3 nicht mehr, daher ist ein Downgrade von MTLCompiler auf 13.2.1 nötig
* GPUCompiler
  * Grund: GPUs auf Basis von 3802 funktionieren seit 13.3 nicht mehr, daher ist ein Downgrade von GPUCompiler auf 13.2.1 nötig

### Frameworks

* OpenCL (libCLVMIGILPlugin.dylib)
  * Grund: Fügt die Hardwarebeschleunigung für Ivy Bridge wieder hinzu
* WebKit (com.apple.WebProcess.sb)
  * Grund: Fügt die Safari-Darstellung für Ivy Bridge wieder hinzu
* Metal
  * Grund: GPUs auf Basis von 3802 funktionieren seit 13.3 nicht mehr, daher ist ein Downgrade von Metal auf 13.2.1 nötig
:::

::: details Patches für Grafikbeschleunigung mit Intel Haswell (13.0+)

### Extensions

* AppleIntelFramebufferAzul.kext
* AppleIntelHD5000Graphics.kext
* AppleIntelHD5000GraphicsGLDriver.bundle
* AppleIntelHD5000GraphicsMTLDriver.bundle
* AppleIntelHD5000GraphicsVADriver.bundle
* AppleIntelHSWVA.bundle
* AppleIntelGraphicsShared.bundle

### Frameworks

* Metal
  * Grund: GPUs auf Basis von 3802 funktionieren seit 13.3 nicht mehr, daher ist ein Downgrade von Metal auf 13.2.1 nötig

### PrivateFrameworks

* MTLCompiler
  * Grund: GPUs auf Basis von 3802 funktionieren seit 13.3 nicht mehr, daher ist ein Downgrade von MTLCompiler auf 13.2.1 nötig
* GPUCompiler
  * Grund: GPUs auf Basis von 3802 funktionieren seit 13.3 nicht mehr, daher ist ein Downgrade von GPUCompiler auf 13.2.1 nötig

:::

::: details Patches für Grafikbeschleunigung mit Intel Broadwell (13.0+)

### Extensions

* AppleIntelBDWGraphics.kext
* AppleIntelBDWGraphicsFramebuffer.kext
* AppleIntelBDWGraphicsGLDriver.bundle
* AppleIntelBDWGraphicsMTLDriver.bundle
* AppleIntelBDWGraphicsVADriver.bundle
* AppleIntelBDWGraphicsVAME.bundle
* AppleIntelGraphicsShared.bundle



:::

::: details Patches für Grafikbeschleunigung mit Intel Skylake (13.0+)

### Extensions

* AppleIntelSKLGraphics.kext
* AppleIntelSKLGraphicsFramebuffer.kext
* AppleIntelSKLGraphicsGLDriver.bundle
* AppleIntelSKLGraphicsMTLDriver.bundle
* AppleIntelSKLGraphicsVADriver.bundle
* AppleIntelSKLGraphicsVAME.bundle
* AppleIntelGraphicsShared.bundle


:::

::: details Patches für Grafikbeschleunigung mit älteren AMD-Vega-GPUs (13.0+)

### Extensions

* AMDRadeonX5000.kext
* AMDRadeonVADriver2.bundle
* AMDRadeonX5000GLDriver.bundle
* AMDRadeonX5000MTLDriver.bundle
* AMDRadeonX5000Shared.bundle
* AMDShared.bundle

:::

::: details Patches für Grafikbeschleunigung mit älteren AMD-Polaris-GPUs (13.0+)

### Extensions

* AMDRadeonX4000.kext
* AMDRadeonX4000HWServices.kext
* AMDRadeonVADriver2.bundle
* AMDRadeonX4000GLDriver.bundle
* AMDMTLBronzeDriver.bundle
* AMDShared.bundle

:::

::: details Patches für Grafikbeschleunigung mit älteren AMD-GCN-GPUs

### Extensions

* AMD7000Controller.kext
* AMD8000Controller.kext
* AMD9000Controller.kext
* AMD9500Controller.kext
* AMD10000Controller.kext
* AMDRadeonX4000.kext
* AMDRadeonX4000HWServices.kext
* AMDFramebuffer.kext
* AMDSupport.kext
* AMDRadeonVADriver.bundle
* AMDRadeonVADriver2.bundle
* AMDRadeonX4000GLDriver.bundle
* AMDMTLBronzeDriver.bundle
* AMDShared.bundle

:::



::: details Patches für Non-Metal-Grafikbeschleunigung (11.0+)

### Allgemeine Patches

* IOSurface.kext
  * Grund: Behebt die sofortige Abmeldung nach dem Anmelden
  * Logik: Downgrade auf IOSurface aus Catalina
  * Hinweis: Für AMD und Intel kommt ein zusätzlicher `addMemoryRegion/removeMemoryRegion`-Patch hinzu, der den ersten bedingten Sprung in einen unbedingten Sprung ändert
    * An Offset `0xdb52` und `0xdbc6` die folgenden Bytes durch `0xeb` ersetzen

### Entfernte Beschleunigungs-Binärdateien

* NVIDIA-Binärdateien
  * GeForceGA.bundle
  * GeForceTesla.kext
    * IOFree-Panic überspringen – ab Mojave
      * An Offset `0x5CF9A` die folgenden Bytes durch `0xEB` ersetzen
    * Vermeidet Aufrufe von `addMemoryRegion/removeMemoryRegion`
      * An Offset `0x5527` und `0x77993` die folgenden Bytes durch `0x909090909090` ersetzen
  * GeForceTeslaGLDriver.bundle
  * GeForceTeslaVADriver.bundle
  * NVDANV50HalTesla.kext
  * NVDAResmanTesla.kext
    * 0x1ea59a - 0x1ea5b3: nop
    * VSLGestalt durch IOLockLock oder ein anderes bekanntes Symbol gleicher Länge ersetzen.

* Binärdateien der NVIDIA-Webtreiber
  * GeForceWeb.kext
  * NVDAGF100HalWeb.kext
  * NVDAGK100HalWeb.kext
  * NVDAGM100HalWeb.kext
  * NVDAGP100HalWeb.kext
  * NVDAResmanWeb.kext
  * NVDAStartupWeb.kext
  * GeForceTeslaWeb.kext
  * NVDANV50HalTeslaWeb.kext
  * NVDAResmanTeslaWeb.kext
    * Grund: Ermöglicht Non-Metal-Beschleunigung für NVIDIA-GPUs mit Maxwell und Pascal

* AMD/ATI-Binärdateien
  * AMD2400Controller.kext
  * AMD2600Controller.kext
  * AMD3800Controller.kext
  * AMD4600Controller.kext
  * AMD4800Controller.kext
  * AMD5000Controller.kext
  * AMD6000Controller.kext
  * AMDFramebuffer.kext
  * AMDLegacyFramebuffer.kext
  * AMDLegacySupport.kext
  * AMDRadeonVADriver.bundle
  * AMDRadeonVADriver2.bundle
  * AMDRadeonX3000.kext
  * AMDRadeonX3000GLDriver.bundle
  * AMDShared.bundle
  * AMDSupport.kext
  * ATIRadeonX2000.kext
  * ATIRadeonX2000GA.plugin
  * ATIRadeonX2000GLDriver.bundle
  * ATIRadeonX2000VADriver.bundle

* Binärdateien für Intel der 5. Generation
  * AppleIntelFramebufferAzul.kext
  * AppleIntelFramebufferCapri.kext
  * AppleIntelHDGraphics.kext
  * AppleIntelHDGraphicsFB.kext
  * AppleIntelHDGraphicsGA.plugin
  * AppleIntelHDGraphicsGLDriver.bundle
  * AppleIntelHDGraphicsVADriver.bundle

* Binärdateien für Intel der 6. Generation
  * AppleIntelHD3000Graphics.kext
  * AppleIntelHD3000GraphicsGA.plugin
  * AppleIntelHD3000GraphicsGLDriver.bundle
  * AppleIntelHD3000GraphicsVADriver.bundle
  * AppleIntelSNBGraphicsFB.kext
    * Board-ID-Patch
      * Ersetzt die ursprüngliche Board-ID durch ein aktualisiertes Modell
  * AppleIntelSNBVA.bundle

### Frameworks

* CoreDisplay.framework
  * Logik: Aus Mojave übernommen, stark modifiziert/mit Shims versehen
* IOSurface.framework
* OpenGL.framework
  * Logik: Aus Mojave übernommen

### PrivateFrameworks

* GPUSupport.framework
  * Logik: Aus Mojave übernommen
* SkyLight.framework
  * Logik: Aus Mojave übernommen, stark modifiziert/mit Shims versehen

:::
