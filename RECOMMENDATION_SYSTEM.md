# Content-Based Recommendation System

## Overview
This is a complete, working content-based recommendation system for the MERN news website. It recommends articles based on:
- **Same category** as the current article
- **Overlapping tags** with the current article
- **Trending articles** (sorted by views and recent publish date)

## Backend Implementation

### 1. Post Model (`NewsBackend/src/models/post.js`)
The Post model now includes a `tags` field:
```javascript
tags: {
  type: [String],
  default: [],
  trim: true,
}
```

### 2. API Endpoints

#### Get Recommendations for an Article
```
GET /api/post/recommendations/:articleId
```
**Response:**
```json
{
  "success": true,
  "count": 5,
  "recommendations": [
    {
      "_id": "...",
      "title": "Article Title",
      "slug": "article-slug",
      "category": {
        "_id": "...",
        "name": "Category Name",
        "slug": "category-slug"
      },
      "tags": ["tag1", "tag2"],
      "viewCount": 100,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "image": "/uploads/image.jpg"
    }
  ]
}
```

#### Get Trending Articles (for Homepage)
```
GET /api/post/trending?limit=5
```
**Response:** Same structure as above

### 3. Recommendation Logic
1. Finds articles with the **same category** OR **overlapping tags**
2. Excludes the current article
3. Only includes published or pending_review articles
4. Sorts by:
   - `viewCount` (descending) - most viewed first
   - `createdAt` (descending) - most recent first
5. Limits to top 5 recommendations
6. If fewer than 5 recommendations, fills remaining slots with trending articles

## Frontend Implementation

### 1. ArticleRecommendations Component
Location: `NewsFrontend/src/Components/ArticleRecommendations.jsx`

**Props:**
- `articleId` (string, optional): If provided, shows recommendations for that article. If not, shows trending articles.
- `title` (string, optional): Custom title for the section (default: "You might also like")
- `limit` (number, optional): Number of recommendations to show (default: 5)

**Usage Examples:**

#### On Article Detail Page
```jsx
import ArticleRecommendations from './Components/ArticleRecommendations';

// Inside your article detail component
{post?._id && (
  <ArticleRecommendations 
    articleId={post._id} 
    title="You might also like"
  />
)}
```

#### On Homepage (Trending Articles)
```jsx
import ArticleRecommendations from './Components/ArticleRecommendations';

// Show trending articles
<ArticleRecommendations 
  title="Trending Articles"
  limit={5}
/>
```

### 2. Integration Points
The component has been integrated into:
- `NewsFrontend/src/Components/Samachardetails.jsx` - After comments section
- `NewsFrontend/src/Components/HealthDetails.jsx` - After comments section
- `NewsFrontend/src/Pages/EntertainmentDetails.jsx` - After comments section

## Creating Posts with Tags

### Backend (API)
When creating a post, include tags in the request body:
```javascript
// As comma-separated string
tags: "technology, news, breaking"

// Or as array
tags: ["technology", "news", "breaking"]
```

### Example API Request
```javascript
const formData = new FormData();
formData.append('title', 'Article Title');
formData.append('category', categoryId);
formData.append('content', 'Article content...');
formData.append('tags', 'technology, news, breaking'); // Comma-separated
// or
formData.append('tags', JSON.stringify(['technology', 'news', 'breaking'])); // Array

await axios.post('/api/post/createPost', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

## Features

✅ **Content-Based Recommendations**: Recommends articles based on:
   - Same category
   - Overlapping tags

✅ **Smart Fallback**: If not enough recommendations, fills with trending articles

✅ **Works for Non-Logged-In Users**: No authentication required

✅ **Responsive Design**: Beautiful card-based UI that works on all devices

✅ **Performance Optimized**: 
   - Limits to 5 recommendations
   - Sorts efficiently by views and date
   - Only fetches necessary fields

✅ **Error Handling**: Graceful handling of errors and empty states

## Testing

### Test Recommendations Endpoint
```bash
# Get recommendations for an article
curl http://localhost:5000/api/post/recommendations/ARTICLE_ID

# Get trending articles
curl http://localhost:5000/api/post/trending?limit=5
```

### Test in Frontend
1. Navigate to any article detail page
2. Scroll down past the article content and comments
3. You should see the "You might also like" section with recommended articles

## Customization

### Change Number of Recommendations
```jsx
<ArticleRecommendations 
  articleId={post._id} 
  limit={10} // Show 10 recommendations instead of 5
/>
```

### Change Section Title
```jsx
<ArticleRecommendations 
  articleId={post._id} 
  title="Related Articles" // Custom title
/>
```

### Styling
The component uses Tailwind CSS classes. You can customize the styling by modifying `ArticleRecommendations.jsx`.

## Notes

- Recommendations are calculated in real-time (not cached)
- The system works even if articles don't have tags (falls back to category matching)
- Only published or pending_review articles are included in recommendations
- The current article is always excluded from recommendations

