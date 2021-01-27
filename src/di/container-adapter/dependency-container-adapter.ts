import FournisseurClasse from "./fournisseurs/fournisseur-classe";
import FournisseurFactory from "./fournisseurs/fournisseur-factory";
import FournisseurJeton from "./fournisseurs/fournisseur-jeton";
import FournisseurValeur from "./fournisseurs/fournisseur-valeur";
import { IntercepteurOptions, PostResolutionIntercepteurCallback, PreResolutionIntercepteurCallback } from "./types/intercepteur";
import JetonInjection from "./types/jeton-injection";
import OptionsEnregistrement from "./types/options-enregistrement";

export default interface DependencyContainerAdapter<Adaptee> {
    getAdaptee(): Adaptee;

    /** Permet l'enregistrement d'un service
     *  {@see OptionsEnregistrement} pour le cycle de vie d'une instance
    */
    enregistrer<T>(jeton: JetonInjection<T>, fournisseur: FournisseurValeur<T>): DependencyContainerAdapter<Adaptee>;
    enregistrer<T>(jeton: JetonInjection<T>, fournisseur: FournisseurFactory<T>): DependencyContainerAdapter<Adaptee>;
    enregistrer<T>(jeton: JetonInjection<T>, fournisseur: FournisseurJeton<T>, options?: OptionsEnregistrement): DependencyContainerAdapter<Adaptee>;
    enregistrer<T>(jeton: JetonInjection<T>, fournisseur: FournisseurClasse<T>, options?: OptionsEnregistrement): DependencyContainerAdapter<Adaptee>;
    enregistrerInstance<T>(jeton: JetonInjection<T>, instance: T): DependencyContainerAdapter<Adaptee>;

    /**
    * Résout un jeton vers une instance

    * @param jeton Jeton de dépendance
    * @return Instance de la dépendance
    */
    resoudre<T>(jeton: JetonInjection): T;
    resoudreTous<T>(jeton: JetonInjection): T[];

    /**
    * Vérifie si une dépendance est enregistrée
    *
    * @param token Jeton à vérifier
    * @param recursive Est-ce que le conteneur parent doit être vérifié
    * @return Si le jeton est enregistré ou non
    */
    isEnregistre<T>(token: JetonInjection<T>, recursive?: boolean): boolean;
    /**
     * Efface tous les jetons enregistrés
     */
    reset(): void;
    effacerInstances(): void;
    creerConteneurEnfant(): DependencyContainerAdapter<Adaptee>;

    /**
    * Enregistre un callback qui est appelé lors de la résolution d'un jeton spécifique
    * @param jeton Jeton à intercepter
    * @param callback Callback à appeler avant la résolution du jeton
    * @param options Options selon les circonstances d'appel du callback
    */
    avantResolution<T>(jeton: JetonInjection<T>, callback: PreResolutionIntercepteurCallback<T>, options?: IntercepteurOptions): void;

    /**
    * Enregistre un callback qui est appelé après la résolution réussie d'un jeton spécifique
    * @param jeton Jeton à intercepter
    * @param callback Callback à appeler après la résolution du jeton
    * @param options Options selon les circonstances d'appel du callback
    */
    apresResolution<T>(jeton: JetonInjection<T>, callback: PostResolutionIntercepteurCallback<T>, options?: IntercepteurOptions): void;
}