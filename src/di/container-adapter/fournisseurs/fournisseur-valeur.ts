import Fournisseur from "./fournisseur";

export default interface FournisseurValeur<T> {
    utiliserValeur: T;
}

export function isFournisseurValeur<T>(fournisseur: Fournisseur<T>): fournisseur is FournisseurValeur<any> {
    return !!fournisseur['utiliserValeur'];
}