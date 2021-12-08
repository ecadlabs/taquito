import { DefaultGlobalConstantsProvider } from '../../src/global-constants/default-global-constants-provider';

describe('DefaultGlobalConstantsProvider tests', () => {
    const michelineExpr = {
        "prim": "pair",
        "args":
            [{
                "prim": "address",
                "annots": ["%addr"]
            },
            {
                "prim": "option",
                "args": [{ "prim": "key_hash" }],
                "annots": ["%key"]
            }],
        "annots": ["%mgr2"]
    };
    it('DefaultGlobalConstantsProvider is instantiable', () => {
        expect(new DefaultGlobalConstantsProvider()).toBeInstanceOf(DefaultGlobalConstantsProvider);
    });

    it('register a global constant and retrieve the value by its hash', async (done) => {
        const hash = 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb';
        const defaultGlobalConstantsProvider = new DefaultGlobalConstantsProvider();

        defaultGlobalConstantsProvider.loadGlobalConstant({
            [hash]: michelineExpr
        });

        expect(michelineExpr).toEqual(await defaultGlobalConstantsProvider.getGlobalConstantByHash(hash));
        done()
    });

    it('register two global constants at the same time and retrieve their value by their hash', async (done) => {
        const hash = 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb';
        const hash2 = "expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre";
        const michelineExpr2 = { prim: "int" };

        const defaultGlobalConstantsProvider = new DefaultGlobalConstantsProvider();

        defaultGlobalConstantsProvider.loadGlobalConstant({
            [hash]: michelineExpr,
            [hash2]: michelineExpr2
        });

        expect(michelineExpr).toEqual(await defaultGlobalConstantsProvider.getGlobalConstantByHash(hash));
        expect(michelineExpr2).toEqual(await defaultGlobalConstantsProvider.getGlobalConstantByHash(hash2));
        done()
    });

    it('register two global constants not at the same time and retrieve their value by their hash', async (done) => {
        const defaultGlobalConstantsProvider = new DefaultGlobalConstantsProvider();
        const hash = 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb';

        defaultGlobalConstantsProvider.loadGlobalConstant({
            [hash]: michelineExpr
        });

        const hash2 = "expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre";
        const michelineExpr2 = { prim: "int" };

        defaultGlobalConstantsProvider.loadGlobalConstant({
            [hash2]: michelineExpr2
        });

        expect(michelineExpr).toEqual(await defaultGlobalConstantsProvider.getGlobalConstantByHash(hash));
        expect(michelineExpr2).toEqual(await defaultGlobalConstantsProvider.getGlobalConstantByHash(hash2));
        done()
    });

    it('throws an error when querying a global constant that is not registered', async (done) => {
        const defaultGlobalConstantsProvider = new DefaultGlobalConstantsProvider();
        const hash = 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb';

        try {
            await defaultGlobalConstantsProvider.getGlobalConstantByHash(hash)
        } catch(err: any) {
            expect(err.message).toEqual("Please load the value associated with the constant expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb using the loadGlobalConstant method of the DefaultGlobalConstantsProvider.")
        }
        done()
    });

});
