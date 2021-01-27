import FormationComponent from './formation/component/formation-component';

function component() {
    const formationComponent: FormationComponent = new FormationComponent();
    formationComponent.creerFormation();

    return formationComponent.render();
}
console.log(component());



/*



const userService = new userService()
const formationService = new formationService(userService)

// const formationComponent = new FormationComponent(formationService)

this.$service.formationService

const classeD = new D()
const classeB = new B(classeD)

const classeE = new E()
const classeC = new C(classeB, classeE)

const classeA = new A(classeB, classeC)


class A {
    constructor(B, C)
}

class B {
    constructor(D)
}

class C {
    constructor(B, E)
}

class D {
    constructor()
}

class E {
    constructor()
}
*/