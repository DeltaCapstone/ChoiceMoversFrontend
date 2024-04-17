import { Injectable } from '@angular/core';
import { Observable, switchMap, tap, of, take, map, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';
import { Customer, CustomerCreateRequest, CustomerProfileUpdateRequest } from '../../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  apiUrl = '';
  cache$ = new ReplaySubject<Map<string, Customer>>(1);

  constructor(private _http: HttpClient, private _feature: FeatureService) {
    this.apiUrl = this._feature.getFeatureValue('api').url;
    this.cache$.next(new Map);
  }

  /**
   * Creates a new customer through the createCustomer API route using infomation provided via the CustomerCreateRequest object and caches the information
   * @param newCustomer A CreateCustomerRequest object containing customer information
   * @returns Observable of type CustomerCreateRequest
   */
  createCustomer(newCustomer: CustomerCreateRequest): Observable<CustomerCreateRequest> {
    this.cacheUpsert([newCustomer]);
    return this._http.post<CustomerCreateRequest>(`${this.apiUrl}/`, newCustomer);
  }

  /**
   * Retrieves the registered customer's information via the getCustomer API route. Looks for information in the cache if it exists
   * @returns Observable of type Customer if the customer exists; undefined otherwise
   */
  getCustomerProfile(): Observable<Customer | undefined> {
    const userName = sessionStorage.getItem('userName') ?? '';
    return this.cacheLookupWithFallback(
      cache => of([cache.get(userName)!]),
      () => this._http.get<Customer>(`${this.apiUrl}/customer/profile`).pipe(
        tap(customer => this.cacheUpsert([customer])),
        switchMap(() => this.cache$.pipe(
          take(1),
          map(cache => [cache.get(userName)!])
        ))
      )
    ).pipe(map(results => results[0]));
  }

  /**
   * Updates the registered customer's infomation via the updateCustomer API route. Caches the informations
   * @param updateCustomer A CustomerProfileUpdateRequest object containing updated customer information
   * @returns Observable of type customer
   */
  updateCustomerProfile(updateCustomer: CustomerProfileUpdateRequest): Observable<Customer> {
    this.cacheUpsert([updateCustomer]);
    return this._http.put<Customer>(`${this.apiUrl}/customer/profile`, updateCustomer).pipe(
      tap(_ => this.cacheUpsert([updateCustomer])),
      switchMap(_ => this.cache$.pipe(
        map(cache => cache.get(updateCustomer.userName)!),
        take(1)
      ))
    );
  }

  /**
   * Gets Customer information. To be used on EmployeeManager portal side versus getCustomerProfile which() is used on Customer facing side of the application
   * @param userName A valid username
   * @returns Observable of type Customer if the customer exists; undefined otherwise
   */
  getCustomer(userName: string): Observable<Customer | undefined> {
    return this.cacheLookupWithFallback(
      cache => of(cache.has(userName) ? [cache.get(userName)!] : []),
      () => this._http.get<Customer>(`${this.apiUrl}/customer/profile/${userName}`).pipe(
        tap(customer => this.cacheUpsert([customer])),
        switchMap(() => this.cache$.pipe(
          take(1),
          map(cache => [cache.get(userName)!])
        ))
      )
    ).pipe(map(results => results[0]));
  }

  /**
   * Function that looks for customer information via the cache
   * @param onHit Function called on a cache hit
   * @param onMiss Function called on a cache miss
   * @returns ReplaySubject with Customer information
   */
  private cacheLookupWithFallback(onHit: (cache: Map<string, Customer>) => Observable<Customer[]>, onMiss: () => Observable<Customer[]>): Observable<Customer[]> {
    return this.cache$.pipe(
      take(1),
      switchMap(cache => {
        if (cache.size > 2) {
          return onHit(cache);
        } else {
          return onMiss();
        }
      })
    )
  }

  /**
   * Deletes information from the cache
   * @param customerIds The customer IDs associated witht the information in the cache
   */
  private cacheDelete(customerIds: string[]) {
    this.cache$.pipe(take(1)).subscribe(cache => {
      customerIds.forEach(customerId => cache.delete(customerId));
      this.cache$.next(cache);
    });
  }

  /**
   * Function that inserts customer information into the cache
   * @param customers A Customer object Partial to be added to the cache, where Partial makes all of the properties in the generic optional
   */
  private cacheUpsert(customers: Partial<Customer>[]) {
    this.cache$.pipe(take(1)).subscribe(cache => {
      customers.forEach(newCustomer => {
        const userName = newCustomer.userName as string;
        const customer = cache.get(userName) ?? new Customer();
        Object.assign(customer, newCustomer);
        cache.set(userName, customer);
      });
      this.cache$.next(cache);
    });
  }
}
