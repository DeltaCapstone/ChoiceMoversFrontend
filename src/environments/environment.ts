// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import pkg from '../../package.json';

export const environment = {
    enableSystemMessages: false,
    enableDebugConsoleLogging: true,
    showEnvironmentBadge: true,
    environmentName: 'development',
    buildNumber: pkg.version + '-d',
    api: {
        url: 'http://localhost:8080',
    },
};
