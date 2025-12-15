'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface SearchAndFilterProps {
  categories: Category[];
}

export default function SearchAndFilter({ categories }: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  const updateURL = (search: string, category: string) => {
    const params = new URLSearchParams();
    
    if (search) {
      params.set('search', search);
    }
    
    if (category && category !== 'all') {
      params.set('category', category);
    }
    
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '/');
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateURL(value, selectedCategory);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateURL(searchQuery, value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6b7a] focus:border-transparent"
        />
      </div>

      {/* Category Dropdown */}
      <div className="relative w-full sm:w-64">
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#ff6b7a] focus:border-transparent cursor-pointer"
        >
          <option value="all">All Blogs</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}