import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const humanizeSlug = (slug = "") =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const SubCategoryPosts = () => {
  const { categorySlug, subSlug } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState(humanizeSlug(subSlug));

  useEffect(() => {
    setPage(1);
  }, [categorySlug, subSlug]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/post/getPostsBySubcategory/${categorySlug}/${subSlug}`,
          {
            params: { page, limit: 9 },
            signal: controller.signal,
          }
        );

        if (res.data?.success) {
          setPosts(res.data.posts || []);
          setCategoryInfo(res.data.category);
          setSubCategoryName(res.data.subCategoryName || humanizeSlug(subSlug));
          setTotalPages(res.data.totalPages || 1);
        } else {
          setError(res.data?.message || "Failed to fetch posts");
          setPosts([]);
          setTotalPages(1);
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err?.response?.data?.message || "Failed to fetch posts");
        setPosts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    return () => controller.abort();
  }, [categorySlug, subSlug, page]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <div className="h-12 w-12 border-4 border-gray-200 border-t-[#F05922] rounded-full animate-spin" />
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-500 py-12">{error}</p>;
    }

    if (posts.length === 0) {
      return <p className="text-center text-gray-500 py-12">No posts found for this subcategory.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post._id}
            to={`/${categorySlug}/${post._id}/${post.slug}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col"
          >
            <img
              src={post.image?.startsWith("http") ? post.image : `http://localhost:5000${post.image}`}
              alt={post.title}
              className="w-full h-60 object-cover rounded-t-lg"
            />
            <div className="p-4 space-y-2 flex-1 flex flex-col">
              <p className="text-xs uppercase tracking-wide text-[#F05922]">
                {categoryInfo?.name} • {post.subCategory || subCategoryName}
              </p>
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-[#F05922] transition">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-3 flex-1">
                {post.content?.slice(0, 120)}{post.content?.length > 120 ? "..." : ""}
              </p>
              <span className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const pagination = () => {
    if (totalPages <= 1) return null;
    const windowSize = 5;
    const startPage = Math.max(1, page - Math.floor(windowSize / 2));
    const endPage = Math.min(totalPages, startPage + windowSize - 1);

    return (
      <div className="flex flex-wrap gap-2 items-center justify-center mt-8">
        {[...Array(Math.max(0, endPage - startPage + 1))].map((_, idx) => {
          const pageNum = startPage + idx;
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-4 py-2 rounded-full ${
                pageNum === page ? "bg-[#F05922] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded-full ${
            page >= totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#0066B3] text-white hover:bg-[#005299]"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="pt-2 pb-12">
      <div className="mx-auto md:px-12 px-6 py-6 w-full bg-white shadow-lg space-y-10">
        <div className="pb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-sm uppercase text-gray-500 tracking-wide">{categoryInfo?.name || humanizeSlug(categorySlug)}</p>
              <h2 className="text-3xl font-bold text-[#F05922]">{subCategoryName}</h2>
            </div>
          </div>
        </div>
        {renderContent()}
        {pagination()}
      </div>
    </div>
  );
};

export default SubCategoryPosts;

