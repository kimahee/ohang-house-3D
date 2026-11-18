(() => {
  "use strict";
  const G = window.Islands;
  const designs = {
    wood: { name: "새잎 오두막", note: "잎빛 지붕 아래 나무 기둥을 세우고 초록 덩굴을 둘렀어요." },
    fire: { name: "노을 벽돌집", note: "주홍 기와와 도톰한 굴뚝 사이로 둥근 창에 불빛이 어려요." },
    earth: { name: "보리 흙집", note: "둥근 황토 벽에 볏짚 지붕을 얹고 문 옆에 작은 항아리를 두었어요." },
    metal: { name: "은빛 공방", note: "은빛 금속 지붕과 반듯한 돌벽에 톱니 모양 창틀을 달았어요." },
    water: { name: "물결 처마집", note: "물결처럼 휜 청록 처마 아래 작은 툇마루와 파란 문이 있어요." }
  };
  const errors = {
    HOME_GROUND: "물가와 절벽을 피해 집이 들어갈 만큼 넓은 땅을 골라 주세요.",
    HOME_PATH: "섬 입구와 벤치, 다리 앞은 주민이 오갈 수 있게 비워 두어요.",
    HOME_NEIGHBOR: "이웃집과 너무 가까워요. 조금 더 떨어진 곳을 골라 주세요.",
    HOME_RESIDENT: "그 자리에 주민이 있어요. 잠깐 기다리거나 자리를 옮겨 보세요."
  };
  const snap = (v, limit) => Math.max(5, Math.min(limit - 5, Math.floor(v / 10) * 10 + 5));
  const image = (kind) => G.homeImages?.[kind] || "./assets/houses/" + kind + ".webp";
  function problem(map, ground, x, y, neighbors, residents) {
    if (
      !Number.isInteger(x) ||
      !Number.isInteger(y) ||
      x % 10 !== 5 ||
      y % 10 !== 5 ||
      x < 35 ||
      x > 965 ||
      y < 35 ||
      y > 735
    )
      return "HOME_GROUND";
    for (let dy = -30; dy <= 10; dy += 10)
      for (let dx = -30; dx <= 30; dx += 10) if (!ground.allows(x + dx, y + dy)) return "HOME_GROUND";
    const near = (point, dx, dy) => Math.abs(point[0] - x) < dx && Math.abs(point[1] - y) < dy;
    if (
      near(map.spawn, 78, 56) ||
      map.seats.some((point) => near(point, 60, 56)) ||
      (map.bridge && near(map.bridge, 115, 53))
    )
      return "HOME_PATH";
    if (neighbors.some((h) => Math.abs(h.x - x) < 90 && Math.abs(h.y - y) < 60)) return "HOME_NEIGHBOR";
    if (residents.some((p) => Math.abs(p.x - x) < 42 && p.y >= y - 40 && p.y <= y + 8))
      return "HOME_RESIDENT";
    return "";
  }
  function suggest(map, ground, near, neighbors, residents) {
    // Pick the nearest valid cell centre to the requested part of the island.
    let bestDistance = Infinity,
      best = null;
    for (let y = 35; y <= 735; y += 10) {
      for (let x = 35; x <= 965; x += 10) {
        const distance = (near[0] - x) ** 2 + (near[1] - y) ** 2;
        if (distance >= bestDistance || problem(map, ground, x, y, neighbors, residents)) continue;
        bestDistance = distance;
        best = [x, y];
      }
    }
    return best;
  }
  G.homes = { designs, errors, snap, image, problem, suggest };
})();
