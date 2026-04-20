# BusanConnect - 프로젝트 TODO

## Phase 1: 데이터베이스 스키마 및 초기 설정
- [x] DB 스키마 설계 (posts, comments, guides, user_profiles 테이블)
- [x] drizzle-kit 마이그레이션 생성 및 적용
- [x] 다국어 컨텍스트(i18n) 설계

## Phase 2: 정적 에셋
- [x] 부산 랜딩 히어로 이미지 수집 및 업로드
- [x] 부산 명소 가이드 이미지 수집 및 업로드

## Phase 3: 글로벌 스타일 및 레이아웃
- [x] Sacred Geometry 테마 CSS 변수 설정 (크림 배경, 골드, 네이비)
- [x] Google Fonts 설정 (Playfair Display, Noto Sans 계열)
- [x] Sacred Geometry SVG 오버레이 컴포넌트 구현
- [x] 다국어 컨텍스트 (LanguageContext) 구현 (한/일/중/영)
- [x] 전역 네비게이션 바 (언어 전환 포함) 구현
- [x] 전역 푸터 구현
- [x] App.tsx 라우팅 구조 설정

## Phase 4: 랜딩 페이지 및 가이드 페이지
- [x] 랜딩 히어로 섹션 (Sacred Geometry 배경, CTA)
- [x] 주요 기능 하이라이트 섹션
- [x] 커뮤니티 미리보기 섹션
- [x] 로컬 가이드 페이지 (카테고리별 카드 목록)

## Phase 5: 커뮤니티 게시판 및 지도
- [x] 게시글 목록 페이지
- [x] 게시글 작성 페이지 (로그인 필요)
- [x] 게시글 상세 페이지 (댓글 포함)
- [x] AI 번역 버튼 및 실시간 번역 UI
- [x] 지도 페이지 (Google Maps + 부산 명소 마커)
- [x] 마커 클릭 시 상세 정보 팝업

## Phase 6: 회원 프로필 및 서버 완성
- [x] 회원 프로필 페이지 (닉네임, 선호 언어, 작성 글 목록)
- [x] 프로필 수정 기능
- [x] 운영자 알림 (게시글/댓글 등록 시 즉시 전송)
- [x] 서버 라우터 완성 (posts, comments, guides, profile, translate)
- [x] Vitest 테스트 작성 및 통과 (12/12)

## Phase 7: 최종 검토
- [x] TypeScript 에러 0개 달성
- [x] 반응형 디자인 구현
- [x] 다국어 UI 전환 구현
- [x] 체크포인트 저장


## Phase 8: 프론트엔드 개선 (v2.0)
- [x] 색상 테마 변경 (파란색 계열로 변경하여 부산 느낌 강화)
- [x] 언어 확장성 구조 개선 (새 언어 추가 용이하게)
- [x] 소셜 로그인 UI (Google, LINE, WeChat, Facebook)
- [x] 여행 일정 페이지 (생성, 편집, 공유, PDF 내보내기)
- [x] 투어 코스 페이지 (작성, 조회, 공유)
- [x] 네이버 지도 연동 (프론트엔드 컴포넌트 완성 - 백엔드 클라이언트 ID 설정 필요)
