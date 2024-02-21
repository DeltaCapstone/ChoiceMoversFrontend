// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    enableSystemMessages: false,
    enableDebugConsoleLogging: false,
    showEnvironmentBadge: true,
    environmentName: 'production',
    buildNumber: require('../../package.json').version + '-p',
    api: {
        url: 'https://backend-here/',
    }
};
