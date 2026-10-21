# Die Patches in OpenCore Legacy Patcher T2 erklärt

Unser Patcher verwendet zahlreiche Patches, um ein stabiles System zu gewährleisten. Hier gehen wir durch, welche Patches verwendet werden und warum wir sie empfehlen oder sogar voraussetzen.

* [OpenCore-Einstellungen](#opencore-einstellungen)
* [Eingeschleuste Kexts](#eingeschleuste-kexts)
* [Patches auf dem Laufwerk](#patches-auf-dem-laufwerk)

## OpenCore-Einstellungen

Im Folgenden findest du einen Überblick über die wichtigste Logik, mit der OpenCore Legacy Patcher T2 native Unterstützung in macOS erreicht. Die Konfiguration von OpenCore ist in [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg) sowie in einer von uns bereitgestellten Online-Version dokumentiert:

* [Online-Dokumentation von OpenCorePkg](https://dortania.github.io/docs/latest/Configuration.html)

::: details Erklärung der Konfiguration

### ACPI -> Add

* SSDT-CPBG
  * Grund: Behebt eine Kernel Panic auf Arrandale-Macs in frühen Big-Sur-Builds
  * Logik: Deaktiviert das Dummy-Gerät CPBG im ACPI
  * Modelle: MacBookPro6,x und iMac11,x
* SSDT-PCI
  * Grund: Patcht die Windows-Audiounterstützung für Sandy und Ivy Bridge
  * Logik: Entfernt die 32-Bit-Zuweisungsbeschränkung von PCI0
  * Modelle: Alle Sandy- und Ivy-Bridge-Macs außer MacPro6,1
* SSDT-DGPU
  * Grund: Ermöglicht ein softwarebasiertes deMUX, das die dGPUs in MacBook Pros von 2011 deaktiviert
  * Logik: Sendet per ACPI eine Abschaltanforderung an die dGPU
  * Modelle: MacBookPro8,2 und MacBookPro8,3 mit defekter dGPU

### ACPI -> Patch

* Patches für `EHCx` und `XHC1`
  * Grund: Für korrekten USB-Betrieb erforderlich
  * Logik: Verhindert, dass sich USB-Maps neuerer Modelle anbinden und die USB-Anschlüsse unbrauchbar machen
  * Modelle: Alle Modelle beim Spoofing mit SMBIOS-Stufe „Moderate“ oder „Advanced“
* Patch: `BUF0` zu `BUF1`
  * Grund: Gehört zu SSDT-PCI
* Patch: `_INI` zu `XINI`
  * Grund: Gehört zu SSDT-DGPU

### Booter -> Patch

* `HW_BID` auf `OC_BID` umleiten
  * Grund: Ermöglicht die Nutzung von macOS-Installern auf nicht unterstützten Modellen
  * Logik: Leitet die Board-ID-Prüfungen von macOS auf eine eigene Variable um
  * Modelle: Alle Systeme mit VMM-Spoofing

### Booter -> Quirks

* ForceBooterSignature
  * Grund: Erforderlich für die Unterstützung des Ruhezustands (Hibernation)
  * Logik: Lässt boot.efi glauben, OpenCore sei Apples Firmware
  * Modelle: Alle Modelle

### DeviceProperties -> Add

* `PciRoot(0x0)/Pci(0x3,0x0)/Pci(0x0,0x0)`
* `PciRoot(0x0)/Pci(0x1,0x0)/Pci(0x0,0x0)`
  * Grund: Erforderlich, damit die Helligkeitssteuerung auf aufgerüsteten iMacs funktioniert
  * Logik: Setzt AppleBackLight-Eigenschaften
  * Modelle: iMac11,x und iMac12,x mit aufgerüsteten NVIDIA-Metal-GPUs
* `PciRoot(0x0)/Pci(0x2,0x0)`
  * Grund: Deaktiviert die interne GPU, um Probleme mit dem Ruhezustand auf aufgerüsteten iMacs zu beheben
  * Logik: Lässt macOS glauben, die iGPU sei ein generisches PCI-Gerät
  * Modelle: iMac12,x mit aufgerüsteten Metal-GPUs

### Kernel -> Patch

* Patch: SMC
  * Grund: Erforderlich, um SMC-Firmware-Updates zu verhindern
  * Logik: Entfernt `smc-version` in AppleSMC.kext per Patch; für die volle Funktion ist SMC-Spoof.kext nötig
  * Modelle: Alle Modelle beim SMBIOS-Spoofing
* Patch: IOHIDFamily
  * Grund: Erforderlich für die Unterstützung von HID-Peripheriegeräten in macOS auf älterer Hardware
  * Logik: Lässt IOHIDFamily glauben, es werde immer die Recovery gebootet
  * Modelle: Penryn-CPUs (Core-2-Serie)
* Patch: FileVault bei gebrochenem Siegel erzwingen
  * Grund: Erlaubt FileVault auf root-gepatchten Macs
  * Logik: Zwingt APFS.kext, bei der FileVault-Unterstützung immer „true“ zurückzugeben
  * Modelle: Alle Modelle, die Root-Patches benötigen
* Patch: Durchsetzung der Library Validation deaktivieren
  * Grund: Nicht-Metal-Root-Volume-Patches bestehen die Library-Validation-Prüfungen nicht
  * Logik: Zwingt die Library-Validation-Funktion, immer „nicht erforderlich“ zurückzugeben
  * Modelle: Nicht-Metal-GPUs
* Patch: SurPlus
  * Grund: macOS 11.3–12.0.1 setzt für einen stabilen Start RDRAND-Unterstützung der CPU voraus
  * Logik: Zwingt den RDRAND-Code, einen vorgegebenen Wert zurückzugeben
  * Modelle: Alle Macs vor Ivy Bridge
* Patch: `kern.hv_vmm_present` umleiten
  * Grund: Ermöglicht die Installation und Aktualisierung von macOS auf nicht unterstützter Hardware
  * Logik: Lässt den Userspace das System als virtuelle Maschine sehen
  * Modelle: Alle Modelle mit VMM-Spoofing


### Kernel -> Quirks

* ThirdPartyDrives
  * Grund: Erforderlich, um Probleme beim Aufwachen aus dem Ruhezustand mit Laufwerken von Drittanbietern zu vermeiden
  * Logik: Patcht AppleAHCIPort.kext für die Unterstützung
  * Modelle: Alle Modelle mit Standard-SATA-Anschlüssen
* PanicNoKextDump
  * Grund: Verhindert Kext-Dumps bei Kernel Panics und erleichtert das Kernel-Debugging
  * Logik: Patcht den Kernel, damit er keine unnötigen Informationen ausgibt
  * Modelle: Nur gesetzt, wenn der Nutzer Verbose Boot aktiviert hat

### Misc -> Security

* SecureBootModel
  * Grund: Erforderlich für native Betriebssystem-Updates beim Spoofing von T2-Modellen
  * Logik: Setzt den Secure-Enclave-Identifier des T2
  * Modelle: Alle Modelle, die mit Stufe „Minimal“ oder höher ein T2-Modell spoofen

### NVRAM -> Add

* `-v keepsyms=1 debug=0x100`
  * Grund: Zeigt Debug-Informationen des macOS-Kernels und der Kexts an und verhindert Neustarts bei einer Panic
  * Logik: Fügt Boot-Argumente zum NVRAM hinzu
  * Modelle: Nur gesetzt, wenn der Nutzer Verbose Boot aktiviert hat
* `-liludbgall`
  * Grund: Aktiviert das Debug-Logging von Lilu und Plugins
  * Logik: Fügt Boot-Argumente zum NVRAM hinzu
  * Modelle: Nur gesetzt, wenn der Nutzer Kext DEBUG aktiviert hat
* `msgbuf=1048576`
  * Grund: Setzt die Größe des Nachrichtenpuffers auf 1 MB, damit Boot-Logs erhalten bleiben
  * Logik: Fügt Boot-Argumente zum NVRAM hinzu
  * Modelle: Nur gesetzt, wenn der Nutzer Kext DEBUG aktiviert hat
* `agdpmod=pikera`
  * Grund: Behebt die GPU-Umschaltung auf MacBookPro9,x
  * Logik: Fügt Boot-Argumente zum NVRAM hinzu
  * Modelle: MacBookPro9,x
* `shikigva=80 unfairgva=1`
* `shikigva=128 unfairgva=1 -wegtree`
  * Grund: Behebt die DRM-Unterstützung auf Modellen mit aufgerüsteten AMD-Metal-GPUs
  * Logik: Fügt Boot-Argumente zum NVRAM hinzu
  * Modelle: Modelle mit aufgerüsteten AMD-Metal-GPUs
* `-revasset`
  * Grund: Aktiviert Inhaltscaching bei VMM-Spoofing
  * Logik: Fügt Boot-Argumente zum NVRAM hinzu
  * Modelle: Alle Modelle mit VMM-Spoofing
* `amfi=0x80`
  * Grund: Deaktiviert Apple Mobile File Integrity, um Root-Patches zu ermöglichen
  * Logik: Fügt Boot-Argumente zum NVRAM hinzu
  * Modelle: Alle Modelle, die unsignierte Root-Patches benötigen

### UEFI -> ProtocolOverrides

* GopPassThrough
  * Grund: Sorgt für korrekte Bildausgabe auf Geräten mit UGA-Firmware, aber GOP-GPU
  * Logik: Stellt GOP-Protokollinstanzen zusätzlich zu den UGA-Protokollinstanzen bereit
  * Modelle: MacPro3,1, iMac7,1-8,1

:::

## Eingeschleuste Kexts

Im Folgenden wird erklärt, welche Kexts OpenCore Legacy Patcher T2 beim Start in den Arbeitsspeicher einschleust.

::: details Erklärung der eingeschleusten Kexts

### Acidanthera

* Lilu
  * Grund: Patch-Engine für andere Kexts
  * Modelle: Alle Modelle
* WhateverGreen
  * Grund: Patcht GPU-Frameworks und -Kexts für korrekte Unterstützung
  * Modelle: Alle Modelle mit Spoofing oder nicht originaler GPU
* CPUFriend
  * Grund: Patcht IOx86PlatformPlugin, um frühere CPU-Profile wiederherzustellen
  * Modelle: Alle Modelle mit Spoofing der Stufe „Minimal“ oder höher
* AirportBrcmFixup
  * Grund: Patcht IO80211 und Co., um die Netzwerkunterstützung für nicht unterstützte Karten herzustellen und Fehler bei nativen Karten zu beheben (z. B. zufällig verschlechterte Netzwerkleistung)
  * Modelle: BCM943224, BCM94331, BCM94360 und BCM943602
* BlueToolFixup
  * Grund: Patcht BlueTool, um Bluetooth unter Monterey zu ermöglichen
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
  * Grund: Installiert das Nicht-AVX2.0-Cryptex auf CPUs ohne AVX2.0
  * Modelle: Alle CPUs bis einschließlich Ivy Bridge
* AutoPkgInstaller
  * Grund: Ermöglicht automatisches Root-Patching
* NVMeFix
  * Grund: Behebt die Unterstützung für NVMe-Laufwerke von Drittanbietern
* RSRHelper
  * Grund: Behebt die Unterstützung für „Schnelle Sicherheitsmaßnahmen“ auf root-gepatchten Installationen
* 

### Ethernet

* nForceEthernet
  * Grund: Schleust den alten NVIDIA-Ethernet-Kext ein, um das Netzwerk unter Catalina und neuer herzustellen
  * Modelle: NVIDIA-Ethernet von 2010 und älter
* MarvelYukonEthernet
  * Grund: Schleust den alten Marvell-Ethernet-Kext ein, um das Netzwerk unter Catalina und neuer herzustellen
  * Modelle: Marvell-Ethernet von 2008 und älter
* CatalinaBCM5701Ethernet
  * Grund: Schleust den alten Broadcom-Ethernet-Kext ein, um das Netzwerk unter Big Sur herzustellen
  * Logik: Entfernt kollidierende Symbole per Patch, damit es keinen Konflikt mit dem vorhandenen BCM5701Ethernet gibt
  * Modelle: Broadcom-Ethernet von 2011 und älter
* Intel82574L
  * Grund: Stellt die Ethernet-Unterstützung auf Mac Pros her
  * Modelle: MacPro3,1 - 5,1
* CatalinaIntelI210Ethernet
  * Grund: Behebt die Unterstützung für Intel-i210/i225-Netzwerkkarten auf Macs vor Ivy Bridge
* AppleIntel8254XEthernet
  * Grund: Stellt die Ethernet-Unterstützung auf Mac Pros her
  * Modelle: MacPro3,1 - 5,1

### Firewire 

* IOFireWireFamily
  * Grund: Ermöglicht das Booten über FireWire
* IOFireWireSBP2
  * Grund: Ermöglicht das Booten über FireWire
* IOFireWireSerialBusProtoColTransport
  * Grund: Ermöglicht das Booten über FireWire

### Maps

* USBMap
  * Grund: Schleust alte USB-Map-Profile ein, um USB zu reparieren
  * Modelle: Alle Modelle mit Spoofing der Stufe „Moderate“ oder höher sowie Modelle vor 2012

### SSE

* AAMouSSE
  * Grund: Übersetzt SSE4.2-Befehle in kompatiblen Code für SSE4.1-CPUs; erforderlich für AMD-Metal-Treiber
  * Modelle: MacPro3,1
* telemetrap
  * Grund: Sorgt dafür, dass telemetry.plugin nicht läuft; erforderlich für SSE4.1-CPUs
  * Modelle: Penryn-CPUs

### Wifi

* IO80211ElCap
  * Grund: Schleust die WLAN-Treiber aus El Capitan erneut ein
  * Modelle: Chipsätze BCM94328, BCM94322 und Atheros
* corecaptureElCap.kext
  * Grund: Schleust die WLAN-Treiber aus El Capitan erneut ein
  * Modelle: Chipsätze BCM94328, BCM94322 und Atheros

### Misc

* AppleBackLightFixup
  * Grund: Patcht AppleBacklight für iMacs mit aufgerüsteten NVIDIA-Metal-GPUs
  * Modelle: iMac11,x, iMac12,x mit aufgerüsteten NVIDIA-Metal-GPUs
* AppleIntelPIIXATA
  * Grund: Behebt die IDE-Unterstützung auf dem MacPro3,1
  * Modelle: MacPro3,1
* AppleIntelMCEDisabler
  * Grund: Behebt die Dual-Socket-Unterstützung unter Catalina und neuer
  * Modelle: Mac Pros und Xserves
* SMC-Spoof
  * Grund: Gibt die SMC-Version als 9.9999 aus
  * Modelle: Alle Modelle mit Spoofing der Stufe „Minimal“ oder höher
* AppleRAIDCard
  * Fügt Unterstützung für AppleRAIDCard in Xserves hinzu
* AMDGPUWakeHandler
  * Grund: Fügt ein softwarebasiertes Demux für MacBook Pros 2011 mit 15"/17" hinzu
* AppleIntelCPUPowerManagement und AppleIntelCPUPowerManagementClient
  * Grund: Stellt das CPU-Energiemanagement für Ivy Bridge und älter wieder her
* AppleUSBTopCase
  * Grund: Stellt die Unterstützung für USB-Tastaturen unter macOS Ventura wieder her
* AppleUSBMultitouch und AppleUSBTrackpad
  * Grund: Stellt die Unterstützung für USB-Trackpads unter macOS Ventura wieder her
* ASPP-Override
  * Grund: Lässt ACPI_SMC_PlatformPlugin gegenüber X86PlatformPlugin den Vorrang erhalten und deaktiviert die Drosselung durch die Firmware
* BacklightInjector
  * Grund: Behebt die Helligkeitssteuerung in iMacs mit aufgerüsteten GPUs
* BigSurSDXC
  * Grund: Stellt die SDXC-Unterstützung auf Macs vor Ivy Bridge wieder her
* Bluetooth-spoof
  * Grund: Täuscht älteres Bluetooth vor, damit es unter Monterey und neuer funktioniert
* Innie
  * Grund: Lässt alle PCIe-Laufwerke als intern erscheinen
  * Modelle: MacPro3,1 und neuer sowie Xserve3,1 und neuer
* KDKlessWorkaround
  * Grund: Hilft bei macOS-Updates auf ohne KDK gepatchten Systemen
* LegacyUSBVieoSupport
  * Grund: Behebt die Unterstützung älterer USB-iSight-Kameras
* MonteAHCIPort
  * Grund: Behebt die Unterstützung der originalen SSD im MacBookAir6,x
* NoAVXFSCompressionTypeZlib
  * Grund: Verhindert den Absturz von AVXFSCompressionTypeZlib auf Systemen ohne AVX1.0 ab 12.4
* SimpleMSR 
  * Grund: Deaktiviert BD PROCHOT, um die Drosselung durch die Firmware auf MacBooks ab Nehalem zu verhindern
* LegacyKeyboardInjector
  * Grund: Behebt die Funktionstasten auf dem MacBook5,2


:::

## Patches auf dem Laufwerk

Leider sind bestimmte Patches auf dem Laufwerk nötig, um den vollen Funktionsumfang zu erreichen. Im Folgenden findest du eine Aufschlüsselung der unterstützten Patches.

::: details Audio-Patches (11.0+)

### Extensions

* AppleHDA
  * Grund: Fügt AppleHDA aus El Capitan wieder hinzu, um Audiounterstützung herzustellen
  * Modelle: iMac7,1 und iMac8,1

:::

::: details Patches für ältere WLAN-Karten (12.0+)

Gilt für die WLAN-Karten BCM94328, BCM94322 und Atheros

### CoreServices

* WiFiAgent.app

### /usr/libexec

* airportd

:::

::: details Patches für die Grafikbeschleunigung von NVIDIA Kepler (12.0+)

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
  * Grund: Stellt die Hardwarebeschleunigung für Kepler wieder her
* Metal 
  * Grund: 3802-basierte GPUs funktionieren ab 13.3 nicht mehr, daher ist ein Downgrade von Metal auf 13.2.1 nötig

### PrivateFrameworks

* MTLCompiler
  * Grund: 3802-basierte GPUs funktionieren ab 13.3 nicht mehr, daher ist ein Downgrade von MTLCompiler auf 13.2.1 nötig
* GPUCompiler
  * Grund: 3802-basierte GPUs funktionieren ab 13.3 nicht mehr, daher ist ein Downgrade von GPUCompiler auf 13.2.1 nötig

:::


::: details Patches für die Grafikbeschleunigung von Intel Ivy Bridge (12.0+)

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
  * Grund: 3802-basierte GPUs funktionieren ab 13.3 nicht mehr, daher ist ein Downgrade von MTLCompiler auf 13.2.1 nötig
* GPUCompiler
  * Grund: 3802-basierte GPUs funktionieren ab 13.3 nicht mehr, daher ist ein Downgrade von GPUCompiler auf 13.2.1 nötig

### Frameworks

* OpenCL (libCLVMIGILPlugin.dylib)
  * Grund: Stellt die Hardwarebeschleunigung für Ivy Bridge wieder her
* WebKit (com.apple.WebProcess.sb)
  * Grund: Stellt das Safari-Rendering für Ivy Bridge wieder her
* Metal 
  * Grund: 3802-basierte GPUs funktionieren ab 13.3 nicht mehr, daher ist ein Downgrade von Metal auf 13.2.1 nötig
:::

::: details Patches für die Grafikbeschleunigung von Intel Haswell (13.0+)

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
  * Grund: 3802-basierte GPUs funktionieren ab 13.3 nicht mehr, daher ist ein Downgrade von Metal auf 13.2.1 nötig

### PrivateFrameworks

* MTLCompiler
  * Grund: 3802-basierte GPUs funktionieren ab 13.3 nicht mehr, daher ist ein Downgrade von MTLCompiler auf 13.2.1 nötig
* GPUCompiler
  * Grund: 3802-basierte GPUs funktionieren ab 13.3 nicht mehr, daher ist ein Downgrade von GPUCompiler auf 13.2.1 nötig

:::

::: details Patches für die Grafikbeschleunigung von Intel Broadwell (13.0+)

### Extensions 

* AppleIntelBDWGraphics.kext
* AppleIntelBDWGraphicsFramebuffer.kext
* AppleIntelBDWGraphicsGLDriver.bundle
* AppleIntelBDWGraphicsMTLDriver.bundle
* AppleIntelBDWGraphicsVADriver.bundle
* AppleIntelBDWGraphicsVAME.bundle
* AppleIntelGraphicsShared.bundle



:::

::: details Patches für die Grafikbeschleunigung von Intel Skylake (13.0+)

### Extensions 

* AppleIntelSKLGraphics.kext
* AppleIntelSKLGraphicsFramebuffer.kext
* AppleIntelSKLGraphicsGLDriver.bundle
* AppleIntelSKLGraphicsMTLDriver.bundle
* AppleIntelSKLGraphicsVADriver.bundle
* AppleIntelSKLGraphicsVAME.bundle
* AppleIntelGraphicsShared.bundle


:::

::: details Patches für die Grafikbeschleunigung von AMD Legacy Vega (13.0+)

### Extensions

* AMDRadeonX5000.kext
* AMDRadeonVADriver2.bundle
* AMDRadeonX5000GLDriver.bundle
* AMDRadeonX5000MTLDriver.bundle
* AMDRadeonX5000Shared.bundle
* AMDShared.bundle

:::

::: details Patches für die Grafikbeschleunigung von AMD Legacy Polaris (13.0+)

### Extensions

* AMDRadeonX4000.kext
* AMDRadeonX4000HWServices.kext
* AMDRadeonVADriver2.bundle
* AMDRadeonX4000GLDriver.bundle
* AMDMTLBronzeDriver.bundle
* AMDShared.bundle

:::

::: details Patches für die Grafikbeschleunigung von AMD Legacy GCN

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



::: details Patches für die Nicht-Metal-Grafikbeschleunigung (11.0+)

### Allgemeine Patches

* IOSurface.kext
  * Grund: Behebt das sofortige Abmelden nach der Anmeldung
  * Logik: Downgrade auf IOSurface aus Catalina
  * Hinweis: Bei AMD und Intel kommt ein zusätzlicher Patch für `addMemoryRegion/removeMemoryRegion` hinzu, der den ersten bedingten Sprung in einen unbedingten Sprung ändert
    * An Offset `0xdb52` und `0xdbc6` die folgenden Bytes durch `0xeb` ersetzen

### Entfernte Beschleunigungs-Binaries

* NVIDIA-Binaries
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

* Binaries der NVIDIA-Web-Treiber 
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
    * Grund: Ermöglicht Nicht-Metal-Beschleunigung für NVIDIA-Maxwell- und -Pascal-GPUs

* AMD/ATI-Binaries
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

* Binaries für Intel der 5. Generation
  * AppleIntelFramebufferAzul.kext
  * AppleIntelFramebufferCapri.kext
  * AppleIntelHDGraphics.kext
  * AppleIntelHDGraphicsFB.kext
  * AppleIntelHDGraphicsGA.plugin
  * AppleIntelHDGraphicsGLDriver.bundle
  * AppleIntelHDGraphicsVADriver.bundle

* Binaries für Intel der 6. Generation
  * AppleIntelHD3000Graphics.kext
  * AppleIntelHD3000GraphicsGA.plugin
  * AppleIntelHD3000GraphicsGLDriver.bundle
  * AppleIntelHD3000GraphicsVADriver.bundle
  * AppleIntelSNBGraphicsFB.kext
    * Board-ID-Patch
      * Originale Board-ID durch die des aktualisierten Modells ersetzen
  * AppleIntelSNBVA.bundle

### Frameworks

* CoreDisplay.framework
  * Logik: Aus Mojave übernommen, stark modifiziert bzw. mit Shims versehen
* IOSurface.framework
* OpenGL.framework
  * Logik: Aus Mojave übernommen

### PrivateFrameworks

* GPUSupport.framework
  * Logik: Aus Mojave übernommen
* SkyLight.framework
  * Logik: Aus Mojave übernommen, stark modifiziert bzw. mit Shims versehen

:::
