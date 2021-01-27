export enum CycleDeVie {
    // Crée une nouvelle instance à chaque appel - valeur par défaut
    Transient = 0,
    // Retourne la même instance à chaque appel
    Singleton = 1,
    // Retourne la même instance pour la séquence de résolution courante
    PorteeResolution = 2,
    // Retourne la même instance à chaque appel. Les conteneurs enfant auront leur propre instance
    PorteeConteneur = 3
}