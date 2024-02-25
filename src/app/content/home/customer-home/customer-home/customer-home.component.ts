import { Component } from '@angular/core';
import { MoveButtonComponent } from '../../../../shared/components/move-button/move-button.component';
@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [MoveButtonComponent],
  templateUrl: './customer-home.component.html',
  styleUrl: './customer-home.component.css'
})
export class CustomerHomeComponent {

}
