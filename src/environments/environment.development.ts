// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import pkg from '../../package.json';

const mapsApiKey = "AIzaSyBYJbCFhGVBBe7lLW8amGRXZR61gfxol_Y";

export const environment = {
    enableSystemMessages: false,
    enableDebugConsoleLogging: true,
    showEnvironmentBadge: true,
    environmentName: 'development',
    buildNumber: pkg.version + '-d',
    api: {
        url: 'http://localhost:8080',
    },
    mapsApi: {
        key: mapsApiKey,
        placesUrl: `https://places.googleapis.com/v1/places/ChIJR0zbo4V49mIRynTpBCdPbC4?fields=reviews,displayName&key=${mapsApiKey}`
    }
};
