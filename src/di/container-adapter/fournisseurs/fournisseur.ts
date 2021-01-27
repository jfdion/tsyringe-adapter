import FournisseurClasse, { isFournisseurClasse } from "./fournisseur-classe";
import FournisseurFactory, { isFournisseurFactory } from "./fournisseur-factory";
import FournisseurJeton, { isFournisseurJeton } from "./fournisseur-jeton";
import FournisseurValeur, { isFournisseurValeur } from "./fournisseur-valeur";

export type Fournisseur<T = any> = FournisseurClasse<T> | FournisseurFactory<T> | FournisseurValeur<T> | FournisseurJeton<T>;

export function isFournisseur<T>(fournisseur: any): fournisseur is Fournisseur<any> {
    return (isFournisseurClasse<T>(fournisseur)
        || isFournisseurFactory<T>(fournisseur)
        || isFournisseurValeur<T>(fournisseur)
        || isFournisseurJeton<T>(fournisseur));
}

export default Fournisseur;