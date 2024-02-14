import { NgFor, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';


type SidebarItem = {
    readonly name: string
    readonly icon: string
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [NgFor, TuiSvgModule, NgClass],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    selectedIndex: Number = 0
    
    sidebarItems: SidebarItem[] = [
        { name: "Schedule", icon: "tuiIconCalendarLarge" },
        { name: "Employees", icon: "tuiIconUserLarge" },
        { name: "Statistics", icon: "tuiIconTrelloLarge" },
        { name: "Settings", icon: "tuiIconSettingsLarge" }
    ];
}
