import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CustomerNavBarComponent } from '../../shared/components/customer-nav-bar/customer-nav-bar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

type MenuBarItem = {
  readonly title: string
  readonly route: string
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CustomerNavBarComponent, RouterOutlet, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
