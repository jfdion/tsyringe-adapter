import { container, DependencyContainer, Frequency, Lifecycle } from "tsyringe";
import { CycleDeVie } from "../cycle-de-vie";
import { Frequence, PostResolutionIntercepteurCallback, PreResolutionIntercepteurCallback } from "../types/intercepteur";
import DependencyContainerAdapter from './../dependency-container-adapter';
import { TSyringeDepenencyContainerAdapter } from "./tsyringe-container-adapter";

jest.mock('tsyringe');

export const STUB_SERVICE_ID: string = 'stub-service';

export class StubService {

    private compteurInterne: number = 0

    constructor() {
    }

    increment(): void {
        this.compteurInterne += 1;
    }

    get compteur(): number {
        return this.compteurInterne;
    }
};

let containerAdapter: DependencyContainerAdapter<DependencyContainer>;

beforeEach(() => {
    containerAdapter = new TSyringeDepenencyContainerAdapter(container);
});

describe(`Enregistrement d'une dépendance`, () => {

    describe(`À partir de la classe`, () => {
        it(`sans option`, () => {
            containerAdapter.enregistrer(STUB_SERVICE_ID, { utiliserClasse: StubService });

            expect(container.register).toHaveBeenCalledWith(STUB_SERVICE_ID, { useClass: StubService }, undefined);
        });

        type casDeTest = { cycleDeVie: CycleDeVie, attendu: Lifecycle };
        test.each`
        cycleDeVie                        | attendu
        ${CycleDeVie.Transient}           | ${Lifecycle.Transient}
        ${CycleDeVie.Singleton}           | ${Lifecycle.Singleton}
        ${CycleDeVie.PorteeResolution}    | ${Lifecycle.ResolutionScoped}
        ${CycleDeVie.PorteeConteneur}     | ${Lifecycle.ContainerScoped}
        `(`Avec l'option $libelle`, ({ cycleDeVie, attendu }: casDeTest) => {
            containerAdapter.enregistrer(STUB_SERVICE_ID, { utiliserClasse: StubService }, { cycleDeVie });

            expect(container.register).toHaveBeenCalledWith(STUB_SERVICE_ID, { useClass: StubService }, { lifecycle: attendu });
        });
    });

    describe(`À partir d'un jeton`, () => {
        const JETON_SERVICE_ID: string = 'jeton-autre-service';

        it(`sans option`, () => {
            containerAdapter.enregistrer(STUB_SERVICE_ID, { utiliserJeton: JETON_SERVICE_ID });

            expect(container.register).toHaveBeenCalledWith(STUB_SERVICE_ID, { useToken: JETON_SERVICE_ID }, undefined);
        });

        type casDeTest = { cycleDeVie: CycleDeVie, attendu: Lifecycle };
        test.each`
        cycleDeVie                        | attendu
        ${CycleDeVie.Transient}           | ${Lifecycle.Transient}
        ${CycleDeVie.Singleton}           | ${Lifecycle.Singleton}
        ${CycleDeVie.PorteeResolution}    | ${Lifecycle.ResolutionScoped}
        ${CycleDeVie.PorteeConteneur}     | ${Lifecycle.ContainerScoped}
        `(`Avec l'option $libelle`, ({ cycleDeVie, attendu }: casDeTest) => {
            containerAdapter.enregistrer(STUB_SERVICE_ID, { utiliserJeton: StubService }, { cycleDeVie });

            expect(container.register).toHaveBeenCalledWith(STUB_SERVICE_ID, { useToken: StubService }, { lifecycle: attendu });
        });
    });

    it(`À partir d'une valeur constante`, () => {
        const valeur: number = 42;

        containerAdapter.enregistrer(STUB_SERVICE_ID, { utiliserValeur: valeur });

        expect(container.register).toHaveBeenCalledWith(STUB_SERVICE_ID, { useValue: valeur });
    });

    it(`À partir d'une factory`, () => {
        const factory = <T>(_: DependencyContainerAdapter<T>) => { return new StubService(); }

        containerAdapter.enregistrer(STUB_SERVICE_ID, { utiliserFactory: factory });

        expect(container.register).toHaveBeenCalledWith(STUB_SERVICE_ID, { useFactory: expect.any(Function) })
    })

    it('Une instance', () => {
        const instance: StubService = new StubService();
        containerAdapter.enregistrerInstance(STUB_SERVICE_ID, instance);

        expect(container.registerInstance).toHaveBeenCalledWith(STUB_SERVICE_ID, instance);
    })
});

describe(`Résolution de dépendance`, () => {
    describe(`vérification de l'existence d'une dépendance`, () => {
        it(`sans le paramètre de recherche de récursive`, () => {
            containerAdapter.isEnregistre(STUB_SERVICE_ID);

            expect(container.isRegistered).toHaveBeenCalledWith(STUB_SERVICE_ID, undefined);
        });

        it(`recherche non-récursive explicite`, () => {
            containerAdapter.isEnregistre(STUB_SERVICE_ID, false);

            expect(container.isRegistered).toHaveBeenCalledWith(STUB_SERVICE_ID, false);
        });

        it(`recherche récursive explicite`, () => {
            containerAdapter.isEnregistre(STUB_SERVICE_ID, true);

            expect(container.isRegistered).toHaveBeenCalledWith(STUB_SERVICE_ID, true);
        });
    });

    it(`résolution d'une dépendance`, () => {
        containerAdapter.resoudre(STUB_SERVICE_ID);

        expect(container.resolve).toHaveBeenCalledWith(STUB_SERVICE_ID);
    });

    it(`résolution d'une collection de dépendances`, () => {
        containerAdapter.resoudreTous(STUB_SERVICE_ID);

        expect(container.resolveAll).toHaveBeenCalledWith(STUB_SERVICE_ID);
    });
});

describe(`Réinitialisation`, () => {
    it(`Effacement des dépendances enregistrés`, () => {
        containerAdapter.reset();

        expect(container.reset).toHaveBeenCalledTimes(1);
    });

    it(`Effacement des instances`, () => {
        containerAdapter.effacerInstances();

        expect(container.clearInstances).toHaveBeenCalledTimes(1);
    });
});

describe(`Hiérarchisation de conteneur`, () => {
    it(`Création d'un conteneur enfant`, () => {
        const conteneurEnfant: DependencyContainerAdapter<DependencyContainer> = containerAdapter.creerConteneurEnfant();

        expect(conteneurEnfant).toBeDefined();
        expect(container.createChildContainer());
    });
})

describe(`Injection de callback dans le cycle de vide de résolution de dépendances`, () => {
    describe(`Enregistrement d'un callback à exécuter avant la résolution`, () => {
        let callback: PreResolutionIntercepteurCallback;
        beforeEach(() => {
            callback = jest.fn()
        });

        it(`sans option`, () => {
            containerAdapter.avantResolution(STUB_SERVICE_ID, callback)

            expect(container.beforeResolution).toHaveBeenCalledWith(STUB_SERVICE_ID, callback, undefined)
        });

        type casDeTest = { frequence: Frequence, attendu: Frequency };
        test.each`
        frequence       | attendu
        ${'Toujours'}   | ${'Always'}
        ${'Unique'}     | ${'Once'}
        `(`Avec l'option $frequence`, ({ frequence, attendu }: casDeTest) => {
            containerAdapter.avantResolution(STUB_SERVICE_ID, callback, { frequence })

            expect(container.beforeResolution).toHaveBeenCalledWith(STUB_SERVICE_ID, callback, { frequency: attendu })
        });
    });

    describe(`Enregistrement d'un callback à exécuter après la résolution`, () => {
        let callback: PostResolutionIntercepteurCallback;
        beforeEach(() => {
            callback = jest.fn()
        });

        it(`sans option`, () => {
            containerAdapter.apresResolution(STUB_SERVICE_ID, callback)

            expect(container.afterResolution).toHaveBeenCalledWith(STUB_SERVICE_ID, callback, undefined)
        });

        type casDeTest = { frequence: Frequence, attendu: Frequency };
        test.each`
        frequence      | attendu
        ${'Toujours'}  | ${'Always'}
        ${'Unique'}    | ${'Once'}
        `(`Avec l'option $libelle`, ({ frequence, attendu }: casDeTest) => {
            containerAdapter.apresResolution(STUB_SERVICE_ID, callback, { frequence })

            expect(container.afterResolution).toHaveBeenCalledWith(STUB_SERVICE_ID, callback, { frequency: attendu })
        });
    });
});