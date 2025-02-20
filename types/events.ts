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
