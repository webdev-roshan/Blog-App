import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Post } from "@/lib/types";
import { useAuth } from "@/hooks/auth/useAuth";
import { Comments } from "./Comments";

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string | number) => void;
}

export const PostCard = ({ post, onEdit, onDelete }: PostCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <Link href={`/posts/${post.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.content}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            {user?.id === post.userId && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit(post);
                  }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(post.id);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Preview Comments Section */}
      <div className="border-t border-gray-100 p-4">
        <Link
          href={`/posts/${post.id}`}
          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          View Post and Comments →
        </Link>
      </div>
    </div>
  );
}; 