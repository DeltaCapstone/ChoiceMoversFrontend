/**
 * Type used to expose constants used for localization.
 */
export class Formats {
    /**
     * The standard date format.
     */
    public DatePrimary: string = 'yyyy/MM/dd';

    /**
     * The standard time format.
     */
    public TimePrimary: string = 'HH:mm:ss';

    /**
     * The standard date and time format.
     */
    public DateTimePrimary: string = `${this.DatePrimary} ${this.TimePrimary}`;

    /**
     * Factory method used when a new formats instance is required.
     * @returns {Formats}
     */
    public static all(): Formats {
        return new Formats();
    }
}
