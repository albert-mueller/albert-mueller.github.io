# Hintergrundprozess

BridgePatcher nutzt einen Hintergrundprozess, um:
- nicht passende Konfigurationen zu erkennen und den Benutzer zu warnen (z. B. eine MacBookPro11,1-Konfiguration, die auf einem MacBookPro11,5 installiert ist)
- den Status der installierten Root-Patches und von OpenCore zu überwachen
- dich zur Installation der Root-Patches aufzufordern, falls diese nicht erkannt werden (typischerweise nach einem Update)
- zu prüfen, ob OpenCore vom USB-Stick oder vom internen Laufwerk gebootet wird
- dich aufzufordern, OpenCore auf dem internen Laufwerk zu installieren, falls vom USB-Stick gebootet wurde
- auf anstehende Updates zu reagieren, die ein neues KDK benötigen, und den KDK-Download automatisch zu starten

Es wird empfohlen, den Hintergrundprozess aktiviert zu lassen, damit alles möglichst reibungslos funktioniert – z. B. um fehlgeschlagenes Patchen zu vermeiden, wenn kein neues KDK gefunden wird.

Wenn du den Hintergrundprozess deaktivierst, muss das KDK für jedes Update manuell installiert werden. BridgePatcher kann dann außerdem beim Start keine Root-Patches erkennen, d. h. du musst die App manuell öffnen und die Root-Patches selbst installieren.
