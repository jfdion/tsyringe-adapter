# tsyringe-adapter
Preuve de concept pour l'utilisation de TSyringe

## Preuve de concept
### Exécution de l'exemple
Préalable, avoir `typescript` et `ts-node` d'installé dans votre environnement de développement (`npm i -g typescript ts-node`)

#### Exécution de l'exemple:
```
ts-node src/main.ts
```

#### Résultat:
```
<h1>Ma formation à partir de ma composante</h1>
```

### Exécution des tests
Préalable, avoir `jest` d'installé dans votre environnement de développement (`npm i -g jest`)

#### Exécution de tous les tests
```
jest
```

#### Exécution d'un seul test
```
jest nom-du-test
```

## Adaptateur
L'adaptateur expose une API simplifiée du conteneur de dépendance de TSyringe. Il permet remplacer simplement l'implémentation pour pour un autre IoC container.
