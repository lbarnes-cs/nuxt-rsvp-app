export type CommonEventDetailsType = {
  location: string;
  timeZone: string;
};

export type EventType = CommonEventDetailsType & {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type AddressType = {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  googleMapUrl: string;
  coordinates: Coordinates;
  readonly fullAddress: string; // getter property
};

export type EventDateType = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  minArrivalDate: string;
  minArrivalTime: string;
  maxDepartureDate: string;
  maxDepatureTime: string;
};

export type DetailedEventType = CommonEventDetailsType & {
  venueName: string;
  address: AddressType;
  eventDate: EventDateType;
  readonly startYear: number; // getter
  readonly startMonth: number; // getter
};
