(() => {
  "use strict";
  const W = 100,
    H = 75,
    CELL = 10;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1]
  ];
  class Terrain {
    constructor(map) {
      this.bytes = Uint8Array.from(atob(map.mask), (c) => c.charCodeAt(0));
    }
    cell(x, y) {
      if (x < 0 || y < 0 || x >= W || y >= H) return false;
      const bit = y * W + x;
      return Boolean(this.bytes[bit >> 3] & (128 >> bit % 8));
    }
    allows(x, y) {
      return this.cell(Math.floor(x / CELL), Math.floor(y / CELL));
    }
    // A short line-of-sight test also prevents diagonal corner cutting during smoothing.
    segment(x, y, tx, ty) {
      const n = Math.ceil(Math.hypot(tx - x, ty - y) / 3) || 1;
      let ox = x,
        oy = y;
      for (let i = 1; i <= n; i++) {
        const nx = x + ((tx - x) * i) / n,
          ny = y + ((ty - y) * i) / n;
        if (!this.allows(nx, ny) || !this.allows(ox, ny) || !this.allows(nx, oy)) return false;
        ox = nx;
        oy = ny;
      }
      return true;
    }
    route(x, y, tx, ty) {
      if (!this.allows(tx, ty)) return null;
      if (this.segment(x, y, tx, ty)) return [[tx, ty]];
      const ax = Math.floor(x / CELL),
        ay = Math.floor(y / CELL);
      const start = ay * W + ax,
        goal = Math.floor(ty / CELL) * W + Math.floor(tx / CELL);
      const parent = new Int16Array(W * H);
      parent.fill(-1);
      parent[start] = start;
      const queue = new Int16Array(W * H);
      queue[0] = start;
      let head = 0,
        tail = 1;
      while (head < tail && parent[goal] === -1) {
        const id = queue[head++],
          cx = id % W,
          cy = Math.floor(id / W);
        for (const [dx, dy] of directions) {
          const nx = cx + dx,
            ny = cy + dy,
            next = ny * W + nx;
          if (!this.cell(nx, ny) || parent[next] !== -1) continue;
          if (dx && dy && (!this.cell(cx + dx, cy) || !this.cell(cx, cy + dy))) continue;
          parent[next] = id;
          queue[tail++] = next;
        }
      }
      if (parent[goal] === -1) return null;
      const cells = [];
      for (let i = goal; i !== start; i = parent[i])
        cells.push([((i % W) + 0.5) * CELL, (Math.floor(i / W) + 0.5) * CELL]);
      cells.reverse();
      cells.push([tx, ty]);
      const result = [];
      let px = x,
        py = y,
        at = 0;
      while (at < cells.length) {
        let end = at;
        while (end + 1 < cells.length && this.segment(px, py, ...cells[end + 1])) end++;
        [px, py] = cells[end];
        result.push([px, py]);
        at = end + 1;
      }
      return result;
    }
  }
  window.Islands.Terrain = Terrain;
})();
