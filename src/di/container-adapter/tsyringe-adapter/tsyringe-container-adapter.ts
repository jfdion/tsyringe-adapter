import { ClassProvider, container as TSyringeContainer, DependencyContainer, FactoryProvider, InjectionToken, Lifecycle, TokenProvider, ValueProvider } from "tsyringe";
import { PostResolutionInterceptorCallback as TSyringePostResolutionInterceptorCallback, PreResolutionInterceptorCallback as TSyringePreResolutionInterceptorCallback } from "tsyringe/dist/typings/types/dependency-container";
import InterceptorOptions from "tsyringe/dist/typings/types/interceptor-options";
import RegistrationOptions from "tsyringe/dist/typings/types/registration-options";
import { IntercepteurOptions, PostResolutionIntercepteurCallback, PreResolutionIntercepteurCallback } from "../types/intercepteur";
import { CycleDeVie } from "./../cycle-de-vie";
import DependencyContainerAdapter from "./../dependency-container-adapter";
import Fournisseur from "./../fournisseurs/fournisseur";
import { isFournisseurClasse } from "./../fournisseurs/fournisseur-classe";
import FournisseurFactory, { isFournisseurFactory } from "./../fournisseurs/fournisseur-factory";
import { isFournisseurJeton } from "./../fournisseurs/fournisseur-jeton";
import { isFournisseurValeur } from "./../fournisseurs/fournisseur-valeur";
import JetonInjection from "./../types/jeton-injection";
import OptionsEnregistrement from "./../types/options-enregistrement";

/**
 * Adaptateur pour l'implémentation de conteneur de dépendance pour TSyringe { @see https://github.com/microsoft/tsyringe }
 */
export class TSyringeDepenencyContainerAdapter implements DependencyContainerAdapter<DependencyContainer> {

    private adaptee: DependencyContainer;

    constructor(container: DependencyContainer) {
        this.adaptee = container;
    }

    getAdaptee(): DependencyContainer {
        return this.adaptee;
    }

    enregistrer<T>(jeton: JetonInjection<T>, fournisseur: Fournisseur<T>, options?: OptionsEnregistrement): DependencyContainerAdapter<DependencyContainer> {
        if (isFournisseurClasse(fournisseur)) {
            this.adaptee.register<T>(jeton as InjectionToken<T>, { useClass: fournisseur.utiliserClasse } as ClassProvider<T>, this.CycleDeVieToLifecycle(options));
        } else if (isFournisseurJeton(fournisseur)) {
            this.adaptee.register<T>(jeton as InjectionToken<T>, { useToken: fournisseur.utiliserJeton } as TokenProvider<T>, this.CycleDeVieToLifecycle(options));
        } else if (isFournisseurValeur(fournisseur)) {
            this.adaptee.register<T>(jeton as InjectionToken<T>, { useValue: fournisseur.utiliserValeur } as ValueProvider<T>);
        } else if (isFournisseurFactory(fournisseur)) {
            this.adaptee.register<T>(jeton as InjectionToken<T>, {
                useFactory: (dependencyContainer: DependencyContainer) => {
                    const container: DependencyContainerAdapter<DependencyContainer> = new TSyringeDepenencyContainerAdapter(dependencyContainer);
                    return (fournisseur as FournisseurFactory<any>).utiliserFactory(container);
                }
            } as FactoryProvider<T>);
        }

        return this;
    };

    enregistrerInstance<T>(token: JetonInjection<T>, instance: T): DependencyContainerAdapter<DependencyContainer> {
        this.adaptee.registerInstance(token as InjectionToken<T>, instance);
        return this;
    };

    resoudre<T>(jeton: JetonInjection): T {
        return this.adaptee.resolve<T>(jeton as InjectionToken<T>);
    }

    resoudreTous<T>(jeton: JetonInjection): T[] {
        return this.adaptee.resolveAll(jeton as InjectionToken<T>);
    }

    isEnregistre<T>(token: JetonInjection<T>, recursive?: boolean): boolean {
        return this.adaptee.isRegistered(token as InjectionToken<T>, recursive);
    }

    reset(): void {
        this.adaptee.reset();
    }

    effacerInstances(): void {
        this.adaptee.clearInstances();
    }

    creerConteneurEnfant(): DependencyContainerAdapter<DependencyContainer> {
        return new TSyringeDepenencyContainerAdapter(this.adaptee.createChildContainer());
    }

    /**
    * Enregistre un callback qui est appelé lors de la résolution d'un jeton spécifique
    * @param token Jeton à intercepter
    * @param callback Callback à appeler avant la résolution du jeton
    * @param options Options selon les circonstances d'appel du callback
    */
    avantResolution<T>(jeton: JetonInjection<T>, callback: PreResolutionIntercepteurCallback<T>, options?: IntercepteurOptions): void {
        this.adaptee.beforeResolution(jeton as InjectionToken<T>, callback as TSyringePreResolutionInterceptorCallback<T>, this.frequenceToFrequency(options));
    }

    /**
    * Enregistre un callback qui est appelé après la résolution réussie d'un jeton spécifique
    * @param token Jeton à intercepter
    * @param callback Callback à appeler après la résolution du jeton
    * @param options Options selon les circonstances d'appel du callback
    */
    apresResolution<T>(jeton: JetonInjection<T>, callback: PostResolutionIntercepteurCallback<T>, options?: IntercepteurOptions): void {
        this.adaptee.afterResolution(jeton as InjectionToken<T>, callback as TSyringePostResolutionInterceptorCallback<T>, this.frequenceToFrequency(options));
    }

    private CycleDeVieToLifecycle(options?: OptionsEnregistrement): RegistrationOptions | undefined {
        if (options === undefined) { return undefined; }

        switch (options.cycleDeVie) {
            case CycleDeVie.Singleton:
                return { lifecycle: Lifecycle.Singleton };
            case CycleDeVie.PorteeResolution:
                return { lifecycle: Lifecycle.ResolutionScoped };
            case CycleDeVie.PorteeConteneur:
                return { lifecycle: Lifecycle.ContainerScoped };
            case CycleDeVie.Transient:
            default:
                return { lifecycle: Lifecycle.Transient };
        }
    }

    private frequenceToFrequency(options?: IntercepteurOptions): InterceptorOptions | undefined {
        if (options === undefined) { return undefined; }

        switch (options.frequence) {
            case 'Toujours':
                return { frequency: 'Always' };
            case 'Unique':
            default:
                return { frequency: 'Once' };
        }
    }
}

const container: DependencyContainerAdapter<DependencyContainer> = new TSyringeDepenencyContainerAdapter(TSyringeContainer);

export default container;