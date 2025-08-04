# web-ide-fe
> 구름톤 딥다이브 풀스택 13회차 프론트엔드<br>
> 개발 기간: 2025.07.11 - 2025.08.03

> BE Github<br>
> [web-ide-be](https://github.com/GROWLOG-youtube-mockup/web-ide-be)

## 배포주소
[GrowLog Web IDE 페이지](https://growlog-web-ide.vercel.app/)

## 팀 노션 페이지
[GROWLOG - Web IDE](https://hallowed-wave-b3c.notion.site/Web-IDE-22b02a2bdd5380bb84d8f777afb9828b?source=copy_link)

# 팀원 소개

|![profile1](https://avatars.githubusercontent.com/u/203277225?v=4)                                                                                   | ![profile2](https://avatars.githubusercontent.com/u/48435096?v=4)                                                                            | ![profile3](https://avatars.githubusercontent.com/u/67671991?v=4)                                                                       |
-----|-|-
|<p align="center">김태현 </p>                                                                                                  | <p align="center">이승준</p>                                                                                           | <p align="center">이재엽</p>                                                                                     
|<p align="center">[![Github](https://img.shields.io/badge/lamarck009-black?logo=github)](https://github.com/lamarck009)</p> | <p align="center">[![Github](https://img.shields.io/badge/sjoon627-black?logo=github)](https://github.com/sjoon627)</p> | <p align="center">[![Github](https://img.shields.io/badge/jaeyeopme-black?logo=github)](https://github.com/jaeyeopme)</p> |
|<p align="center">코드에디터, 탭 기능, 프로젝트 초대 구현</p>                                                                   | <p align="center">계정관련, 메인화면 구현</p>                                                                         | <p align="center">사이드바, 채팅 기능 구현</p>                                                              




# 프로젝트 소개

## 기술 스택
| Category       | Stack                                                                                             |
|----------------|---------------------------------------------------------------------------------------------------|
| Language       | ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)                                    |
| Framework      | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) &nbsp; ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)|
| UI/UX & Styling      | ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) &nbsp;	![Shadcn/ui](https://img.shields.io/badge/shadcn/ui-8A2BE2?style=for-the-badge&2F&logo=shadcnui&color=131316)|
| Real-time Comm | ![Liveblocks](https://img.shields.io/badge/Liveblocks-%23262626.svg?style=for-the-badge&logo=liveblocks&logoColor=white) &nbsp; ![SockJS](https://img.shields.io/badge/SockJS-%23FFFFFF.svg?style=for-the-badge&logo=liveblocks) &nbsp; ![STOMP](https://img.shields.io/badge/STOMP-%23643715.svg?style=for-the-badge&logo=liveblocks)             |
| State Management       | ![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react) &nbsp; ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white) &nbsp;![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white) |
| Advanced Features | ![Monaco](https://img.shields.io/badge/Monaco-0078D4.svg?style=for-the-badge&logo=monaco&logoColor=white) <br> ![DND Kit](https://img.shields.io/badge/DND%20Kit-%23262626.svg?style=for-the-badge&logo=liveblocks&logoColor=white)|
| Tools & Others           |![Axios](https://img.shields.io/badge/Axios-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) <br> 	![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220) <br>![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)     |



## 아키텍쳐
![아키텍쳐](readmeImage/architec.png)

## 주요 기능
**사용자 인증**
- 로그인, 회원가입, 프로필 이미지 설정, 이메일 인증 등의 기능을 제공한다.
- 이메일 인증 절차를 통해 회원가입을 지원한다.
- 프로필 이미지, 비밀번호, 이름 등의 개인 정보를 사용자가 직접 수정할 수 있다.

**메인 페이지**
- 사용자가 속해 있는 프로젝트 목록을 볼 수 있다.
- 본인 소유의 프로젝트와 참여하는 프로젝트를 구분하여 보여준다.

**프로젝트 컨테이너 실행**
- 프로젝트 시작 시, 사용자 전용 Docker 컨테이너를 실행하여 개발 환경을 제공한다.
- 각 프로젝트는 Docker 볼륨을 기반으로 고유한 파일 시스템을 가지며, 이를 통해 사용자 작업 내용을 안전하게 보존한다.
- 템플릿 기반으로 초기 개발 환경이 구성되며, 언어별 사전 정의된 이미지에서 파일이 복사되어 프로젝트 구조를 자동 생성한다.
- 컨테이너는 실시간 코드 편집, 컴파일, 실행 등을 위한 환경을 포함한다.

**채팅**
- 실시간 채팅 및 코드 위치 연결 기능을 제공한다.
- `[텍스트](ide://경로:줄번호)` 방식을 통한 해당 위치 자동 포커싱이 가능하다.

**동시 편집**
- 동일한 파일에 대해 팀원들과 동시에 편집할 수 있는 실시간 협업 기능을 지원한다.

**권한 기반 프로젝트 멤버 관리**
- 프로젝트 구성원은 Owner, Write, Read 권한을 가질 수 있고 권한에 따라 기능 접근이 제한된다.

## 시연 영상
### 사용자 인증
![signup_cropped](https://github.com/user-attachments/assets/bd05662e-2897-4d11-a7d4-a6307e192357)


### 프로젝트 생성
![create_cropped](https://github.com/user-attachments/assets/d5229622-bfcb-4ffa-a3ef-ca243abe6500)


### 코드 편집
![edit_cropped](https://github.com/user-attachments/assets/f2230aa6-01ef-4a0e-922f-fb772ccdb235)


### 프로젝트 초대
![invite_cropped](https://github.com/user-attachments/assets/52d0401f-588e-4558-969c-f7305c4125c0)


### 채팅
![chat_cropped](https://github.com/user-attachments/assets/970be362-d57b-4981-8099-00cb9f8001ec)
