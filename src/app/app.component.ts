import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DateFormatService } from './date-format.service';
import { DateFormat } from './interfaces/date-format.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'interview';
  today: string;

  constructor(private dateFormatService: DateFormatService) {
    this.today = this.dateFormatService.today();
  }
}
