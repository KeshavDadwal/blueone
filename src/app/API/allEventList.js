'use client';
import { getApiUrl } from "@/lib/apiConfig";

export const getAllEvents = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${getApiUrl("/api/public/books/search")}?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await response.json();

    const books = Array.isArray(data?.data) ? data.data : [];

    const uniqueEventsMap = new Map();

    books.forEach(book => {
      if (book?.event_id) {
        uniqueEventsMap.set(book.event_id, {
          id: book.event_id,
          name: book.event_name,
          slug: book.event_slug,
          date: book.event_date,
          location: book.event_location,
          description: book.event_description
        });
      }
    });

    const uniqueEvents = Array.from(uniqueEventsMap.values());

    return {
      events: uniqueEvents,
      total: uniqueEvents.length,
      currentPage: page,
      totalPages: Math.ceil(uniqueEvents.length / limit)
    };

  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      events: [],
      total: 0,
      currentPage: page,
      totalPages: 0
    };
  }
};

export default getAllEvents;
