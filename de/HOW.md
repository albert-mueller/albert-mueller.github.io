# Bootvorgang mit OpenCore Legacy Patcher T2

OpenCore Legacy Patcher T2 selbst ist eigentlich ein ziemlich „dummes“ Programm. Im Wesentlichen bearbeitet es eine config.plist-Datei und verschiebt Dateien; eigene Logik zum Bootvorgang enthält es kaum. Die eigentliche Magie von OCLP steckt in [OpenCorePkg](https://github.com/acidanthera/OpenCorePkg), unserem Backend – das macht diesen Patcher so leistungsfähig.

## Bootvorgang mit OpenCore

Um besser zu verstehen, wie OpenCore ältere Macs so nahezu nativ wiederbeleben kann, schauen wir uns an, *wie* OpenCore mit deinem Mac zusammenarbeitet:

![](../images/oc-explained.png)
