import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class NumberHelperService {
    constructor() { }

    public isPresent<T>(t: T | undefined | null | void): t is T {
        return t !== undefined && t !== null;
    }

    public filterNaN(input: number) {
        return (isNaN(input) ? 0 : input);
    }

    public round(input: number, round: number) {
        return input.toFixed(round)
    }
}
