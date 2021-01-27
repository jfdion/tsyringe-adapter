import { CycleDeVie } from "./../cycle-de-vie";

declare type OptionsEnregistrement = {
    /**
     * Configure le cycle de vie d'un service enregistré
     * See https://github.com/microsoft/tsyringe#available-scopes for more information
     */
    cycleDeVie: CycleDeVie;
};
export default OptionsEnregistrement;
