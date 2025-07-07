import { RateResponse } from "./RateResponse.model";

export interface Rate {
  id?: number;
  rating: number;
  comment: string;
  flightNumber: string;
  company: string;
  flightDate: string;
  submittedAt?: string;
  rateResponse?: RateResponse[];
}
