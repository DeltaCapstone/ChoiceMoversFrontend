import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgFor } from '@angular/common';

type MenuBarItem = {
  readonly title: string
  readonly route: string
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, TuiSvgModule, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  items: MenuBarItem[] = [
    { title: "Home", route: "home" },
    { title: "Moving", route: "moving" },
    { title: "Clean Out", route: "cleanOut" },
    { title: "Packing", route: "packing" },
    { title: "Storage", route: "storage" },
    { title: "Quote", route: "quote" },
    { title: "Contact", route: "contact" },
  ]
}
