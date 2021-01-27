
import Formation from "../formation";
import FormationService, { FORMATION_SERVICE_ID } from "../formation-service";
import container from "./../../di/container";

export default class FormationComponent {

    private formationService: FormationService = container.resoudre<FormationService>(FORMATION_SERVICE_ID);
    private formation: Formation | undefined

    creerFormation(): void {
        try {
            this.formation = this.formationService.create('Ma formation à partir de ma composante');
        } catch (e) {
            this.formation = undefined;
        }
    }

    render(): string {
        return !!this.formation ? `<h1>${this.formation.titre}</h1>` : '';
    }
}
