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

const spieleProRunde = 4; // 4 Teams aktiv → 2 Spiele
const startzeit = new Date(2025, 6, 5, 9, 0); // z. B. 5. Juli 2025, 09:00 Uhr
const intervallMin = 20;

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getTimeSlot(i) {
  const d = new Date(startzeit.getTime() + i * intervallMin * 60000);
  return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function generateRounds() {
  const rounds = [];
  const teamPool = [...teams];
  const totalRounds = Math.floor(teamPool.length / spieleProRunde) * 3;

  for (let r = 0; r < totalRounds; r++) {
    const round = { matches: [], schiris: [] };
    const pool = shuffle(teamPool);
    const aktive = pool.slice(0, spieleProRunde);
    const schiris = pool.slice(spieleProRunde, spieleProRunde + 2);
    round.schiris = schiris.map(t => t.name);

    round.matches.push({
      t1: aktive[0],
      t2: aktive[1],
      field: "Feld 1"
    });
    round.matches.push({
      t1: aktive[2],
      t2: aktive[3],
      field: "Feld 2"
    });

    rounds.push(round);
  }
  return rounds;
}

function createInput(id) {
  const saved = localStorage.getItem(id) || "";
  const input = document.createElement("input");
  input.type = "number";
  input.value = saved;
  input.onchange = () => localStorage.setItem(id, input.value);
  input.min = 0;
  return input;
}

function renderSchedule() {
  const tbody = document.getElementById("spielplan-body");
  const rounds = generateRounds();

  rounds.forEach((runde, i) => {
    const tr = document.createElement("tr");

    const timeCell = document.createElement("td");
    timeCell.textContent = getTimeSlot(i);
    tr.appendChild(timeCell);

    runde.matches.forEach((match, idx) => {
      const td = document.createElement("td");
      const teamLogoHTML = team =>
        `<img src="${team.logo}" class="team-logo" alt=""> ${team.name}`;
      td.innerHTML = `${teamLogoHTML(match.t1)}<br>vs<br>${teamLogoHTML(match.t2)}`;
      tr.appendChild(td);

      const resultCell = document.createElement("td");
      resultCell.appendChild(createInput(`runde${i}_spiel${idx}_t1`));
      resultCell.appendChild(document.createTextNode(" : "));
      resultCell.appendChild(createInput(`runde${i}_spiel${idx}_t2`));
      tr.appendChild(resultCell);
    });

    const schiriCell = document.createElement("td");
    schiriCell.innerHTML = runde.schiris.join("<br>");
    tr.appendChild(schiriCell);

    tbody.appendChild(tr);
  });

  renderKO(); // vorerst leer / Erweiterung folgt
}

function renderKO() {
  const koDiv = document.getElementById("ko-baum");
  koDiv.innerHTML = `<p>⚠️ KO-Baum wird erstellt, sobald Gruppenergebnisse vollständig sind.</p>`;
}

renderSchedule();
