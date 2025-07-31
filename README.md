<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa Plugin Starter
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Compatibility

This starter is compatible with versions >= 2.4.0 of `@medusajs/medusa`.

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/learn/installation) to set up a server.

Visit the [Plugins documentation](https://docs.medusajs.com/learn/fundamentals/plugins) to learn more about plugins and how to create them.

Visit the [Docs](https://docs.medusajs.com/learn/installation#get-started) to learn more about our system requirements.

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa's architecture](https://docs.medusajs.com/learn/introduction/architecture) and [commerce modules](https://docs.medusajs.com/learn/fundamentals/modules/commerce-modules) in the Docs.

## Community & Contributions

The community and core team are available in [GitHub Discussions](https://github.com/medusajs/medusa/discussions), where you can ask for support, discuss roadmap, and share ideas.

Join our [Discord server](https://discord.com/invite/medusajs) to meet other community members.

## Other channels

- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)

# Medusa Digital Asset Plugin

디지털 자산을 관리하기 위한 Medusa 플러그인입니다.

## API 문서

### Admin API

#### 디지털 자산 관리

##### 1. 디지털 자산 목록 조회

```http
GET /admin/digital-assets
```

**Query Parameters**

- `limit` (number, optional): 페이지당 항목 수 (기본값: 20)
- `offset` (number, optional): 시작 오프셋 (기본값: 0)
- `include_deleted` (boolean, optional): 삭제된 항목 포함 여부

**응답**

```json
{
  "digital_assets": [
    {
      "id": "asset_01",
      "name": "디지털 자산 1",
      "file_url": "https://example.com/asset1.pdf",
      "thumbnail_url": "https://example.com/thumb1.jpg",
      "mime_type": "application/pdf",
      "created_at": "2024-03-14T12:00:00Z",
      "updated_at": "2024-03-14T12:00:00Z"
    }
  ],
  "count": 1,
  "skip": 0,
  "take": 20
}
```

##### 2. 새 디지털 자산 생성

```http
POST /admin/digital-assets
Content-Type: multipart/form-data
```

**Request Body**

- `file`: 디지털 자산 파일 (필수)
- `thumbnail`: 썸네일 이미지 (선택)
- `name`: 자산 이름 (필수)

**응답**

```json
{
  "id": "asset_01",
  "name": "새 디지털 자산",
  "file_url": "https://example.com/new-asset.pdf",
  "thumbnail_url": "https://example.com/new-thumb.jpg",
  "mime_type": "application/pdf",
  "created_at": "2024-03-14T12:00:00Z",
  "updated_at": "2024-03-14T12:00:00Z"
}
```

##### 3. 디지털 자산 수정

```http
PATCH /admin/digital-assets/:id
Content-Type: multipart/form-data
```

**Path Parameters**

- `id`: 디지털 자산 ID

**Request Body**

- `file`: 새 디지털 자산 파일 (선택)
- `thumbnail`: 새 썸네일 이미지 (선택)
- `name`: 새 자산 이름 (선택)

**응답**

```json
{
  "id": "asset_01",
  "name": "수정된 디지털 자산",
  "file_url": "https://example.com/updated-asset.pdf",
  "thumbnail_url": "https://example.com/updated-thumb.jpg",
  "mime_type": "application/pdf",
  "created_at": "2024-03-14T12:00:00Z",
  "updated_at": "2024-03-14T13:00:00Z"
}
```

##### 4. 디지털 자산 다운로드 (관리자)

```http
GET /admin/digital-assets/:id/download
```

**Path Parameters**

- `id`: 디지털 자산 ID

**응답**

- 성공 시: 파일 스트림 (파일 직접 다운로드)
- Content-Type: 파일의 MIME 타입
- Content-Disposition: attachment; filename="파일명"

**에러 응답**

```json
{
  "message": "에러 메시지"
}
```

#### 디지털 자산 라이센스 관리

##### 1. 라이센스 목록 조회

```http
GET /admin/digital-asset-licenses
```

**Query Parameters**

- `license_id` (string, optional): 라이센스 ID로 필터링
- `customer_id` (string, optional): 고객 ID로 필터링
- `order_item_id` (string, optional): 주문 항목 ID로 필터링
- `is_exercised` (boolean, optional): 사용 여부로 필터링
- `limit` (number, optional): 페이지당 항목 수 (기본값: 20)
- `offset` (number, optional): 시작 오프셋 (기본값: 0)

**응답**

```json
{
  "licenses": [
    {
      "id": "license_01",
      "customer_id": "cust_01",
      "order_item_id": "item_01",
      "is_exercised": false,
      "created_at": "2024-03-14T12:00:00Z"
    }
  ],
  "count": 1,
  "skip": 0,
  "take": 20
}
```

### Store API

#### 라이브러리 관리

##### 1. 고객 라이브러리 조회

```http
GET /store/library
Authorization: Bearer {token}
```

**응답**

```json
{
  "items": [
    {
      "id": "asset_01",
      "title": "디지털 자산 1",
      "description": "자산 설명",
      "metadata": {
        "key": "value"
      }
    }
  ]
}
```

##### 2. 특정 디지털 자산 조회

```http
GET /store/library/:id
Authorization: Bearer {token}
```

**Path Parameters**

- `id`: 디지털 자산 ID

**응답**

```json
{
  "id": "asset_01",
  "name": "디지털 자산 1",
  "file_url": "https://example.com/asset1.pdf",
  "thumbnail_url": "https://example.com/thumb1.jpg",
  "mime_type": "application/pdf"
}
```

##### 3. 디지털 자산 다운로드

```http
GET /store/library/:id/download
Authorization: Bearer {token}
```

**Path Parameters**

- `id`: 디지털 자산 ID

**응답**

- 성공 시: 파일 스트림 (파일 직접 다운로드)
- Content-Type: 파일의 MIME 타입
- Content-Disposition: attachment; filename="파일명"

**에러 응답**

```json
{
  "message": "에러 메시지"
}
```

##### 4. 디지털 자산 라이센스 사용

```http
GET /store/library/:id/exercise
Authorization: Bearer {token}
```

**Path Parameters**

- `id`: 디지털 자산 ID

**응답**

```json
{
  "id": "asset_01",
  "name": "디지털 자산 1",
  "file_url": "https://example.com/asset1.pdf",
  "thumbnail_url": "https://example.com/thumb1.jpg",
  "mime_type": "application/pdf"
}
```

## 인증

모든 API 요청에는 Bearer 토큰이 필요합니다:

- Admin API: 관리자 인증 토큰
- Store API: 고객 인증 토큰

```http
Authorization: Bearer {your_token}
```

## 에러 응답

API 요청이 실패하면 다음과 같은 형식의 에러 응답을 반환합니다:

```json
{
  "error": "ERROR_CODE",
  "message": "에러 메시지"
}
```

## 설치 방법

...
