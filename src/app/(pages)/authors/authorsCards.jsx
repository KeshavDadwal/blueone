import React from 'react';

function AuthorsCards ({ coverImage, authorName }) {
  const defaultImage = "/author-defaultimages.png";

  return (
    <div className="w-full min-h-[250px]">
      <div className="flex flex-col h-full">
        <div className="w-full">
        <img src={coverImage || defaultImage} alt={authorName} className="h-[220px] object-cover" />
        </div>
        <div className='flex-1'>
        <h2 className="mt-2 text-center text-base uppercase font-semibold font-barlow ">{authorName}</h2>
        </div>
      </div>
    </div>
  );
}

export default AuthorsCards;

