import { personA } from "@/constants/people";
import { eventInfo } from "./event";

const accountName =
  personA.lastName.toLowerCase() + personA.firstName.toLowerCase();

export const PAYPAL_LINK: string = `https://paypal.me/${accountName}`;
export const VENUE_GOOGLE_MAPS: string = eventInfo.address.googleMapUrl;
export const TRAIN_PARIS_VIERZON_LINK: string =
  "https://www.sncf-connect.com/en-en/train/route/paris/vierzon";
export const VIERZON_GOOGLE_MAP: string =
  "https://maps.app.goo.gl/ExampleTrainStationLink";
