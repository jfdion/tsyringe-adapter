import JetonInjection from "./../types/jeton-injection";
import Fournisseur from "./fournisseur";

export default interface FournisseurJeton<T> {
    utiliserJeton: JetonInjection;
}

export function isFournisseurJeton<T>(fournisseur: Fournisseur<T>): fournisseur is FournisseurJeton<any> {
    return !!fournisseur['utiliserJeton'];
}