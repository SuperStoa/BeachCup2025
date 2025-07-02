const gruppen = {
  A: ["SuperSTOAs 1", "Mila Superstar – Palling", "Oaschlecker – Traunreut", "Beachbuddies – Lisowski", "Meine Volksbank", "Frei 1"],
  B: ["SuperSTOAs 2", "SuperSTOAs 3", "Geile Reichenhaller", "Leider geil – Traunwalchen", "Martin Schneider – Traunreut", "Frei 2"]
};

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

function initialisiereTabelle(teams) {
  return teams.map(team => ({ name: team, spiele: 0, siege: 0, punkte: 0 }));
}

function werteSpiele(spiele, tabelle) {
  spiele.forEach((spiel, index) => {
    const punkteA = parseInt(spiel.punkteA);
    const punkteB = parseInt(spiel.punkteB);
    if (isNaN(punkteA) || isNaN(punkteB)) return;

    const teamA = tabelle.find(t => t.name === spiel.teamA);
    const teamB = tabelle.find(t => t.name === spiel.teamB);

    teamA.spiele++; teamB.spiele++;

    if (punkteA > punkteB) {
      teamA.siege++; teamA.punkte += 2;
    } else {
      teamB.siege++; teamB.punkte += 2;
    }
  });

  tabelle.sort((a, b) => b.punkte !== a.punkte ? b.punkte - a.punkte : b.siege - a.siege);
}

function renderSpielplan(gruppeKey) {
  const spiele = generiereSpiele(gruppeKey);
  const container = document.getElementById(`spiele${gruppeKey}`);
  container.innerHTML = "";

  spiele.forEach((spiel, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${spiel.teamA}</td>
      <td><input type="number" id="${gruppeKey}-a-${index}" /></td>
      <td>${spiel.teamB}</td>
      <td><input type="number" id="${gruppeKey}-b-${index}" /></td>`;
    container.appendChild(row);
  });

  const button = document.createElement("button");
  button.textContent = `Gruppe ${gruppeKey}: Auswerten`;
  button.onclick = () => {
    spiele.forEach((spiel, index) => {
      spiel.punkteA = document.getElementById(`${gruppeKey}-a-${index}`).value;
      spiel.punkteB = document.getElementById(`${gruppeKey}-b-${index}`).value;
    });
    const tabelle = initialisiereTabelle(gruppen[gruppeKey]);
    werteSpiele(spiele, tabelle);
    renderTabelle(gruppeKey, tabelle);
  };
  container.parentElement.appendChild(button);
}

function renderTabelle(gruppeKey, tabelle) {
  const tableBody = document.getElementById(`tabelle${gruppeKey}`);
  tableBody.innerHTML = `<tr><th>Platz</th><th>Team</th><th>Spiele</th><th>Siege</th><th>Punkte</th></tr>`;
  tabelle.forEach((team, index) => {
    tableBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${team.name}</td>
        <td>${team.spiele}</td>
        <td>${team.siege}</td>
        <td>${team.punkte}</td>
      </tr>`;
  });
}

function gespeicherteTabelle(gruppeKey) {
  const tab = [];
  const rows = document.querySelectorAll(`#tabelle${gruppeKey} tr`);
  rows.forEach((row, i) => {
    if (i === 0) return;
    const tds = row.querySelectorAll("td");
    tab.push({
      name: tds[1].textContent,
      spiele: parseInt(tds[2].textContent),
      siege: parseInt(tds[3].textContent),
      punkte: parseInt(tds[4].textContent)
    });
  });
  return tab;
}

function starteKOPhase() {
  const top4A = gespeicherteTabelle("A").slice(0, 4);
  const top4B = gespeicherteTabelle("B").slice(0, 4);
  const low2A = gespeicherteTabelle("A").slice(4);
  const low2B = gespeicherteTabelle("B").slice(4);

  const vf = [
    [top4A[0].name, top4B[3].name],
    [top4A[1].name, top4B[2].name],
    [top4B[1].name, top4A[2].name],
    [top4B[0].name, top4A[3].name]
  ];

  const platzierung = [
    [low2A[0]?.name || "-", low2B[0]?.name || "-"],
    [low2A[1]?.name || "-", low2B[1]?.name || "-"]
  ];

  renderBracket(top4A.map(t=>t.name
