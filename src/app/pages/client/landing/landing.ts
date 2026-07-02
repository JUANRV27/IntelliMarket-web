import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  team = [
    { name: 'Ángel Díaz',           role: 'Estudiante de Ciencias de la Computación', img: 'assets/images/Angel.png',    linkedin: 'https://www.linkedin.com/in/angel-gabriel-diaz-chavez/' },
    { name: 'Mauricio Canchis',      role: 'Estudiante de Ciencias de la Computación', img: 'assets/images/Mauricio.png', linkedin: 'No existente' },
    { name: 'Juan José Rodríguez',   role: 'Estudiante de Ciencias de la Computación', img: 'assets/images/Juan.png',     linkedin: 'https://www.linkedin.com/in/juan-jos%C3%A9-r-bbbb74264/' },
    { name: 'Johan Quispe',          role: 'Estudiante de Ciencias de la Computación', img: 'assets/images/Johan.png',    linkedin: 'https://www.linkedin.com/in/johan-sebasti%C3%A1n-quispe-quintana-1a05b829b/' },
  ];
  
  // Método para el botón del Hero que baja suavemente a las "Features"
  scrollToSection(element: HTMLElement): void {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
}