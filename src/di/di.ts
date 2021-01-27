import { inject, injectable } from "tsyringe";

/**
 * Re-exportation des décorateurs pour se découpler du framework d'injection de dépendances et
 * pour suivre le standard de la première lettre en capitale.
 */
export { inject as Inject, injectable as Injectable };
