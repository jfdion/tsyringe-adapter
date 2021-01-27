
import container from '../../di/container';
import Formation from '../formation';
import FormationService, { FORMATION_SERVICE_ID } from '../formation-service';
import FormationComponent from './formation-component';

beforeEach(() => {
    container.effacerInstances();
});

describe(`Création d'une formation`, () => {
    beforeEach(() => {
        const mockFormationService: FormationService = container.resoudre<FormationService>(FORMATION_SERVICE_ID);
        mockFormationService.create = jest.fn(() => new Formation('Ma formation'));
        container.enregistrerInstance(FORMATION_SERVICE_ID, mockFormationService);
    })

    it(`le rendu affiche le titre`, () => {
        const formationComponent: FormationComponent = new FormationComponent();

        formationComponent.creerFormation();

        expect(formationComponent.render().indexOf('Ma formation')).toBeGreaterThanOrEqual(0);
    });
});

describe(`Une erreur survient lors de la création`, () => {
    beforeEach(() => {
        const mockFormationService: FormationService = container.resoudre<FormationService>(FORMATION_SERVICE_ID);
        mockFormationService.create = jest.fn(() => { throw new Error('invalide') });
        container.enregistrerInstance(FORMATION_SERVICE_ID, mockFormationService);
    })

    it(`le rendu n'affiche rien`, () => {
        const formationComponent: FormationComponent = new FormationComponent();

        formationComponent.creerFormation();

        expect(formationComponent.render()).toEqual('');
    });
});