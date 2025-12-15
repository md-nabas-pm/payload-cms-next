import Image from "next/image";
import { getPayload } from 'payload'
import config from '@payload-config'
import SearchAndFilter from './SearchAndFilter';

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string; category?: string }
}) {
  const payload = await getPayload({ config });
  
  // Build query conditions
  const where: any = {};
  
  if (searchParams.category && searchParams.category !== 'all') {
    where.category = {
      equals: searchParams.category
    };
  }
  
  if (searchParams.search) {
    where.or = [
      {
        title: {
          contains: searchParams.search
        }
      },
      {
        excerpt: {
          contains: searchParams.search
        }
      },
      {
        author: {
          contains: searchParams.search
        }
      }
    ];
  }

  const postsCollection = await payload.find({
    collection: 'posts',
    where: Object.keys(where).length > 0 ? where : undefined,
  });

  const categoriesCollection = await payload.find({
    collection: 'categories',
  });

  const posts = postsCollection.docs;
  const categories = categoriesCollection.docs;

  return (
    <div className="min-h-screen bg-[#f5f1ed] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-light mb-8">
            <span className="text-[#ff6b7a]">Latest</span>{" "}
            <span className="text-gray-900 font-normal">Blogs</span>
          </h1>

          {/* Search and Filter Component */}
          <SearchAndFilter categories={categories} />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Featured Image */}
              <div className="relative h-64 bg-gradient-to-br from-teal-400 to-teal-600">
                {post.featuredImage?.url ? (
                  <Image
                    src={post.featuredImage.url}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gray-800/80 px-8 py-4 rounded-lg">
                      <h3 className="text-white text-xl font-bold text-center uppercase tracking-wide">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category and Date */}
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <span className="font-medium">
                    {post.category?.name || 'Uncategorized'}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {post.excerpt || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in...'}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">
                      {post.author?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {post.author || 'Anonymous'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {post.status === 'published' ? 'Editor' : 'Viewer'}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No blog posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}