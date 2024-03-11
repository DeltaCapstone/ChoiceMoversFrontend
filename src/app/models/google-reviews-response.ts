/**
 * Interface that describes the GoogleReviewsResponse type
 */
export interface GoogleReviewsResponse {
    reviews: [{
        authorAttribution: {
            displayName: string;
            photoUri: string;
            uri: string;
        }
        originalText: {
            languageCode: string;
            text: string;
        }
        rating: number;
        relativePublishTimeDescription: string;
        text: {
            languageCode: string;
            text: string;
        }
    }]
}
