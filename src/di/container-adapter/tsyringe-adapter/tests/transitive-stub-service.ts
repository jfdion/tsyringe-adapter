import { Inject, Injectable } from "../../../di";
import { StubService, STUB_SERVICE_ID } from "./stub-service";

export const TRANSITIVE_STUB_SERVICE_ID: string = 'transitive-stub-service';

@Injectable()
export class TransitiveStubService {
    private stubService: StubService;

    constructor(@Inject(STUB_SERVICE_ID) stubService: StubService) {
        this.stubService = stubService;
    }

    get compteur(): number {
        return this.stubService.compteur;
    }
}
