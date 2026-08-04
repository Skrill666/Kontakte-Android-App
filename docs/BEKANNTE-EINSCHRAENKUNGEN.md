# Bekannte Einschränkungen

- Die App ist für Android umgesetzt; native Funktionen laufen nicht im Browser.
- Das Testgerät muss selbst mindestens 20 Kontakte besitzen. Die App erzeugt keine künstlichen Testkontakte.
- Kontakte können entsprechend der Aufgabenstellung nicht bearbeitet werden.
- Beim Erstellen wird jeweils ein Feld für Telefonnummer und E-Mail-Adresse angeboten; bestehende Mehrfachwerte werden vollständig angezeigt.
- Kontaktfotos werden als Base64-Daten geladen. Bei sehr großen Adressbüchern kann dies mehr Speicher benötigen; die Abfrage ist deshalb paginiert.
- Das Ergebnis des SMS-Versands kann unter Android nicht ermittelt werden; die App öffnet nur den Composer.
- Verfügbarkeit und Verhalten von Telefon-, E-Mail- und SMS-Apps hängen vom Gerät ab.
