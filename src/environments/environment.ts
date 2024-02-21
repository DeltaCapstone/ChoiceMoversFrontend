// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    enableSystemMessages: false,
    enableDebugConsoleLogging: true,
    showEnvironmentBadge: true,
    environmentName: 'development',
    buildNumber: require('../../package.json').version + '-d',
    api: {
        url: 'https://backend-here/',
    }
};
