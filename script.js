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
// === KO-PHASE STARTEN ===
function starteKOPhase() {
  const top4A = gespeicherteTabelle("A").slice(0, 4);
  const top4B = gespeicherteTabelle("B").slice(0, 4);
  const low2A = gespeicherteTabelle("A").slice(4, 6);
  const low2B = gespeicherteTabelle("B").slice(4, 6);

  const viertel = [
    [top4A[0].name, top4B[3].name],
    [top4A[1].name, top4B[2].name],
    [top4B[1].name, top4A[2].name],
    [top4B[0].name, top4A[3].name],
  ];

  const platzierung = [
    [low2A[0].name, low2B[0].name], // Spiel um Platz 11
    [low2A[1].name, low2B[1].name], // Spiel um Platz 9
  ];

  renderKO("viertelfinale", viertel, "Halbfinale", "halbfinale", "Finale", "finalspiele");
  renderPlatzierung("platzierung", platzierung);
}

// === HILFSFUNKTION – Tabelle aus DOM ziehen ===
function gespeicherteTabelle(gruppeKey) {
  const tab = [];
  const zeilen = document.querySelectorAll(`#tabelle${gruppeKey} tr`);
  zeilen.forEach((tr, i) => {
    if (i === 0) return; // skip header
    const tds = tr.querySelectorAll("td");
    tab.push({
      platz: parseInt(tds[0].textContent),
      name: tds[1].textContent,
      spiele: parseInt(tds[2].textContent),
      siege: parseInt(tds[3].textContent),
      punkte: parseInt(tds[4].textContent),
    });
  });
  return tab;
}

// === RENDER-FUNKTIONEN ===
function renderKO(containerId, paarungen, halbTitel, halbId, finaleTitel, finaleId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<tr><th colspan="4">Viertelfinale</th></tr>`;
  paarungen.forEach(([teamA, teamB], i) => {
    container.innerHTML += `
      <tr>
        <td>${teamA}</td>
        <td><input type="number" id="vf${i}a" /></td>
        <td>${teamB}</td>
        <td><input type="number" id="vf${i}b" /></td>
      </tr>`;
  });

  // hier könntest du auch automatisch Halbfinale füllen, wenn Scores eingetragen werden etc.
}

function renderPlatzierung(containerId, paarungen) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<tr><th colspan="4">Platzierungsspiele</th></tr>`;
  paarungen.forEach(([teamA, teamB], i) => {
    container.innerHTML += `
      <tr>
        <td>${teamA}</td>
        <td><input type="number" /></td>
        <td>${teamB}</td>
        <td><input type="number" /></td>
      </tr>`;
  });
}
