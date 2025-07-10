import { RateResponse } from "./RateResponse.model";
import { RateStatus } from "./rate-status.model";

export interface Rate {
  id?: number;
  rating: number;
  comment: string;
  flightNumber: string;
  company: string;
  flightDate: string;
  submittedAt?: string;
  status?: RateStatus;
  rateResponse?: RateResponse[];
}
