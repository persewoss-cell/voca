# 파파고(Papago) 번역 프록시 설정 가이드

단어장의 "새단어 추가"에서 "추천 뜻 자동입력"이 더 정확하고 안정적으로 동작하도록,
네이버 파파고(Papago) 번역 API를 연결하는 방법입니다.

파파고 API는 보안상 브라우저에서 직접 호출할 수 없어서, 중간에 아주 작은 서버
(Cloudflare Worker)를 하나 두고 그 서버가 대신 파파고를 호출합니다. 이 폴더의
`worker.js`가 바로 그 서버 코드입니다.

두 단계만 진행하면 됩니다.

## 1단계. 네이버 클라우드 플랫폼(NCP)에서 파파고 API 키 발급받기

1. https://www.ncloud.com 에 접속해서 회원가입 및 로그인합니다. (본인 인증이 필요할 수 있습니다.)
2. 콘솔(Console)로 이동한 뒤, 상단 메뉴에서 **AI·Application Service → Papago Translation**
   (또는 검색창에 "Papago" 검색)으로 들어갑니다.
3. **Application 등록**을 눌러 새 애플리케이션을 만듭니다. 서비스 환경(Service Environment)은
   **Papago Translation**을 선택하면 됩니다.
4. 등록이 끝나면 **Client ID**와 **Client Secret** 값이 발급됩니다. 이 두 값을 안전한 곳에
   복사해두세요. (다른 사람에게 공유하지 마세요 — 이 값이 곧 비밀번호입니다.)

무료 사용량이 제공되며, 초과 시에만 과금됩니다. 자세한 무료 한도는 NCP 콘솔의 요금 안내를
참고해주세요.

## 2단계. Cloudflare Workers에 프록시 배포하기

1. https://dash.cloudflare.com/sign-up 에서 무료로 가입합니다. (신용카드 없이 가입 가능합니다.)
2. 왼쪽 메뉴에서 **Workers & Pages**로 이동한 뒤 **Create Application → Create Worker**를 누릅니다.
3. 이름을 정하고(예: `papago-proxy`) **Deploy**를 눌러 기본 템플릿을 먼저 배포합니다.
4. 배포된 Worker 페이지에서 **Edit code**를 누른 뒤, 기존 코드를 모두 지우고 이 폴더의
   `worker.js` 내용을 그대로 붙여넣습니다. **Save and deploy**를 누릅니다.
5. Worker 설정 화면에서 **Settings → Variables and Secrets**로 이동해 아래 두 개를
   **Secret**(암호화됨) 타입으로 추가합니다.
   - `NCP_CLIENT_ID` → 1단계에서 받은 Client ID
   - `NCP_CLIENT_SECRET` → 1단계에서 받은 Client Secret
6. 저장하면 Worker가 자동으로 다시 배포됩니다. Worker 개요 화면 상단에 표시되는 주소
   (예: `https://papago-proxy.본인아이디.workers.dev`)를 복사해둡니다.

## 3단계. 단어장 앱에 연결하기

`vocab-app.js` 파일 맨 위쪽에 있는 아래 줄을 찾아서,

```js
const PAPAGO_PROXY_URL = ""; // 예: "https://papago-proxy.본인아이디.workers.dev"
```

따옴표 안에 2단계에서 복사한 Worker 주소를 붙여넣고 저장합니다. 이 값이 비어 있으면
지금처럼 기존 무료 번역 API만 사용하고, 값을 채우면 "추천 뜻 자동입력"이 파파고를
가장 먼저 사용하고 실패할 때만 기존 방식으로 대체됩니다.

궁금한 점이 있거나 배포 중 막히는 부분이 있으면 Claude에게 Worker 주소나 오류 메시지를
알려주시면 이어서 도와드릴 수 있습니다.
