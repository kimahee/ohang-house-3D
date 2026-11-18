(() => {
  "use strict";
  const G = window.Islands,
    $ = (id) => document.getElementById(id),
    modal = $("modal"),
    body = $("modal-body");
  const entries = Object.entries(G.maps);
  const el = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== null && text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  const icon = (name) => {
    const n = el("i");
    n.dataset.icon = name;
    n.setAttribute("aria-hidden", "true");
    return n;
  };
  const btn = (label, fn, cls = "soft") => {
    const b = el("button", label, cls);
    b.type = "button";
    b.addEventListener("click", fn);
    return b;
  };
  const add = (parent, ...kids) => {
    parent.append(...kids);
    return parent;
  };
  let saved = G.net.load("ohaeng:profile"),
    profile =
      saved && typeof saved.name === "string" && saved.name.trim() && G.art.colors[saved.color]
        ? saved
        : null;
  let world = null,
    selected = null,
    counts = null,
    countsBusy = false,
    dialogType = "",
    toastTimer,
    viewStamp = "";
  let soundOn = G.net.load("ohaeng:sound", false) === true,
    audio = null;
  function sound(level = 0) {
    if (!soundOn) return;
    try {
      const A = window.AudioContext || window.webkitAudioContext;
      if (!A) return;
      if (!audio) audio = new A();
      audio.resume().catch(() => {});
      const now = audio.currentTime;
      [523.25, level ? 783.99 : 659.25].forEach((freq, i) => {
        const o = audio.createOscillator(),
          g = audio.createGain();
        o.type = "sine";
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.001, now + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.055, now + i * 0.09 + 0.015);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.29);
        o.connect(g);
        g.connect(audio.destination);
        o.start(now + i * 0.09);
        o.stop(now + i * 0.09 + 0.3);
      });
    } catch {
      /* Sound is optional. */
    }
  }
  function paintSound() {
    $("sound").querySelector("i").dataset.icon = soundOn ? "sound" : "mute";
    $("sound").querySelector("span").textContent = soundOn ? "소리 켬" : "소리 끔";
    $("sound").setAttribute("aria-pressed", String(soundOn));
    G.art.paintIcons($("sound"));
  }
  function notice(text) {
    const n = $("toast");
    n.textContent = text;
    n.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => n.classList.remove("show"), 2900);
  }
  function dialog(title, type) {
    dialogType = type;
    body.replaceChildren();
    const h = el("h2", title);
    h.id = "modal-title";
    body.append(h);
    if (!modal.open) modal.showModal();
    return body;
  }
  function close() {
    if (modal.open) modal.close();
    dialogType = "";
  }
  $("close-modal").onclick = close;
  modal.addEventListener("close", () => {
    dialogType = "";
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      const r = modal.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
    }
  });
  function state(up = true) {
    const solo = G.net.mode === "solo";
    const msg = solo
      ? "혼자 산책"
      : up === null
        ? "서버 연결 중"
        : !up
          ? world
            ? "연결 복구 중"
            : "서버 연결 확인 필요"
          : G.net.mode === "shared"
            ? "공유 서버 연결됨"
            : "온라인 산책";
    document.querySelectorAll(".mode-label").forEach((n) => {
      n.textContent = msg;
      n.parentElement.dataset.state = solo ? "local" : up ? "online" : "error";
    });
    if (world) $("people").title = msg;
  }
  function countLabel(id) {
    if (G.net.mode === "solo") return "혼자 산책";
    return counts ? "주민 " + (counts[id] || 0) + "명" : "인원 확인 중";
  }
  async function getCounts() {
    if (world || countsBusy || document.hidden) return;
    countsBusy = true;
    try {
      counts = await G.net.rpc("counts");
      if (world) return;
      state(true);
      if (selected) $("detail-count").textContent = countLabel(selected);
      for (const [id] of entries) {
        const c = document.querySelector('.card-count[data-id="' + id + '"]');
        if (c) c.textContent = G.net.mode === "solo" ? "" : " · " + (counts[id] || 0) + "명";
      }
    } catch {
      if (!world) {
        counts = null;
        state(false);
        if (selected) $("detail-count").textContent = "인원 연결 대기";
      }
    } finally {
      countsBusy = false;
    }
  }
  function tint(node, m) {
    node.style.setProperty("--tint", m.color);
    node.style.setProperty("--wash", m.pale);
  }
  const homeEditor = new G.HomeEditor(notice);
  const atlas = new G.IslandAtlas(document.querySelector(".atlas"), choose);
  function buildAtlas() {
    for (const [id, m] of entries) {
      const pin = btn("", () => choose(id), "island-pin");
      tint(pin, m);
      pin.dataset.room = id;
      pin.style.left = m.pin[0] + "%";
      pin.style.top = m.pin[1] + "%";
      pin.setAttribute("aria-label", m.name + " 둘러보기");
      pin.setAttribute("aria-pressed", "false");
      add(pin, el("span", null, "pin-dot"), el("span", m.name));
      $("map-pins").append(pin);
      const card = btn("", () => choose(id), "island-card");
      card.dataset.room = id;
      tint(card, m);
      card.setAttribute("aria-pressed", "false");
      const preview = el("span", null, "card-art");
      preview.style.backgroundImage = 'url("' + G.postcards[id] + '")';
      preview.style.backgroundPosition = m.card[0] + "% " + m.card[1] + "%";
      const copy = el("span", null, "card-copy"),
        detail = el("span", null, "card-text"),
        sub = el("small", m.mood),
        count = el("span", "", "card-count");
      count.dataset.id = id;
      sub.append(count);
      add(detail, el("strong", m.name), sub);
      add(copy, el("span", m.han, "seal"), detail, el("span", "↗", "card-arrow"));
      add(card, preview, copy);
      $("island-cards").append(card);
    }
  }
  function choose(id, scroll = true) {
    selected = id;
    atlas.select(id);
    const m = G.maps[id];
    $("intro").hidden = true;
    $("detail").hidden = false;
    tint($("detail"), m);
    $("detail-name").textContent = m.name;
    $("detail-mood").textContent = m.mood;
    $("detail-desc").textContent = m.desc;
    $("detail-place").textContent = m.spot;
    $("detail-count").textContent = countLabel(id);
    $("detail-seal").textContent = m.han;
    document
      .querySelectorAll("button[data-room]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.room === id)));
    if (scroll && window.innerWidth < 691) window.scrollTo({ top: 0, behavior: "instant" });
    if (scroll) $("enter").focus({ preventScroll: true });
  }
  function intro() {
    selected = null;
    atlas.select(null);
    $("detail").hidden = true;
    $("intro").hidden = false;
    document
      .querySelectorAll("button[data-room]")
      .forEach((b) => b.setAttribute("aria-pressed", "false"));
  }
  function profileForm(next) {
    const d = dialog("나의 산책자", "profile"),
      form = el("form");
    form.autocomplete = "off";
    const av = el("div", null, "avatar-choice"),
      prev = el("div", null, "avatar-preview"),
      c = G.art.avatarCanvas();
    prev.append(c);
    const palette = el("div", null, "swatches");
    palette.setAttribute("role", "group");
    palette.setAttribute("aria-label", "망토 색");
    let color = profile?.color ?? 0;
    const choices = [];
    function pick(i) {
      color = i;
      G.art.paintAvatar(c, color, 1, "idle", 0);
      choices.forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
    }
    G.art.colors.forEach((v, i) => {
      const b = btn("", () => pick(i), "swatch");
      b.style.setProperty("--swatch", v.coat);
      b.title = v.name;
      b.setAttribute("aria-label", v.name);
      choices.push(b);
      palette.append(b);
    });
    pick(color);
    const name = el("input", null, "field");
    name.id = "nickname";
    name.maxLength = 12;
    name.required = true;
    name.placeholder = "1~12자로 입력해 주세요";
    name.value = profile?.name || "";
    name.autocomplete = "off";
    const label = el("label", "닉네임", "profile-label");
    label.htmlFor = name.id;
    const palWrap = el("div");
    add(palWrap, el("span", "망토 색", "profile-label"), palette);
    add(av, prev, palWrap);
    const submit = el("button", next === "enter" ? "이 섬에 입장하기" : "섬 고르기", "primary");
    submit.type = "submit";
    submit.append(icon("arrow"));
    add(form, av, label, name, submit);
    d.append(form);
    G.art.paintIcons(d);
    name.focus({ preventScroll: true });
    name.addEventListener("input", () => name.setCustomValidity(""));
    form.onsubmit = (e) => {
      e.preventDefault();
      const v = name.value.trim();
      if (!v || /[\u0000-\u001f\u007f]/.test(v)) {
        name.setCustomValidity("화면에 표시할 닉네임을 입력해 주세요.");
        name.reportValidity();
        return;
      }
      profile = { name: v, color };
      G.net.save("ohaeng:profile", profile);
      close();
      sound();
      if (next === "enter") enter();
      else choose(selected || "wood");
    };
  }
  function explain() {
    const d = dialog("섬 이용 안내", "guide");
    const list = el("ul", null, "guide-list");
    for (const line of [
      "지도에서 섬을 누르거나 드래그하면 그 섬이 커져요. 섬 카드를 눌러도 선택할 수 있어요.",
      "섬에 처음 들어가면 오행 집 다섯 채 중 하나를 고르고 지도를 눌러 집터를 정해요. 산책 중 내 집을 누르면 디자인과 위치를 바꿀 수 있어요.",
      "PC는 방향키·WASD, 휴대폰은 갈 곳을 터치해요. 산책 수첩에서 장소를 누르면 길을 찾아가요.",
      "말풍선은 보낸 순간 가까이 있던 주민에게 보여요. PC에서는 Enter로 대화 입력을 시작해요.",
      "인사에서 손을 흔들거나 박수를 쳐 보세요. 앉기를 누르면 빈자리를 찾아가요.",
      "주민을 누르면 차단할 수 있어요. 받은 말은 산책 수첩에서 선택해 신고할 수 있어요."
    ])
      list.append(el("li", line));
    d.append(
      list,
      el(
        "p",
        G.net.mode === "solo"
          ? "현재 혼자 산책 중이에요. 친구와 만나려면 공유 서버 또는 Supabase에 연결된 주소로 함께 접속해 주세요."
          : "같은 게임 주소에서 같은 섬을 고르면 함께 걸을 수 있어요.",
        "notice"
      )
    );
  }
  function places(container, w, closeOnClick = false) {
    container.replaceChildren();
    for (const [point, label] of [
      [w.map.main, w.map.spot],
      [w.map.quiet, w.map.rest]
    ]) {
      const b = btn(
        "",
        () => {
          if (closeOnClick) close();
          w.walkTo([point[0], point[1] + 17]);
        },
        "place-button"
      );
      b.setAttribute("aria-label", label + "까지 걷기");
      add(b, icon("pin"), el("span", label), icon("chevron"));
      container.append(b);
    }
    G.art.paintIcons(container);
  }
  function update(w, force = false) {
    if (world !== w) return;
    homeEditor.refresh();
    const stamp = [
      w.actors.size,
      w.log.map((m) => m.seq).join(","),
      w.blocks.map((b) => b.uid).join(",")
    ].join("/");
    if (!force && viewStamp === stamp) return;
    viewStamp = stamp;
    $("people-label").textContent = "주민 " + w.actors.size + "명";
    const recent = $("recent-list");
    recent.replaceChildren();
    if (!w.log.length) {
      recent.append(el("p", "아직 들려온 말이 없어요. 가까운 주민에게 인사를 건네보세요.", "empty"));
    } else
      for (const m of w.log.slice(-3)) {
        const p = el("p", null, "recent-item");
        add(p, el("strong", m.name), el("span", m.body));
        recent.append(p);
      }
    if (modal.open && dialogType === "journal") journal(false);
    if (modal.open && dialogType === "people") people(false);
  }
  function ready(w) {
    if (world !== w) return;
    $("lobby").hidden = true;
    $("game").hidden = false;
    window.scrollTo(0, 0);
    tint($("game"), w.map);
    $("world-name").textContent = w.map.name;
    $("world-seal").textContent = w.map.han;
    $("detail-thumb").src = G.postcards[w.room];
    $("detail-thumb").alt = w.map.name + " 지형";
    $("chat").value = "";
    $("move-hint").textContent = matchMedia("(pointer:coarse)").matches
      ? "땅을 눌러 이동"
      : "방향키 · WASD · 클릭 이동";
    places($("places"), w);
    update(w, true);
    $("stage").focus({ preventScroll: true });
    homeEditor.enter(w);
  }
  async function enter() {
    if (!selected || world) return;
    if (!profile) {
      profileForm("enter");
      return;
    }
    const w = new G.World(selected, profile, { ready, member, update, notice, sound, connection: state });
    world = w;
    $("enter").disabled = true;
    $("enter").firstChild.textContent = "입장 중… ";
    viewStamp = "";
    try {
      await w.start();
      if (world === w) sound(1);
    } catch (e) {
      if (world !== w) return;
      w.close();
      world = null;
      state(false);
      const d = dialog("섬 연결을 확인해 주세요", "connection");
      const msg =
        e.message === "CONFIG"
          ? "config.js에 프로젝트 URL과 sb_publishable_ 공개 키를 모두 입력해 주세요."
          : G.net.mode === "cloud"
            ? "Supabase의 익명 로그인, setup.sql 실행 여부와 config.js의 프로젝트 정보를 확인해 주세요."
            : "공유 서버가 실행 중인지 확인한 뒤 다시 입장해 주세요.";
      d.append(
        el("p", msg),
        btn(
          "다시 연결하기",
          () => {
            close();
            enter();
          },
          "primary"
        )
      );
    } finally {
      $("enter").disabled = false;
      $("enter").firstChild.textContent = "이 섬에 입장하기 ";
    }
  }
  function leave(home = false) {
    const old = world;
    world = null;
    homeEditor.leave();
    if (old) old.close();
    close();
    $("game").hidden = true;
    $("lobby").hidden = false;
    if (home) intro();
    else if (selected) choose(selected);
    state(counts ? true : null);
    getCounts();
    window.scrollTo(0, 0);
    setTimeout(getCounts, 250);
  }
  function greetings() {
    if (!world) return;
    const w = world,
      d = dialog("가벼운 인사", "greetings");
    d.append(el("h3", "몸짓"));
    const gestures = el("div", null, "row-actions");
    for (const [kind, txt, title] of [
      ["wave", "손을 흔들었어요", "👋 손 흔들기"],
      ["clap", "박수를 쳤어요", "👏 박수"]
    ])
      gestures.append(
        btn(title, () => {
          close();
          w.say(kind, txt);
        })
      );
    d.append(gestures, el("h3", "빠른 말풍선"));
    const lines = el("div", null, "row-actions");
    for (const txt of ["안녕!", "같이 걸을래?", "여기 앉아도 돼?"])
      lines.append(
        btn(txt, () => {
          close();
          w.say("text", txt);
        })
      );
    d.append(lines);
  }
  function people(open = true) {
    const w = world;
    if (!w) return;
    const d = open ? dialog("이 섬의 주민", "people") : body;
    if (!open) d.querySelector(".member-list")?.remove();
    const list = el("div", null, "member-list");
    for (const a of w.actors.values()) {
      const row = el("div", null, "member-row");
      row.append(el("span", a.info.name + (a.mine ? " · 나" : "")));
      if (!a.mine && a.info.uid !== w.self.uid)
        row.append(btn("주민 메뉴", () => member(a.info), "link"));
      list.append(row);
    }
    if (w.blocks.length) {
      list.append(el("h3", "차단한 주민"));
      for (const b of w.blocks) {
        const row = el("div", null, "member-row");
        add(
          row,
          el("span", b.name),
          btn("차단 해제", () => changeBlock(b.uid, false), "link")
        );
        list.append(row);
      }
    }
    d.append(list);
  }
  async function changeBlock(uid, on) {
    const w = world;
    if (!w) return;
    try {
      await w.block(uid, on);
      if (world !== w) return;
      close();
      notice(on ? "이 주민의 말풍선을 숨겼어요." : "다음 말풍선부터 다시 들을 수 있어요.");
    } catch {
      notice("설정을 저장하지 못했어요. 다시 시도해 주세요.");
    }
  }
  function member(info) {
    const w = world;
    if (!w) return;
    const own = info.uid === w.self.uid,
      d = dialog(info.name, "member");
    if (own) {
      d.append(el("p", info.sid === w.sid ? "내 산책자예요." : "같은 브라우저 계정의 산책자예요."));
      return;
    }
    const blocked = w.blocks.some((b) => b.uid === info.uid);
    d.append(
      el(
        "p",
        blocked ? "이 주민의 말풍선을 숨기는 중이에요." : "이 주민의 말풍선을 내 화면에서 숨길 수 있어요."
      )
    );
    d.append(
      btn(blocked ? "차단 해제" : "이 주민 차단", () => changeBlock(info.uid, !blocked), "primary")
    );
  }
  function journal(open = true) {
    const w = world;
    if (!w) return;
    const d = open ? dialog("산책 수첩", "journal") : body;
    if (open) {
      d.append(el("h3", "장소로 걷기"));
      const nav = el("div");
      places(nav, w, true);
      d.append(nav, el("h3", "주변 대화"));
    }
    let list = d.querySelector(".log-list");
    const previous = list?.scrollTop || 0;
    if (!list) {
      list = el("div", null, "log-list");
      d.append(list);
    }
    list.replaceChildren();
    if (!w.log.length) list.append(el("p", "근처에서 받은 말풍선이 여기에 모여요.", "empty"));
    for (const m of [...w.log].reverse()) {
      const item = el("div", null, "log-item"),
        copy = el("div"),
        time = new Date(m.at).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
      add(copy, el("small", m.name + " · " + time), el("p", m.body));
      item.append(copy);
      if (m.uid !== w.self.uid) item.append(btn("신고", () => reportForm(m), "link"));
      list.append(item);
    }
    list.scrollTop = previous;
  }
  function reportForm(m) {
    const w = world;
    if (!w) return;
    const d = dialog("말풍선 신고", "report");
    d.append(el("p", m.name + " · " + m.body), el("h3", "신고 사유"));
    const row = el("div", null, "row-actions");
    for (const reason of ["불쾌한 표현", "도배", "기타"]) {
      const b = btn(reason, async () => {
        [...row.children].forEach((n) => (n.disabled = true));
        try {
          await w.report(m.seq, reason);
          if (world === w) {
            close();
            notice("신고를 접수했어요.");
          }
        } catch {
          notice("신고를 접수하지 못했어요. 다시 시도해 주세요.");
          [...row.children].forEach((n) => (n.disabled = false));
        }
      });
      row.append(b);
    }
    d.append(row);
  }
  $("sound").onclick = () => {
    soundOn = !soundOn;
    G.net.save("ohaeng:sound", soundOn);
    paintSound();
    sound();
  };
  $("guide").onclick = explain;
  $("brand").onclick = () => leave(true);
  $("start").onclick = () => profileForm("select");
  $("back-intro").onclick = intro;
  $("enter").onclick = enter;
  $("to-atlas").onclick = () => leave(false);
  $("people").onclick = () => people();
  $("greetings").onclick = greetings;
  $("seat").onclick = () => world?.toggleSeat();
  $("journal").onclick = $("all-chat").onclick = () => journal();
  $("photo").onclick = async () => {
    if (!world) return;
    try {
      await world.photo();
      notice("산책 사진을 저장했어요.");
    } catch {
      notice("사진을 저장할 수 없어요. 공유 서버나 배포 주소에서 다시 시도해 주세요.");
    }
  };
  $("chat-form").onsubmit = async (e) => {
    e.preventDefault();
    const input = $("chat"),
      text = input.value,
      w = world;
    if (!w || !text.trim()) return;
    if ((await w.say("text", text)) && world === w && input.value === text) input.value = "";
  };
  window.addEventListener("pagehide", () => {
    if (world) leave(false);
  });
  window.addEventListener("pageshow", () => getCounts());
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) getCounts();
  });
  buildAtlas();
  G.art.paintIcons();
  paintSound();
  state(null);
  getCounts();
  setInterval(getCounts, 6500);
})();
