import { NgFor, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { TuiSvgModule } from '@taiga-ui/core';
import { RouterLink, RouterLinkActive  } from '@angular/router';

type SidebarItem = {
    readonly name: string
    readonly icon: string
    readonly route: string
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [NgFor, TuiSvgModule, NgClass, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {    
    items: SidebarItem[] = [
        { name: "Schedule", icon: "tuiIconCalendarLarge", route: "schedule" },
        { name: "Employees", icon: "tuiIconUserLarge", route: "employees" },
        { name: "Statistics", icon: "tuiIconTrelloLarge", route: "statistics" },
        { name: "Settings", icon: "tuiIconSettingsLarge", route: "settings" }
    ];
}
