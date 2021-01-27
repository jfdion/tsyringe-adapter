import { delay } from "tsyringe";
import { constructeur } from "./types/constructeur";

export class ConstructeurRetarde<T>{ }

export function delai<T>(wrappedConstructor: () => constructeur<T>): ConstructeurRetarde<T> {
    return delay<T>(wrappedConstructor);
}