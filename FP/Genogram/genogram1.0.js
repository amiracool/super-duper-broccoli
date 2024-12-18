const canvas = document.getElementById("genogramCanvas");
const ctx = canvas.getContext("2d");

let nodes = [];
let relationships = [];
let selectedNode = null;
let dragStart = null;

// Utility: Draw all elements
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw relationships
  relationships.forEach(rel => {
    const source = nodes.find(n => n.id === rel.source);
    const target = nodes.find(n => n.id === rel.target);

    if (source && target) {
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.moveTo(source.x, source.y); // Start at the source node
      ctx.lineTo(target.x, source.y); // Horizontal to target
      ctx.lineTo(target.x, target.y); // Drop down to target node
      ctx.stroke();
    }
  });

  // Draw nodes
  nodes.forEach(node => {
    ctx.beginPath();
    // Draw shapes
    if (node.gender === "M") {
      ctx.rect(node.x - 20, node.y - 20, 40, 40); // Square for males
    } else if (node.gender === "F") {
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2); // Circle for females
    } else {
      ctx.moveTo(node.x, node.y - 20);
      ctx.lineTo(node.x + 20, node.y + 20);
      ctx.lineTo(node.x - 20, node.y + 20);
      ctx.closePath(); // Diamond for other
    }

    // Fill and stroke
    ctx.fillStyle = "lightblue";
    ctx.fill();
    ctx.stroke();

    // Add cross-out for deceased
    if (node.deceased) {
      ctx.beginPath();
      ctx.moveTo(node.x - 25, node.y - 25);
      ctx.lineTo(node.x + 25, node.y + 25);
      ctx.moveTo(node.x + 25, node.y - 25);
      ctx.lineTo(node.x - 25, node.y + 25);
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.strokeStyle = "black"; // Reset
    }

    // Add text BELOW the shape
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "12px Arial";
    ctx.fillText(node.name, node.x, node.y + 30); // Name below shape
    ctx.fillText(`Age: ${node.age}`, node.x, node.y + 45);
    if (node.health) {
      ctx.fillText(node.health, node.x, node.y + 60);
    }
  });
}

// Add a new node
document.getElementById("add-node").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const health = document.getElementById("health").value;
  const deceased = document.getElementById("deceased").checked;
  const gender = document.getElementById("gender").value;

  if (!name) return alert("Name is required.");

  nodes.push({
    id: Date.now(),
    name,
    age: age || "N/A",
    health,
    deceased,
    gender,
    x: Math.random() * 900 + 50,
    y: Math.random() * 500 + 50
  });
  drawCanvas();
});

// Handle mouse events for drag-and-drop
canvas.addEventListener("mousedown", e => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  // Check if user clicks on a node
  selectedNode = nodes.find(n => Math.hypot(n.x - mouseX, n.y - mouseY) < 25);
  if (selectedNode) {
    dragStart = { x: mouseX, y: mouseY };
  }
});

canvas.addEventListener("mousemove", e => {
  if (dragStart && selectedNode) {
    selectedNode.x += e.offsetX - dragStart.x;
    selectedNode.y += e.offsetY - dragStart.y;
    dragStart = { x: e.offsetX, y: e.offsetY };
    drawCanvas();
  }
});

canvas.addEventListener("mouseup", () => {
  selectedNode = null;
  dragStart = null;
});

// Add a relationship between two nodes
document.getElementById("relationship-type").addEventListener("change", () => {
  const sourceName = prompt("Enter Source Node Name:");
  const targetName = prompt("Enter Target Node Name:");
  const sourceNode = nodes.find(n => n.name === sourceName);
  const targetNode = nodes.find(n => n.name === targetName);

  if (sourceNode && targetNode) {
    relationships.push({ source: sourceNode.id, target: targetNode.id });
    drawCanvas();
  } else {
    alert("Invalid node names.");
  }
});

// Export the canvas
document.getElementById("export").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "genogram.png";
  link.href = canvas.toDataURL();
  link.click();
});

// Initial draw
drawCanvas();
let relationshipStart = null; // Track the start of a relationship
let isDraggingNode = false;   // Track whether a node is being dragged
let dragNode = null;          // The node currently being dragged

// Add a new node
document.getElementById("add-node").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const health = document.getElementById("health").value;
  const deceased = document.getElementById("deceased").checked;
  const gender = document.getElementById("gender").value;

  if (!name) return alert("Name is required.");

  nodes.push({
    id: Date.now(),
    name,
    age: age || "N/A",
    health,
    deceased,
    gender,
    x: Math.random() * 900 + 50,
    y: Math.random() * 500 + 50,
  });

  drawCanvas();
});

// Handle mouse down for dragging or relationship creation
canvas.addEventListener("mousedown", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  // Check if clicking on a node
  const clickedNode = nodes.find((n) => Math.hypot(n.x - mouseX, n.y - mouseY) < 25);

  if (clickedNode) {
    if (e.shiftKey) {
      // Shift + Click starts a relationship
      relationshipStart = clickedNode;
    } else {
      // Regular click starts dragging the node
      isDraggingNode = true;
      dragNode = clickedNode;
    }
  }
});

// Handle mouse move for dragging or showing temporary relationship
canvas.addEventListener("mousemove", (e) => {
  if (isDraggingNode && dragNode) {
    // Update node position while dragging
    dragNode.x = e.offsetX;
    dragNode.y = e.offsetY;
    drawCanvas();
  } else if (relationshipStart) {
    // Show a temporary relationship line
    drawCanvas();
    ctx.beginPath();
    ctx.moveTo(relationshipStart.x, relationshipStart.y);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
});

// Handle mouse up to finalize drag or create relationships
canvas.addEventListener("mouseup", (e) => {
  if (isDraggingNode) {
    // Stop dragging
    isDraggingNode = false;
    dragNode = null;
  } else if (relationshipStart) {
    // Finalize a relationship
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    const relationshipEnd = nodes.find(
      (n) => Math.hypot(n.x - mouseX, n.y - mouseY) < 25 && n !== relationshipStart
    );

    if (relationshipEnd) {
      // Add the relationship
      relationships.push({ source: relationshipStart.id, target: relationshipEnd.id });
    }

    relationshipStart = null; // Reset the relationship state
  }

  drawCanvas();
});
