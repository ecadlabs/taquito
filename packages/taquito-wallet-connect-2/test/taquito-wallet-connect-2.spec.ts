import { ConnectionFailed, NetworkType, PermissionScopeMethods, WalletConnect2 } from '../src/taquito-wallet-connect-2';
import { sessionExample } from './data';

describe('Wallet connect 2 tests', () => {
    let mockSignClient: {
        on: jest.Mock<any, any>;
        connect: jest.Mock<any, any>;
    };

    beforeEach(() => {
        mockSignClient = {
            on: jest.fn(),
            connect: jest.fn()
        }
        mockSignClient.connect.mockReturnValue({ approval: async () => sessionExample })
    })

    it('verify that WalletConnect2 is instantiable', async () => {
        expect(new WalletConnect2(mockSignClient as any)).toBeInstanceOf(WalletConnect2);
    });

    it('should establish a connection successfully', async () => {
        const walletConnect = new WalletConnect2(mockSignClient as any);
        await walletConnect.requestPermissions({
            permissionScope: {
                methods: [PermissionScopeMethods.OPERATION_REQUEST],
                networks: [NetworkType.GHOSTNET]
            }
        })

        expect(mockSignClient.connect).toHaveBeenCalledWith({
            requiredNamespaces: {
                tezos: {
                    chains: ["tezos:ghostnet"],
                    methods: ["tezos_sendOperations"],
                    events: [],
                },
            },
        })

    });

    it('should fail to establish a connection if the received namespace is missing a requested method', async () => {
        const walletConnect = new WalletConnect2(mockSignClient as any);
        await expect(walletConnect.requestPermissions({
            permissionScope: {
                methods: [PermissionScopeMethods.OPERATION_REQUEST, PermissionScopeMethods.SIGN],
                networks: [NetworkType.GHOSTNET]
            }
        })).rejects.toThrowError(ConnectionFailed)

    });

    it('should fail to establish a connection if the received namespace is missing a requested method', async () => {
        const walletConnect = new WalletConnect2(mockSignClient as any);

        mockSignClient.connect.mockReturnValue({
            approval: async () => {
                return {
                    ...sessionExample,
                    namespaces: {
                        tezos: {
                            accounts: [],
                            methods: ['tezos_sendOperations'],
                            events: [],
                        },
                    }
                }
            }
        })

        await expect(walletConnect.requestPermissions({
            permissionScope: {
                methods: [PermissionScopeMethods.OPERATION_REQUEST],
                networks: [NetworkType.GHOSTNET]
            }
        })).rejects.toThrowError(ConnectionFailed)

    });

});
