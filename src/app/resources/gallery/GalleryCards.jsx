import React from "react";

function GalleryCards({
  title,
  gallerydate,
  galleryimage,
  imageContainerClass,
}) {
  const defaultImage = "https://via.placeholder.com/250x400.png?text=No+Image+Available";
  const imageSrc = galleryimage || defaultImage;

  // Safely parse the gallerydate and format it
  let formattedDate = "Unknown Date";
  if (gallerydate) {
    const date = new Date(gallerydate);
    if (!isNaN(date)) {
      formattedDate =
        new Intl.DateTimeFormat("en-US", { month: "long" }).format(date) +
        ", " +
        new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(date);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden">
      {/* Image Section */}
      <div
        className={`relative ${imageContainerClass || "h-60 rounded-t-lg"}`}
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={imageSrc}
          alt={title || "Event cover"}
          className="absolute inset-0 object-cover w-full h-full rounded-t-lg"
        />
      </div>

      {/* Event Details */}
      <div className="flex-1 bg-white/90">
          {title && (
            <h6 className="pt-4 uppercase font-medium font-barlow leading-6">
              {title}
            </h6>
          )}
          {gallerydate && (
            <p className="pt-2 uppercase font-normal font-barlow leading-6">
              {new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(gallerydate))}, 
              {new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(new Date(gallerydate))}
            </p>
          )}


          {/* {eventlocation && (
            <p className="pt-2 uppercase font-normal font-barlow leading-6">{eventlocation}</p>
          )} */}
        </div>
    </div>
  );
}

export default GalleryCards;