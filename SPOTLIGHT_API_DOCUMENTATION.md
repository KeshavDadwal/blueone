# Spotlight API Documentation

This document provides comprehensive API documentation for the Spotlight endpoints, including available filters and response formats.

## Table of Contents
- [Public Spotlight API](#public-spotlight-api)
- [Admin Spotlight API](#admin-spotlight-api)
- [Filters and Query Parameters](#filters-and-query-parameters)
- [Response Formats](#response-formats)
- [Examples](#examples)

---

## Public Spotlight API

### Base URL
```
/api/public/spotlight
```

### Get All Spotlights

Retrieve all active spotlight items with optional filtering by author and book.

**Endpoint:** `GET /api/public/spotlight`

**Authentication:** Not required (Public API)

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `authorId` | number | No | Filter by author ID | `?authorId=1` |
| `authorSlug` | string | No | Filter by author slug | `?authorSlug=john-doe` |
| `bookId` | number | No | Filter by book ID | `?bookId=123` |
| `bookSlug` | string | No | Filter by book slug | `?bookSlug=my-awesome-book` |
| `isActive` | boolean | No | Filter by active status (default: `true`) | `?isActive=true` |

**Example Requests:**

```bash
# Get all active spotlights
curl -X GET "https://dashboard.bluone.ink/api/public/spotlight"

# Get spotlights for a specific author by ID
curl -X GET "https://dashboard.bluone.ink/api/public/spotlight?authorId=1"

# Get spotlights for a specific author by slug
curl -X GET "https://dashboard.bluone.ink/api/public/spotlight?authorSlug=john-doe"

# Get spotlights for a specific book by ID
curl -X GET "https://dashboard.bluone.ink/api/public/spotlight?bookId=123"

# Get spotlights for a specific book by slug
curl -X GET "https://dashboard.bluone.ink/api/public/spotlight?bookSlug=my-awesome-book"

# Get all spotlights including inactive ones
curl -X GET "https://dashboard.bluone.ink/api/public/spotlight?isActive=false"

# Combine filters - get active spotlights for a specific author and book
curl -X GET "https://dashboard.bluone.ink/api/public/spotlight?authorId=1&bookId=123&isActive=true"
```

**Response Format:**

```json
[
  {
    "id": 1,
    "title": "Featured Spotlight",
    "mediaUrl": "https://example.com/image.jpg",
    "text": "Rich text content or HTML",
    "link": "https://example.com/link",
    "authors": [
      {
        "id": 1,
        "name": "Author Name",
        "slug": "author-name"
      }
    ],
    "books": [
      {
        "id": 1,
        "title": "Book Title",
        "slug": "book-title"
      }
    ]
  },
  {
    "id": "author-5-0",
    "title": "Legacy Author Spotlight",
    "mediaUrl": "https://example.com/legacy.jpg",
    "text": "Legacy spotlight content",
    "link": null,
    "authors": [
      {
        "id": 5,
        "name": "Legacy Author",
        "slug": "legacy-author"
      }
    ],
    "books": []
  }
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number/string | Spotlight ID. Numeric for new spotlights, string format `author-{id}-{index}` or `book-{id}-{index}` for legacy spotlights |
| `title` | string \| null | Spotlight title |
| `mediaUrl` | string \| null | URL to media (image/video) |
| `text` | string \| null | Rich text content (can be HTML) |
| `link` | string \| null | Link URL (null for legacy spotlights) |
| `authors` | array | Array of associated authors (always present, may be empty) |
| `authors[].id` | number | Author ID |
| `authors[].name` | string | Author name |
| `authors[].slug` | string | Author slug |
| `books` | array | Array of associated books (always present, may be empty) |
| `books[].id` | number | Book ID |
| `books[].title` | string | Book title |
| `books[].slug` | string | Book slug |

**Status Codes:**

- `200 OK` - Success
- `429 Too Many Requests` - Rate limit exceeded (100 requests per minute)
- `500 Internal Server Error` - Server error

**Notes:**

- By default, only active spotlights are returned (`isActive=true`)
- Results are ordered by `order` field (ascending), then by creation date (descending)
- The API combines data from:
  - **New Spotlight model** - Dedicated spotlight entries created via Spotlight management page
  - **Legacy author spotlight JSON fields** - Old spotlight data stored in author records
  - **Legacy book spotlight JSON fields** - Old spotlight data stored in book records
- Legacy spotlights have string IDs in the format `author-{id}-{index}` or `book-{id}-{index}`
- When filtering by author or book, the API returns spotlights that are associated with the specified author/book

---

## Admin Spotlight API

### Base URL
```
/api/spotlight
```

### Get All Spotlights (Admin)

Retrieve all spotlights including inactive ones. Requires authentication.

**Endpoint:** `GET /api/spotlight`

**Authentication:** Required (Admin only)

**Query Parameters:** None

**Example Request:**

```bash
curl -X GET "https://dashboard.bluone.ink/api/spotlight" \
  -H "Cookie: your-session-cookie"
```

**Response Format:**

```json
[
  {
    "id": 1,
    "title": "Featured Spotlight",
    "mediaUrl": "https://example.com/image.jpg",
    "text": "Rich text content",
    "link": "https://example.com/link",
    "isActive": true,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "authors": [
      {
        "id": 1,
        "name": "Author Name",
        "slug": "author-name",
        "imageUrl": "https://example.com/author.jpg"
      }
    ],
    "books": [
      {
        "id": 1,
        "title": "Book Title",
        "slug": "book-title",
        "coverImageUrl": "https://example.com/cover.jpg",
        "thumbnailUrl": "https://example.com/thumb.jpg"
      }
    ]
  }
]
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Spotlight ID |
| `title` | string \| null | Spotlight title |
| `mediaUrl` | string \| null | URL to media (image/video) |
| `text` | string \| null | Rich text content |
| `link` | string \| null | Link URL |
| `isActive` | boolean | Whether the spotlight is active |
| `order` | number | Display order (lower numbers appear first) |
| `createdAt` | string | ISO 8601 timestamp of creation |
| `updatedAt` | string | ISO 8601 timestamp of last update |
| `authors` | array | Array of associated authors |
| `authors[].id` | number | Author ID |
| `authors[].name` | string | Author name |
| `authors[].slug` | string | Author slug |
| `authors[].imageUrl` | string \| null | Author profile image URL |
| `books` | array | Array of associated books |
| `books[].id` | number | Book ID |
| `books[].title` | string | Book title |
| `books[].slug` | string | Book slug |
| `books[].coverImageUrl` | string \| null | Book cover image URL |
| `books[].thumbnailUrl` | string \| null | Book thumbnail image URL |

### Create Spotlight (Admin)

Create a new spotlight and assign it to authors and books.

**Endpoint:** `POST /api/spotlight`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "title": "Featured Spotlight",
  "mediaUrl": "https://example.com/image.jpg",
  "text": "Rich text content or HTML",
  "link": "https://example.com/link",
  "isActive": true,
  "order": 0,
  "authorIds": [1, 2],
  "bookIds": [10, 20]
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | No | Spotlight title |
| `mediaUrl` | string | No | URL to media (image/video) |
| `text` | string | No | Rich text content (HTML supported) |
| `link` | string | No | Link URL |
| `isActive` | boolean | No | Whether spotlight is active (default: `true`) |
| `order` | number | No | Display order (default: `0`) |
| `authorIds` | number[] | No | Array of author IDs to associate (default: `[]`) |
| `bookIds` | number[] | No | Array of book IDs to associate (default: `[]`) |

**Validation:**
- At least one of `title`, `mediaUrl`, or `text` must be provided

**Example Request:**

```bash
curl -X POST "https://dashboard.bluone.ink/api/spotlight" \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "title": "New Featured Spotlight",
    "mediaUrl": "https://example.com/image.jpg",
    "text": "This is a featured spotlight",
    "link": "https://example.com",
    "isActive": true,
    "order": 1,
    "authorIds": [1, 2],
    "bookIds": [10]
  }'
```

**Response:** Same format as GET response with the newly created spotlight

**Status Codes:**

- `201 Created` - Spotlight created successfully
- `400 Bad Request` - Validation error (missing required fields)
- `401 Unauthorized` - Authentication required
- `500 Internal Server Error` - Server error

**Note:** When a spotlight is created, it automatically syncs to the JSON `spotlight` fields in the associated authors and books.

### Update Spotlight (Admin)

Update an existing spotlight and its associations.

**Endpoint:** `PUT /api/spotlight`

**Authentication:** Required (Admin only)

**Request Body:**

```json
{
  "id": 1,
  "title": "Updated Spotlight Title",
  "mediaUrl": "https://example.com/new-image.jpg",
  "text": "Updated text content",
  "link": "https://example.com/new-link",
  "isActive": false,
  "order": 5,
  "authorIds": [1, 3],
  "bookIds": [10, 20, 30]
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | **Yes** | Spotlight ID to update |
| `title` | string | No | Spotlight title |
| `mediaUrl` | string | No | URL to media (image/video) |
| `text` | string | No | Rich text content |
| `link` | string | No | Link URL |
| `isActive` | boolean | No | Whether spotlight is active |
| `order` | number | No | Display order |
| `authorIds` | number[] | No | Array of author IDs (replaces existing associations) |
| `bookIds` | number[] | No | Array of book IDs (replaces existing associations) |

**Validation:**
- `id` is required
- At least one of `title`, `mediaUrl`, or `text` must be provided

**Example Request:**

```bash
curl -X PUT "https://dashboard.bluone.ink/api/spotlight" \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "id": 1,
    "title": "Updated Title",
    "isActive": true,
    "authorIds": [1, 2, 3],
    "bookIds": [10]
  }'
```

**Response:** Same format as GET response with the updated spotlight

**Status Codes:**

- `200 OK` - Spotlight updated successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `500 Internal Server Error` - Server error

**Note:** 
- Updating `authorIds` or `bookIds` replaces all existing associations
- The spotlight is automatically synced to/removed from the JSON `spotlight` fields in authors and books

### Delete Spotlight (Admin)

Delete a spotlight and remove it from all associated authors and books.

**Endpoint:** `DELETE /api/spotlight`

**Authentication:** Required (Admin only)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | **Yes** | Spotlight ID to delete |

**Example Request:**

```bash
curl -X DELETE "https://dashboard.bluone.ink/api/spotlight?id=1" \
  -H "Cookie: your-session-cookie"
```

**Response:**

```json
{
  "success": true
}
```

**Status Codes:**

- `200 OK` - Spotlight deleted successfully
- `400 Bad Request` - ID is required
- `401 Unauthorized` - Authentication required
- `500 Internal Server Error` - Server error

**Note:** When a spotlight is deleted, it is automatically removed from the JSON `spotlight` fields in all associated authors and books.

---

## Filters and Query Parameters

### Public API Filters

The public spotlight API supports the following filters:

#### 1. Filter by Author

**By ID:**
```
GET /api/public/spotlight?authorId=1
```

**By Slug:**
```
GET /api/public/spotlight?authorSlug=john-doe
```

Returns all spotlights associated with the specified author.

#### 2. Filter by Book

**By ID:**
```
GET /api/public/spotlight?bookId=123
```

**By Slug:**
```
GET /api/public/spotlight?bookSlug=my-awesome-book
```

Returns all spotlights associated with the specified book.

#### 3. Filter by Active Status

**Active only (default):**
```
GET /api/public/spotlight
GET /api/public/spotlight?isActive=true
```

**Inactive only:**
```
GET /api/public/spotlight?isActive=false
```

**All (active and inactive):**
Note: The public API defaults to active only. To get inactive spotlights, explicitly set `isActive=false`.

#### 4. Combined Filters

You can combine multiple filters:

```
# Get active spotlights for a specific author
GET /api/public/spotlight?authorId=1&isActive=true

# Get spotlights for a specific book
GET /api/public/spotlight?bookSlug=my-book&isActive=true

# Get all spotlights (including inactive) for an author
GET /api/public/spotlight?authorId=1&isActive=false
```

**Note:** When filtering by both author and book, the API returns spotlights that match either condition (OR logic).

---

## Response Formats

### Public API Response

The public API returns a simplified response with minimal data:

```json
[
  {
    "id": 1,
    "title": "Spotlight Title",
    "mediaUrl": "https://example.com/image.jpg",
    "text": "Content",
    "link": "https://example.com",
    "authors": [
      {
        "id": 1,
        "name": "Author Name",
        "slug": "author-slug"
      }
    ],
    "books": [
      {
        "id": 1,
        "title": "Book Title",
        "slug": "book-slug"
      }
    ]
  }
]
```

### Admin API Response

The admin API returns additional metadata:

```json
[
  {
    "id": 1,
    "title": "Spotlight Title",
    "mediaUrl": "https://example.com/image.jpg",
    "text": "Content",
    "link": "https://example.com",
    "isActive": true,
    "order": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "authors": [
      {
        "id": 1,
        "name": "Author Name",
        "slug": "author-slug",
        "imageUrl": "https://example.com/author.jpg"
      }
    ],
    "books": [
      {
        "id": 1,
        "title": "Book Title",
        "slug": "book-slug",
        "coverImageUrl": "https://example.com/cover.jpg",
        "thumbnailUrl": "https://example.com/thumb.jpg"
      }
    ]
  }
]
```

---

## Examples

### JavaScript/TypeScript Examples

```javascript
// Fetch all active spotlights
async function getAllSpotlights() {
  const response = await fetch('https://dashboard.bluone.ink/api/public/spotlight');
  const spotlights = await response.json();
  return spotlights;
}

// Fetch spotlights for a specific author
async function getAuthorSpotlights(authorSlug) {
  const response = await fetch(
    `https://dashboard.bluone.ink/api/public/spotlight?authorSlug=${authorSlug}`
  );
  const spotlights = await response.json();
  return spotlights;
}

// Fetch spotlights for a specific book
async function getBookSpotlights(bookId) {
  const response = await fetch(
    `https://dashboard.bluone.ink/api/public/spotlight?bookId=${bookId}`
  );
  const spotlights = await response.json();
  return spotlights;
}

// Fetch spotlights with multiple filters
async function getFilteredSpotlights(authorId, bookId, isActive = true) {
  const params = new URLSearchParams({
    authorId: authorId.toString(),
    bookId: bookId.toString(),
    isActive: isActive.toString()
  });
  const response = await fetch(
    `https://dashboard.bluone.ink/api/public/spotlight?${params}`
  );
  const spotlights = await response.json();
  return spotlights;
}

// Create a new spotlight (Admin)
async function createSpotlight(spotlightData) {
  const response = await fetch('https://dashboard.bluone.ink/api/spotlight', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
    body: JSON.stringify(spotlightData)
  });
  const spotlight = await response.json();
  return spotlight;
}

// Update a spotlight (Admin)
async function updateSpotlight(id, spotlightData) {
  const response = await fetch('https://dashboard.bluone.ink/api/spotlight', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ id, ...spotlightData })
  });
  const spotlight = await response.json();
  return spotlight;
}

// Delete a spotlight (Admin)
async function deleteSpotlight(id) {
  const response = await fetch(
    `https://dashboard.bluone.ink/api/spotlight?id=${id}`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  );
  const result = await response.json();
  return result;
}
```

### React Example

```jsx
import { useState, useEffect } from 'react';

function SpotlightList({ authorId, bookId }) {
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpotlights() {
      try {
        const params = new URLSearchParams();
        if (authorId) params.append('authorId', authorId);
        if (bookId) params.append('bookId', bookId);
        params.append('isActive', 'true');

        const response = await fetch(
          `https://dashboard.bluone.ink/api/public/spotlight?${params}`
        );
        const data = await response.json();
        setSpotlights(data);
      } catch (error) {
        console.error('Error fetching spotlights:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSpotlights();
  }, [authorId, bookId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {spotlights.map((spotlight) => (
        <div key={spotlight.id} className="spotlight-item">
          {spotlight.mediaUrl && (
            <img src={spotlight.mediaUrl} alt={spotlight.title || 'Spotlight'} />
          )}
          {spotlight.title && <h3>{spotlight.title}</h3>}
          {spotlight.text && (
            <div dangerouslySetInnerHTML={{ __html: spotlight.text }} />
          )}
          {spotlight.link && (
            <a href={spotlight.link} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Python Example

```python
import requests

# Get all active spotlights
response = requests.get('https://dashboard.bluone.ink/api/public/spotlight')
spotlights = response.json()

# Get spotlights for a specific author
response = requests.get(
    'https://dashboard.bluone.ink/api/public/spotlight',
    params={'authorSlug': 'john-doe', 'isActive': 'true'}
)
author_spotlights = response.json()

# Get spotlights for a specific book
response = requests.get(
    'https://dashboard.bluone.ink/api/public/spotlight',
    params={'bookId': 123}
)
book_spotlights = response.json()
```

---

## Filter Combinations

### Common Use Cases

1. **Get all spotlights for an author's page:**
   ```
   GET /api/public/spotlight?authorSlug=author-name&isActive=true
   ```

2. **Get all spotlights for a book's page:**
   ```
   GET /api/public/spotlight?bookSlug=book-title&isActive=true
   ```

3. **Get all active spotlights (homepage):**
   ```
   GET /api/public/spotlight
   ```

4. **Get spotlights that match both author and book:**
   ```
   GET /api/public/spotlight?authorId=1&bookId=123
   ```
   Note: This returns spotlights associated with either the author OR the book (OR logic).

---

## Rate Limiting

- **Public API:** 100 requests per minute per IP address
- **Admin API:** No rate limiting (authentication required)

---

## Security Headers

All public endpoints include the following security headers:
- `Content-Type: application/json`
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET`
- `Access-Control-Max-Age: 86400`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

---

## Base URL

All endpoints are relative to:
```
https://dashboard.bluone.ink
```

For local development, use:
```
http://localhost:3000
```

---

## Error Responses

### Rate Limit Exceeded

```json
{
  "error": "Rate limit exceeded"
}
```

**Status Code:** `429 Too Many Requests`

### Internal Server Error

```json
{
  "error": "Internal server error"
}
```

**Status Code:** `500 Internal Server Error`

### Validation Error

```json
{
  "error": "At least one of mediaUrl, text, or title is required"
}
```

**Status Code:** `400 Bad Request`

### Unauthorized

```json
{
  "error": "Unauthorized"
}
```

**Status Code:** `401 Unauthorized`

---

## Notes

1. **Legacy Support:** The API includes legacy spotlight data from author and book JSON fields for backward compatibility.

2. **Automatic Syncing:** When spotlights are created/updated via the admin API, they automatically sync to the JSON `spotlight` fields in associated authors and books.

3. **ID Format:** 
   - New spotlights have numeric IDs
   - Legacy spotlights have string IDs: `author-{id}-{index}` or `book-{id}-{index}`

4. **Ordering:** Results are ordered by `order` field (ascending), then by creation date (descending).

5. **Default Behavior:** The public API returns only active spotlights by default. Set `isActive=false` to get inactive ones.
