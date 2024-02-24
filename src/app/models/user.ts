export interface User {
    readonly email: string;
    readonly name: string;
    readonly status: 'alive' | 'deceased';
    readonly tags: readonly string[];
}
