import { ConstructeurRetarde } from "./../constructeur-retarde";
import { constructeur } from "./../types/constructeur";
import Fournisseur from "./fournisseur";

export default interface FournisseurClasse<T> {
    utiliserClasse: constructeur<T> | ConstructeurRetarde<T>;
}

export function isFournisseurClasse<T>(fournisseur: Fournisseur<T>): fournisseur is FournisseurClasse<any> {
    return !!fournisseur['utiliserClasse'];
}