import type { DetailedEventType } from "@/types/events";

export const eventInfo: DetailedEventType = {
  location: "123 Example Street, Sampletown, Countryland",
  venueName: "Sample Venue Name",
  address: {
    street: "123 Example Street",
    postalCode: "12345",
    city: "Sampletown",
    country: "Countryland",
    googleMapUrl: "https://maps.app.goo.gl/ExampleMapUrl123",
    coordinates: {
      lat: 48.8566, // dummy coordinate (e.g. near Paris)
      lng: 2.3522,
    },
    get fullAddress() {
      return `${this.street}, ${this.postalCode} ${this.city}, ${this.country}`;
    },
  },
  timeZone: "Europe/Paris",
  eventDate: {
    startDate: "2025-07-13",
    startTime: "12:00:00",
    endDate: "2025-07-13",
    endTime: "22:00:00",
    minArrivalDate: "2025-07-11",
    minArrivalTime: "10:00:00",
    maxDepartureDate: "2025-07-15",
    maxDepatureTime: "17:00:00",
  },
  get startYear() {
    return new Date(this.eventDate.startDate).getFullYear();
  },
  get startMonth() {
    return new Date(this.eventDate.startDate).getMonth() + 1;
  },
};
