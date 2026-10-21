# Hintergrundprozess

OpenCore Legacy Patcher T2 nutzt einen Hintergrundprozess, um:
- nicht passende Konfigurationen zu erkennen und den Nutzer zu warnen (z. B. eine MacBookPro11,1-Konfiguration auf einem MacBookPro11,5),
- den Status der installierten Root-Patches und von OpenCore zu überwachen,
- dich zur Installation der Root-Patches aufzufordern, falls sie nicht erkannt werden (typischerweise nach einem Update),
- zu prüfen, ob OpenCore von einem USB-Stick oder vom internen Laufwerk gebootet wird,
- dich zur Installation von OpenCore auf dem internen Laufwerk aufzufordern, falls vom USB-Stick gebootet wurde,
- auf anstehende Updates zu reagieren, die ein neues KDK benötigen, und den KDK-Download automatisch zu starten.

Für einen möglichst reibungslosen Betrieb empfehlen wir, den Hintergrundprozess aktiviert zu lassen – z. B. um fehlgeschlagenes Patchen zu vermeiden, wenn kein neues KDK gefunden wird.

Wenn du den Hintergrundprozess deaktivierst, musst du das KDK bei jedem Update manuell installieren. OCLPT2 kann außerdem beim Booten keine Root-Patches erkennen; du musst die App also manuell öffnen und die Root-Patches selbst installieren.
