# Intelligentes Übersetzungssystem

Eine leistungsstarke webbasierte Übersetzungsanwendung, die Chinesisch-Deutsch-Übersetzung, intelligente Übersetzung und Dokumentenübersetzung unterstützt.

## Funktionsmerkmale

### Kernübersetzungsfunktion
- **Mehrmodi-Übersetzung**: Unterstützt Standardübersetzung, intelligente Übersetzung (unter Berücksichtigung des Kontexts) und Dokumentenübersetzung
- **Chinesisch-Deutsch-Übersetzung**: Speziell optimierte Chinesisch-Deutsch-Übersetzung, enthält umfangreiche Wortzuordnungen und Kontextverarbeitung
- **Lokale Übersetzung**: Eingebauter lokaler Übersetzungsdienst, grundlegende Übersetzungsfunktionen ohne Internetverbindung nutzbar
- **API-Integration**: Unterstützt Google Translate, Baidu Translate und benutzerdefinierte API-Dienste

### Intelligente Funktionen
- **Synonymersatz**: Bietet Synonymauswahl zur Optimierung der Übersetzungsergebnisse
- **Übersetzungsqualitätsbewertung**: Automatische Bewertung der Übersetzungsqualität, liefert eine Punktzahl von 0-100
- **Übersetzungsinformationspanel**: Stellt Wörterbuch-, Grammatik- und Kontextinformationen bereit
- **Vergleichsansicht**: Ermöglicht den Vergleich von Originalübersetzung und Synonymübersetzung

### Benutzererlebnis
- **Responsive Design**: Passt sich an verschiedene Bildschirmgrößen an
- **Dunkles/Helles Thema**: Unterstützt Themenwechsel, passt sich unterschiedlichen Nutzungsszenarien an
- **Sprachfunktion**: Unterstützt Sprachsynthese (Vorlesen) und Spracherkennung
- **Verlauf**: Speichert Übersetzungsverlauf automatisch, unterstützt Suche und Filter
- **Favoritenfunktion**: Speichert häufig genutzte Übersetzungen für schnellen Zugriff

### Dokumentenverarbeitung
- **Dokumentenübersetzung**: Unterstützt das Hochladen von Dokumenten zur Übersetzung
- **Format beibehalten**: Versucht, das ursprüngliche Dokumentformat und die Struktur zu erhalten
- **Mehrformatunterstützung**: Unterstützt Text, PDF, Word und andere Formate

## Technische Umsetzung

### Frontend-Technologien
- **HTML5**: semantische Tags, verbessert die Zugänglichkeit
- **CSS3**: modernes Styling, unterstützt CSS-Variablen und responsives Design
- **JavaScript ES6+**: modularer Code, Nutzung moderner JavaScript-Features
- **Lokaler Speicher**: Verwendung von localStorage zum Speichern von Benutzereinstellungen und Verlauf

### Übersetzungs-Engine
- **Lokaler Übersetzungsdienst** (local-translate.js): 
 - Enthält umfangreiche Chinesisch-Deutsch-Wortschatzzuordnungen
 - Unterstützt kontextbewusste Übersetzung
 - Verarbeitet gängige Satzstrukturen und Grammatik
 - Intelligente Tokenisierung und Phrasenerkennung

### Projektstruktur
```
translate/
├── index.html # Hauptseite
├── style.css # Stildatei
├── app.js # Hauptanwendungslogik
└── local-translate.js # Lokaler Übersetzungsdienst
```

## Anleitung

### Grundübersetzung
1. Wählen Sie die Quell- und Zielsprache aus
2. Geben Sie den zu übersetzenden Text in das Textfeld ein
3. Klicken Sie auf die Schaltfläche „Übersetzen“ oder verwenden Sie die Tastenkombination (Ctrl+Enter)
4. Sehen Sie sich das Übersetzungsergebnis an

### Intelligente Übersetzung
1. Wechseln Sie in den Modus „Intelligente Übersetzung“
2. Geben Sie den Text ein und übersetzen Sie ihn
3. Klicken Sie auf hervorgehobene Wörter, um Synonyme zu sehen
4. Wählen Sie passende Synonyme, um die Übersetzung zu optimieren

### Dokumentenübersetzung
1. Wechseln Sie in den Modus „Dokumentenübersetzung“
2. Laden Sie das zu übersetzende Dokument hoch
3. Wählen Sie Übersetzungsoptionen
4. Klicken Sie auf die Schaltfläche „Übersetzung starten“

### Verlauf und Favoriten
- Klicken Sie auf die Schaltfläche „Verlauf“ oder „Favoriten“ in der unteren Statusleiste
- Verwenden Sie das Suchfeld, um Ergebnisse zu filtern
- Klicken Sie auf einen Verlaufseintrag oder Favoriten, um das Textfeld schnell zu füllen

### Einstellungen
- Klicken Sie auf die Einstellungsschaltfläche oben rechts
- Wechseln Sie das Thema (dunkel/hell)
- Schriftgröße anpassen
- API-Dienst konfigurieren
- Automatisches Vorlesen und das Speichern des Verlaufs aktivieren

## Tastenkombinationen

- `Ctrl+Enter`: Text übersetzen
- `Ctrl+L`: Text leeren
- `Ctrl+C`: Übersetzungsergebnis kopieren
- `Ctrl+S`: Übersetzungsergebnis vorlesen
- `Ctrl+H`: Verlauf anzeigen/ausblenden
- `Ctrl+F`: Lesezeichen anzeigen/ausblenden
- `Ctrl+,`: Einstellungen öffnen

## Browser-Kompatibilität

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Entwicklung und Anpassung

### Neue Wörter hinzufügen
Bearbeiten Sie die Objekte `deToZhDict` und `zhToDeDict` in der Datei `local-translate.js` und fügen Sie neue Wortzuordnungen hinzu.

### Neuen API-Dienst hinzufügen
1. Fügen Sie in der Datei `app.js` im Objekt `apiServices` eine neue Dienstkonfiguration hinzu.
2. Fügen Sie in der Funktion `translate` die Aufruflogik für den neuen Dienst hinzu.
3. Fügen Sie im Einstellungs‑Panel eine Option für den neuen Dienst hinzu.

### Benutzerdefiniertes Thema
Bearbeiten Sie die CSS‑Variablen in der Datei `style.css` oder fügen Sie neue Theme‑Klassen hinzu.

## Lizenz

MIT License

## Mitwirken

Bitte reichen Sie Issues und Pull Requests ein, um dieses Projekt zu verbessern.
