# 백엔드 API 연동 계획

## 1. 개요

- API 명세서를 기반으로 백엔드 서버와 연동 작업을 진행합니다.
- 각 기능별로 API를 연동하고, 프론트엔드에 필요한 상태 관리 로직을 구현합니다.
- 작업은 기능 단위로 나누어 진행하며, 각 기능별로 브랜치를 생성하여 관리합니다.

## 2. 작업 순서

1.  **환경 설정 및 기본 API 클라이언트 구현**

    - `axios` 라이브러리 설치
    - API 클라이언트 인스턴스 생성 (`/src/services/api/index.ts`)
      - `baseURL` 설정
      - 인터셉터를 이용한 `Authorization` 헤더 (JWT 토큰) 추가

2.  **인증 (Authentication)**

    - **로그인 (`/auth/login`)**
      - `LoginPage.tsx` 에서 로그인 폼 제출 시 API 호출
      - 로그인 성공 시 `accessToken`을 `localStorage`에 저장
      - 사용자 정보를 `zustand` 스토어에 저장
      - 로그인 후 프로젝트 목록 페이지로 리다이렉트
    - **회원가입 (`/users/signup`)**
      - `SignUpPage.tsx` 에서 회원가입 폼 제출 시 API 호출
      - 회원가입 성공 시 로그인 페이지로 이동
    - **이메일 인증 (`/auth/email/send`, `/auth/email/verify`)**
      - 회원가입 페이지에서 이메일 인증 기능 구현
    - **로그아웃 (`/auth/logout`)**
      - 로그아웃 시 `localStorage`의 `accessToken` 제거
      - `zustand` 스토어의 사용자 정보 초기화
    - **비밀번호 재설정 (`/auth/reset-password`)**
      - 비밀번호 찾기/재설정 기능 구현

3.  **사용자 정보 (User)**

    - **내 정보 조회 (`/users/me`)**
      - 페이지 로드 시 또는 필요 시 내 정보를 조회하여 스토어 업데이트
    - **내 정보 수정 (`/users/me/name`, `/users/me/password`, `/users/me/profile-image`)**
      - 프로필 수정 페이지에서 각 정보 수정 기능 구현

4.  **프로젝트 (Workspaces/Projects)**

    - **프로젝트 목록 조회 (`/projects`)**
      - `ProjectListPage.tsx` 에서 내 프로젝트, 초대된 프로젝트 목록 조회
    - **프로젝트 생성 (`/projects`)**
      - 프로젝트 생성 다이얼로그에서 API 호출
    - **프로젝트 정보 수정/삭제 (`/projects/{projectId}`)**
      - 프로젝트 설정 또는 컨텍스트 메뉴에서 기능 구현
    - **프로젝트 열기/닫기 (`/projects/{projectId}/open`, `/projects/{projectId}/close`)**
      - IDE 페이지 진입/이탈 시 컨테이너 실행/종료 API 호출

5.  **파일 시스템 (File System)**

    - **파일 트리 조회 (`/projects/{projectId}/tree`)**
      - IDE 사이드바의 파일 탐색기에서 파일 트리 구조 조회
    - **파일 열기/저장 (`/projects/{projectId}/files`)**
      - 파일 탐색기에서 파일 클릭 시 내용 조회
      - 코드 에디터에서 저장 시 파일 내용 업데이트
    - **파일/폴더 생성/삭제/이름변경/이동**
      - 파일 탐색기 컨텍스트 메뉴를 통해 기능 구현

6.  **기타**
    - **Liveblocks 인증 (`/liveblock/auth`)**
      - Liveblocks 연동 시 인증 API 호출
    - **전역 에러 처리**
      - API 요청 실패 시 에러를 처리하고 사용자에게 알림 (Toast 등)

## 3. API 응답 타입 정의

- `/src/types/api.ts` 파일에 API 응답 데이터 관련 타입을 정의합니다.
- Swagger 문서를 참고하여 각 API의 DTO (Data Transfer Object)에 맞는 타입을 생성합니다.

## 4. 상태 관리 (Zustand)

- `/src/stores` 디렉토리의 각 스토어에 API 연동에 필요한 상태와 액션을 추가합니다.
  - `user-store.ts`: 사용자 정보, 로그인/로그아웃 액션
  - `project-store.ts`: 프로젝트 목록, 개별 프로젝트 정보, 관련 API 호출 액션
  - `file-tree-store.ts`: 파일 트리 데이터, 관련 API 호출 액션
  - `editor-tabs-store.ts`: 열린 파일 탭 정보, 파일 내용 상태

## 5. 작업 진행 계획 (로그인 페이지)

1.  `axios` 설치 및 API 클라이언트 설정 (완료)
2.  `/src/services/api/auth.ts` 파일 생성하여 로그인 API 함수 구현
3.  `/src/types/api.ts` 에 로그인 API 관련 타입 추가
4.  `LoginPage.tsx` 컴포넌트 수정
    - `react-hook-form`을 사용하여 폼 상태 관리
    - 로그인 버튼 클릭 시 `auth.ts`의 로그인 함수 호출
    - API 호출 로딩 상태 처리
    - 로그인 성공/실패에 따른 UI 피드백 (Toast 메시지 등)
    - 로그인 성공 시 `user-store` 업데이트 및 페이지 이동
5.  `user-store.ts` 수정
    - 로그인 액션 및 사용자 정보 상태 추가
