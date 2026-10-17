export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

let x = 2;
let y = 2;
let direction = 0;

type Command = {
  label: "Forward" | "Right";
  execute: () => void;
};
const commandQueue: Command[] = [];

function enqueueCommand(command: Command) {
  commandQueue.push(command);
  updateQueueDisplay();
}

type DirectionRecord = {
  name: string;
  dx: number;
  dy: number;
};
const directions: DirectionRecord[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

function updateQueueDisplay() {
  pendingList.replaceChildren();
  commandQueue.forEach((command) => {
    const li = document.createElement("li");
    li.textContent = command.label;
    pendingList.appendChild(li);
  });
  if (commandQueue.length === 0) {
    queueStatus.textContent = "No pending commands";
  } else {
    queueStatus.textContent = `Pending commands: ${commandQueue.length}`;
    runButton.disabled = false;
    clearButton.disabled = false;
  }
}

function moveForward() {
  const dx = directions[direction].dx;
  const dy = directions[direction].dy;
  x = Math.max(0, Math.min(4, x + dx));
  y = Math.max(0, Math.min(4, y + dy));
}

function moveRight() {
  direction = (direction + 1) % 4;
}

const forwardCommand: Command = {
  label: "Forward",
  execute: moveForward,
};

const rightCommand: Command = {
  label: "Right",
  execute: moveRight,
};

function runCommand(command: Command) {
  command.execute();
  drawRover();
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueueCommand(forwardCommand);
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueueCommand(rightCommand);
};

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  commandQueue.length = 0;
  updateQueueDisplay();
  drawRover();
};

document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  while (commandQueue.length > 0) {
    const command = commandQueue.shift()!;
    runCommand(command);
  }
  updateQueueDisplay();
};

document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  commandQueue.length = 0;
  updateQueueDisplay();
};

drawRover();
updateQueueDisplay();
