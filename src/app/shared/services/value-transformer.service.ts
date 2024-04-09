import { Injectable } from '@angular/core';
import { AbstractTuiValueTransformer, TuiDay, TuiTime } from '@taiga-ui/cdk';

@Injectable({
  providedIn: 'root'
})
export class ValueTransformerService extends AbstractTuiValueTransformer<[TuiDay | null, TuiTime | null], string> {

  private readonly separator = ', ';

  /**
   * Transforms a string to a TuiDay and TuiTime
   * @param controlValue 
   * @returns Date in the form TuiDay, TuiTime
   */
  fromControlValue(controlValue: string): [TuiDay | null, TuiTime | null] {
    const [day, time = ''] = controlValue.split(this.separator);

    return day
      ? [TuiDay.normalizeParse(day), time ? TuiTime.fromString(time) : null]
      : [null, null];
  }

  /**
   * Transforms a TuiDay and TuiTime into a string
   * @param param0 TuiDay and TuiTime provided to the function
   * @returns TuiDay and TuiTime in string format
   */
  toControlValue([day, time]: [TuiDay | null, TuiTime | null]): string {
    return day
      ? day.toString() + (time ? `${this.separator}${time.toString()}` : '')
      : '';
  }

}
