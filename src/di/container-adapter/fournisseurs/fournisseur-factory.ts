import DependencyContainerAdapter from "./../dependency-container-adapter";
import Fournisseur from "./fournisseur";
/**
 * Fourni une dépendance en utlisant une factory
 * Contrairement aux autres fournisseurs, les instances ne sont pas mises en cache
 * Si nécessaire, la factory doit l'implémenter
 */
export default interface FournisseurFactory<T> {
    utiliserFactory: (dependencyContainer: DependencyContainerAdapter<any>) => T;
}

export function isFournisseurFactory<T>(fournisseur: Fournisseur<T>): fournisseur is FournisseurFactory<any> {
    return !!fournisseur['utiliserFactory'];
}