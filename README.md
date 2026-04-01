# algorithm-dijkstra

Demo: https://danielsuba.github.io/algorithm-dijkstra/

Algorithm dijkstra jest to interaktywna aplikacja webowa, która została wykonana jako projekt zadany przez uczelnię UWB. Projekt pozwala na żywo obserwować działanie algorytmu dijkstry i w jaki sposób on przeszukuje przestrzeń w poszukiwaniu najkrótszej drogi do końca.
Główne funkcje:
* Interaktywna siatka umożliwia samodzielne definiowanie wymiarów planszy (2d), ustawianie punktu startowego i końcowego oraz ręczne rysowanie ścian (przeszkód).
* Generator labiryntów pozwala na generowanie losowego układu przeszkód przy użyciu przycisku "Randomize walls" oraz konfigurowalnego suwaka gęstości (Density).
* Pełna kontrola animacji obejmuje pauzowanie, wznawianie, resetowanie algorytmu oraz dynamiczną zmianę prędkości działania za pomocą suwaka (nawet w trakcie trwania animacji).
* Tryb "Show Weights" umożliwia wyświetlanie aktualnej odległości od punktu startowego na każdym odwiedzonym kafelku.
* Zaawansowana personalizacja wizualna
  * Temy strony: Standard Theme i Ciemny (Dark Theme).
  * Style frontu przeszukiwania obejmują różne warianty kolorowania algorytmu, takie jak dynamiczne gradienty (zależne od odległości od startu lub pozycji na siatce), jednolite kolory oraz tryb losowy.

Technologie

Projekt został opracowany wyłącznie z wykorzystaniem vanilnych technologii webowych, bez użycia zewnętrznych bibliotek ani frameworków.

* HTML5: Struktura aplikacji.
* CSS3 służy do stylowania, w tym wykorzystania zmiennych CSS dla tem(motywów), CSS Grid do precyzyjnego pozycjonowania siatki oraz Flexbox do budowy interfejsu. Zastosowano również własne animacje klatkowe (@keyframes).
* JavaScript umożliwia obiektową reprezentację siatki, implementację matematyczną algorytmu Dijkstry oraz system animacji oparty na asynchronicznych wywołaniach rekurencyjnych (setTimeout).

Jak uruchomić projekt?
Aplikacja nie wymaga instalacji dodatkowych pakietów lub biblotek.
