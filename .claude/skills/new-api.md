---
name: Create New API
description: 새로운 API를 개발할 때 사용함
---

## When to Use
- 새로운 API를 추가할 때 이 skill을 사용한다.

## Workflow
1. API 함수 및 타입 작성
   - `src/actions/`에 Server Action 파일 작성
   - 도메인 모델, API 함수를 같은 파일에 정의
   - API 함수는 `response.data`를 파싱해서 반환
   - 미리 로딩해도 되는 데이터는 전부 Server Action으로 처리함

2. Mock 데이터 생성
   - 해당 feature 폴더에 mock 데이터 작성
   - 실제 API 응답 형식과 동일하게 작성 (`{ data: ... }`)

3. Component에서 사용
   - Mock 데이터로 UI 개발 진행
   - 백엔드 API 완성 후 mock을 실제 API로 교체

## 타입 위치 규칙
- API 공통 응답 포맷 (`ApiResponse<T>`): `src/types/`
- 도메인 모델: `src/actions/` (해당 API 파일에 함께)

## Example

```typescript
// src/actions/articles.ts
"use server";

// Domain Models
export interface ArticleSummary {
  id: number;
  title: string;
  // ...
}

// API Functions (data만 반환)
export async function getArticleSummaries(): Promise<ArticleSummary[]> {
  // TODO: 백엔드 API 연동 후 mock 제거
  return mockArticleSummaries.data;
}
```

## CheckList

- [ ] 도메인 모델 및 API 함수 작성 (actions/)
- [ ] Mock 데이터 작성 (features/[domain]/mocks/)
- [ ] 컴포넌트 연동 확인
