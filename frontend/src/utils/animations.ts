
export const createNodes = (
  container: HTMLElement,
  count: number
): HTMLElement[] => {
  const nodes: HTMLElement[] = [];
  
  for (let i = 0; i < count; i++) {
    const node = document.createElement('div');
    node.classList.add('node');
    
    const x = Math.random() * container.offsetWidth;
    const y = Math.random() * container.offsetHeight;
    
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    
    container.appendChild(node);
    nodes.push(node);
  }
  
  return nodes;
};

export const createConnections = (
  container: HTMLElement,
  nodes: HTMLElement[],
  maxDistance: number
): void => {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const node1 = nodes[i];
      const node2 = nodes[j];
      
      const x1 = parseInt(node1.style.left);
      const y1 = parseInt(node1.style.top);
      const x2 = parseInt(node2.style.left);
      const y2 = parseInt(node2.style.top);
      
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      
      if (distance < maxDistance) {
        const connection = document.createElement('div');
        connection.classList.add('connection');
        
        const width = distance;
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        
        connection.style.width = `${width}px`;
        connection.style.left = `${x1}px`;
        connection.style.top = `${y1}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        
        container.appendChild(connection);
      }
    }
  }
};

export const animateNodes = (nodes: HTMLElement[]) => {
  nodes.forEach((node) => {
    const duration = 2 + Math.random() * 8;
    const xMovement = -5 + Math.random() * 10;
    const yMovement = -5 + Math.random() * 10;
    
    node.animate(
      [
        { transform: 'translate(0, 0)' },
        { transform: `translate(${xMovement}px, ${yMovement}px)` },
        { transform: 'translate(0, 0)' }
      ],
      {
        duration: duration * 1000,
        iterations: Infinity
      }
    );
  });
};
