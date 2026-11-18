/* 같은 Wi-Fi에서 플레이하는 선택형 서버. GitHub Pages는 이 파일을 실행할 필요가 없습니다. */
import { createServer } from "node:http";
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { networkInterfaces } from "node:os";
import { PGlite } from "@electric-sql/pglite";

const root = dirname(fileURLToPath(import.meta.url));
const data = process.env.OHAENG_DATA || join(root, ".local-game");
await mkdir(data, { recursive: true });
const db = new PGlite(join(data, "db"));
await db.exec(`
  do $$ begin
    if not exists(select from pg_roles where rolname='anon') then create role anon; end if;
    if not exists(select from pg_roles where rolname='authenticated') then create role authenticated; end if;
  end $$;
  create schema if not exists auth;
  create or replace function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
`);
await db.exec(await readFile(join(root, "supabase/setup.sql"), "utf8"));
if (process.argv.includes("--reports")) {
  const reports = await db.query(
    "select reported_at,room,sender_name,body,reason from ohaeng_game.reports order by reported_at desc"
  );
  console.table(reports.rows);
  await db.close();
  process.exit(0);
}
const secretPath = join(data, "session-key");
try {
  await writeFile(secretPath, randomBytes(32), { flag: "wx", mode: 0o600 });
} catch (error) {
  if (error.code !== "EEXIST") throw error;
}
const secret = await readFile(secretPath);
const signature = (id) => createHmac("sha256", secret).update(id).digest("hex");
function identity(request) {
  const token = (request.headers.authorization || "").match(/^Bearer ([a-f0-9-]{36})\.([a-f0-9]{64})$/);
  if (!token) return null;
  return timingSafeEqual(Buffer.from(token[2]), Buffer.from(signature(token[1]))) ? token[1] : null;
}
const calls = {
  counts: [],
  enter: ["p_session", "p_room", "p_name", "p_color"],
  tick: ["p_session", "p_room", "p_x", "p_y", "p_face", "p_seat"],
  say: ["p_session", "p_room", "p_event", "p_kind", "p_text"],
  block: ["p_target", "p_on"],
  report: ["p_session", "p_seq", "p_reason"],
  leave: ["p_session", "p_room"]
};
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".png": "image/png",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
};
const allowedStatic =
  /^\/(?:index\.html|styles\.css|config\.js|js\/[\w-]+\.js|assets\/(?:[\w-]+\/)*[\w.-]+)$/;
function reply(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(body));
}
async function readBody(request) {
  const parts = [];
  let size = 0;
  for await (const part of request) {
    size += part.length;
    if (size > 5000) throw new Error("MESSAGE");
    parts.push(part);
  }
  return JSON.parse(Buffer.concat(parts).toString() || "{}");
}
const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, "http://localhost").pathname;
    if (req.method === "POST" && pathname.startsWith("/api/")) {
      if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host)
        return reply(res, 403, { message: "ORIGIN" });
      if (pathname === "/api/session") {
        const id = randomUUID();
        return reply(res, 200, { token: id + "." + signature(id), uid: id });
      }
      const verb = pathname.match(/^\/api\/rpc\/ohaeng_([a-z]+)$/)?.[1];
      if (!Object.hasOwn(calls, verb)) return reply(res, 404, { message: "NOT_FOUND" });
      const uid = identity(req);
      if (!uid && verb !== "counts") return reply(res, 401, { message: "SIGN_IN" });
      const body = await readBody(req);
      const args = calls[verb].map((key) => body[key]);
      const slots = args.map((_, i) => "$" + (i + 1)).join(",");
      const value = await db.transaction(async (tx) => {
        await tx.query("select set_config('request.jwt.claim.sub',$1,true)", [uid || ""]);
        await tx.exec(uid ? "set local role authenticated" : "set local role anon");
        const result = await tx.query("select public.ohaeng_" + verb + "(" + slots + ") as value", args);
        return result.rows[0].value;
      });
      return reply(res, 200, value);
    }
    const path = pathname === "/" ? "/index.html" : pathname;
    if (!["GET", "HEAD"].includes(req.method) || !allowedStatic.test(path))
      return reply(res, 404, { message: "NOT_FOUND" });
    const content = await readFile(join(root, path.slice(1)));
    res.writeHead(200, {
      "Content-Type": types[extname(path)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff"
    });
    if (req.method === "HEAD") return res.end();
    // This line only exists when the bundled local server serves config.js.
    res.end(
      path === "/config.js"
        ? Buffer.concat([content, Buffer.from('\nwindow.OHAENG_LOCAL_ENDPOINT = "/api";\n')])
        : content
    );
  } catch (error) {
    if (error.code === "ENOENT") return reply(res, 404, { message: "NOT_FOUND" });
    const known =
      /^(SIGN_IN|PROFILE|SESSION_MISMATCH|ROOM_GONE|MESSAGE|SLOW_DOWN|BLOCK_SELF|USER_GONE|REPORT|MESSAGE_GONE)$/;
    return reply(res, 400, { message: known.test(error.message) ? error.message : "BAD_REQUEST" });
  }
});
const port = Number(process.env.PORT || 4173);
server.listen(port, "0.0.0.0", () => {
  console.log("오행의 섬  http://localhost:" + port);
  let addresses;
  try {
    addresses = networkInterfaces();
  } catch {
    return;
  }
  for (const net of Object.values(addresses).flat()) {
    if (net && !net.internal && net.family === "IPv4")
      console.log("같은 Wi-Fi  http://" + net.address + ":" + port);
  }
});
async function close() {
  server.close();
  await db.close();
  process.exit(0);
}
process.on("SIGINT", close);
process.on("SIGTERM", close);
