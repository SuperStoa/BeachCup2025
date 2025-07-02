const teams = [
  "SuperSTOAs 1",
  "SuperSTOAS 2",
  "SuperSTOAs 3",
  "Mila Superstar – TSV Palling",
  "Geile Reichenhaller – TSV Bad Reichenhall",
  "Oaschlecker – Traunreut",
  "Leider geil – TSV Traunwalchen",
  "Beachbuddies – Wolfgang Lisowski",
  "Ein Team von Martin Schneider – Traunreut",
  "Meine Volksbank-Raiffeisenbank eG",
  "Frei 1",
  "Frei 2"
];

// Hilfsfunktion zum Mischen
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Spielpaarungen generieren
function generateMatches(teams) {
  const matches = [];
  const shuffled = shuffle([...teams]);

  for (let i = 0; i < shuffled.length; i += 4) {
    const gruppe = shuffled.slice(i, i + 4);
    if (gruppe.length < 4) break;

    const [t1, t2, t3, t4] = gruppe;
    const rest = teams.filter(t => !gruppe.includes(t));
    const schiris = shuffle(rest).slice(0, 2).join(" & ");

    matches.push({
      feld1: `${t1} vs ${t2}`,
      feld2: `${t3} vs ${t4}`,
      schiri: schiris
    });
  }

  return matches;
}

// Tabelle befüllen
function renderMatches() {
  const tbody = document.getElementById("spielplan-body");
  const matches = generateMatches(teams);

  matches.forEach((match, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>Runde ${i + 1}</td>
      <td>${match.feld1}</td>
      <td>${match.feld2}</td>
      <td>${match.schiri}</td>
    `;
    tbody.appendChild(row);
  });
}

renderMatches();
