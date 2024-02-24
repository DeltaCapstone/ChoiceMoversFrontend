import { Component } from '@angular/core';
import { PageComponent } from '../../../shared/components/page-component';
import { PageService } from '../../../shared/services/page.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent extends PageComponent {
    ngOnInit(){
        this.setTitle("Settings");
    }
    
    constructor(pageService: PageService){
        super(pageService);
    }
}
