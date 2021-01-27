import { Injectable } from "../../../di";

export const STUB_SERVICE_ID: string = 'stub-service';

@Injectable()
export class StubService {

    private compteurInterne: number = 0

    constructor() {
    }

    increment(): void {
        this.compteurInterne += 1;
    }

    get compteur(): number {
        return this.compteurInterne;
    }
};