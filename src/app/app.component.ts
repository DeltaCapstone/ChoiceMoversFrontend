import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    constructor(private http: HttpClient) { }

    response: string = ''
    
    getRequest() {
        this.http.get('http://localhost:8080/', {responseType: "text"}).subscribe({
            next: res => {
                this.response = res
            },
            error: err => {
                console.error(err);
            }
        });
    }
    
    title = 'temp-name';
}
