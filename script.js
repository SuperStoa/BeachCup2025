const gruppen = {
  A: ['Team 1', 'Team 2', 'Team 3', 'Team 4'],
  B: ['Team 5', 'Team 6', 'Team 7', 'Team 8'],
  C: ['Team 9', 'Team 10', 'Team 11', 'Team 12']
};

const gruppenContainer = document.getElementById("gruppen-container");
const KO = document.getElementById("baum");

// Initialisiere Gruppen
for (const [gruppe, teams] of Object.entries(gruppen)) {
  const table = document.createElement("table");
  const head = `<thead><tr><th>Team</th><th>Punkte</th><th>Bälle</th><th>Sieg</th></tr></thead>`;
  let body = "<tbody>";

  teams.forEach((team, i) => {
    const id = `${gruppe}${i}`;
    const punkt = localStorage.getItem(`pkt_${id}`) || '';
    const ball = localStorage.getItem(`bal_${id}`) || '';
    const sieg = punkt === "15" ? "✅" : "–";

    body += `
      <tr>
        <td>${team}</td>
        <td><input type="number" min="0" max="15" id="pkt_${id}" value="${punkt}" onchange="update('${id}')"></td>
        <td><input type="number" min="0" id="bal_${id}" value="${ball}" onchange="update('${id}')"></td>
        <td id="sieg_${id}">${sieg}</td>
      </tr>`;
  });

  body += "</tbody>";
  table.innerHTML = `<caption>Gruppe ${gruppe}</caption>` + head + body;
  gruppenContainer.appendChild(table);
}

// Update-Funktion
window.update = function(id) {
  const punkte = document.getElementById("pkt_" + id).value;
  const baelle = document.getElementById("bal_" + id).value;

  localStorage.setItem(`pkt_${id}`, punkte);
  localStorage.setItem(`bal_${id}`, baelle);

  document.getElementById("sieg_" + id).textContent = (punkte == 15) ? "✅" : "–";
  renderKO();
};

function renderKO() {
  KO.innerHTML = "<h3>🏆 Turnierbaum:</h3><ul>";
  let sieger = [];

  Object.entries(gruppen).forEach(([g, teams]) => {
    for (let i = 0; i < teams.length; i++) {
      if (localStorage.getItem(`pkt_${g}${i}`) == 15) {
        sieger.push(teams[i]);
        break;
      }
    }
  });

  if (sieger.length === 3) {
    sieger.push("Wildcard-Team");

    KO.innerHTML += `
      <li>VF1: ${sieger[0]} vs ${sieger[1]}</li>
      <li>VF2: ${sieger[2]} vs ${sieger[3]}</li>
      <li>HF1: Sieger VF1 vs Sieger VF2</li>
      <li>Finale: Sieger HF1 vs ???</li>
    `;
  } else {
    KO.innerHTML += `<li>Warten auf Gruppensieger...</li>`;
  }

  KO.innerHTML += "</ul>";
}

renderKO();
