import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgFor } from '@angular/common';

type MenuBarItem = {
  readonly title: string
  readonly route: string
}

@Component({
  selector: 'app-customer-nav-bar',
  standalone: true,
  imports: [NgFor, TuiSvgModule, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './customer-nav-bar.component.html',
  styleUrl: './customer-nav-bar.component.css'
})
export class CustomerNavBarComponent {
  items: MenuBarItem[] = [
    { title: "Home", route: "customer-home" },
    { title: "Moving", route: "moving" },
    { title: "Packing", route: "packing" },
    { title: "Storage", route: "storage" },
    { title: "Contact", route: "contact" },
  ]
}
