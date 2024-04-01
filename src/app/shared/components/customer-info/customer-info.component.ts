import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormGroup, FormBuilder, FormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../base-component'
import { Observable, Subscription, map, of } from 'rxjs';
import { CustomersService } from '../../services/customers.service';
import { Customer, CustomerCreateRequest, CustomerProfileUpdateRequest } from '../../../models/customer.model'
import { ActivatedRoute, Router } from '@angular/router';
import { SessionType } from '../../../models/session.model';
import { SessionService } from '../../services/session.service';
import { TuiTextfieldControllerModule, TuiDataListModule, TuiErrorModule, TuiSvgModule, TuiButtonModule } from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiInputPhoneModule, TuiTextareaModule, TuiInputPasswordModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-customer-info',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TuiTextfieldControllerModule, TuiDataListModule, TuiErrorModule, TuiSvgModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPhoneModule, TuiTextareaModule, TuiInputPasswordModule, TuiButtonModule],
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInfoComponent extends BaseComponent {
  @Input() readOnly: boolean;

  customerSignUpGroup: FormGroup;

  subscriptions: Subscription[] = [];

  isNew: boolean = false;

  user$: Observable<Customer | undefined>;

  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute, private _customerService: CustomersService, private _location: Location, private _router: Router, @Inject(SessionType.Customer) private _session: SessionService<Customer>) {
    super();

    this.customerSignUpGroup = this._formBuilder.group({
      userName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phonePrimary: new FormControl('', Validators.required),
      phoneOther: new FormControl([]),
      passwordPlain: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    const userName: string | null = this._route.snapshot.paramMap.get('userName');
    //if user exists, get this customer and set the form values
    if (userName) {
      this.user$ = this._customerService.getCustomer(userName);

      const customerSubscription = this.user$.subscribe(user => {
        this.customerSignUpGroup.patchValue({
          userName: user?.username ?? '',
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          email: user?.email ?? '',
          phonePrimary: user?.phonePrimary ?? '',
          phoneOther: user?.phoneOther ?? [],
        });
      });
      this.subscriptions.push(customerSubscription);
    } else {
      this.user$ = of(new Customer);
      this.isNew = true;
    }
  }

  save() {
    const customerSignUpFormValues = this.customerSignUpGroup.value;
    const saveSub = this.user$.pipe(
      map(user => ({
        ...user,
        username: customerSignUpFormValues.userName ?? user?.username ?? '',
        firstName: customerSignUpFormValues.firstName ?? user?.firstName ?? '',
        lastName: customerSignUpFormValues.lastName ?? user?.lastName ?? '',
        email: customerSignUpFormValues.email ?? user?.email ?? '',
        phonePrimary: customerSignUpFormValues.phonePrimary ?? user?.phonePrimary ?? '',
        phoneOther: [customerSignUpFormValues.phoneOther],
      }))
    ).subscribe(newUser => {
      //create new customer
      console.log('Request object to send is:', customerSignUpFormValues)
      const createCustomerRequest: CustomerCreateRequest = {
        ...newUser,
        passwordPlain: 'test1234'
      };
      console.log('Customer request is', createCustomerRequest)
      this._customerService.createCustomer(createCustomerRequest).subscribe({
        next: (response) => {
          console.log('Customer created successfully', response);
          this.back();
        },
        error: (error) => {
          console.error('Error creating customer', error);
          this.back();
        }
      });
    });
    this.subscriptions.push(saveSub);
    this._router.navigate(['/home']);
  }

  back() {
    this._location.back();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
