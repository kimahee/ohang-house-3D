(() => {
  "use strict";
  const G = window.Islands;
  const colors = [
    { name: "이끼 초록", coat: "#637d50", dark: "#40563b", light: "#a4ae76", scarf: "#dcb268" },
    { name: "감빛 주홍", coat: "#bd7156", dark: "#864c3d", light: "#d69a73", scarf: "#e1c283" },
    { name: "보리 노랑", coat: "#b99541", dark: "#76673c", light: "#d3b365", scarf: "#75958a" },
    { name: "은빛 남보라", coat: "#7d8197", dark: "#555d73", light: "#a4aac1", scarf: "#c8ac78" },
    { name: "물빛 청록", coat: "#538989", dark: "#3b6063", light: "#85ae9d", scarf: "#dfa071" }
  ];
  // Small original interface glyphs, drawn at the device's pixel density.
  const glyphs = {
    arrow: "M4 12h15m-6-6 6 6-6 6",
    back: "M20 12H5m6-6-6 6 6 6",
    book: "M3 5q5-2 9 1 4-3 9-1v14q-5-2-9 1-4-3-9-1z M12 6v14",
    map: "M2 5l6-2 8 3 6-2v15l-6 2-8-3-6 2z M8 3v15 M16 6v15",
    pin: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
    mute: "M3 9h4l5-4v14l-5-4H3z M16 9l5 6m0-6-5 6",
    sound: "M3 9h4l5-4v14l-5-4H3z M16 8q5 4 0 8 M19 5q8 7 0 14",
    people:
      "M15 21v-2q0-4-6-4t-6 4v2 M12 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0 M16 4q6 .2 4 5-.6 1.4-2 2 M17 15q5 0 5 5",
    wave: "M7 12 5 9Q3 7 2 9t2 5l3 5q4 4 8 2 5-2 5-8l-1-6q-1-2-2 0v4l-2-8q-1-2-2 0l1 7-3-8q-2-2-2 1l2 8-4-7q-2-1-2 2z",
    seat: "M4 13h16v3H4z M6 5h12v5H6z M7 10v3m10-3v3 M6 16v4m12-4v4",
    chat: "M21 11q0 7-9 7H8l-5 3 1-6q-2-2-2-5 0-7 10-7t9 8z",
    move: "M12 2v20 M2 12h20 M9 5l3-3 3 3 M9 19l3 3 3-3 M5 9l-3 3 3 3 M19 9l3 3-3 3",
    send: "M3 11 21 3l-6 18-4-7z M11 14l10-11",
    camera: "M3 7h4l2-3h6l2 3h4v13H3z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    close: "M5 5l14 14 M19 5 5 19",
    walk: "M13 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4 M7 12l3-3 4 1 3 4h3 M12 10l-1 6-5 5 M11 15l5 2 1 5",
    chevron: "m9 5 7 7-7 7"
  };
  function paintIcons(root = document) {
    root.querySelectorAll("i[data-icon]").forEach((i) => {
      const path = glyphs[i.dataset.icon];
      if (!path || i.dataset.drawn === i.dataset.icon) return;
      const c = document.createElement("canvas");
      c.width = c.height = 48;
      c.setAttribute("aria-hidden", "true");
      const ctx = c.getContext("2d");
      ctx.scale(2, 2);
      ctx.lineCap = ctx.lineJoin = "round";
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = getComputedStyle(i).color;
      ctx.stroke(new Path2D(path));
      i.replaceChildren(c);
      i.dataset.drawn = i.dataset.icon;
    });
  }
  function ellipse(ctx, x, y, rx, ry, color) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  function path(ctx, shape, color, outline, width = 1.2) {
    const p = new Path2D(shape);
    if (color) {
      ctx.fillStyle = color;
      ctx.fill(p);
    }
    if (outline) {
      ctx.strokeStyle = outline;
      ctx.lineWidth = width;
      ctx.stroke(p);
    }
  }
  // A felt cap, a short cloak and a little shoulder bag form the island walker.
  function character(ctx, color, face = 1, pose = "idle", time = 0) {
    const s = colors[color] || colors[0],
      line = "#474739";
    const step = pose === "walk" ? Math.sin(time * 0.016) : 0;
    ctx.save();
    ctx.lineJoin = ctx.lineCap = "round";
    ellipse(ctx, 20, 46, 12.5, 2.5, "#3a493234");
    ctx.translate(20, 0);
    ctx.scale(face === -1 ? -1 : 1, 1);
    ctx.translate(-20, 0);
    const sitting = pose === "sit";
    ctx.translate(0, sitting ? 4 : -Math.abs(step) * 1.4);
    ellipse(ctx, 15, sitting ? 39 : 44 + step * 1.4, 3.6, 2.2, "#514737");
    ellipse(ctx, 25, sitting ? 39 : 44 - step * 1.4, 3.8, 2.2, "#514737");
    path(ctx, "M13 28Q20 24 26 29L30 39Q21 44 10 39Z", s.coat, s.dark);
    path(ctx, "M13 31Q8 32 7 37Q8 40 11 37L15 33", s.light, s.dark);
    if (pose === "wave") {
      ctx.save();
      ctx.translate(27, 30);
      ctx.rotate(Math.sin(time * 0.018) * 0.24);
      path(ctx, "M-2 2Q0-3 3-7Q5-9 7-7L6-4Q7-2 5 1L2 5Z", s.light, s.dark);
      ctx.restore();
    } else if (pose === "clap") {
      const gap = (1 + Math.sin(time * 0.024)) * 2;
      path(ctx, "M11 31q5 0 9 3l-1 3q-6-1-9-3z", s.light, s.dark, 0.8);
      path(ctx, "M27 29q5 4-3 8l-3-2 4-6z", s.coat, s.dark, 0.8);
      ellipse(ctx, 20 - gap, 33, 2.4, 2.2, "#efc59c");
      ellipse(ctx, 22 + gap, 32.5, 2.4, 2.2, "#efc59c");
    } else {
      path(ctx, "M26 30q6 2 5 7-2 3-4 0l-3-5", s.coat, s.dark);
    }
    path(ctx, "M12 18Q11 11 20 11T30 20L29 25Q27 30 20 30T11 24Z", "#f0cba1", line);
    path(ctx, "M11 20Q11 16 16 16l-1 6-2-1-1 3-2-2z", "#514638");
    ellipse(ctx, 20, 22, 0.95, 1.4, line);
    ellipse(ctx, 26.5, 21.8, 0.85, 1.35, line);
    ellipse(ctx, 17, 24, 1.8, 0.9, "#dc9f83");
    ellipse(ctx, 28.2, 23.6, 1.3, 0.8, "#dc9f83");
    path(ctx, "M22 25q1.1 1 2.5-.1", null, "#987459", 0.75);
    path(ctx, "M8 18Q8 7 18 5q8-2 12 7l2 5-13 3z", s.coat, s.dark);
    path(ctx, "M5.5 18q10-5 23-4 6 0 6 2-3 4-18 5-9 1-11-1z", s.light, s.dark, 1.05);
    path(ctx, "M18 7Q12 6 12 2q6-1 8 5z", "#b8b980", s.dark, 0.75);
    path(ctx, "M20 7q2-7 7-5 0 4-7 5z", "#86a46a", s.dark, 0.75);
    path(ctx, "M13 28q7 3 15-1l.8 3q-7 4-16 1z", s.scarf, s.dark, 0.7);
    path(ctx, "m23 31 3-1 1 7-4-1z", s.scarf, s.dark, 0.7);
    path(ctx, "M13 31l13 9", null, "#8e6c47", 1.5);
    path(ctx, "M22 36q3-1 6 0l-.3 5q-3 2-6-.2z", "#b68959", "#795e40", 0.8);
    ctx.restore();
  }
  function avatarCanvas() {
    const c = document.createElement("canvas");
    c.width = 100;
    c.height = 125;
    return c;
  }
  function paintAvatar(c, color, face, pose, t) {
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    ctx.scale(c.width / 40, c.height / 50);
    character(ctx, color, face, pose, t);
    ctx.restore();
  }
  function bench(ctx, x, y, flat = false) {
    ctx.save();
    ctx.translate(x, y);
    ellipse(ctx, 0, 4, 32, 6, "#394c3429");
    path(ctx, "M-25-3h4v10h-4z M19-3h4v10h-4z", "#765a3b", "#5d5038", 1);
    if (!flat)
      path(
        ctx,
        "M-22-19h3v18h-3z M18-19h3v18h-3z M-27-19h53v5h-53z M-27-12h53v4h-53z",
        "#b69b6a",
        "#6f6348",
        1
      );
    path(ctx, "M-24-6h48l4 6h-57z", "#d1ab70", "#796548", 1);
    path(ctx, "M-28 0h56v3h-56z", "#9e7f54", "#736047", 0.8);
    path(ctx, "M-21-4h40", null, "#aa8659", 0.6);
    ctx.restore();
  }
  function sign(ctx, x, y, color) {
    ctx.save();
    ctx.translate(x, y);
    ellipse(ctx, 1, 1, 9, 2.4, "#38423529");
    path(ctx, "M-2-20h4V1h-4z", "#9c7851", "#705b40", 0.8);
    path(ctx, "M-11-24H7l6 4-6 4h-18z", "#f2d79d", "#786541", 0.85);
    path(ctx, "M-6-20h12m-3-2 3 2-3 2", null, color, 1);
    ctx.restore();
  }
  function scenery(canvas, map) {
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(canvas.width / 1000, canvas.height / 750);
    if (map.bridge) {
      const [x, y, w] = map.bridge;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = "#5e66534d";
      ctx.fillRect(-w / 2 + 2, -8, w, 26);
      for (let i = 0; i < w; i += 7) {
        ctx.fillStyle = i % 2 ? "#c8a47a" : "#d1af80";
        ctx.fillRect(-w / 2 + i, -9, 6.5, 19);
      }
      for (const h of [-10, 10]) {
        ctx.strokeStyle = "#857254";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-w / 2, h - 3);
        ctx.quadraticCurveTo(0, h + 1, w / 2, h - 3);
        ctx.stroke();
        for (const k of [-w / 2, -w / 4, 0, w / 4, w / 2]) {
          ctx.fillStyle = "#8f7455";
          ctx.fillRect(k - 1.3, h - 5, 2.6, 7);
        }
      }
      ctx.restore();
    }
    [map.main, map.quiet].forEach((p, i) => bench(ctx, p[0], p[1], !i && map.han === "土"));
    sign(ctx, map.spawn[0] - 24, map.spawn[1] - 10, map.color);
  }
  G.art = { colors, paintIcons, avatarCanvas, paintAvatar, character, scenery };
})();
