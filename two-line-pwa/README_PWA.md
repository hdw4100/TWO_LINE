# TWO LINE PWA → APK 배포 가이드

## 자동으로 만들어진 것 (Claude가 처리 완료)

| 파일 | 내용 |
|---|---|
| `index.html` | 게임 본체 (PWA 메타 + service worker 등록 포함) |
| `manifest.json` | 앱 이름 "TWO LINE", 풀스크린/가로 모드, 그린 테마 |
| `service-worker.js` | 오프라인 캐싱 |
| `icon-192.png` | 192×192 아이콘 (게임 톤 - 2호선 그린 + 큰 숫자 "2") |
| `icon-512.png` | 512×512 (스플래시 / 스토어) |
| `icon-maskable.png` | 512×512 (안드로이드 adaptive icon) |
| `TWO-LINE-PWA.zip` | **위 6개 파일 한꺼번에 묶음** ← 이것만 받으면 됨 |

---

## 사용자가 해야 할 일 (5분, 클릭 3번)

### Step 1 — GitHub 가입 (이미 있으면 skip)

1. https://github.com/signup 접속
2. 이메일/비밀번호 입력 → 가입 완료

### Step 2 — Repo 만들기 + 파일 업로드

1. 우상단 `+` 아이콘 → `New repository` 클릭
2. 입력:
   - Repository name: `two-line`
   - **Public** 선택 (필수)
   - 나머지 기본
   - `Create repository`
3. 빈 repo 페이지에서 `uploading an existing file` 링크 클릭
4. **`TWO-LINE-PWA.zip` 압축 풀고 안의 6개 파일을 모두 드래그해서 페이지에 떨굼**
5. 아래 `Commit changes` 클릭

### Step 3 — Pages 활성화

1. repo 페이지 상단 `Settings` 클릭
2. 좌측 메뉴 `Pages` 클릭
3. **Source** 섹션에서:
   - Branch: `main` 선택
   - Folder: `/ (root)` 선택
   - `Save` 클릭
4. 1~2분 대기. 페이지에 다음 문구 표시됨:
   ```
   ✓ Your site is live at https://[유저명].github.io/two-line/
   ```

### Step 4 — 폰에서 테스트

스마트폰 크롬 브라우저에서 그 URL 접속:
- 게임 정상 로드 → ✓ PWA 성공
- 크롬 메뉴(⋮) → "홈 화면에 추가" 옵션 보임 → 누르면 앱 아이콘 생성
- 홈 화면 아이콘 탭 → 풀스크린 게임 실행

---

## 여기까지가 1단계 — PWA 완성

폰에 설치된 PWA는:
- 앱 아이콘으로 실행
- 풀스크린 모드
- 오프라인에서도 작동 (한 번 로드 후)
- 가로 모드 강제

## 2단계 — APK로 변환 (선택사항)

PWA만으로도 앱처럼 작동하지만, Play Store 등록이나 APK 파일로 친구에게 공유하려면 **Bubblewrap** 으로 APK 빌드.

Bubblewrap은 PC에 JDK 17 + Android SDK 가 있어야 작동합니다. 환경 준비되면 알려주세요 — 다음 단계 안내드릴게요.

또는 더 간단한 방법:
- **PWABuilder** (https://www.pwabuilder.com/) — 사이트 URL 넣으면 APK 자동 생성 + 다운로드. 환경 설치 불필요.

---

## 문제 해결

### "홈 화면에 추가" 옵션이 안 보임
- HTTPS 인지 확인 (GitHub Pages는 자동 HTTPS)
- 크롬 메뉴 → 사이트 정보 → 권한
- 다른 크롬 브라우저(Edge, Samsung Internet)에서 시도

### 아이콘 깨짐
- 파일명이 정확히 `icon-192.png`, `icon-512.png`, `icon-maskable.png` 인지 확인

### 게임 안 열림
- HTML 파일명이 `index.html` 인지 확인
- 모든 6개 파일이 같은 폴더(root)에 있는지 확인

---

## 빠른 대안: PWABuilder (가장 쉬움)

GitHub Pages 작동 확인되면 https://www.pwabuilder.com/ 접속:
1. PWA URL 입력 (https://[유저명].github.io/two-line/)
2. `Start` → 분석 자동 진행
3. `Package For Stores` → Android 선택
4. 옵션 입력 (앱 이름은 자동 채워짐) → `Generate Package`
5. **`.apk` 파일 다운로드** ← 끝

이 방법은 PC에 아무것도 설치 안 해도 됩니다. GitHub Pages가 작동하면 PWABuilder가 다 알아서 해줍니다.
