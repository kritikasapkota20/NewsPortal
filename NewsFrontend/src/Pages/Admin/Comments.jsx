import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_SERVERAPI || 'http://localhost:5000/api';
const PAGE_SIZE = 10;

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API}/admin/comments`, {
          params: { page, limit: PAGE_SIZE, search: search.trim() || undefined },
          withCredentials: true,
          signal: controller.signal,
        });
        setComments(res.data?.comments || []);
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err?.response?.data?.message || 'Failed to load comments');
          setComments([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    return () => controller.abort();
  }, [page, search]);

  const handleDelete = (commentId) => {
    console.log('Delete comment:', commentId);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const windowSize = 5;
  const startPage = Math.max(1, page - Math.floor(windowSize / 2));
  const endPage = Math.min(totalPages, startPage + windowSize - 1);

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Manage Comments</h1>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search comment text..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-[#0066B3]"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Loading comments...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && comments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No comments found.
                </td>
              </tr>
            )}
            {!loading && !error && comments.map((comment) => (
              <tr key={comment._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {comment.articleId?.title || 'Unknown Post'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {comment.articleId?.category?.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {comment.userId?.username || 'Anonymous'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {comment.userId?.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700 line-clamp-3">{comment.text}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700">
                    {comment.parentCommentId ? 'Reply' : 'Comment'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        {[...Array(Math.max(0, endPage - startPage + 1))].map((_, idx) => {
          const pageNum = startPage + idx;
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-4 py-2 rounded-full ${pageNum === page ? 'bg-[#F05922] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded-full ${page >= totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#0066B3] text-white hover:bg-[#005299]'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Comments;