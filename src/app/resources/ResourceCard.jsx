import React from 'react';

function ResourceCards({ title, resouceimage, imageContainerClass }) {
  const defaultImage = "https://via.placeholder.com/250x400.png?text=No+Image+Available";

  return (
    <div className="w-full min-h-[300px]">
      <div className="flex flex-col h-full pb-6">
        {/* Image container with customizable class */}
        <div className={`${imageContainerClass || 'h-[200px] lg:h-[300px]'}`}>
          <img
            src={resouceimage || defaultImage}
            alt={title || "Book cover"}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1">
          {title && (
            <h6 className="pt-4 uppercase font-medium font-barlow leading-6">
              {title}
            </h6>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResourceCards;
