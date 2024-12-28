// Initialize Konva Stage and Layer
const stage = new Konva.Stage({
    container: 'container',
    width: 1000,
    height: 600,
  });
  
  const layer = new Konva.Layer();
  stage.add(layer);
  
  let currentMode = null;
  
  // Add Circle Button Functionality
  document.getElementById('add-circle').addEventListener('click', () => {
    console.log("Add Circle button clicked");
    const circle = new Konva.Circle({
      x: Math.random() * 800 + 50,
      y: Math.random() * 500 + 50,
      radius: 30,
      fill: 'pink',
      draggable: true,
    });
  
    layer.add(circle);
    layer.draw();
  });
  
  // Cross Out Button Functionality
  document.getElementById('cross-out').addEventListener('click', () => {
    console.log("Cross Out button clicked");
    currentMode = 'cross-out';
  
    // Add click listener for stage
    stage.on('click', (e) => {
      if (currentMode === 'cross-out' && e.target !== stage) {
        const target = e.target;
  
        // Get the bounding box of the clicked shape
        const bounds = target.getClientRect();
  
        // Create a red cross
        const line1 = new Konva.Line({
          points: [bounds.x, bounds.y, bounds.x + bounds.width, bounds.y + bounds.height],
          stroke: 'red',
          strokeWidth: 2,
        });
  
        const line2 = new Konva.Line({
          points: [bounds.x + bounds.width, bounds.y, bounds.x, bounds.y + bounds.height],
          stroke: 'red',
          strokeWidth: 2,
        });
  
        layer.add(line1);
        layer.add(line2);
        layer.draw();
      }
    });
  });
  