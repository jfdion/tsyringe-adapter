import container from "../di/container";
import { Inject, Injectable } from "../di/di";
import UserService, { USER_SERVICE_ID } from "../user/user-service";
import Formation from "./formation";


export const FORMATION_SERVICE_ID: string = 'formation-service';

@Injectable()
export default class FormationService {
    private userService: UserService;

    constructor(@Inject(USER_SERVICE_ID) userService: UserService) {
        this.userService = userService;
    }

    public create(titre: string): Formation {
        if (!this.userService.isAuthorized()) {
            throw Error('not connected');
        }
        return new Formation(titre);
    }
}

container.enregistrer(FORMATION_SERVICE_ID, { utiliserClasse: FormationService });