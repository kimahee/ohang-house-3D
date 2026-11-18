(() => {
  "use strict";
  const G = window.Islands,
    cfg = window.OHAENG_CONFIG || {};
  const base = (cfg.supabaseUrl || "").trim().replace(/\/+$/, ""),
    key = (cfg.supabasePublishableKey || "").trim();
  const local = window.OHAENG_LOCAL_ENDPOINT;
  const mode = base || key ? "cloud" : local ? "shared" : "solo";
  const valid =
    mode !== "cloud" ||
    (/^https:\/\/[a-z\d.-]+(?::\d+)?$/i.test(base) && /^sb_publishable_[\w.-]+$/.test(key));
  const storageKey = "ohaeng:session:" + (mode === "cloud" ? base : location.host);
  let memorySession = null,
    pendingSession = null;
  function uuid() {
    if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const h = Array.from(bytes, (x) => x.toString(16).padStart(2, "0")).join("");
    return [h.slice(0, 8), h.slice(8, 12), h.slice(12, 16), h.slice(16, 20), h.slice(20)].join("-");
  }
  function load(name, fallback = null) {
    try {
      return JSON.parse(localStorage.getItem(name)) ?? fallback;
    } catch {
      return fallback;
    }
  }
  function save(name, value) {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch {
      /* Private browsing can disable persistence. */
    }
  }
  async function request(url, body, headers = {}, keepalive = false) {
    const ctrl = new AbortController(),
      timeout = setTimeout(() => ctrl.abort(), 9000);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body),
        signal: ctrl.signal,
        keepalive
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (!res.ok) {
        const err = new Error(data?.message || data?.msg || "CONNECTION");
        err.status = res.status;
        err.code = data?.code || data?.error_code;
        throw err;
      }
      return data;
    } finally {
      clearTimeout(timeout);
    }
  }
  const fresh = (session) => Boolean(session?.access && session.expires > Date.now() + 60000);
  async function acquire(force = false) {
    let old = load(storageKey, memorySession);
    if (!force && fresh(old)) {
      memorySession = old;
      return old;
    }
    if (mode === "shared") {
      const data = await request(local + "/session", {});
      memorySession = { access: data.token, uid: data.uid, expires: Date.now() + 365 * 86400000 };
    } else {
      if (!valid) throw new Error("CONFIG");
      let data;
      if (old?.refresh) {
        try {
          data = await request(
            base + "/auth/v1/token?grant_type=refresh_token",
            { refresh_token: old.refresh },
            { apikey: key }
          );
        } catch (e) {
          // A second tab may already have rotated the refresh token.
          const latest = load(storageKey);
          if (latest?.refresh !== old.refresh && fresh(latest)) {
            memorySession = latest;
            return latest;
          }
          if (e.status !== 400 && e.status !== 401) throw e;
        }
      }
      if (!data) data = await request(base + "/auth/v1/signup", { data: {} }, { apikey: key });
      if (!data?.access_token || !data.user?.id) throw new Error("SIGN_IN");
      memorySession = {
        access: data.access_token,
        refresh: data.refresh_token,
        uid: data.user.id,
        expires: Date.now() + data.expires_in * 1000
      };
    }
    save(storageKey, memorySession);
    return memorySession;
  }
  function session(force = false) {
    if (!pendingSession) {
      const run = () => acquire(force);
      pendingSession = (navigator.locks ? navigator.locks.request(storageKey, run) : run()).finally(
        () => (pendingSession = null)
      );
    }
    return pendingSession;
  }
  const seedUid = uuid();
  let solo = null,
    soloEvents = [],
    soloSeq = 0,
    lastSaid = 0;
  function soloSnapshot() {
    return {
      self: { ...solo },
      players: [],
      events: soloEvents.map((m) => ({ ...m, age: (Date.now() - m.at) / 1000 })),
      blocks: []
    };
  }
  function single(verb, p) {
    if (verb === "counts")
      return Object.fromEntries(Object.keys(G.maps).map((id) => [id, solo?.room === id ? 1 : 0]));
    if (verb === "enter") {
      const [x, y] = G.maps[p.p_room].spawn;
      solo = {
        sid: p.p_session,
        uid: seedUid,
        room: p.p_room,
        name: p.p_name,
        color: p.p_color,
        x,
        y,
        face: 1,
        seat: -1
      };
      soloEvents = [];
      lastSaid = 0;
      return soloSnapshot();
    }
    if (verb === "leave") {
      if (solo?.sid === p.p_session) solo = null;
      return true;
    }
    if (!solo || solo.sid !== p.p_session) throw new Error("ROOM_GONE");
    if (verb === "tick") {
      Object.assign(solo, { x: p.p_x, y: p.p_y, face: p.p_face, seat: p.p_seat });
      if (solo.seat >= 0) [solo.x, solo.y] = G.maps[solo.room].seats[solo.seat];
      return soloSnapshot();
    }
    if (verb === "say") {
      if (Date.now() - lastSaid < 750) throw new Error("SLOW_DOWN");
      const m = {
        seq: ++soloSeq,
        sid: solo.sid,
        uid: seedUid,
        name: solo.name,
        kind: p.p_kind,
        body: p.p_text,
        at: Date.now(),
        age: 0
      };
      lastSaid = m.at;
      soloEvents.push(m);
      if (soloEvents.length > 45) soloEvents.shift();
      return m;
    }
    throw new Error("SIGN_IN");
  }
  async function rpc(verb, p = {}, options = {}) {
    if (mode === "solo") return single(verb, p);
    if (!valid) throw new Error("CONFIG");
    const endpoint = mode === "cloud" ? base + "/rest/v1/rpc/ohaeng_" : local + "/rpc/ohaeng_";
    const h = mode === "cloud" ? { apikey: key } : {};
    if (verb !== "counts") {
      const auth = options.keepalive ? memorySession : await session();
      if (!auth) throw new Error("SIGN_IN");
      h.Authorization = "Bearer " + auth.access;
    }
    try {
      return await request(endpoint + verb, p, h, !!options.keepalive);
    } catch (e) {
      if (e.status !== 401 || verb === "counts" || options.keepalive) throw e;
      const auth = await session(true);
      return request(endpoint + verb, p, { ...h, Authorization: "Bearer " + auth.access });
    }
  }
  G.net = { mode, valid, rpc, uuid, load, save };
})();
