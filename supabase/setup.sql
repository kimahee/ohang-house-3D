-- 오행의 섬 · Supabase SQL Editor에서 이 파일 전체를 한 번 실행하세요.
-- 이 게임의 전용 스키마와 RPC만 생성합니다. 다시 실행해도 기존 데이터가 유지됩니다.
begin;
create schema if not exists ohaeng_game;
revoke all on schema ohaeng_game from public, anon, authenticated;

create table if not exists ohaeng_game.rooms (
  id text primary key, terrain bytea not null, spawn int[] not null, seats jsonb not null
);
insert into ohaeng_game.rooms(id,terrain,spawn,seats) values
('wood',decode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAP4AAAAAAAf4AAAAAH/4AAAAAAL/8AAAAD//wAAAAAB//8AAABf//gAAAAAP//4AAAH///gAAAAB///wAAA////AAAAAf///oAAD///+AAAAD////wAD////8AAAAP///////////4AAAB////////////wAAB/////////////gAAP/////////////gAB//////////////AAf/////////////+gB//////////////+AP//////////////+A///////////////4H///////////////wf///////////////B///////////////8P///////////////w///////////////+D///////////////4P///////////////gf//////////////+D///////////////wD///////////////AH//////////////8AP//////////////gA//////////////4AB//////////////AAB/////////////4AAD/////////////AAAP////////////8AAA/////////////wAAD////////////+AAAH////////////oAAAP///////////+AAAAf///////////AAAAAf/////////+AAAAAA//////////wAAAAAA/////////+AAAAAAD/////////4AAAAAAD////////+AAAAAAAD////////wAAAAAAAD///////+AAAAAAAAD//59//+gAAAAAAAAD/MAB//wAAAAAAAAABwAAA/kAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=','base64'),array[414, 437],'[[504, 370], [532, 370], [723, 311], [751, 311]]'::jsonb),
('fire',decode('AAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAf//AAAAAAAAAAAAAD//+AAAAAAAAAAAAAP//+ADwAAAAAAAAAB///+B/4AAAAAAAAAP//////wAAAAAAAAB///////gAAAAAAAAP//////+AAAAAAAAB////////QAAAAAAAP////////AAAAAAAA////////+AAAAAAAH////////+AAAAAAAP////////8AAAAAAB/////////4AAAAAAH/////////wAAAAAA//////////gAAAAAD//////////AAAAAAf/////////8AAAAAD//////////4AAAAAf//////////gAAAAD//////////+AAAAAP//////////wAAAAB///////////gAAAAD//////////+AAAAAf//4P//////4AAAAB//4Af//////AAAAAH/+AA//////8AAAAAf/gAB//////AAAAAB/4AAD/////wAAAAAP/AAA/////+AAAAAB/wAAP/////wAAAAAH+AAD//////AAAAAA/gAB//////4AAAAAD8AAf//////AAAAAAfAAP//////4AAAAAB8AD///////wAAAAAHgA///////+AAAAAAeAP///////4AAAAABwB////////AAAAAADAP///////8AAAAAAMB////////4AAAAAAAP////////wAAAAAAB/////////AAAAAAEP////////+AAAAAAZ/////////8AAAAAB//////////wAAAAAH//////////AAAAAA//////////8AAAAAB//////////gAAAAAH/////////8AAAAAAf/////////4AAAAAA//////////AAAAAAD/////////4AAAAAAH/////////gAAAAAAP////////+AAAAAAAB////////gAAAAAAAH////////AAAAAAAAf///////wAAAAAAAA////////AAAAAAAAB///////wAAAAAAAAH//////8AAAAAAAAAD//////wAAAAAAAAAD/////+AAAAAAAAAAAf////gAAAAAAAAAAAf///8AAAAAAAAAAAA////wAAAAAAAAAAAB///wAAAAAAAAAAAAA//gAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=','base64'),array[419, 509],'[[490, 436], [518, 436], [647, 361], [675, 361]]'::jsonb),
('earth',decode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAegAAAAAAAAAAAAAAP/wAAAAAAAAAAAAAF//6AAAAAAAAAAAAA///8AAAAAAAAAAAAH///6AAAAAAAAAAAA////4AAAAAAAAAAAH////3/AAAAAAAAAA///////AAAAAAAAAH///////AAAAAAAAB///////+AAAAAAAAf/////////4AAAAAH//////////8AAAAAf//////////8AAAAD///////////4AAAAf///////////wAAAB////////////AAAAP////////////AAAAf///////////8AAAD////////////4AAAP////////////wAAA/////////////AAAP////////////8AAA/////////////wAAH/////////////gAD//////////////AAf/////////////+AB//////////////8AP//////////////4A///////////////AD//////////////+Af//////////////4B///////////////AH//////////////8Af//////////////4A///////////////AB//////////////8AP//////////////AAf/////////////8AA//////////////wAB/////////////+AAH/////////////4AAf/////////////wAA//////////////AAD/////////////8AAf/////////////wAA/////////////+AAD/////////////4AAf/////////////AAB/////////////wAAD////////////+AAAH////////////wAAAP///////////8AAAA///////////8AAAAB///////////AAAAAA//////////oAAAAAC/////////+AAAAAAAA////////wAAAAAAAB///////+AAAAAAAAP//////lAAAAAAAAAf/////8AAAAAAAAAAP/////AAAAAAAAAAAHn///4AAAAAAAAAAAAP//9AAAAAAAAAAAAAH//gAAAAAAAAAAAAAf/+AAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=','base64'),array[421, 486],'[[508, 414], [536, 414], [714, 320], [742, 320]]'::jsonb),
('metal',decode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAP4AAAAAAAAAAAAAAAfwAAAAAAAAAAAIAAB/wAAAAAAAAAAfwAAD/wAAAAAAAAAH+AAAH//wAAAAAAAA/wAAAP//gAAAAAAAH+AAAB//+AAAAAAAA/wAAA///4AAAAAAAf/AAA////4AAAAAAP//gAP//5/wAAAAAff//+D//+B/gAAAAH4f//////wH/AAAAA+Af//////AP/AAAAHwA//////4Af4AAAAeAB//////AB/wAAADwAD/////4AD/gAAAOAAH/////AAD/gAAF4AAP////4AgH/AABfAAA/////4f//+AAP8A/f/////////4AA/+P///////////wAH//////////////AA//////////////+AH//////////////wAP//////////////gB//////////////+AP//////////////8B///////////////4H///////////////gf///////////////D///////////////4P///////////////gf//////////////+B///////////////wB//////////////+AAf/////////////wAAf/////////////AAAf////////////4AAA/////////////AAAD///////////g4AAAP//////////wAAAAAf/////////wAAAAAAf////////gAAAAAAAH///////8AAAAAAAAH///////gAAAAAAAAf//////8AAAAAAAAAf//////gAAAAAAAAA/5////8AAAAAAAAAAAA////gAAAAAAAAAAAA///wAAAAAAAAAAAAB//+AAAAAAAAAAAAAAAfwAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=','base64'),array[402, 451],'[[496, 384], [524, 384], [756, 413], [784, 413]]'::jsonb),
('water',decode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAf/gAAAAAAAAAAAAAH//wAAAAAAAAAAAA////gAAAAAAAAAAAP////AAAAAAAAAAAD////+AAAAAAAAAAD/////8AAAAAAAAAA//////4AAAAAAAAAH/////wAAAAAAAAAA/////8AAAAAAAAAAH/////gAAAAAAAAAB/////+PwAAAAAAAD//////x/gAAAAAAA//////4P+AAAAAAAH/////wB/8AAAAAAA/////4Af/8AAAAAAP////+Af//8AAAAAD/////wP///wAAAAAP////+D////gAAAAB/////wf///+AAAAAH/////B////8AAAAA/////8D////wAAAAH/////4P////gAAAAf/////gH///+AAAAB//////gD///4AAAAP//////AB///gAAAA///////AA//+AAAAB///////wA//wAAAAH///////4B//AAAAAf///////4D/4AAAAAf///////4H/wAAAAA////////wP/AAAAAD//////////8AAAAAP//////////4AAAAAf//////////gAAAAB////////B/+AAAAAH///////4H/8AAAAAf//////+A//gAAAAB///////AP/+AAAAAP//////AB//wAAAAA//////gA///AAAAAH/////4Af//4AAAAA/////+AP///AAAAAD/////wH///8AAAAAP////+A////wAAAAB/////wH////AAAAAH////+A////8AAAAAf////wD////4AAAAA/////APwCf/gAAAAD////8A+AAP+AAAAAH////4BAAAP4AAAAAP////gAAAAfAAAAAAf////AAAAA8AAAAAAf///+AAAABgAAAAAA////8AAAAAAAAAAAB////gAAAAAAAAAAAH///4AAAAAAAAAAAAP///AAAAAAAAAAAAAf//8AAAAAAAAAAAAAf//wAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAP4AAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=','base64'),array[370, 445],'[[451, 371], [479, 371], [803, 374], [831, 374]]'::jsonb)
on conflict(id) do update set terrain=excluded.terrain,spawn=excluded.spawn,seats=excluded.seats;
create table if not exists ohaeng_game.visitors (
  uid uuid primary key, first_seen timestamptz not null default now(), last_seen timestamptz not null default now()
);
alter table ohaeng_game.rooms add column if not exists home_version bigint not null default 0;
create table if not exists ohaeng_game.houses (
  owner uuid primary key references ohaeng_game.visitors(uid),
  room text not null references ohaeng_game.rooms(id),
  kind text not null check (kind in ('wood','fire','earth','metal','water')),
  x int not null, y int not null, name text not null, rev int not null default 1
);
create index if not exists ohaeng_houses_room on ohaeng_game.houses(room);
create table if not exists ohaeng_game.players (
  sid uuid primary key, uid uuid not null, room text not null references ohaeng_game.rooms(id),
  name text not null, color int not null, x int not null, y int not null, face int not null default 1,
  seat int not null default -1, arrived timestamptz not null default now(),
  seen timestamptz not null default now(), last_said timestamptz
);
create index if not exists ohaeng_players_room_seen on ohaeng_game.players(room, seen);
create table if not exists ohaeng_game.messages (
  seq bigint generated always as identity primary key, event_key uuid not null unique,
  room text not null, sid uuid not null, uid uuid not null, name text not null,
  kind text not null, body text not null, sent timestamptz not null default now(), audience uuid[] not null
);
create index if not exists ohaeng_messages_room_sent on ohaeng_game.messages(room, sent);
create table if not exists ohaeng_game.blocks (
  owner uuid not null, target uuid not null, name text not null, primary key(owner,target)
);
create table if not exists ohaeng_game.reports (
  reporter uuid not null, message_seq bigint not null, reason text not null,
  room text not null, sender uuid not null, sender_name text not null, body text not null,
  message_time timestamptz not null, reported_at timestamptz not null default now(),
  primary key(reporter,message_seq)
);
-- No direct Data API access to game tables. RPCs use the authenticated subject.
alter table ohaeng_game.rooms enable row level security;
alter table ohaeng_game.visitors enable row level security;
alter table ohaeng_game.houses enable row level security;
alter table ohaeng_game.players enable row level security;
alter table ohaeng_game.messages enable row level security;
alter table ohaeng_game.blocks enable row level security;
alter table ohaeng_game.reports enable row level security;
revoke all on all tables in schema ohaeng_game from public, anon, authenticated;
revoke all on all sequences in schema ohaeng_game from public, anon, authenticated;

create or replace function ohaeng_game.walkable(p_room text, px int, py int)
returns boolean language sql stable set search_path = '' as $fn$
  select case when px between 0 and 999 and py between 0 and 749 then
    (get_byte(r.terrain, ((py/10)*100+px/10)/8) & (128 >> (((py/10)*100+px/10)%8))) <> 0
    else false end from ohaeng_game.rooms r where r.id=p_room;
$fn$;

create or replace function ohaeng_game.player_json(p ohaeng_game.players)
returns jsonb language sql immutable set search_path = '' as $fn$
  select jsonb_build_object('sid',p.sid,'uid',p.uid,'name',p.name,'color',p.color,'x',p.x,'y',p.y,'face',p.face,'seat',p.seat);
$fn$;
create or replace function ohaeng_game.message_json(m ohaeng_game.messages)
returns jsonb language sql stable set search_path = '' as $fn$
  select jsonb_build_object('seq',m.seq,'sid',m.sid,'uid',m.uid,'name',m.name,'kind',m.kind,'body',m.body,
    'at',floor(extract(epoch from m.sent)*1000),'age',greatest(0,extract(epoch from (now()-m.sent))));
$fn$;

create or replace function ohaeng_game.home_json(h ohaeng_game.houses)
returns jsonb language sql immutable strict set search_path = '' as $fn$
  select jsonb_build_object('uid',h.owner,'room',h.room,'kind',h.kind,'x',h.x,'y',h.y,'name',h.name,'rev',h.rev);
$fn$;

create or replace function ohaeng_game.can_stand(p_room text,px int,py int)
returns boolean language sql stable set search_path = '' as $fn$
  select ohaeng_game.walkable(p_room,px,py) and not exists (
    select from ohaeng_game.houses h where h.room=p_room
      and px/10 between h.x/10-3 and h.x/10+3 and py/10 between h.y/10-3 and h.y/10);
$fn$;

create or replace function ohaeng_game.snapshot(me ohaeng_game.players)
returns jsonb language sql stable set search_path = '' as $fn$
  select jsonb_build_object(
    'self',ohaeng_game.player_json(me),
    'homeVersion',(select r.home_version from ohaeng_game.rooms r where r.id=me.room),
    'myHome',(select ohaeng_game.home_json(h) from ohaeng_game.houses h where h.owner=me.uid),
    'homes',coalesce((select jsonb_agg(ohaeng_game.home_json(h) order by h.y,h.owner)
      from ohaeng_game.houses h where h.room=me.room),'[]'::jsonb),
    'players',coalesce((select jsonb_agg(ohaeng_game.player_json(p) order by p.arrived,p.sid)
      from ohaeng_game.players p where p.room=me.room and p.sid<>me.sid
      and p.seen>now()-interval '35 seconds'), '[]'::jsonb),
    'events',coalesce((select jsonb_agg(t.item order by t.seq) from (
      select m.seq,ohaeng_game.message_json(m) as item from ohaeng_game.messages m
      where m.room=me.room and me.sid=any(m.audience) and m.sent>=me.arrived
        and m.sent>now()-interval '5 minutes' and not exists(
          select 1 from ohaeng_game.blocks b where b.owner=me.uid and b.target=m.uid)
      order by m.seq desc limit 45) t), '[]'::jsonb),
    'blocks',coalesce((select jsonb_agg(jsonb_build_object('uid',b.target,'name',b.name) order by b.name)
      from ohaeng_game.blocks b where b.owner=me.uid), '[]'::jsonb));
$fn$;

create or replace function public.ohaeng_counts() returns jsonb
language sql stable security definer set search_path = '' as $fn$
  select jsonb_object_agg(q.id,q.total) from (
    select r.id,count(p.sid) as total from ohaeng_game.rooms r left join ohaeng_game.players p
      on p.room=r.id and p.seen>now()-interval '35 seconds' group by r.id) q;
$fn$;

create or replace function public.ohaeng_enter(p_session uuid,p_room text,p_name text,p_color int)
returns jsonb language plpgsql security definer set search_path = '' as $fn$
declare u uuid := auth.uid(); r ohaeng_game.rooms; me ohaeng_game.players; dx int; dy int;
begin
  if u is null or p_session is null then raise exception 'SIGN_IN'; end if;
  if p_name is null or char_length(btrim(p_name)) not between 1 and 12 or p_name ~ '[[:cntrl:]]' or
     p_color is null or p_color not between 0 and 4 then raise exception 'PROFILE'; end if;
  select * into strict r from ohaeng_game.rooms where id=p_room;
  -- Spread arrivals around the signpost, so two newcomers can see each other.
  dx := (get_byte(uuid_send(p_session),0)%5-2)*11;
  dy := (get_byte(uuid_send(p_session),1)%3-1)*9;
  insert into ohaeng_game.players as p(sid,uid,room,name,color,x,y)
    values(p_session,u,p_room,btrim(p_name),p_color,r.spawn[1]+dx,r.spawn[2]+dy)
    on conflict(sid) do update set seen=now(),name=excluded.name,color=excluded.color
    where p.uid=u and p.room=p_room returning * into me;
  if me.sid is null then raise exception 'SESSION_MISMATCH'; end if;
  insert into ohaeng_game.visitors(uid) values(u) on conflict(uid) do update set last_seen=now();
  delete from ohaeng_game.players where seen<now()-interval '1 day';
  delete from ohaeng_game.messages where sent<now()-interval '1 day';
  return ohaeng_game.snapshot(me);
end; $fn$;

create or replace function public.ohaeng_tick(p_session uuid,p_room text,p_x int,p_y int,p_face int,p_seat int)
returns jsonb language plpgsql security definer set search_path = '' as $fn$
declare me ohaeng_game.players; seats jsonb; sx int; sy int;
begin
  select * into me from ohaeng_game.players where sid=p_session and uid=auth.uid() and room=p_room for update;
  if not found then raise exception 'ROOM_GONE'; end if;
  if p_seat=-1 or me.seen<=now()-interval '35 seconds' then me.seat:=-1; end if;
  -- Serialize a position change with a house placement or seat claim in the same room.
  if p_seat between 0 and 3 and p_seat<>me.seat then
    select r.seats into seats from ohaeng_game.rooms r where r.id=p_room for update;
  else
    perform 1 from ohaeng_game.rooms r where r.id=p_room for share;
  end if;
  if me.seat=-1 and ohaeng_game.can_stand(p_room,p_x,p_y) then me.x:=p_x; me.y:=p_y;
  elsif not ohaeng_game.can_stand(p_room,me.x,me.y) then
    select r.spawn[1],r.spawn[2] into me.x,me.y from ohaeng_game.rooms r where r.id=p_room;
  end if;
  if p_seat between 0 and 3 and p_seat<>me.seat then
    sx:=(seats->p_seat->>0)::int; sy:=(seats->p_seat->>1)::int;
    if abs(me.x-sx)<=42 and abs(me.y-sy)<=42 and not exists(
      select 1 from ohaeng_game.players p where p.room=p_room and p.seat=p_seat and p.sid<>me.sid
      and p.seen>now()-interval '35 seconds') then me.seat:=p_seat; me.x:=sx; me.y:=sy; end if;
  end if;
  update ohaeng_game.players set seen=now(),x=me.x,y=me.y,seat=me.seat,
    face=case when p_face=-1 then -1 else 1 end where sid=me.sid returning * into me;
  return ohaeng_game.snapshot(me);
end; $fn$;

-- Store one home for each resident. An island transfer and its layout revisions commit together.
create or replace function public.ohaeng_place_home(
  p_session uuid, p_room text, p_kind text, p_x int, p_y int, p_expected int)
returns jsonb language plpgsql security definer set search_path = '' as $fn$
declare
  me ohaeng_game.players; previous ohaeng_game.houses; r ohaeng_game.rooms;
begin
  select * into me from ohaeng_game.players
    where sid=p_session and room=p_room and uid=auth.uid() and seen>now()-interval '35 seconds' for update;
  if not found then raise exception 'ROOM_GONE'; end if;
  perform 1 from ohaeng_game.visitors v where v.uid=me.uid for update;
  select * into previous from ohaeng_game.houses where owner=me.uid;
  if p_kind is null or p_kind not in ('wood','fire','earth','metal','water') or
    p_x is null or p_y is null or p_x not between 35 and 965 or p_y not between 35 and 735
    or p_x%10<>5 or p_y%10<>5 then raise exception 'HOME_GROUND'; end if;
  if previous.room=p_room and previous.kind=p_kind and previous.x=p_x and previous.y=p_y then
    return ohaeng_game.snapshot(me);
  end if;
  if p_expected is distinct from coalesce(previous.rev,0) then raise exception 'HOME_STALE'; end if;
  perform 1 from ohaeng_game.rooms where id in (p_room,previous.room) order by id for update;
  select * into strict r from ohaeng_game.rooms where id=p_room;
  if exists(select from generate_series(-30,30,10) dx cross join generate_series(-30,10,10) dy
    where not ohaeng_game.walkable(p_room,p_x+dx,p_y+dy)) then raise exception 'HOME_GROUND'; end if;
  if (abs(r.spawn[1]-p_x)<78 and abs(r.spawn[2]-p_y)<56) or
    (p_room='water' and abs(706-p_x)<115 and abs(365-p_y)<53) or
    exists(select from jsonb_array_elements(r.seats) seat
      where abs((seat->>0)::int-p_x)<60 and abs((seat->>1)::int-p_y)<56)
    then raise exception 'HOME_PATH'; end if;
  if exists(select from ohaeng_game.houses h where h.owner<>me.uid and h.room=p_room
    and abs(h.x-p_x)<90 and abs(h.y-p_y)<60) then raise exception 'HOME_NEIGHBOR'; end if;
  if exists(select from ohaeng_game.players p where p.room=p_room and p.seen>now()-interval '35 seconds'
    and abs(p.x-p_x)<42 and p.y between p_y-40 and p_y+8) then raise exception 'HOME_RESIDENT'; end if;
  insert into ohaeng_game.houses as h(owner,room,kind,x,y,name,rev)
    values(me.uid,p_room,p_kind,p_x,p_y,me.name,coalesce(previous.rev,0)+1)
    on conflict(owner) do update set room=excluded.room,kind=excluded.kind,x=excluded.x,
      y=excluded.y,name=excluded.name,rev=excluded.rev;
  update ohaeng_game.rooms set home_version=home_version+1 where id in (p_room,previous.room);
  return ohaeng_game.snapshot(me);
end; $fn$;

create or replace function public.ohaeng_say(p_session uuid,p_room text,p_event uuid,p_kind text,p_text text)
returns jsonb language plpgsql security definer set search_path = '' as $fn$
declare me ohaeng_game.players; m ohaeng_game.messages; recipients uuid[]; msg text:=btrim(p_text);
begin
  select * into me from ohaeng_game.players where sid=p_session and uid=auth.uid() and room=p_room
    and seen>now()-interval '35 seconds' for update;
  if not found then raise exception 'ROOM_GONE'; end if;
  select * into m from ohaeng_game.messages where event_key=p_event and sid=me.sid;
  if found then return ohaeng_game.message_json(m); end if;
  if p_kind is null or p_kind not in ('text','wave','clap') or p_event is null then raise exception 'MESSAGE'; end if;
  if p_kind='wave' then msg:='손을 흔들었어요'; elsif p_kind='clap' then msg:='박수를 쳤어요'; end if;
  if msg is null or char_length(msg) not between 1 and 100 or msg ~ '[[:cntrl:]]' then raise exception 'MESSAGE'; end if;
  if now()-me.last_said < interval '0.75 seconds' then raise exception 'SLOW_DOWN'; end if;
  select array_agg(p.sid) into recipients from ohaeng_game.players p where p.room=me.room
    and p.seen>now()-interval '35 seconds' and (p.x-me.x)^2+(p.y-me.y)^2<=180^2
    and not exists(select 1 from ohaeng_game.blocks b where b.owner=p.uid and b.target=me.uid);
  insert into ohaeng_game.messages(event_key,room,sid,uid,name,kind,body,audience)
    values(p_event,me.room,me.sid,me.uid,me.name,p_kind,msg,coalesce(recipients,array[me.sid])) returning * into m;
  update ohaeng_game.players set last_said=now(),seen=now() where sid=me.sid;
  return ohaeng_game.message_json(m);
end; $fn$;

create or replace function public.ohaeng_block(p_target uuid,p_on boolean)
returns boolean language plpgsql security definer set search_path = '' as $fn$
declare u uuid:=auth.uid(); alias_name text;
begin
  if u is null or p_target is null or u=p_target then raise exception 'BLOCK_SELF'; end if;
  if p_on then
    select name into alias_name from ohaeng_game.players where uid=p_target order by seen desc limit 1;
    if alias_name is null then select name into alias_name from ohaeng_game.messages where uid=p_target order by seq desc limit 1; end if;
    if alias_name is null then raise exception 'USER_GONE'; end if;
    insert into ohaeng_game.blocks(owner,target,name) values(u,p_target,alias_name)
      on conflict(owner,target) do update set name=excluded.name;
  else delete from ohaeng_game.blocks where owner=u and target=p_target; end if;
  return true;
end; $fn$;

create or replace function public.ohaeng_report(p_session uuid,p_seq bigint,p_reason text)
returns boolean language plpgsql security definer set search_path = '' as $fn$
declare u uuid:=auth.uid(); m ohaeng_game.messages;
begin
  if u is null or p_reason is null or p_reason not in ('불쾌한 표현','도배','기타') then raise exception 'REPORT'; end if;
  select msg.* into m from ohaeng_game.messages msg join ohaeng_game.players p on p.sid=p_session
    where msg.seq=p_seq and p.uid=u and msg.uid<>u and p.sid=any(msg.audience) and msg.room=p.room and msg.sent>=p.arrived;
  if not found then raise exception 'MESSAGE_GONE'; end if;
  insert into ohaeng_game.reports(reporter,message_seq,reason,room,sender,sender_name,body,message_time)
    values(u,m.seq,p_reason,m.room,m.uid,m.name,m.body,m.sent) on conflict(reporter,message_seq) do nothing;
  return true;
end; $fn$;

create or replace function public.ohaeng_leave(p_session uuid,p_room text)
returns boolean language sql security definer set search_path = '' as $fn$
  with removed as (delete from ohaeng_game.players where sid=p_session and uid=auth.uid() and room=p_room returning 1)
  select exists(select 1 from removed);
$fn$;

revoke all on all functions in schema ohaeng_game from public,anon,authenticated;
revoke all on function public.ohaeng_counts(),public.ohaeng_enter(uuid,text,text,int),
  public.ohaeng_tick(uuid,text,int,int,int,int),public.ohaeng_say(uuid,text,uuid,text,text),
  public.ohaeng_block(uuid,boolean),public.ohaeng_report(uuid,bigint,text),public.ohaeng_place_home(uuid,text,text,int,int,int),public.ohaeng_leave(uuid,text)
  from public,anon,authenticated;
grant execute on function public.ohaeng_counts() to anon,authenticated;
grant execute on function public.ohaeng_enter(uuid,text,text,int),public.ohaeng_tick(uuid,text,int,int,int,int),
  public.ohaeng_say(uuid,text,uuid,text,text),public.ohaeng_block(uuid,boolean),
  public.ohaeng_report(uuid,bigint,text),public.ohaeng_place_home(uuid,text,text,int,int,int),public.ohaeng_leave(uuid,text) to authenticated;
notify pgrst, 'reload schema';
commit;
