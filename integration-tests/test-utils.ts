import stringify from "json-stringify-safe";
import { it as jestIt, describe as jestDescribe } from "@jest/globals";
import { Global } from "@jest/types";
import { fail } from "assert";

interface DoneCallback {
    (...args: any[]): any;
    fail(error?: string | { message: string }): any;
}

type ProvidesCallback = ((cb: DoneCallback) => void | undefined) | (() => PromiseLike<unknown>);
type EmptyFunction = () => void;
interface FunctionLike {
    readonly name: string;
}

export function _it(name: string, fn: Global.TestFn, timeout?: number): void {
    jestIt(name, wrapTestFn(fn), timeout);
};

export const _describe = (name: Global.BlockNameLike, fn: EmptyFunction): void => {
    jestDescribe(name, wrapEmptyFunction(fn));
};

const wrapEmptyFunction: (testFunction: EmptyFunction) => EmptyFunction = (testFunction) => {
    return () => {
        try {
            testFunction();
        } catch (e: unknown) {
            fail(stringify(e));
        }
    }
}

function wrapTestFn(testFunction: Global.TestFn): Global.TestFn {
    if (testFunction.length === 0 ) {
        return async function(this: Global.TestContext) {
            try {
                const result = await (testFunction as Global.PromiseReturningTestFn).bind(this)();
                if (result instanceof Promise) {
                    return await result;
                } else {
                    return result;
                }
            } catch (e: unknown) {
                fail(stringify(e));
            }
        }
    } else {
        return function (this: Global.TestContext, done: Global.DoneFn) {
            try {
                return (testFunction as Global.DoneTakingTestFn).bind(this)(done);
            } catch (e: unknown) {
                fail(stringify(e));
            }
        }
    }
}

const wrapProvidesCallback: (testFunction?: ProvidesCallback) => ProvidesCallback | undefined = (testFunction) => {
    if (!testFunction) {
        return undefined;
    }
    if (testFunction.length === 0) {
        return async () => {
            try {
                await (testFunction as (() => PromiseLike<unknown>))();
            } catch (e: unknown) {
                fail(stringify(e));
            }
        }
    } else {
        return (cb: DoneCallback) => {
            try {
                (testFunction as ((cb: DoneCallback) => void | undefined))(cb);
            } catch (e: unknown) {
                fail(stringify(e));
            }
        }
    }
}
