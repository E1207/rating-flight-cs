import { Rate } from './rate.model';

export interface Flight {
  id: number;
  flightNumber: string;
  company: string;
  flightDate: string;
  rates: Rate[];
}
