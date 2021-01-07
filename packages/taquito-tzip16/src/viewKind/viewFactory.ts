import { RpcClient } from '@taquito/rpc';
import { ContractAbstraction, ContractProvider, Wallet } from '@taquito/taquito';
import { MichelsonStorageView } from './michelson-storage-view';

export class ViewFactory {
    getView(
        viewName: string,
        rpc: RpcClient,
        contract: ContractAbstraction<ContractProvider | Wallet>,
        viewImplementation: object
    ) {
        if (Object.keys(viewImplementation)[0] === 'michelsonStorageView') {
            const viewValues = Object.values(viewImplementation)[0];
            if (!viewValues.returnType || !viewValues.code) {
                return;
            }
            let ignoreView = false;
            const michelsonStorageView = function () {
                const view = new MichelsonStorageView(
                    viewName,
                    contract,
                    rpc,
                    viewValues.returnType,
                    viewValues.code,
                    viewValues.parameter
                );
                // If there is illegal instruction in the code of the view, the view is ignored
                if (!view.isValidViewCodeInstructions()) {
                    ignoreView = true;
                }
                return view;
            };
            if (!ignoreView) {
                return michelsonStorageView;
            }
        }
        /*         else if (Object.keys(viewImplementation)[0] === 'restApiQuery') {
            // TODO      
        } */
    }
}
