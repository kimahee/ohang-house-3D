(() => {
  "use strict";
  const G = window.Islands,
    H = G.homes;
  const $ = (id) => document.getElementById(id);
  const put = (node, value) => {
    if (node.textContent !== value) node.textContent = value;
  };
  function position(node, x, y) {
    node.style.left = x / 10 + "%";
    node.style.top = y / 7.5 + "%";
  }
  class HomeEditor {
    constructor(notice) {
      this.notice = notice;
      this.dialog = $("home-editor");
      this.mapNode = $("placement-map");
      this.buttons = new Map();
      for (const [id, design] of Object.entries(H.designs)) {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "home-option";
        option.dataset.design = id;
        option.style.setProperty("--accent", G.maps[id].color);
        option.setAttribute("aria-label", G.maps[id].name[0] + " · " + design.name);
        const img = new Image();
        img.alt = "";
        img.draggable = false;
        img.loading = "lazy";
        img.src = H.image(id);
        const title = document.createElement("span");
        title.textContent = design.name;
        option.append(img, title);
        option.onclick = () => this.pick(id);
        this.buttons.set(id, option);
        $("home-options").append(option);
      }
      $("my-house").addEventListener("click", () => {
        if (this.current?.live) this.open(this.current);
      });
      $("home-close").onclick = () => this.close();
      $("home-back").onclick = () => (this.step === 2 ? this.showStep(1) : this.close());
      $("home-next").onclick = () => (this.step === 1 ? this.showStep(2) : this.commit());
      $("suggest-home").onclick = () => this.suggest();
      this.dialog.addEventListener("cancel", (e) => {
        if (this.saving) e.preventDefault();
      });
      this.dialog.addEventListener("close", () => {
        if (this.dialog.open) return;
        this.editing = null;
        this.pointer = null;
        if (this.current?.live) $("stage").focus({ preventScroll: true });
      });
      const move = (event) => {
        const rect = this.mapNode.getBoundingClientRect();
        this.point = [
          H.snap(((event.clientX - rect.left) / rect.width) * 1000 + this.grab[0], 1000),
          H.snap(((event.clientY - rect.top) / rect.height) * 750 + this.grab[1], 750)
        ];
        this.message("");
        this.refresh();
      };
      this.mapNode.addEventListener("pointerdown", (e) => {
        if (!e.isPrimary || e.button !== 0 || this.saving) return;
        this.mapNode.focus({ preventScroll: true });
        this.pointer = e.pointerId;
        const house = $("plot-ghost").getBoundingClientRect(),
          bounds = this.mapNode.getBoundingClientRect();
        const onHouse =
          e.clientX >= house.left &&
          e.clientX <= house.right &&
          e.clientY >= house.top &&
          e.clientY <= house.bottom;
        this.grab = onHouse
          ? [
              this.point[0] - ((e.clientX - bounds.left) * 1000) / bounds.width,
              this.point[1] - ((e.clientY - bounds.top) * 750) / bounds.height
            ]
          : [0, 0];
        this.mapNode.setPointerCapture(e.pointerId);
        move(e);
      });
      this.mapNode.addEventListener("pointermove", (e) => {
        if (e.pointerId === this.pointer) move(e);
      });
      this.mapNode.addEventListener("pointerup", (e) => {
        if (e.pointerId !== this.pointer) return;
        move(e);
        this.pointer = null;
      });
      this.mapNode.addEventListener("lostpointercapture", () => {
        this.pointer = null;
      });
      this.mapNode.addEventListener("keydown", (e) => {
        const dir = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }[
          e.key
        ];
        if (!dir || this.saving) return;
        e.preventDefault();
        this.point = [H.snap(this.point[0] + dir[0], 1000), H.snap(this.point[1] + dir[1], 750)];
        this.message("");
        this.refresh();
      });
    }
    enter(w) {
      this.current = w;
      if (w.housingReady && !w.myHome) this.open(w);
    }
    leave() {
      this.current = null;
      this.editing = null;
      if (this.dialog.open) this.dialog.close();
    }
    close() {
      if (!this.saving && this.dialog.open) this.dialog.close();
    }
    open(w) {
      if (!w.housingReady) {
        this.notice("집을 열려면 게임 관리자가 최신 supabase/setup.sql을 한 번 실행해야 해요.");
        return;
      }
      this.editing = w;
      this.saving = false;
      this.suggestion = 0;
      this.neighborVersion = -1;
      this.ground = new G.Terrain(w.map);
      this.originalHome = w.myHome;
      this.base = w.myHome?.rev || 0;
      this.point = w.myHome?.room === w.room ? [w.myHome.x, w.myHome.y] : null;
      this.kind = w.myHome?.kind || w.room;
      $("home-island").textContent = w.map.name;
      $("placement-terrain").src = G.mapImage(w.room);
      G.art.scenery($("placement-scenery"), w.map);
      this.dialog.showModal();
      this.showStep(1);
      w.keys.clear();
      w.cancelRoute();
    }
    message(text) {
      $("home-message").hidden = !text;
      put($("home-message"), text);
    }
    pick(id) {
      this.kind = id;
      const design = H.designs[id],
        m = G.maps[id];
      this.dialog.style.setProperty("--accent", m.color);
      this.dialog.style.setProperty("--wash", m.pale);
      $("home-portrait").src = H.image(id);
      $("home-element").textContent = m.han + " · " + m.name[0];
      $("home-design-name").textContent = design.name;
      $("home-design-note").textContent = design.note;
      for (const [key, btn] of this.buttons) btn.setAttribute("aria-pressed", String(key === id));
    }
    showStep(n) {
      const w = this.editing;
      if (!w || this.saving) return;
      this.step = n;
      $("home-design-step").hidden = n !== 1;
      $("home-site-step").hidden = n !== 2;
      const moving = this.originalHome && this.originalHome.room !== w.room;
      $("home-title").textContent = n === 1 ? "어떤 집에서 살까요?" : "어디에 집을 놓을까요?";
      $("home-back").textContent =
        n === 1 ? (this.originalHome ? "닫기" : "나중에 정하기") : "‹ 디자인 다시 고르기";
      $("home-next").textContent =
        n === 1
          ? "집터 고르기 →"
          : moving
            ? "이 섬으로 이사하기"
            : this.originalHome
              ? "변경 저장하기"
              : "여기에 집 짓기";
      $("home-back").disabled =
        $("home-close").disabled =
        $("suggest-home").disabled =
        $("home-next").disabled =
          false;
      this.message(
        moving
          ? G.maps[this.originalHome.room].name +
              "에 살고 있어요. 이사를 확정하면 지금 고른 섬으로 집을 옮겨요."
          : ""
      );
      this.pick(this.kind);
      if (n === 2) {
        $("ghost-image").src = H.image(this.kind);
        if (!this.point) this.suggest();
        this.refresh();
        this.mapNode.focus({ preventScroll: true });
      } else {
        $("home-title").focus({ preventScroll: true });
      }
      this.dialog.scrollTop = 0;
    }
    neighbors() {
      const w = this.editing;
      return w.homes.filter((h) => h.uid !== w.self.uid);
    }
    residents() {
      const w = this.editing;
      return [w.self, ...[...w.actors.values()].filter((a) => !a.mine).map((a) => a.info)];
    }
    suggest() {
      const w = this.editing;
      const [sx, sy] = w.map.spawn;
      const spots = [
        [sx - 106, sy - 25],
        [sx + 115, sy + 68],
        [260, 350],
        [720, 400],
        [500, 530],
        [500, 230]
      ];
      const target = spots[this.suggestion++ % spots.length];
      this.point = H.suggest(w.map, this.ground, target, this.neighbors(), this.residents()) || [
        H.snap(target[0], 1000),
        H.snap(target[1], 750)
      ];
      this.message("");
      this.refresh();
    }
    refresh() {
      const w = this.editing;
      if (!w || !this.dialog.open || this.step !== 2 || !this.point) return;
      if (w.homeVersion !== this.neighborVersion) {
        this.neighborVersion = w.homeVersion;
        const layer = $("placement-neighbors");
        layer.replaceChildren();
        for (const h of this.neighbors()) {
          const img = new Image();
          img.src = H.image(h.kind);
          img.alt = h.name + "의 집";
          img.className = "mini-home";
          position(img, h.x, h.y);
          layer.append(img);
        }
      }
      const [x, y] = this.point;
      const err = H.problem(w.map, this.ground, x, y, this.neighbors(), this.residents());
      const ghost = $("plot-ghost");
      position(ghost, x, y);
      ghost.classList.toggle("unsuitable", Boolean(err));
      $("home-status").classList.toggle("unsuitable", Boolean(err));
      put($("home-status"), err ? H.errors[err] : "이 자리에 집을 놓을 수 있어요.");
      $("home-next").disabled = Boolean(err) || this.saving;
    }
    async commit() {
      const w = this.editing;
      if (!w || this.saving || $("home-next").disabled) return;
      const [x, y] = this.point;
      this.saving = true;
      $("home-back").disabled =
        $("home-close").disabled =
        $("suggest-home").disabled =
        $("home-next").disabled =
          true;
      this.message("집을 저장하고 있어요…");
      try {
        const snap = await G.net.rpc("place_home", {
          ...w.params(),
          p_kind: this.kind,
          p_x: x,
          p_y: y,
          p_expected: this.base
        });
        if (!w.live || this.editing !== w) return;
        w.apply(snap);
        this.saving = false;
        this.close();
        if (w.terrain.allows(x, y + 16)) w.walkTo([x, y + 16]);
        this.notice("내 집을 놓았어요. ‘내 집’에서 위치와 디자인을 다시 정할 수 있어요.");
      } catch (e) {
        if (!w.live || this.editing !== w) return;
        this.saving = false;
        $("home-back").disabled = $("home-close").disabled = $("suggest-home").disabled = false;
        if (e.message === "HOME_STALE") {
          try {
            const fresh = await G.net.rpc("tick", { ...w.params(), ...w.pose() });
            if (!w.live || this.editing !== w) return;
            w.apply(fresh);
            this.openAfterConflict(w);
          } catch {
            if (!w.live || this.editing !== w) return;
            this.message("다른 창에서 집이 바뀌었어요. 연결이 돌아오면 ‘내 집’을 다시 열어 주세요.");
            this.refresh();
            w.schedule(0);
          }
        } else {
          this.message(H.errors[e.message] || "집을 저장하지 못했어요. 연결을 확인하고 다시 눌러 주세요.");
          this.refresh();
          w.schedule(0);
        }
      }
    }
    openAfterConflict(w) {
      this.editing = null;
      this.dialog.close();
      this.open(w);
      this.message("다른 창에서 내 집이 바뀌었어요. 현재 집을 확인한 뒤 다시 골라 주세요.");
    }
  }
  G.HomeEditor = HomeEditor;
})();
