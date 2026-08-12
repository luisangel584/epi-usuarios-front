import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  standalone: true,
  imports: [],
  template: `
    <div class="container">
      <h1>Hello, World!</h1>
      <p>Bienvenido a mi componente standalone de Angular.</p>
    </div>
  `,
  styles: `
    .container {
      font-family: sans-serif;
      text-align: center;
      padding: 2rem;
    }
    h1 { color: #3f51b5; }
  `
})
export class HelloWorldComponent {}
