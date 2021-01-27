import { Inject, Injectable } from "./../../../di";

export const PREMIERE_CLASSE_ID = 'premiere-classe';
export const DEUXIEME_CLASSE_ID = 'deuxieme-classe';

@Injectable()
export class PremiereClasse {
    private static VALEUR: number = 42;

    private deuxiemeClasse: DeuxiemeClasse;

    constructor(@Inject(DEUXIEME_CLASSE_ID) deuxiemeClasse: DeuxiemeClasse) {
        this.deuxiemeClasse = deuxiemeClasse;
    }

    total(): number {
        return this.valeur() + this.deuxiemeClasse.valeur();
    }

    valeur(): number {
        return PremiereClasse.VALEUR;
    }

}

@Injectable()
export class DeuxiemeClasse {
    private static VALEUR: number = 7;

    private premiereClasse: PremiereClasse;

    constructor(@Inject(PREMIERE_CLASSE_ID) premiereClasse: PremiereClasse) {
        this.premiereClasse = premiereClasse;
    }

    total(): number {
        return this.premiereClasse.valeur() / this.valeur();
    }

    valeur(): number {
        return DeuxiemeClasse.VALEUR;
    }
}