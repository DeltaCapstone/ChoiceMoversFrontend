import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * A service that streamlines checking whether certain features are enabled to control application behavior.
 */
@Injectable({
    providedIn: 'root'
})
export class FeatureService {
    constructor() {
    }

    /**
     * Determines if the given feature has been defined in the environment.
     * @param {any} featureName The name of the feature to check.
     * @returns {boolean} true if the feature is found; false otherwise.
     */
    public hasFeature(featureName: any): boolean {
        return (environment as any)[featureName] !== undefined;
    }

    /**
     * Determines if the given feature is enabled.
     * @param {any} featureName The name of the feature to check.
     * @returns {boolean} true if the feature is found AND it's value is true (not truthy); false otherwise.
     */
    public isFeatureEnabled(featureName: any): boolean {
        return this.hasFeature(featureName) && (environment as any)[featureName] === true;
    }

    /**
     * Attempts to return the value of the given feature (if present).  This is also typically used for non-boolean features.
     * @param {string} featureName The name of the feature to return.
     * @returns {any | null} The value of the feature.
     */
    public getFeatureValue(featureName: string): any | null {
        return this.hasFeature(featureName) ? (environment as any)[featureName] : null;
    }
}
