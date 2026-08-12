import { Injectable } from '@angular/core';
import { DateFormat } from './interfaces/date-format.interface';

@Injectable({
  providedIn: 'root'
})
export class UsDateFormatService extends DateFormat {

  /** Returns today's date formatted as YYYY/D/M */
  today(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    return `${yyyy}/${day}/${month}`;
  }
}
