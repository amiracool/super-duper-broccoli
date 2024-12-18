const canvas = document.getElementById('genogramCanvas');
const ctx = canvas.getContext('2d');

let nodes = [];
let selectedNode = null;
let isDragging = false;

// Add a new node
document.getElementById('add-node').addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const gender = document.getElementById('gender').value;

  if (!name) {
    alert('Name is required.');
    return;
  }

  // Add node to the canvas
  const newNode = {
    name,
    gender,
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 100,
    height: 50,
  };
  nodes.push(newNode);
  drawCanvas();
});

// Draw the canvas
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw nodes
  nodes.forEach(node => {
    ctx.beginPath();
    if (node.gender === 'M') {
      ctx.fillStyle = 'lightblue';
    } else {
      ctx.fillStyle = 'lightpink';
    }
    ctx.fillRect(node.x, node.y, node.width, node.height);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(node.x, node.y, node.width, node.height);

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(node.name, node.x + node.width / 2, node.y + node.height / 2 + 4);
    ctx.closePath();
  });
}

// Handle mouse events for dragging
canvas.addEventListener('mousedown', (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  // Check if a node is clicked
  selectedNode = nodes.find(
    node =>
      mouseX >= node.x &&
      mouseX <= node.x + node.width &&
      mouseY >= node.y &&
      mouseY <= node.y + node.height
  );

  if (selectedNode) {
    isDragging = true;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging && selectedNode) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Update node position
    selectedNode.x = mouseX - selectedNode.width / 2;
    selectedNode.y = mouseY - selectedNode.height / 2;

    drawCanvas();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  selectedNode = null;
});

// Export the canvas as an image
document.getElementById('export').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'genogram.png';
  link.href = canvas.toDataURL();
  link.click();
});
