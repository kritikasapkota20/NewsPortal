import React, { useState } from 'react';

const Comments = () => {
  const [comments] = useState([
    {
      id: 1,
      post: 'Breaking News: Market Crash',
      author: 'John Doe',
      content: 'This is a very informative article!',
      date: '2024-03-14',
      status: 'Approved'
    },
    {
      id: 2,
      post: 'New Tech Trends in 2025',
      author: 'Jane Smith',
      content: 'Great insights about future technology.',
      date: '2024-03-13',
      status: 'Pending'
    },
    {
      id: 3,
      post: 'Sports Update: Final Match Highlights',
      author: 'Mike Johnson',
      content: 'The match was incredible!',
      date: '2024-03-12',
      status: 'Approved'
    },
  ]);

  const handleApprove = (commentId) => {
    console.log('Approve comment:', commentId);
  };

  const handleDelete = (commentId) => {
    console.log('Delete comment:', commentId);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Comments</h1>
      
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
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{comment.post}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{comment.author}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{comment.content}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{comment.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    comment.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {comment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {comment.status === 'Pending' && (
                    <button
                      onClick={() => handleApprove(comment.id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
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
    </div>
  );
};

export default Comments; 