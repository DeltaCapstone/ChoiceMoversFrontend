import { Injectable } from '@angular/core';
import { Features } from 'src/app/features';
import { SeverityCode } from 'src/app/models/severity-code';
import { FeatureService } from './feature.service';

/**
 * Service type that provides an abstractions for logging operations.
 */
@Injectable({
    providedIn: 'root'
})
export class LogService {

    private consoleLogEnabled?: boolean | null;

    /**
     * Initializes a new instance of the LogService class.
     * @param {FeatureService} featureService - The FeatureService instance used to check feature flags.
     */
    constructor(protected featureService: FeatureService) {
        this.consoleLogEnabled = null;
    }

    public log(severity?: SeverityCode, ...args: any[]): void {
        if (this.consoleLogEnabled === null) {
            if (!this.featureService.hasFeature(Features.enableDebugConsoleLogging)) {
                this.consoleLogEnabled = true;
            } else {
                this.consoleLogEnabled = this.featureService.hasFeature(Features.enableDebugConsoleLogging) && this.featureService.isFeatureEnabled(Features.enableDebugConsoleLogging);
            }
        }

        if (!!this.consoleLogEnabled) {
            if (severity) {
                switch (severity) {
                    case SeverityCode.Info:
                        console.log(...args);
                        break;
                    case SeverityCode.Warning:
                        console.warn(...args);
                        break;
                    case SeverityCode.Error:
                        console.error(...args);
                        break;
                    case SeverityCode.Exception:
                        if ((console as any).exception) {
                            (console as any).exception(...args);
                        } else {
                            console.error(...args);
                        }

                        break;
                    default:
                        console.log(...args);
                        break;
                }
            } else {
                console.log(...args);
            }
        }
    }
}
