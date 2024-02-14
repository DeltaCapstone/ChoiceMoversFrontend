import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

type SidebarItem = {
    readonly name: string
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    sidebarItems: SidebarItem[] = [
        {name: "Schedule"},
        {name: "Employees"},
        {name: "Statistics"},
        {name: "Settings"}
    ];
}
