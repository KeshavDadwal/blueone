// Function to process event content HTML
export const processEventContent = (content) => {
  try {
    if (!content) return "";

    // Remove JSON quotes if present
    let processedContent = content.replace(/^"|"$/g, "");

    // Remove any wrapping <p> tags at the start and end
    processedContent = processedContent.replace(/^<p>|<\/p>$/g, "");

    // Fix newlines and escaped characters
    processedContent = processedContent
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");

    // Convert HTML entities
    processedContent = processedContent
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    // Trim extra whitespace
    processedContent = processedContent.trim();

    return processedContent;
  } catch (error) {
    console.warn("Error processing event content:", error);
    return content || "";
  }
};

// Function to process entire event data object
export const processEventData = (event) => {
  const defaultImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  return {
    id: event.id,
    title: event.title || "Untitled Event",
    eventslug: event.eventslug || event.slug,
    content: processEventContent(event.content),
    bannerUrl: event.bannerUrl || event.eventbanner || defaultImage,
    eventDate: event.eventDate || event.date,
    eventTime: event.eventTime || event.time,
    location: event.location || "",
    state: event.state || "",
    meta_description: event.meta_description || event.title || "",
  };
}; 