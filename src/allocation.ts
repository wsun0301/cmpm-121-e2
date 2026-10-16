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
  ShiftResult: ShiftResult = {
    assignedProducers,
    production: 0,
    consumption: 0,
    balance: 0,
  },
) {
  const production = ShiftResult.assignedProducers * 3;
  const consumption = 6;
  const balance = production - consumption;
  return {
    shiftResult: {
      assignedProducers: ShiftResult.assignedProducers,
      production,
      consumption,
      balance,
    },
  };
}

function drawCrewAssignments(numProducers: number = assignedProducers) {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < numProducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < numProducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function drawSupplyChart() {
  const { shiftResult: { production, consumption, balance } } =
    calculateSupplies();
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${assignedProducers} / 6`, 18, 76);
  ctx.fillText(`Production: ${production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);
  readout.textContent =
    `Assigned: ${assignedProducers}/6 · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

function updateAllocationDisplay() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewAssignments();
  drawSupplyChart();
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
