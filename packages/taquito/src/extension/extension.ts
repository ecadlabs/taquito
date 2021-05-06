import { Context } from "../context"

export interface Extension {

    configureContext(context: Context): void;

}