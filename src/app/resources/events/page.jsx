"use client";
import { useState, useEffect } from "react";
import Loader from "@/app/components/Loader";
import EventsCards from "./EventsCards";
import inkdouble1 from "@/app/assests/image/inkdouble1.svg";
import inkdouble2 from "@/app/assests/image/inkdouble2.svg";
import Link from "next/link";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet";
import Image from "next/image";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const [sortOrder, setSortOrder] = useState("newest");

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

  // Fetch data from API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://dashboard.bluone.ink/api/public/events");
        const data = await response.json();
        const mappedEvents = data.map((event) => ({
          id: event.id,
          title: event.title,
          eventslug: event.slug,
          eventbanner: event.bannerUrl,
          eventdate: new Date(event.eventDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
          eventtiming: event.eventTime,
          eventlocation: "",
          eventstate: "",
        }));
        setEvents(mappedEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.eventdate);
    const dateB = new Date(b.eventdate);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const filteredEvents = sortedEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Separate upcoming and past events with sorting
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter((event) => new Date(event.eventdate) >= today)
    .sort((a, b) => new Date(b.eventdate) - new Date(a.eventdate))
    .slice(0, 3);

  const pastEvents = events
    .filter((event) => new Date(event.eventdate) < today)
    .sort((a, b) => new Date(b.eventdate) - new Date(a.eventdate));

  const currentPastEvents = pastEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className="flex flex-col h-full pb-20 mx-auto top_bg_gradient">
          <HelmetProvider>
            <Helmet>
              <title>All Events | BluOne Ink Publishing</title>
              <meta
                name="description"
                content="Browse our list of events, including significant news, gatherings, and highlights from our Editorial Team and Authors."
              />
              <link
                rel="canonical"
                href="https://www.bluone.ink/resources/events"
              />
            </Helmet>
          </HelmetProvider>
          <div className="container px-4 mx-auto">
            <div className="w-full flex justify-center">
              <h1 className="text-[42px] font-medium pt-20 pb-10">Events</h1>
            </div>

            {/* Upcoming Events Section */}
            {upcomingEvents.length > 0 && (
              <section id="related-titles" className="container">
                <div className="flex items-center gap-2 justify-center pb-2">
                  <Image
                    src={inkdouble1}
                    width={55}
                    height={55}
                    alt="inkdouble1"
                  />
                  <i>
                    <h3 className="font-medium text-2xl md:text-3xl text-center">
                      Upcoming Events
                    </h3>
                  </i>
                  <Image
                    src={inkdouble2}
                    width={55}
                    height={55}
                    alt="inkdouble2"
                  />
                </div>

                <div className="lg:w-[60%] mx-auto mt-14">
                  {upcomingEvents.slice(0, 3).map((event, index) => (
                    <div key={event.id}>
                      <img
                        src={
                          index === 0
                            ? "/upevent1top.png"
                            : index === 1
                            ? "/upeventsectop.png"
                            : "/upthirdtop.png"
                        }
                        alt={`Title for Event ${index + 1}`}
                        className="w-full"
                      />

                      <Link href={`/resources/events/${encodeURIComponent(event.eventslug)}`}>
                        <div
                          style={{
                            backgroundColor: '#fff3e6',
                            backgroundSize: "cover",
                            backgroundPosition: index === 0 ? "bottom" : "top",
                          }}
                          className="w-full"
                        >
                          <div className="lg:pr-16 lg:pl-16 lg:pt-0 lg:pb-4 p-6 lg:flex w-full gap-10">
                            <div className="lg:w-[60%] flex items-center justify-center h-[80%]">
                              <div className="bg-[#fff4ea] w-full">
                                <img
                                  src={event.eventbanner}
                                  alt="Event image"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </div>
                            <div className="lg:w-[40%] pt-4 lg:pt-0 flex items-center">
                              <div>
                                <h3 className="text-[20px] uppercase leading-6 font-barlow font-medium">
                                  {event.title}
                                </h3>
                                <p className="text-[18px] text-[#0D1928] leading-6 mt-4 font-normal font-barlow">
                                  {event.eventdate}
                                </p>
                                <p className="text-[18px] text-[#0D1928] leading-6 font-normal font-barlow">
                                  {event.eventtiming}
                                </p>
                                <p className="text-[18px] text-[#0D1928] leading-6 font-normal font-barlow">
                                  {event.eventlocation},{' '}{event.eventstate}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>

                      <img
                        src={
                          index === 0
                            ? "/upevent1bottom.png"
                            : index === 1
                            ? "/upeventsecbottom.png"
                            : "/upthirdbottom.png"
                        }
                        alt={`Title for Event ${index + 1}`}
                        className="w-full mb-2"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Past Events Section */}
            <section id="related-titles" className="container">
              <div className="flex items-center gap-2 justify-center pb-6 pt-10">
                <Image
                  src={inkdouble1}
                  width={55}
                  height={55}
                  alt="inkdouble1"
                />
                <i>
                  <h3 className="font-medium text-2xl md:text-2xl text-center">
                    Past Events
                  </h3>
                </i>
                <Image
                  src={inkdouble2}
                  width={55}
                  height={55}
                  alt="inkdouble2"
                />
              </div>

              <div
                className={`pt-6 ${
                  currentPastEvents.length > 0
                    ? "grid grid-cols-2 lg:grid-cols-3 gap-4"
                    : "flex justify-center items-center h-64"
                }`}
              >
                {currentPastEvents.length > 0 ? (
                  currentPastEvents.map((event) => (
                    <Link
                      href={`/resources/events/${encodeURIComponent(event.eventslug)}`}
                      key={event.id}
                      className="p-4 mb-4 hover:shadow-md input-border border-[#ffffff00] hover:border-[#BABABA] rounded-md"
                    >
                      <EventsCards
                        title={event.title}
                        eventdate={event.eventdate}
                        eventlocation={event.eventstate}
                        eventimage={event.eventbanner}
                        imageContainerClass="h-[200px] lg:h-[280px]"
                      />
                    </Link>
                  ))
                ) : (
                  <p className="text-md">No results found</p>
                )}
              </div>

              {/* Pagination */}
              <div className="w-full flex-wrap md:flex justify-center md:justify-between mt-10">
                {currentPastEvents.length > 0 && (
                  <div className="flex justify-center pb-5 md:justify-between">
                    <i>
                      <p>
                        Showing {indexOfFirstEvent + 1}-
                        {Math.min(indexOfLastEvent, pastEvents.length)} Past
                        Events of {pastEvents.length}
                      </p>
                    </i>
                  </div>
                )}

                {totalPages > 1 && pastEvents.length > 6 && (
                  <div className="flex justify-center gap-2 items-center">
                    {currentPage > 1 && (
                      <button
                        onClick={() => {
                          setCurrentPage((prev) => prev - 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="p-2 mx-2 flex items-center text-[#241b6d] hover:rounded-md hover:text-[#241b6d]"
                      >
                        <MdOutlineArrowLeft className="w-6 h-6" />
                      </button>
                    )}

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`p-1 px-2.5 py-0 text-lg font-medium text-[#8A8A8A] font-barlow rounded-full w-[30px] h-[30px] ${
                          currentPage === i + 1
                            ? "bg-[#8A8A8A66] text-black"
                            : "bg-white hover:bg-[#241b6d] hover:text-white font-normal"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    {currentPage < totalPages && (
                      <button
                        onClick={() => {
                          setCurrentPage((prev) => prev + 1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="p-2 mx-2 flex items-center text-[#241b6d] hover:rounded-md hover:text-[#241b6d]"
                      >
                        <MdOutlineArrowRight className="text-[#241b6d] w-6 h-6" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      )}
    </>
  );
}
