import React from 'react';

function AuthorBooksCards({
  title,
  bookPrice,
  authorName,
  thumbnailUrl,
  publishYear,
  imageContainerClass
}) {
  const defaultImage = "https://via.placeholder.com/250x400.png?text=No+Image+Available";

  return (
    <div className="w-full min-h-[400px]">
      <div className="flex flex-col h-full">
        <div className={`h-full lg:h-[400px] object-cover ${imageContainerClass}`}>
          <img
            src={thumbnailUrl || defaultImage}
            alt={title || "Book cover"}
            className="object-cover object-top w-full h-full"
          />
        </div>
        <div className='flex-1'>
          {title && (
            <h6 className="pt-4 uppercase font-semibold font-barlow leading-5">
              {title}
            </h6>
          )}
          {authorName && (
            <h4 className="uppercase font-light font-barlow pt-2 text-base leading-5 text-[#0D1928]">
              {Array.isArray(authorName) ? authorName.join(', ') : authorName}
            </h4>
          )}
          {bookPrice && (
            <h4 className="text-gray-500 text-base font-barlow">
              {bookPrice}
            </h4>
          )}
          {publishYear && (
            <p className="text-gray-500 text-sm">{publishYear}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthorBooksCards;
