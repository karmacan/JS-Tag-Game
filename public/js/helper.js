function getNeighborsIds(actual, template, id) {
  // Checkc external dependencies
  if (!actual) {
    console.log('Actual dom cells not provided!');
    return null;
  }
  if (!template) {
    console.log('Template of dom cells not provided!');
    return null;
  }
  if (!id) {
    console.log('Id of dom cell not provided!');
    return null;
  }

  const neighborsIds = [];

  template.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === id) {
        // Self
        try { neighborsIds.push(template[i][j]); } catch { null }
        // l
        try { neighborsIds.push(template[i][j - 1]); } catch { null }
        // r
        try { neighborsIds.push(template[i][j + 1]); } catch { null }
        // Top
        try { neighborsIds.push(template[i - 1][j]); } catch { null }
        // tl
        try { neighborsIds.push(template[i - 1][j - 1]); } catch { null }
        // tr
        try { neighborsIds.push(template[i - 1][j + 1]); } catch { null }
        // Bottom
        try { neighborsIds.push(template[i + 1][j]); } catch { null }
        // bl
        try { neighborsIds.push(template[i + 1][j - 1]); } catch { null }
        // br
        try { neighborsIds.push(template[i + 1][j + 1]); } catch { null }
      }
    });
  });

  return neighborsIds.filter(val => val !== undefined);
}

function getNeighbors(actual, template, id) {
  const neighborsIds = getNeighborsIds(actual, template, id);
  return neighborsIds.map(val => actual[val - 1]);
}