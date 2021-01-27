import JetonInjection from "./jeton-injection";

export declare type TypeResolution = "Single" | "All";
export interface PreResolutionIntercepteurCallback<T = any> {
    /**
     * @param token The InjectionToken that was intercepted
     * @param resolutionType The type of resolve that was called (i.e. All or Single)
     */
    (token: JetonInjection<T>, resolutionType: TypeResolution): void;
}
export interface PostResolutionIntercepteurCallback<T = any> {
    /**
     * @param token The InjectionToken that was intercepted
     * @param result The object that was resolved from the container
     * @param typeResolution The type of resolve that was called (i.e. All or Single)
     */
    (token: JetonInjection<T>, result: T | T[], typeResolution: TypeResolution): void;
}

declare type Frequence = "Toujours" | "Unique";
declare type IntercepteurOptions = {
    frequence: Frequence;
};