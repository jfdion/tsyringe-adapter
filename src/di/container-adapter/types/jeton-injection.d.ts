import { ConstructeurRetarde } from "../constructeur-retarde";
import { constructeur } from "./constructeur";

declare type JetonInjection<T = any> = constructeur<T> | string | symbol | ConstructeurRetarde<T>;

export default JetonInjection;