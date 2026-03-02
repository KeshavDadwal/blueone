"use client";
import { useState, useEffect } from "react";
import Loader from "@/app/components/Loader";
import Link from "next/link";
import { Helmet } from "react-helmet";
import { processEventData } from "@/app/API/eventUtils";

const Page = ({ params }) => {
  const eventslug = decodeURIComponent(params.eventslug);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch event data from API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`https://dashboard.bluone.ink/api/public/events/${eventslug}`);
        if (!response.ok) {
          throw new Error('Event not found');
        }
        const data = await response.json();
        setEvent(processEventData(data));
      } catch (error) {
        console.error(error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventslug]);

  // Meta title and description
  const pageTitle = `${event?.title || ""} | BluOne Ink Publishing`;
  const pageDescription = event?.meta_description || "";
  const canonicalUrl = `https://www.bluone.ink/resources/events/${eventslug}`;

  if (!event && !loading) {
    return <div>Event not found.</div>;
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main id="event-content" className="wrapper pt-0 mt-0 lg:pb-20 relative top-0">
          <Helmet>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <link rel="canonical" href={canonicalUrl} />
          </Helmet>

          {/* Page Container */}
          <div className="w-full bottom-0">
            <img
              src="/banner-back.png"
              className="w-full h-[500px] object-cover eventbannerpath"
              alt="Event Cover"
            />
          </div>

          <section>
            <div className="container relative z-[111]">
              <div className="event-wrapper p-10 pt-6 lg:w-[70%] -mt-96 mx-auto bg-white rounded-3xl shadow-md">
                <Link href="/resources/events">
                  <i>
                    <h6 className="text-[16px] text-center text-[#007DD7]">Back to All Events</h6>
                  </i>
                </Link>
                <h3 className="text-center mb-6 pt-6">{event?.title || "Event"}</h3>

                {/* Banner Image */}
                <div className="w-full pt-6">
                  <img src={event.bannerUrl} width="100%" alt="Event Banner" />
                </div>

                {/* Date and Time */}
                <div className="w-full pt-6">
                  <h6 className="text-[16px] uppercase font-medium font-barlow">
                    Date and Time:{" "}
                    <span className="text-[16px] font-normal">
                      {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(new Date(event.eventDate))}, {event.eventTime}
                    </span>
                  </h6>
                </div>

                {/* Location */}
                {event?.location && (
                  <div className="pt-1">
                    <h6 className="text-[16px] uppercase font-medium font-barlow">
                      Location: <span className="font-normal">{event.location}{event.state && `, ${event.state}`}</span>
                    </h6>
                  </div>
                )}

                {/* Event Content */}
                <div className="event-content pt-6 prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: event?.content }} />
                </div>

              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default Page;
