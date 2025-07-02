// === TEAMDATEN ===
const gruppen = {
  A: [
    "SuperSTOAs 1",
    "Mila Superstar – Palling",
    "Oaschlecker – Traunreut",
    "Beachbuddies – Lisowski",
    "Meine Volksbank",
    "Frei 1",
  ],
  B: [
    "SuperSTOAs 2",
    "SuperSTOAs 3",
    "Geile Reichenhaller",
    "Leider geil – Traunwalchen",
    "Martin Schneider – Traunreut",
    "Frei 2",
  ],
};

// === SPIELPAARE GENERIEREN ===
function generiereSpiele(gruppe) {
  const spiele = [];
  const teams = gruppen[gruppe];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      spiele.push({ teamA: teams[i], teamB: teams[j], punkteA: '', punkteB: '' });
    }
  }
  return spiele;
}

// === TABELLE INITIALISIEREN ===
function initialisiereTabelle(teams) {
  return teams.map(team => ({
    name: team,
    spiele: 0,
    siege: 0,
    punkte: 0,
  }));
}

// === ERGEBNIS EINTRAGEN & WERTEN ===
function werteSpiele(spiele, tabelle, gruppeKey) {
  spiele.forEach((spiel, index) => {
    const punkteA = parseInt(spiel.punkteA);
    const punkteB = parseInt(spiel.punkteB);
    if (isNaN(punkteA) || isNaN(punkteB)) return;

    const teamA = tabelle.find(t => t.name === spiel.teamA);
    const teamB = tabelle.find(t => t.name === spiel.teamB);

    teamA.spiele++; teamB.spiele++;

    if (punkteA > punkteB) {
      teamA.siege++; teamA.punkte += 2;
    } else if (punkteB > punkteA) {
      teamB.siege++; teamB.punkte += 2;
    }
  });

  // nach Punkte und Siege sortieren
  tabelle.sort((a, b) =>
    b.punkte !== a.punkte ? b.punkte - a.punkte : b.siege - a.siege
  );
}

// === SPIELPLAN GENERIEREN ===
function renderSpielplan(gruppeKey) {
  const spiele = generiereSpiele(gruppeKey);
  const container = document.getElementById(`spiele${gruppeKey}`);
  container
