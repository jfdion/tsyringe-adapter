import Formation from "./formation";
import FormationService from "./formation-service";

let formationService: FormationService;

describe(`Utilisateur connecté`, () => {
    beforeEach(() => {
        formationService = new FormationService({ isAuthorized: jest.fn(() => true) });
    });

    it(`peut créer une formation`, () => {
        const resultat: Formation = formationService.create("Ma formation");

        expect(resultat).toEqual({ titreCourant: 'Ma formation' });
    });
});


describe(`Utilisateur non-connecté`, () => {
    beforeEach(() => {
        formationService = new FormationService({ isAuthorized: jest.fn(() => false) });
    });

    it(`ne peut pas créer une formation`, () => {
        expect(() => formationService.create("Ma formation")).toThrowError();
    });
});