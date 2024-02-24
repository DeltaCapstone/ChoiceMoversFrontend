import { Component } from '@angular/core';
import { PageService } from '../../../shared/services/page.service';
import { PageComponent } from '../../../shared/components/page-component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent extends PageComponent {
    ngOnInit(){
        this.setTitle("Statistics");
    }
    
    constructor(pageService: PageService){
        super(pageService);
    }
}
