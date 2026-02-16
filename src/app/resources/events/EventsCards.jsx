import React from 'react';

function EventsCards({ title, eventdate, eventlocation, eventimage, imageContainerClass }) {
  const defaultImage = "https://via.placeholder.com/250x400.png?text=No+Image+Available";

  const imageSrc = eventimage || defaultImage;

  return (
    <div className="w-full min-h-[300px] relative">
      {/* Background Image */}
      <div
        className={`absolute inset-0 blur-sm ${imageContainerClass || 'h-[200px] lg:h-[300px]'}`}
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full pb-6 bg-opacity-80 backdrop-blur-sm">
        {/* Foreground Image */}
        <div className={`relative ${imageContainerClass || 'h-[200px] lg:h-[300px]'}`}>
          <img
            src={imageSrc}
            alt={title || "Event cover"}
            className="object-contain object-center w-full h-full"
          />
        </div>

        {/* Event Details */}
        <div className="flex-1 bg-white/90">
          {title && (
            <h6 className="pt-4 uppercase font-medium font-barlow leading-6">
              {title}
            </h6>
          )}
          {eventdate && (
            <p className="pt-2 uppercase font-normal font-barlow leading-6">
              {new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(eventdate)) +
                ", " +
                new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(new Date(eventdate))} 
              {eventlocation && ` / ${eventlocation}`}
            </p>
          )}

          {/* {eventlocation && (
            <p className="pt-2 uppercase font-normal font-barlow leading-6">{eventlocation}</p>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default EventsCards;
