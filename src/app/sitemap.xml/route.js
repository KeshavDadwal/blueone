import { getApiUrl } from "@/lib/apiConfig";

export async function GET() {
  const baseUrl = "https://bluone.ink";

  // Fetch all dynamic data
  const [authorsRes, booksRes, blogsRes, eventsRes] = await Promise.all([
    fetch(getApiUrl("/api/public/authors")),
    fetch(getApiUrl("/api/public/books")),
    fetch(getApiUrl("/api/public/blogs")),
    fetch(getApiUrl("/api/public/events")),
  ]);

  const authors = await authorsRes.json();
  const books = await booksRes.json();
  const blogs = await blogsRes.json();
  const events = await eventsRes.json();

  // Static URLs
  const staticUrls = [
    { loc: `${baseUrl}/`, priority: "1.00" },
    { loc: `${baseUrl}/authors`, priority: "0.80" },
    { loc: `${baseUrl}/books`, priority: "0.80" },
    { loc: `${baseUrl}/contact`, priority: "0.80" },
    { loc: `${baseUrl}/comingsoon`, priority: "1.00" },
    { loc: `${baseUrl}/terms`, priority: "0.80" },
    { loc: `${baseUrl}/privacypolicy`, priority: "0.80" },
    { loc: `${baseUrl}/disclaimer`, priority: "0.80" },
    { loc: `${baseUrl}/resources`, priority: "0.80" },
  ];

  const now = new Date().toISOString();

  // Static XML
  const staticUrlsXml = staticUrls.map(url => `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${now}</lastmod>
      <priority>${url.priority}</priority>
    </url>
  `).join("");

  // Authors XML
  const authorsUrls = authors.map(author => `
    <url>
      <loc>${baseUrl}/authors/${author.slug}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.80</priority>
    </url>
  `).join("");

  // Books XML
  const booksUrls = books.map(book => `
    <url>
      <loc>${baseUrl}/books/${book.slug}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.80</priority>
    </url>
  `).join("");

  // Blogs XML (under /resources/)
  const blogsUrls = blogs.map(blog => `
    <url>
      <loc>${baseUrl}/resources/blogs/${blog.slug}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.70</priority>
    </url>
  `).join("");

  // Events XML (under /resources/)
  const eventsUrls = events.map(event => `
    <url>
      <loc>${baseUrl}/resources/events/${event.slug}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.70</priority>
    </url>
  `).join("");

  // Combine all parts
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrlsXml}
    ${authorsUrls}
    ${booksUrls}
    ${blogsUrls}
    ${eventsUrls}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
