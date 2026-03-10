import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() { }

  public stringToDate(dateString: string) {
    const date = new Date(dateString);
    console.log(date.toString());
    return date;
  }

  public dateToString(date: Date) {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  public dateStringToString(dateString: string, returnTime: boolean, returnDate: boolean, wordBetween: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const formattedDate = date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const formattedTime = date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    if (returnDate && returnTime) {
      return `${formattedDate} ${wordBetween} ${formattedTime}`;
    }

    if (returnDate) {
      return formattedDate;
    }

    if (returnTime) {
      return formattedTime;
    }

    return '';
  }
}
