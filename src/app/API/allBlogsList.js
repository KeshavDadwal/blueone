'use client';

export const allBlogsList = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `https://dashboard.bluone.ink/api/public/blogs?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const data = await response.json();
    
    // Map the blog data according to the API response structure
    const blogs = data.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      blogImage: blog.blogImage,
      categories: blog.categories
    }));

    return blogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

// Function to get all blogs for filtering
export const getAllBlogs = async () => {
  try {
    const response = await fetch(
      `https://dashboard.bluone.ink/api/public/blogs`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const data = await response.json();
    
    return data.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      blogImage: blog.blogImage,
      categories: blog.categories
    }));
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    return [];
  }
};

export default allBlogsList; 