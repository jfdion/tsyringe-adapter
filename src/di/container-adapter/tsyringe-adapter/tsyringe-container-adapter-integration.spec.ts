import { container, DependencyContainer } from "tsyringe";
import { delai } from "../constructeur-retarde";
import { CycleDeVie } from "../cycle-de-vie";
import DependencyContainerAdapter from "../dependency-container-adapter";
import { DeuxiemeClasse, DEUXIEME_CLASSE_ID, PremiereClasse, PREMIERE_CLASSE_ID } from './tests/cycle';
import { Generateur, GENERATEUR_CURRENT_INDEX_ID, GENERATEUR_ID } from "./tests/generateur-id";
import { StubService, STUB_SERVICE_ID } from "./tests/stub-service";
import { TransitiveStubService, TRANSITIVE_STUB_SERVICE_ID } from './tests/transitive-stub-service';
import { TSyringeDepenencyContainerAdapter } from "./tsyringe-container-adapter";



let containerAdapter: DependencyContainerAdapter<DependencyContainer>;

beforeEach(() => {
    containerAdapter = new TSyringeDepenencyContainerAdapter(container);
});

it(`Récupérer un service enregistré`, () => {
    containerAdapter.enregistrer<StubService>(STUB_SERVICE_ID, { utiliserClasse: StubService });

    expect(containerAdapter.isEnregistre(STUB_SERVICE_ID)).toBe(true);
    expect(containerAdapter.resoudre<StubService>(STUB_SERVICE_ID)).toBeDefined();
    expect(containerAdapter.resoudre<StubService>(STUB_SERVICE_ID) instanceof StubService).toBe(true);
});

it(`Récupérer un service avec une dépendance transitive`, () => {
    containerAdapter.enregistrer<StubService>(STUB_SERVICE_ID, { utiliserClasse: StubService });
    containerAdapter.enregistrer<TransitiveStubService>(TRANSITIVE_STUB_SERVICE_ID, { utiliserClasse: TransitiveStubService });

    expect(containerAdapter.isEnregistre(TRANSITIVE_STUB_SERVICE_ID)).toBe(true);
    expect(containerAdapter.resoudre<StubService>(TRANSITIVE_STUB_SERVICE_ID)).toBeDefined();
    expect(containerAdapter.resoudre<TransitiveStubService>(TRANSITIVE_STUB_SERVICE_ID) instanceof TransitiveStubService).toBe(true);
});

it(`Un service enregistré retourne une nouvelle instance à chaque appel`, () => {
    containerAdapter.enregistrer<StubService>(STUB_SERVICE_ID, { utiliserClasse: StubService });

    // Incrément de la valeur du service de base
    const stubService: StubService = containerAdapter.resoudre<StubService>(STUB_SERVICE_ID);
    stubService.increment();

    // Incrément de la valeur d'un autre appel pour le même service
    const stubServiceAutre: StubService = containerAdapter.resoudre<StubService>(STUB_SERVICE_ID);
    stubServiceAutre.increment();

    expect(stubService.compteur).toBe(1);
    expect(stubServiceAutre.compteur).toBe(1);
});

it(`Un service enregistré comme singleton est toujours réutilisé`, () => {
    containerAdapter.enregistrer<StubService>(STUB_SERVICE_ID, { utiliserClasse: StubService }, { cycleDeVie: CycleDeVie.Singleton });

    // Incrément de la valeur du service de base
    const stubService: StubService = containerAdapter.resoudre<StubService>(STUB_SERVICE_ID);
    stubService.increment();

    // Incrément de la valeur d'un autre appel pour le même service
    const stubServiceAutre: StubService = containerAdapter.resoudre<StubService>(STUB_SERVICE_ID);
    stubServiceAutre.increment();

    expect(stubService.compteur).toBe(2);
    expect(stubServiceAutre.compteur).toBe(2);
});

it(`Un service peut être généré à partir d'une factory`, () => {
    containerAdapter.enregistrer<number>(GENERATEUR_CURRENT_INDEX_ID, { utiliserValeur: 10 });

    containerAdapter.enregistrer<Generateur>(GENERATEUR_ID, {
        utiliserFactory: (container: DependencyContainerAdapter<any>) => {
            const index: number = container.resoudre(GENERATEUR_CURRENT_INDEX_ID);

            return new Generateur(index);
        }
    });

    const generateurId: Generateur = containerAdapter.resoudre<Generateur>(GENERATEUR_ID);

    expect(generateurId.next).toBe(11);
});

it(`Le container peut résoudre une dépendance cyclique, une seule des classes doit être retardée pour briser le cycle`, () => {
    containerAdapter.enregistrer<PremiereClasse>(PREMIERE_CLASSE_ID, { utiliserClasse: delai(() => PremiereClasse) });
    containerAdapter.enregistrer<DeuxiemeClasse>(DEUXIEME_CLASSE_ID, { utiliserClasse: DeuxiemeClasse });

    const premiereClasse: PremiereClasse = containerAdapter.resoudre<PremiereClasse>(PREMIERE_CLASSE_ID);
    const deuxiemeClasse: DeuxiemeClasse = containerAdapter.resoudre<DeuxiemeClasse>(DEUXIEME_CLASSE_ID);

    expect(premiereClasse.total()).toBe(49);
    expect(deuxiemeClasse.total()).toBe(6);
});