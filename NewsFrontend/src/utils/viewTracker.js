export function recordPostView(post) {
  try {
    if (!post) return;
    const categoryId = post.category?._id || post.category;
    if (!categoryId) return;

    // Load existing map
    const raw = localStorage.getItem('viewedCategories');
    const viewed = raw ? JSON.parse(raw) : {};

    // Increment
    const key = String(categoryId);
    viewed[key] = (viewed[key] || 0) + 1;

    localStorage.setItem('viewedCategories', JSON.stringify(viewed));
  } catch (_) {}
}

export function getViewedCategories() {
  try {
    const raw = localStorage.getItem('viewedCategories');
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}


