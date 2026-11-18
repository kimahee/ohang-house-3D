# 오행의 섬

다섯 수채화 섬 가운데 하나를 골라 자유롭게 걷고, 가까이 있는 실제 주민과 말풍선으로 대화하는 모바일·PC 웹 게임입니다.

| 하고 싶은 일 | 시작 방법 |
| --- | --- |
| 지금 혼자 산책 | ZIP을 모두 푼 뒤 `index.html`을 Chrome, Edge 또는 Safari로 엽니다. |
| 친구와 인터넷에서 만나기 | 아래의 **GitHub Pages 배포**와 **Supabase 연결**을 차례로 진행합니다. |
| 같은 Wi-Fi에서 둘이 테스트 | **내 컴퓨터에서 공유 서버 실행**의 두 명령을 실행합니다. |

## GitHub Pages 배포

1. GitHub에서 이 게임용 저장소를 만듭니다. 예시 이름은 `ohaeng-islands`입니다.
2. 압축을 푼 폴더에서 `index.html`이 보이는 위치까지 들어갑니다. GitHub 저장소의 **Add file → Upload files**에서 그 안의 파일과 하위 폴더를 함께 올리고 **Commit changes**를 누릅니다. 저장소 첫 화면에서 `index.html`, `styles.css`, `config.js`, `js/`, `assets/`가 나란히 보여야 합니다.
3. 저장소의 **Settings → Pages → Build and deployment**에서 **Deploy from a branch → main → /(root) → Save**를 선택합니다. 파일을 다른 브랜치에 올렸다면 그 브랜치를 고릅니다.
4. 배포가 끝나면 **Settings → Pages → Visit site**에서 게임을 엽니다. 일반 프로젝트 저장소의 주소 형식은 `https://아이디.github.io/저장소이름/`입니다. 아직 링크가 보이지 않으면 저장소의 **Actions**에서 Pages 배포의 완료 상태를 확인합니다.

기존 **오행의 집** 저장소에 추가할 때는 `islands/` 폴더 안에 게임 파일 전체를 넣을 수 있습니다. 이 경우 방문 주소는 기존 Pages 주소 뒤에 `islands/`를 붙입니다. Pages의 발행 폴더가 `/docs`라면 `docs/islands/` 안에 넣습니다.

[GitHub Pages 공식 배포 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Supabase 연결

1. 게임에 사용할 Supabase 프로젝트를 열고 **Authentication → Sign In / Providers**에서 **Allow anonymous sign-ins**를 켭니다. 플레이어는 이메일 입력 없이 닉네임으로 입장합니다.
2. **SQL Editor → New query**를 연 뒤 이 저장소의 `supabase/setup.sql` 전체를 붙여 넣고 **Run**을 누릅니다. 섬, 지형, 주민, 말풍선, 차단, 신고 및 방문 통계가 준비됩니다. 게임은 Supabase **Data API**를 사용하므로 프로젝트에서 Data API와 `public` 스키마 노출을 켜 둡니다.
3. Supabase의 **Connect**에서 **Project URL**과 **Publishable key**를 복사합니다. 키는 **Settings → API Keys**에서도 확인할 수 있습니다.
4. GitHub에서 `config.js`를 열고 연필 모양 **Edit** 버튼으로 두 값을 입력한 뒤 커밋합니다. 브라우저에 전달할 키는 `sb_publishable_`로 시작하는 공개 키입니다.

```js
window.OHAENG_CONFIG = {
  supabaseUrl: "https://프로젝트참조값.supabase.co",
  supabasePublishableKey: "sb_publishable_여기에_공개키"
};
```

5. Pages 배포가 끝난 뒤 새로고침합니다. 시작 화면에 **온라인 산책**이 표시되면 두 기기에서 같은 게임 주소와 같은 섬을 선택합니다. 두 아바타를 가까이 세우고 한쪽에서 말풍선을 보내 확인할 수 있습니다.

| 화면에 보이는 상태 | 의미 |
| --- | --- |
| 혼자 산책 | 이 화면의 아바타로 다섯 섬을 둘러볼 수 있습니다. |
| 온라인 산책 | 공개 주소가 Supabase 게임 서버에 연결되어 있습니다. |
| 공유 서버 연결됨 | 직접 실행한 서버에 연결되어 있습니다. 같은 서버 주소에서 함께 플레이할 수 있습니다. |
| 서버 연결 확인 필요 / 연결 복구 중 | 게임이 연결을 다시 시도합니다. 처음 설정 중이라면 익명 로그인, SQL 실행 결과, 공개 키, Data API 설정을 확인하세요. |

[Supabase 익명 로그인](https://supabase.com/docs/guides/auth/auth-anonymous) · [프로젝트 URL과 공개 키](https://supabase.com/docs/guides/getting-started/api-keys)

## 내 컴퓨터에서 공유 서버 실행

Node.js 20 이상을 설치한 컴퓨터에서 `package.json`이 있는 폴더를 터미널로 엽니다. `config.js`의 두 값은 비워 둡니다.

```sh
npm ci
npm start
```

컴퓨터는 `http://localhost:4173`으로 접속합니다. 같은 Wi-Fi의 휴대폰에서는 터미널의 **같은 Wi-Fi** 옆에 표시된 주소를 엽니다. 주소가 표시되지 않으면 컴퓨터의 무선 LAN IPv4 주소와 포트 4173을 사용합니다. 연결 중에는 서버를 켜 두세요.

로컬 서버는 번들에 지정된 PGlite로 PostgreSQL을 실행합니다. Supabase와 동일한 SQL로 섬 상태, 근거리 메시지 수신자, 자리 배정, 신고를 처리합니다. 서버 데이터와 로컬 인증 정보는 `.local-game/`에 저장됩니다. 이 폴더와 `node_modules/`는 GitHub 업로드 대상에서 제외하세요.

## 산책과 대화

| 동작 | 조작 |
| --- | --- |
| 이동 | PC 방향키·WASD 또는 땅 클릭. 휴대폰은 가고 싶은 땅을 터치합니다. |
| 장소 찾기 | **산책 수첩**의 장소를 선택하면 가능한 길을 따라 걷습니다. 수의 섬 강은 나무다리로 건넙니다. |
| 말풍선 | 입력창에 1~100자를 쓰고 전송합니다. PC에서 Enter를 누르면 입력창으로 이동합니다. |
| 인사·앉기 | **인사**에서 빠른 말풍선, 손 흔들기, 박수를 고릅니다. **앉기**는 가까운 빈자리를 찾아갑니다. 이동하거나 **일어나기**를 누르면 자리에서 일어납니다. |
| 기록·차단·신고 | **산책 수첩**에서 받은 말을 다시 볼 수 있습니다. 주민 메뉴에서 차단하고 주민 목록에서 해제합니다. 받은 메시지 옆 **신고**를 누르면 사유를 선택할 수 있습니다. |
| 사진·섬 이동 | 카메라 버튼은 현재 산책 장면을 PNG로 저장합니다. **전체 지도**를 열면 같은 닉네임·망토로 다른 섬에 갈 수 있습니다. |

움직임과 대화는 서버에 약 0.4초 간격으로 동기화하며 다른 아바타의 움직임은 화면에서 부드럽게 이어집니다. 말풍선은 발송 시점에 같은 섬에서 반경 180 지도 단위 안에 있던 접속자에게 전달됩니다. 섬을 옮기면 대화 수첩이 비워집니다. 앱을 정상 종료하면 퇴장하고, 네트워크가 끊긴 주민은 마지막 응답 후 35초가 지나면 인원에서 빠집니다.

## 운영자가 확인할 수 있는 정보

Supabase의 **SQL Editor**에서 필요한 쿼리를 실행합니다. 누적 방문 수는 실제 섬에 한 번 이상 입장한 익명 계정 수입니다. 같은 브라우저에서 재방문하면 같은 계정으로 집계되며, 저장 데이터를 지우거나 다른 브라우저를 쓰면 새 계정이 될 수 있습니다.

```sql
-- 누적 방문자 수
select count(*) as visitors from ohaeng_game.visitors;

-- 지금 섬별 접속 인원 (접속 세션 기준)
select public.ohaeng_counts();

-- 신고된 발언과 사유
select reported_at, room, sender_name, body, reason
from ohaeng_game.reports
order by reported_at desc;
```

신고는 운영자 검토용으로 저장됩니다. 로컬 서버에서는 서버를 종료한 뒤 같은 폴더에서 `node server.mjs --reports`로 확인할 수 있습니다. 대화 원문은 새 입장 시 하루가 지난 기록부터 정리하고, 신고 내용은 별도로 보관합니다.

## 구성 파일

| 위치 | 수정할 내용 |
| --- | --- |
| `index.html`, `styles.css` | 화면 구성과 모바일 레이아웃 |
| `assets/maps/`, `js/catalog.js` | 전체 지도·섬 상세 그림, 섬 이름, 장소 좌표와 이동 경계 |
| `js/navigation.js`, `js/world.js` | 도보 경로, 충돌 판정, 카메라, 주민 표시와 말풍선 |
| `js/art.js`, `js/postcards.js` | 아바타·벤치·다리 그림과 섬 미리보기 |
| `js/app.js`, `js/network.js` | 화면 전환, 주민 메뉴, 대화, 익명 로그인과 서버 연결 |
| `config.js`, `supabase/setup.sql` | 프로젝트 연결, 서버 데이터, 지형 검증과 수신 범위 |
| `server.mjs`, `package*.json` | 로컬 공유 서버와 실행 환경 |

섬 지도는 이 프로젝트의 수채화 지도 6장을 사용합니다. 이동 가능 지형과 좌표는 1000 × 750 기준입니다. 해안선·다리·벤치 위치를 변경할 때는 클라이언트의 `catalog.js`와 `setup.sql`의 섬 데이터를 함께 갱신하세요. 글꼴 라이선스는 `assets/fonts/`에 포함되어 있습니다.
