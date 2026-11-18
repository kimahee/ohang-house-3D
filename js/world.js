(() => {
  "use strict";
  const G = window.Islands;
  const $ = (id) => document.getElementById(id);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const bindings = {
    ArrowLeft: [-1, 0],
    KeyA: [-1, 0],
    ArrowRight: [1, 0],
    KeyD: [1, 0],
    ArrowUp: [0, -1],
    KeyW: [0, -1],
    ArrowDown: [0, 1],
    KeyS: [0, 1]
  };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  class World {
    constructor(room, profile, ui) {
      this.room = room;
      this.map = G.maps[room];
      this.profile = profile;
      this.ui = ui;
      this.sid = G.net.uuid();
      this.live = true;
      this.keys = new Set();
      this.actors = new Map();
      this.log = [];
      this.seenMessages = new Set();
      this.blocks = [];
      this.route = [];
      this.terrain = new G.Terrain(this.map);
      this.listeners = new AbortController();
      this.camera = { left: 0, top: 0, scale: 1.35 };
      this.dims = { width: 1, height: 1 };
      this.stage = $("stage");
      this.land = $("land");
      this.actorLayer = $("actors");
      this.markerLayer = $("markers");
      this.lastFrame = 0;
      this.lastHud = 0;
      this.speechBusy = false;
      this.failures = 0;
      this.online = false;
      this.seatRevision = 0;
      this.nextSeat = null;
      this.pendingEvent = null;
      this.timer = null;
    }
    params() {
      return { p_session: this.sid, p_room: this.room };
    }
    async start() {
      const snap = await G.net.rpc("enter", {
        ...this.params(),
        p_name: this.profile.name,
        p_color: this.profile.color
      });
      if (!this.live) {
        G.net.rpc("leave", this.params(), { keepalive: true }).catch(() => {});
        return;
      }
      this.self = { ...snap.self };
      this.actorLayer.replaceChildren();
      this.markerLayer.replaceChildren();
      $("destination").hidden = true;
      $("terrain-image").src = G.mapImage(this.room);
      G.art.scenery($("scenery"), this.map);
      this.mark(this.map.main, this.map.spot);
      this.mark(this.map.quiet, this.map.rest);
      this.mark([this.map.spawn[0] - 24, this.map.spawn[1] - 10], "산책 입구");
      this.upsert(this.self, true);
      this.apply(snap);
      this.ui.ready(this);
      this.resize();
      this.frame(performance.now());
      this.bind();
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.stage);
      this.setConnection(true);
      this.schedule(40);
    }
    mark(p, name) {
      const label = document.createElement("span");
      label.className = "land-label";
      label.textContent = name;
      label.style.left = p[0] + "px";
      label.style.top = p[1] - 26 + "px";
      this.markerLayer.append(label);
    }
    resize() {
      this.dims = { width: this.stage.clientWidth, height: this.stage.clientHeight };
      this.camera.scale = Math.max(
        this.dims.width / 1000,
        this.dims.height / 750,
        this.dims.width < 520 ? 1.38 : 1.5
      );
      this.pan();
    }
    pan() {
      if (!this.self) return;
      const { width: w, height: h } = this.dims,
        s = this.camera.scale;
      this.camera.left = clamp(this.self.x * s - w / 2, 0, Math.max(0, 1000 * s - w));
      this.camera.top = clamp(this.self.y * s - h * 0.52, 0, Math.max(0, 750 * s - h));
      this.land.style.transform =
        "translate(" + -this.camera.left + "px," + -this.camera.top + "px) scale(" + s + ")";
    }
    bind() {
      const opt = { signal: this.listeners.signal };
      this.stage.addEventListener(
        "pointerdown",
        (e) => {
          if (e.button !== 0 || e.target.closest("button")) return;
          this.stage.focus({ preventScroll: true });
          const b = this.stage.getBoundingClientRect(),
            s = this.camera.scale;
          this.walkTo([
            (e.clientX - b.left - this.stage.clientLeft + this.camera.left) / s,
            (e.clientY - b.top - this.stage.clientTop + this.camera.top) / s
          ]);
        },
        opt
      );
      window.addEventListener(
        "keydown",
        (e) => {
          if (
            $("modal").open ||
            e.altKey ||
            e.ctrlKey ||
            e.metaKey ||
            e.target.closest("input,textarea,select,[contenteditable]")
          )
            return;
          if (bindings[e.code]) {
            e.preventDefault();
            this.keys.add(e.code);
            this.cancelRoute();
            this.stand();
          }
          if (
            e.key === "Enter" &&
            !e.repeat &&
            (!e.target.closest("button") || e.target === this.stage)
          ) {
            e.preventDefault();
            $("chat").focus();
          }
        },
        opt
      );
      window.addEventListener("keyup", (e) => this.keys.delete(e.code), opt);
      window.addEventListener("blur", () => this.keys.clear(), opt);
      document.addEventListener(
        "visibilitychange",
        () => {
          this.keys.clear();
          if (!document.hidden) this.schedule(0);
        },
        opt
      );
      window.addEventListener("online", () => this.schedule(0), opt);
      window.addEventListener(
        "offline",
        () => {
          if (G.net.mode !== "solo") this.setConnection(false);
        },
        opt
      );
    }
    cancelRoute() {
      this.route = [];
      this.nextSeat = null;
      $("destination").hidden = true;
    }
    stand() {
      if (this.self.seat !== -1) {
        this.self.seat = -1;
        this.seatRevision++;
        this.schedule(0);
      }
    }
    walkTo(p, seat = null) {
      const tx = Math.round(p[0]),
        ty = Math.round(p[1]);
      const route = this.terrain.route(this.self.x, this.self.y, tx, ty);
      if (!route) {
        this.ui.notice("그곳까지 걸어갈 수 없어요. 섬 안의 땅이나 다리를 눌러 주세요.");
        return false;
      }
      this.stand();
      this.route = route;
      this.nextSeat = seat;
      const dest = $("destination");
      dest.hidden = false;
      dest.style.left = tx + "px";
      dest.style.top = ty + "px";
      return true;
    }
    toggleSeat() {
      if (this.self.seat >= 0) {
        this.stand();
        this.ui.notice("자리에서 일어났어요.");
        return;
      }
      const taken = new Set(
        [...this.actors.values()].filter((a) => !a.mine && a.info.seat >= 0).map((a) => a.info.seat)
      );
      const options = this.map.seats
        .map((point, id) => ({ point, id, dist: dist(point, [this.self.x, this.self.y]) }))
        .filter((s) => !taken.has(s.id))
        .sort((a, b) => a.dist - b.dist);
      if (!options.length) {
        this.ui.notice("지금은 모든 자리에 주민이 앉아 있어요.");
        return;
      }
      const s = options[0];
      if (this.walkTo(s.point, s.id) && s.dist > 30) this.ui.notice("가까운 빈자리로 걸어갈게요.");
    }
    move(dt) {
      if ($("modal").open) {
        this.keys.clear();
        return false;
      }
      let dx = 0,
        dy = 0,
        target = null;
      for (const key of this.keys) {
        dx += bindings[key][0];
        dy += bindings[key][1];
      }
      if (!dx && !dy && this.route.length) {
        target = this.route[0];
        dx = target[0] - this.self.x;
        dy = target[1] - this.self.y;
      }
      const len = Math.hypot(dx, dy);
      if (!len && !target) return false;
      let step = target ? Math.min(len, dt * 109) : dt * 109;
      const vx = len ? (dx / len) * step : 0,
        vy = len ? (dy / len) * step : 0;
      const { x, y } = this.self;
      const nx = x + vx,
        ny = y + vy;
      if (this.terrain.segment(x, y, nx, ny)) {
        this.self.x = nx;
        this.self.y = ny;
      } else if (!target) {
        if (this.terrain.segment(x, y, nx, y)) this.self.x = nx;
        if (this.terrain.segment(this.self.x, y, this.self.x, ny)) this.self.y = ny;
      } else {
        this.cancelRoute();
        return false;
      }
      if (Math.abs(vx) > 0.12) this.self.face = vx > 0 ? 1 : -1;
      if (target && len <= step + 0.001) {
        this.route.shift();
        if (!this.route.length) {
          const seat = this.nextSeat;
          this.cancelRoute();
          if (seat !== null) {
            this.self.seat = seat;
            this.seatRevision++;
            this.schedule(0);
          }
        }
      }
      return Math.hypot(this.self.x - x, this.self.y - y) > 0.01;
    }
    upsert(info, mine = false) {
      let a = this.actors.get(info.sid);
      if (!a) {
        const el = document.createElement("div");
        el.className = "actor" + (mine ? " mine" : "");
        el.dataset.sid = info.sid;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "actor-body";
        b.setAttribute("aria-label", info.name + (mine ? " (나)" : " 주민 메뉴"));
        const c = G.art.avatarCanvas();
        b.append(c);
        const tag = document.createElement("span");
        tag.className = "name-tag";
        tag.textContent = info.name + (mine ? " · 나" : "");
        const bubble = document.createElement("span");
        bubble.className = "bubble";
        bubble.hidden = true;
        el.append(b, tag, bubble);
        this.actorLayer.append(el);
        b.addEventListener(
          "click",
          () => {
            if (this.live) this.ui.member(info);
          },
          { signal: this.listeners.signal }
        );
        a = {
          el,
          c,
          tag,
          bubble,
          info,
          mine,
          x: info.x,
          y: info.y,
          lastDraw: "",
          until: 0,
          gesture: null
        };
        this.actors.set(info.sid, a);
      }
      a.info = info;
      return a;
    }
    apply(snap) {
      this.blocks = snap.blocks || [];
      const hidden = new Set(this.blocks.map((b) => b.uid));
      const here = new Set([this.sid]);
      for (const info of snap.players) {
        here.add(info.sid);
        this.upsert(info);
      }
      for (const [id, a] of this.actors)
        if (!here.has(id)) {
          a.el.remove();
          this.actors.delete(id);
        }
      for (const a of this.actors.values())
        if (hidden.has(a.info.uid)) {
          a.until = 0;
          a.bubble.hidden = true;
        }
      this.log = this.log.filter((m) => !hidden.has(m.uid));
      for (const m of snap.events) this.receive(m, false);
      this.ui.update(this);
    }
    receive(m, redraw = true) {
      if (!m || this.seenMessages.has(m.seq) || this.blocks.some((b) => b.uid === m.uid)) return;
      this.seenMessages.add(m.seq);
      if (this.seenMessages.size > 2000) {
        this.seenMessages = new Set([...this.seenMessages].slice(-1500));
      }
      this.log.push(m);
      this.log.sort((a, b) => a.seq - b.seq);
      if (this.log.length > 50) this.log.shift();
      const a = this.actors.get(m.sid);
      if (a && m.age < 5.5) {
        a.bubble.textContent =
          m.kind === "wave" ? "👋 손 흔들기" : m.kind === "clap" ? "👏 짝짝!" : m.body;
        a.bubble.hidden = false;
        a.until = performance.now() + Math.max(100, (5.5 - m.age) * 1000);
        a.gesture = m.kind;
      }
      if (redraw) this.ui.update(this);
    }
    frame = (t) => {
      if (!this.live) return;
      const dt = Math.min(0.055, Math.max(0, (t - (this.lastFrame || t)) / 1000));
      this.lastFrame = t;
      const moving = this.move(dt);
      this.pan();
      for (const a of this.actors.values()) {
        const info = a.mine ? this.self : a.info;
        let walking = moving;
        if (a.mine) {
          a.x = info.x;
          a.y = info.y;
        } else {
          const dx = info.x - a.x,
            dy = info.y - a.y,
            len = Math.hypot(dx, dy);
          walking = len > 1;
          const factor = reduced.matches ? 1 : 1 - Math.exp(-dt * 10);
          a.x += dx * factor;
          a.y += dy * factor;
        }
        if (!a.bubble.hidden && a.until < t) {
          a.bubble.hidden = true;
          a.gesture = null;
        }
        const pose =
          info.seat >= 0
            ? "sit"
            : a.gesture && a.gesture !== "text"
              ? a.gesture
              : walking
                ? "walk"
                : "idle";
        const phase =
          !reduced.matches && ["walk", "wave", "clap"].includes(pose) ? Math.floor(t / 85) : 0;
        const key = [info.color, info.face, pose, phase].join("/");
        if (a.lastDraw !== key) {
          G.art.paintAvatar(a.c, info.color, info.face, pose, phase * 85);
          a.lastDraw = key;
        }
        a.el.style.transform = "translate(" + a.x.toFixed(2) + "px," + a.y.toFixed(2) + "px)";
        a.el.style.zIndex = String(Math.round(a.y) * 2 + (a.mine ? 1 : 0));
      }
      if (t - this.lastHud > 180) {
        this.lastHud = t;
        const m = this.map,
          p = [this.self.x, this.self.y];
        let where = m.mood;
        for (const [at, name] of [
          [m.spawn, "산책 입구"],
          [m.main, m.spot],
          [m.quiet, m.rest]
        ])
          if (dist(p, at) < 69) where = name;
        $("location-label").textContent = where;
        $("seat").querySelector("span").textContent = this.self.seat >= 0 ? "일어나기" : "앉기";
      }
      this.animation = requestAnimationFrame(this.frame);
    };
    setConnection(up) {
      this.online = up;
      this.ui.connection(up);
    }
    schedule(delay) {
      clearTimeout(this.timer);
      if (!this.live || this.inflight) return;
      this.timer = setTimeout(() => this.sync(), delay);
    }
    async sync() {
      if (!this.live || this.inflight || !this.self) return;
      this.inflight = true;
      const seatVersion = this.seatRevision;
      const pose = {
        p_x: Math.floor(this.self.x),
        p_y: Math.floor(this.self.y),
        p_face: this.self.face,
        p_seat: this.self.seat
      };
      try {
        let snap;
        try {
          snap = await G.net.rpc("tick", { ...this.params(), ...pose });
        } catch (e) {
          if (e.message !== "ROOM_GONE") throw e;
          if (!this.live) return;
          snap = await G.net.rpc("enter", {
            ...this.params(),
            p_name: this.profile.name,
            p_color: this.profile.color
          });
          if (!this.live) {
            G.net.rpc("leave", this.params(), { keepalive: true }).catch(() => {});
            return;
          }
        }
        if (!this.live) return;
        if (seatVersion === this.seatRevision && pose.p_seat >= 0 && snap.self.seat !== pose.p_seat) {
          this.self.seat = snap.self.seat;
          this.ui.notice("다른 주민이 먼저 앉았어요. 다른 자리를 골라 주세요.");
        }
        this.apply(snap);
        this.failures = 0;
        this.setConnection(true);
      } catch {
        if (this.live) {
          this.failures++;
          this.setConnection(false);
        }
      } finally {
        this.inflight = false;
        const delay = this.failures
          ? Math.min(8000, 600 * 2 ** this.failures)
          : document.hidden
            ? 4500
            : 380;
        this.schedule(delay);
      }
    }
    async say(kind, body) {
      if (!this.live || this.speechBusy) return false;
      if (!this.online) {
        this.ui.notice("연결을 복구하고 있어요. 잠시 후 다시 보내 주세요.");
        this.schedule(0);
        return false;
      }
      const clean = body.trim();
      if (!clean) return false;
      const pending = this.pendingEvent;
      const event =
        pending && pending.body === clean && pending.kind === kind
          ? pending
          : { id: G.net.uuid(), body: clean, kind };
      this.pendingEvent = event;
      this.speechBusy = true;
      try {
        // Flush the latest location before the server determines who can hear this line.
        await G.net.rpc("tick", {
          ...this.params(),
          p_x: Math.floor(this.self.x),
          p_y: Math.floor(this.self.y),
          p_face: this.self.face,
          p_seat: this.self.seat
        });
        const m = await G.net.rpc("say", {
          ...this.params(),
          p_event: event.id,
          p_kind: kind,
          p_text: clean
        });
        if (!this.live) return false;
        this.pendingEvent = null;
        this.receive(m);
        this.ui.sound();
        return true;
      } catch (e) {
        if (!this.live) return false;
        if (e.message === "SLOW_DOWN") this.ui.notice("말풍선 사이에 잠깐 숨을 골라 주세요.");
        else this.ui.notice("전송하지 못했어요. 같은 내용으로 다시 보낼 수 있어요.");
        return false;
      } finally {
        this.speechBusy = false;
      }
    }
    async block(uid, on) {
      await G.net.rpc("block", { p_target: uid, p_on: on });
      if (!this.live) return;
      if (on) {
        this.log = this.log.filter((m) => m.uid !== uid);
        for (const a of this.actors.values())
          if (a.info.uid === uid) {
            a.bubble.hidden = true;
            a.gesture = null;
          }
      }
      this.schedule(0);
      this.ui.update(this);
    }
    report(seq, reason) {
      return G.net.rpc("report", { p_session: this.sid, p_seq: seq, p_reason: reason });
    }
    async photo() {
      const w = this.dims.width,
        h = this.dims.height,
        { scale: s, left, top } = this.camera;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(w * 1.6);
      canvas.height = Math.round(h * 1.6);
      const ctx = canvas.getContext("2d");
      ctx.scale(1.6, 1.6);
      ctx.save();
      ctx.translate(-left, -top);
      ctx.scale(s, s);
      let bg = $("terrain-image");
      if (location.protocol === "file:" && !bg.src.startsWith("data:")) {
        bg = new Image();
        bg.src = G.postcards[this.room];
      }
      await bg.decode();
      ctx.drawImage(bg, 0, 0, 1000, 750);
      ctx.drawImage($("scenery"), 0, 0, 1000, 750);
      for (const a of [...this.actors.values()].sort((a, b) => a.y - b.y)) {
        ctx.drawImage(a.c, a.x - 18, a.y - 43, 36, 45);
        ctx.textAlign = "center";
        ctx.font = "bold 9px sans-serif";
        ctx.strokeStyle = "#fff9e6";
        ctx.lineWidth = 2.5;
        ctx.strokeText(a.info.name, a.x, a.y + 9);
        ctx.fillStyle = "#34483b";
        ctx.fillText(a.info.name, a.x, a.y + 9);
      }
      ctx.restore();
      ctx.fillStyle = "#fff8e8e8";
      ctx.fillRect(12, h - 41, 154, 29);
      ctx.fillStyle = "#344b3c";
      ctx.textAlign = "left";
      ctx.font = "14px serif";
      ctx.fillText("오행의 섬 · " + this.map.name, 21, h - 21);
      const blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PHOTO"))), "image/png")
      );
      const url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = "오행의섬-" + this.map.name.replaceAll(" ", "") + "-산책.png";
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 15000);
    }
    close() {
      if (!this.live) return;
      this.live = false;
      clearTimeout(this.timer);
      cancelAnimationFrame(this.animation);
      this.listeners.abort();
      this.resizeObserver?.disconnect();
      this.keys.clear();
      G.net.rpc("leave", this.params(), { keepalive: true }).catch(() => {});
      this.actorLayer.replaceChildren();
      this.markerLayer.replaceChildren();
    }
  }
  G.World = World;
})();
