export const GENERATEUR_CURRENT_INDEX_ID: string = 'generateur-current-index';
export const GENERATEUR_ID: string = 'generateur';

export class Generateur {
    private id: number;

    public constructor(id: number) {
        this.id = id;
    }

    get next(): number {
        return this.id + 1;
    }
}