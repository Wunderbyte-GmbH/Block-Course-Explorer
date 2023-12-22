# Kurs-Explorer Block

## Name
block_course_explorer

## Beschreibung
Dies ist ein Block-Plugin zur Anzeige und Verwaltung von Kursen in Moodle 4+. Die Funktionen dieses Plugins sind erweiterte Filter- und Sortiermöglichkeiten,
informative Kurskacheln, Vorfilterung nach Kurskategorien und 2 verschiedene Ansichten: "Alle Kurse" und "Meine Kurse".
Während die Vorfilterung und die Ansichten in der Konfiguration eines Blocks eingestellt werden können (Moodle-Bearbeitungsmodus einschalten ->
klicken Sie auf das Zahnradsymbol des Blocks -> wählen Sie die Konfiguration), sind die Dropdown-Filter, die Sortierung und die Informationen, die auf
Kacheln angezeigt werden, festgelegt und erfordern Codeänderungen, um sie anzupassen.

Es gibt eine Option, um MINTCampus-Stilvorgaben auf die Ansicht eines Plugins anzuwenden. In den Plugin-Einstellungen
(Website-Verwaltung -> Plugins -> Kurs-Explorer) gibt es eine Checkbox, die es erlaubt, eine MINTCampus CSS-Datei zu laden.

## Erforderliche Kursfelder

Die Daten in den Filtern, der Sortierung und den Kacheln stammen aus den benutzerdefinierten Kursfeldern in 
Website-Administration -> Kurse -> Benutzerdefinierte Felder für Kurse.
Die folgenden Felder werden auf mein.mintcampus.org verwendet und sind für die korrekte Funktion des Plugins erforderlich:

#### Name - Bezeichner - Feldtyp:
- Course duration - mc_moodle_kursdauer - Dropdown menu
- Cost - mc_moodle_kosten - Short text
- Level - mc_moodle_level - Dropdown menu
- License - mc_moodle_copyright - Dropdown menu
- Certificate - mc_moodle_zertifikat - Dropdown menu
- Language - mc_moodle_sprache - Dropdown menu
- Accessibility - mc_moodle_barrierearm - Checkbox
- Topics - mc_moodle_themen - Multiselect menu (installation required)
- MC-Original - mcoriginal - Checkbox
- Format - mc_moodle_format - Dropdown menu
- Target group - mc_moodle_zielgruppe - Multiselect menu (installation required)
- Course provider - mc_moodle_partner_name - Short text

Multiselect menu https://moodle.org/plugins/customfield_multiselect

#### Dropdown filters:
- Course categories - standard moodle course categories
- Topics - mc_moodle_themen
- Target group - mc_moodle_zielgruppe

#### Sort dropdown options:
- Alphabetically asc/desc - sorting by standard moodle course title
- MC-Original - mcoriginal
- Favorites - standard moodle favorite (user preferences)

## Installation
Packen Sie das Block-Plugin im moodle/blocks/ Ordner als course_explorer und das lokale Service-Plugin im moodle/local/ als
course_explorer_service (siehe [Abhängigkeiten von anderen Plugins](#abhängigkeiten-von-anderen-plugins)).

## Abhängigkeiten von anderen Plugins

### format_mintcampus
Die Kurskachel zeigt die durchschnittliche Bewertung eines Kurses und die Anzahl der Personen, die ihn bewertet haben. Auf mein.mintcampus.org
werden diese Informationen aggregiert und dem block_course_explorer von format_mintcampus zur Verfügung gestellt.
### local_course_explorer_service
Dies ist ein Backend des Block-Plugins, das die Daten aggregiert und formatiert an das Frontend des Blocks liefert.
Für die korrekte Arbeit ist ein Web-Service-Token erforderlich (Website-Administration -> Server -> Token verwalten).
Das erstellte Token sollte in den Einstellungen des Kurs-Explorers gespeichert werden (Website-Administration -> Plugins -> Nach unten scrollen zu Blöcke
-> Kurs-Explorer)

## MINTCampus CSS-Vorgabe
Dieses Preset befindet sich in course_explorer/resources/presets/. Die Datei wird in der php-Datei des Hauptblocks (block_course_explorer) geladen.
Generell könnte man ein eigenes Stylesheet in den presets-Ordner legen und den Pfad dazu in block_course_explorer anpassen, um
um es anzuwenden (während die Checkbox in den Einstellungen aktiviert ist).

## Screenshots
![Course-Explorer-All-Courses](resources/screenshots/Course-Explorer-All-Courses.png)
![Course-Explorer-All-Courses-MINTCampus](resources/screenshots/Course-Explorer-All-Courses-MINTCampus.png)
![Course-Explorer-Config](resources/screenshots/Course-Explorer-Config.png)
![Course-Explorer-Settings](resources/screenshots/Course-Explorer-Settings.png)