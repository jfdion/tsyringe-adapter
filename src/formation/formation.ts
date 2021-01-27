export default class Formation {
    private titreCourant: string;

    constructor(titre: string) {
        this.titreCourant = titre;
    }

    get titre(): string {
        return this.titreCourant;
    }
}