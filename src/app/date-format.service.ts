import { Injectable } from '@angular/core';
import { DateFormat } from './interfaces/date-format.interface';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService extends DateFormat {

  /** Returns today's date formatted as YYYY-MM-DD */
  today(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
