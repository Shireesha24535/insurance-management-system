
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly products = [
    {
      name: 'Auto Insurance',
      description: 'Protection for every journey.',
      icon: '🚗',
      startingPrice: '₹499',
      period: '/ month'
    },
    {
      name: 'Home Insurance',
      description: 'Protect your home and belongings.',
      icon: '🏡',
      startingPrice: '₹299',
      period: '/ month'
    },
    {
      name: 'Life Insurance',
      description: 'Help secure your family’s future.',
      icon: '🛡️',
      startingPrice: '₹799',
      period: '/ month'
    }
  ];
}
