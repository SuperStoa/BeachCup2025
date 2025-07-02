const teams = [
  { name: "SuperSTOAs 1", logo: "logos/team1.png" },
  { name: "SuperSTOAS 2", logo: "logos/team2.png" },
  { name: "SuperSTOAs 3", logo: "logos/team3.png" },
  { name: "Mila Superstar – TSV Palling", logo: "logos/team4.png" },
  { name: "Geile Reichenhaller – TSV Bad Reichenhall", logo: "logos/team5.png" },
  { name: "Oaschlecker – Traunreut", logo: "logos/team6.png" },
  { name: "Leider geil – TSV Traunwalchen", logo: "logos/team7.png" },
  { name: "Beachbuddies – Wolfgang Lisowski", logo: "logos/team8.png" },
  { name: "Ein Team von Martin Schneider – Traunreut", logo: "logos/team9.png" },
  { name: "Meine Volksbank-Raiffeisenbank eG", logo: "logos/team10.png" },
  { name: "Frei 1", logo: "logos/team11.png" },
  { name: "Frei 2", logo: "logos/team12.png" }
];

const startzeit = new Date(2025, 6, 5, 10, 0); // 5. Juli 2025 – 10:00 Uhr
const minutenProSpiel = 20;

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getZeitString(index) {
  const zeit = new Date(startzeit.getTime() + index * minutenProSpiel * 60000);
  return zeit.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function generateSpielplan() {
  const spiele = [];
  const alleTeams = shuffle([...teams]);
  const spieleProRunde = 4;
  let spielNr = 1;
  let runde = 0;

  while (alleTeams.length >= 4) {
    const spieler = alleTeams.splice(0, 4);
    const schiris = alleTeams.slice(0, 2);
    spiele.push({
      spielNr,
      zeit: getZeitString(runde),
      feld: "Feld 1",
      teamA: spieler[0],
      teamB: spieler[1],
      schiri: schiris[0]?.name || "n. a."
    });
    spielNr++;
    spiele.push({
      spielNr,
      zeit: getZeitString(runde),
      feld: "Feld 2",
      teamA: spieler[2],
      teamB: spieler[3],
      schiri: schiris[1]?.name || "n. a."
    });
    spielNr++;
    runde++;
    alleTeams.push(...spieler); // für Rotation
  }

  return spiele;
}

function ergebnisInput(spielId, team) {
  const input = document.createElement("input");
  input.type = "number";
  input.min = 0;
  input.value = localStorage.getItem(`${spielId}_${team}`) || "";
  input.onchange = () => localStorage.setItem(`${spielId}_${team}`, input.value);
  return input;
}

function teamZelle(team) {
  return `<img src="${team.logo}" class="team-logo" alt=""> ${team.name}`;
}

function renderSpielplan() {
  const spiele = generateSpielplan();
  const tbody = document.getElementById("spielplan-body");

  spiele.forEach(spiel => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${spiel.spielNr}</td>
      <td>${spiel.zeit}</td>
      <td>${spiel.feld}</td>
      <td>${teamZelle(spiel.teamA)}</td>
      <td></td>
      <td>${teamZelle(spiel.teamB)}</td>
      <td></td>
      <td>${spiel.schiri}</td>
    `;
    const tdPunkteA = document.createElement("td");
    tdPunkteA.appendChild(ergebnisInput(spiel.spielNr, "A"));
    const tdPunkteB = document.createElement("td");
    tdPunkteB.appendChild(ergebnisInput(spiel.spielNr, "B"));

    tr.children[4].replaceWith(tdPunkteA);
    tr.children[6].replaceWith(tdPunkteB);

    tbody.appendChild(tr);
  });
}

renderSpielplan();
