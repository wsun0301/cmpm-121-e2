export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let assignedProducers = 2;

type ShiftResult = {
  assignedProducers: number;
  production: number;
  consumption: number;
  balance: number;
};

function calculateSupplies(
  numProducers: number,
): ShiftResult {
  const production = numProducers * 3;
  const consumption = 6;
  const balance = production - consumption;
  return {
    assignedProducers: numProducers,
    production,
    consumption,
    balance,
  };
}

function drawCrewAssignments(result: ShiftResult) {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < result.assignedProducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < result.assignedProducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function drawSupplyChart(result: ShiftResult) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${result.assignedProducers} / 6`, 18, 76);
  ctx.fillText(`Production: ${result.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, result.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${result.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, result.consumption * 14, 20);
}

function updateReadout(result: ShiftResult) {
  readout.textContent =
    `Assigned: ${result.assignedProducers}/6 · Production: ${result.production} · Consumption: ${result.consumption} · Balance: ${
      result.balance > 0 ? "+" : ""
    }${result.balance}`;
}

function updateAllocationDisplay() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const result = calculateSupplies(assignedProducers);
  drawCrewAssignments(result);
  drawSupplyChart(result);
  updateReadout(result);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedProducers = Math.max(0, assignedProducers - 1);
  updateAllocationDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedProducers = Math.min(6, assignedProducers + 1);
  updateAllocationDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedProducers = 2;
    updateAllocationDisplay();
  };
updateAllocationDisplay();
