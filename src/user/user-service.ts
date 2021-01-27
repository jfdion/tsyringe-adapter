import container from "../di/container";
import { Injectable } from "../di/di";

export const USER_SERVICE_ID: string = 'user-service';

@Injectable()
export default class UserService {
    public isAuthorized(): boolean {
        return true;
    }
}

container.enregistrer(USER_SERVICE_ID, { utiliserClasse: UserService });