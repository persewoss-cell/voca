# Isadora Moon 단어장

Isadora Moon 책 단어장을 발음 듣기 기능과 함께 볼 수 있는 웹사이트입니다.

- 단어/표현 170개 (챕터별 정리 + 부록)
- 단어 옆 🔊 버튼 → 단어 발음 재생
- 예문 옆 🔊 버튼 → 예문 전체를 영어로 재생
- 챕터 필터, 검색 기능
- 발음 재생은 브라우저 내장 [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)를 사용하므로 별도 데이터베이스나 유료 API 없이 완전히 무료로 동작합니다.

## GitHub Pages로 배포하기 (무료)

1. 저장소 **Settings → Pages** 로 이동합니다.
2. **Source**를 `Deploy from a branch`로 설정합니다.
3. Branch를 `main`, 폴더를 `/ (root)`로 선택하고 저장합니다.
4. 몇 분 뒤 `https://<사용자명>.github.io/voca/` 주소로 사이트가 열립니다.

## 추천 뜻 자동입력에 파파고(Papago) 연결하기 (선택)

"새단어 추가"의 추천 뜻 자동입력은 기본적으로 무료 번역 API로 동작하지만, 더 정확하고
안정적으로 쓰고 싶다면 네이버 파파고 API를 연결할 수 있습니다. `papago-proxy/README.md`에
설정 방법이 정리되어 있습니다.

## 로컬에서 미리 보기

별도 빌드 과정 없이 정적 파일이므로, 저장소를 내려받은 뒤 `index.html`을 브라우저로 열거나 아래처럼 간단한 로컬 서버로 실행하면 됩니다.

```bash
python3 -m http.server 8000
```

그 후 브라우저에서 `http://localhost:8000` 접속.
