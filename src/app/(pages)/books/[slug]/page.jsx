import { redirect } from "next/navigation";

import { fetchBookBySlug, processBookData } from "@/app/API/booksapi";
import { fetchBookVersionsV1, fetchRelatedBooksV1 } from "@/app/API/booksV1Api";
import BookPageClient from "./BookPageClient";

export async function generateMetadata({ params }) {
  const slug = decodeURIComponent(params.slug);
  const cleanSlug = slug.replace(/-\d{13}$/, "");

  try {
    const bookData = await fetchBookBySlug(cleanSlug);
    if (!bookData) return {};

    const authorNames = [
      bookData.author?.name,
      ...(bookData.writers || []).map((w) => w?.name),
    ]
      .filter(Boolean)
      .join(", ");

    const title = `${bookData.title}${authorNames ? ` by ${authorNames}` : ""} | BluOne Ink Book`;
    const description = bookData.metaDescription || bookData.description || undefined;

    return {
      title,
      description,
      alternates: {
        canonical: `https://www.bluone.ink/books/${params.slug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function Page({ params }) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  const cleanSlug = decodedSlug.replace(/-\d{13}$/, "");

  const bookData = await fetchBookBySlug(cleanSlug);
  if (!bookData) redirect("/books");

  const expectedSlug = `${cleanSlug}-${bookData.isbn13}`;
  if (decodedSlug !== expectedSlug) redirect(`/books/${expectedSlug}`);

  const allAuthors = [bookData.author, ...(bookData.writers || [])]
    .filter(Boolean)
    .map((author) => ({
      id: author.id,
      author_name: author.name,
      authslug: author.slug,
      image: author.imageUrl,
      authorDescription: author.description,
      authorSocial: author.socialMedia
        ? typeof author.socialMedia === "string"
          ? JSON.parse(author.socialMedia)
          : author.socialMedia
        : {},
    }));

  const categoryNames = [bookData.category, ...(bookData.additionalCategories || [])]
    .filter(Boolean)
    .map((cat) => cat.name)
    .join(", ");

  const genreNames = [bookData.genre, ...(bookData.additionalGenres || [])]
    .filter(Boolean)
    .map((gen) => gen.name)
    .join(", ");

  const bookInfo = {
    ...processBookData(bookData),
    author: allAuthors[0] || null,
    authors: allAuthors,
    category: categoryNames,
    genre: genreNames,
    categories: bookData.category
      ? [bookData.category, ...(bookData.additionalCategories || [])]
      : [],
    genres: bookData.genre
      ? [bookData.genre, ...(bookData.additionalGenres || [])]
      : [],
  };

  const primaryCategorySlug = bookInfo.categories?.[0]?.slug;

  const [relatedData, versionsData] = await Promise.all([
    fetchRelatedBooksV1({
      categorySlug: primaryCategorySlug,
      sort: "title_asc",
      page: 1,
      limit: 7,
    }),
    fetchBookVersionsV1({ title: bookInfo.title }),
  ]);

  const relatedBooksRaw = Array.isArray(relatedData?.books) ? relatedData.books : [];
  const relatedBooks = relatedBooksRaw
    .filter((b) => b?.slug && b.slug !== bookInfo.slug)
    .slice(0, 6);

  const versionsRaw = Array.isArray(versionsData) ? versionsData : [];
  const seen = new Set();
  const versions = [];
  for (const v of versionsRaw) {
    if (!v?.language || !v?.slug) continue;
    if (seen.has(v.language)) continue;
    seen.add(v.language);
    versions.push(v);
  }

  return (
    <BookPageClient
      bookInfo={bookInfo}
      relatedBooks={relatedBooks}
      versions={versions}
      slug={slug}
    />
  );
}
