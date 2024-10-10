import { OpKind } from '@taquito/taquito';
import {
  NetworkType,
  PermissionScopeEvents,
  PermissionScopeMethods,
  SigningType,
  TransferParams,
  WalletConnect2,
} from '../src/taquito-wallet-connect-2';
import { existingPairings, fakeCode, sessionExample, sessionMultipleChains } from './data';

describe('Wallet connect 2 tests', () => {
  let sessionDeletedEvent: (eventParams: { topic: string }) => void;
  let sessionExpiredEvent: (eventParams: { topic: string }) => void;
  let sessionUpdatedEvent: (eventParams: { topic: string; params: any }) => void;
  let walletConnect: WalletConnect2;
  let mockSignClient: {
    on: any;
    connect: jest.Mock<any, any>;
    pairing: {
      getAll: jest.Mock<any, any>;
    };
    session: {
      keys: string[];
      get: jest.Mock<any, any>;
    };
    disconnect: jest.Mock<any, any>;
    peer: {
      metadata: any;
    };
    request: jest.Mock<any, any>;
  };

  beforeEach(() => {
    mockSignClient = {
      on: (eventName: string, eventFct: any) => {
        if (eventName === 'session_delete') {
          sessionDeletedEvent = eventFct;
        } else if (eventName == 'session_expire') {
          sessionExpiredEvent = eventFct;
        } else if (eventName == 'session_update') {
          sessionUpdatedEvent = eventFct;
        }
      },
      connect: jest.fn(),
      pairing: {
        getAll: jest.fn(),
      },
      session: {
        keys: [sessionExample.topic, sessionMultipleChains.topic],
        get: jest.fn(),
      },
      disconnect: jest.fn(),
      peer: {
        metadata: sessionExample.peer.metadata,
      },
      request: jest.fn(),
    };
    mockSignClient.connect.mockReturnValue({ approval: async () => sessionExample });
    walletConnect = new WalletConnect2(mockSignClient as any);
  });

  it('verify that WalletConnect2 is instantiable', async () => {
    expect(new WalletConnect2(mockSignClient as any)).toBeInstanceOf(WalletConnect2);
  });

  it('should establish a connection successfully', async () => {
    await walletConnect.requestPermissions({
      permissionScope: {
        methods: [PermissionScopeMethods.TEZOS_SEND],
        networks: [NetworkType.GHOSTNET],
      },
    });

    expect(mockSignClient.connect).toHaveBeenCalledWith({
      requiredNamespaces: {
        tezos: {
          chains: ['tezos:ghostnet'],
          methods: ['tezos_send'],
          events: [],
        },
      },
    });
  });

  it('should throw an error if connection fails', async () => {
    mockSignClient.connect.mockRejectedValue(new Error());
    await expect(
      walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      })
    ).rejects.toThrow('Unable to connect');
  });

  it('should throw an error if tezos is not part of the requiredNamespace', async () => {
    mockSignClient.connect.mockReturnValue({
      approval: async () => {
        return {
          ...sessionExample,
          requiredNamespaces: {
            unknown: {
              methods: [PermissionScopeMethods.TEZOS_SEND],
              chains: ['tezos:ghostnet'],
              events: [],
            },
          },
        };
      },
    });

    await expect(
      walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      })
    ).rejects.toThrow('Tezos not found in requiredNamespaces');
  });

  describe('test pairing', () => {
    beforeEach(async () => {
      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });
    });

    it('should access all existing active pairings with getAvailablePairing', async () => {
      mockSignClient.pairing.getAll.mockReturnValue(existingPairings);
      expect(walletConnect.getAvailablePairing()).toEqual(existingPairings);
    });

    it('should access peer metadata with getPeerMetadata', async () => {
      expect(walletConnect.getPeerMetadata()).toEqual(sessionExample.peer.metadata);
    });
  });

  describe('test session', () => {
    beforeEach(async () => {
      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });
    });

    it('should access all existing session keys with getAllExistingSessionKeys', async () => {
      const sessionKeys = walletConnect.getAllExistingSessionKeys();
      expect(sessionKeys).toEqual([sessionExample.topic, sessionMultipleChains.topic]);
    });

    it('should use an existing session with configureWithExistingSessionKey', async () => {
      expect(walletConnect.getSession().topic).toEqual(sessionExample.topic);

      mockSignClient.session.get.mockReturnValue(sessionMultipleChains);
      walletConnect.configureWithExistingSessionKey(sessionMultipleChains.topic);

      expect(mockSignClient.session.get).toHaveBeenCalledWith(sessionMultipleChains.topic);
      expect(walletConnect.getSession().topic).toEqual(sessionMultipleChains.topic);
    });

    it('should throw an error if the session key does not exist', async () => {
      expect(() => walletConnect.configureWithExistingSessionKey('test')).toThrow(
        'Invalid session key "test"'
      );
    });

    it('should delete session when calling disconnect', async () => {
      expect(walletConnect.isActiveSession()).toBeTruthy();
      await walletConnect.disconnect();
      expect(mockSignClient.disconnect).toHaveBeenCalledTimes(1);
      expect(walletConnect.isActiveSession()).toBeFalsy();
    });
  });

  describe('test active network', () => {
    beforeEach(async () => {
      mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SIGN],
          networks: [NetworkType.GHOSTNET, NetworkType.PARISNET],
        },
      });
    });

    it('should access permitted networks', async () => {
      expect(walletConnect.getNetworks()).toEqual([NetworkType.GHOSTNET, NetworkType.PARISNET]);
    });

    it('should set the active network successfully', async () => {
      walletConnect.setActiveNetwork(NetworkType.PARISNET);
      expect(walletConnect.getActiveNetwork()).toEqual(NetworkType.PARISNET);
    });

    it('should fail to set the active network when it is not part of the session namespace', async () => {
      expect(() => walletConnect.setActiveNetwork(NetworkType.OXFORDNET)).toThrow(
        'Invalid network "oxfordnet"'
      );
    });

    it('should throw an error when no active network is set and session namespace has multiple networks', async () => {
      expect(() => walletConnect.getActiveNetwork()).toThrow(
        'Please specify the active network using the "setActiveNetwork" method.'
      );
    });

    it('should delete active network when calling disconnect', async () => {
      walletConnect.setActiveNetwork(NetworkType.GHOSTNET);
      expect(walletConnect.getActiveNetwork()).toEqual(NetworkType.GHOSTNET);

      await walletConnect.disconnect();
      expect(mockSignClient.disconnect).toHaveBeenCalledTimes(1);

      expect(() => walletConnect.getActiveNetwork()).toThrow('Not connected, no active session');
    });
  });

  describe('test active account', () => {
    it('should return active account when session namespace only have one', async () => {
      mockSignClient.connect.mockReturnValue({ approval: async () => sessionExample });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });

      expect(await walletConnect.getPKH()).toEqual('tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh');
    });

    it('should throw an error when no active account is set and session namespace has multiple accounts', async () => {
      mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SIGN],
          networks: [NetworkType.GHOSTNET, NetworkType.PARISNET],
        },
      });

      await expect(walletConnect.getPKH()).rejects.toThrow(
        'Please specify the active account using the "setActiveAccount" method.'
      );
    });

    it('should set the active account successfully', async () => {
      mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SIGN],
          networks: [NetworkType.GHOSTNET, NetworkType.PARISNET],
        },
      });

      walletConnect.setActiveAccount('tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh');
      expect(await walletConnect.getPKH()).toEqual('tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh');
    });

    it('should fail to set the active account when it is not part of the session namespace', async () => {
      mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SIGN],
          networks: [NetworkType.GHOSTNET, NetworkType.PARISNET],
        },
      });

      expect(() => walletConnect.setActiveAccount('test')).toThrow('Invalid pkh "test"');
    });

    it('should delete active account when calling disconnect', async () => {
      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });

      expect(await walletConnect.getPKH()).toEqual('tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh');
      await walletConnect.disconnect();
      expect(mockSignClient.disconnect).toHaveBeenCalledTimes(1);
      await expect(walletConnect.getPKH()).rejects.toThrow('Not connected, no active session');
    });
  });

  describe('test public key', () => {
    it('should return public key when session namespace only have one', async () => {
      mockSignClient.connect.mockReturnValue({ approval: async () => sessionExample });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });

      expect(await walletConnect.getPK()).toEqual(
        '01b5630403234ba9745073c9ad081c7b812786b2bcfa8cfe1ff28d800b989f29'
      );
    });

    it('should throw an error when no active account is set and session namespace has multiple accounts', async () => {
      mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SIGN],
          networks: [NetworkType.GHOSTNET, NetworkType.PARISNET],
        },
      });

      await expect(walletConnect.getPK()).rejects.toThrow(
        'Please specify the active account using the "setActiveAccount" method.'
      );
    });

    it('should set the active account successfully', async () => {
      mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SIGN],
          networks: [NetworkType.GHOSTNET, NetworkType.PARISNET],
        },
      });

      walletConnect.setActiveAccount('tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh');
      expect(await walletConnect.getPK()).toEqual(
        '72dfcd018c5a636c311a0214c19f24e1e52a0f38082e31e3971af9b0296f4767'
      );
    });

    it('should fail to set the active account when it is not part of the session namespace', async () => {
      mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SIGN],
          networks: [NetworkType.GHOSTNET, NetworkType.PARISNET],
        },
      });

      expect(() => walletConnect.setActiveAccount('test')).toThrow('Invalid pkh "test"');
    });

    it('should delete active account when calling disconnect', async () => {
      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });

      expect(await walletConnect.getPK()).toEqual(
        '01b5630403234ba9745073c9ad081c7b812786b2bcfa8cfe1ff28d800b989f29'
      );
      await walletConnect.disconnect();
      expect(mockSignClient.disconnect).toHaveBeenCalledTimes(1);
      await expect(walletConnect.getPK()).rejects.toThrow('Not connected, no active session');
    });
  });

  describe('test validation of incoming proposal namespaces', () => {
    it('should fail to establish a connection if the proposal namespace does not have any accounts', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#21-session-namespaces-must-not-have-accounts-empty

      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: [],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.TEZOS_SEND],
            networks: [NetworkType.GHOSTNET],
          },
        })
      ).rejects.toThrow('5001: Accounts must not be empty.');
    });

    it('should fail to establish a connection if the proposal namespace addresses are not CAIP-10 compliant', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#22-session-namespaces-addresses-must-be-caip-10-compliant

      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.TEZOS_SEND],
            networks: [NetworkType.GHOSTNET],
          },
        })
      ).rejects.toThrow(
        '5001: Accounts must be CAIP-10 compliant. "tezos:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh" is invalid.'
      );
    });

    it('should fail to establish a connection if the received namespace is missing a requested method', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#23-session-namespaces-must-approve-all-methods

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.TEZOS_SEND, PermissionScopeMethods.TEZOS_SIGN],
            networks: [NetworkType.GHOSTNET],
          },
        })
      ).rejects.toThrow(
        '5002: All methods must be approved. "tezos_sign" is missing in the session namespace.'
      );
    });

    it('should fail to establish a connection if the received namespace is missing multiple requested methods', async () => {
      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.TEZOS_SEND, PermissionScopeMethods.TEZOS_SIGN],
            networks: [NetworkType.GHOSTNET],
          },
        })
      ).rejects.toThrow(
        '5002: All methods must be approved. "tezos_send,tezos_sign" is missing in the session namespace.'
      );
    });

    it('should fail to establish a connection if the received namespace is missing account in a requested chain', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#24-session-namespaces-must-contain-at-least-one-account-in-requested-chains

      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.TEZOS_SEND],
            networks: [NetworkType.GHOSTNET, NetworkType.PARISNET],
          },
        })
      ).rejects.toThrow(
        '5001: All chains must have at least one account. "parisnet" is missing in the session namespace.'
      );
    });

    it('should fail to establish a connection if the received namespace is missing account in requested chains', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#24-session-namespaces-must-contain-at-least-one-account-in-requested-chains

      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.TEZOS_SEND],
            networks: [NetworkType.GHOSTNET, NetworkType.PARISNET, NetworkType.OXFORDNET],
          },
        })
      ).rejects.toThrow(
        '5001: All chains must have at least one account. "parisnet,oxfordnet" is missing in the session namespace.'
      );
    });

    it('should establish a connection successfully if the received namespace contains multiple accounts for one chain', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#25-session-namespaces-may-contain-multiple-accounts-for-one-chain

      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: [
                  'tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
                  'tezos:ghostnet:tz2BxqkU3UvZrqA22vbEaSGyjR9bEQwc4k2G',
                ],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [],
              },
            },
          };
        },
      });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });

      expect(mockSignClient.connect).toHaveBeenCalledWith({
        requiredNamespaces: {
          tezos: {
            chains: ['tezos:ghostnet'],
            methods: ['tezos_send'],
            events: [],
          },
        },
      });
    });

    it('should establish a connection successfully even if the received namespace extend methods and events', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#26-session-namespaces-may-extend-methods-and-events-of-proposal-namespaces

      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [PermissionScopeMethods.TEZOS_SEND, PermissionScopeMethods.TEZOS_SIGN],
                events: [PermissionScopeEvents.ACCOUNTS_CHANGED],
              },
            },
          };
        },
      });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });

      expect(mockSignClient.connect).toHaveBeenCalledWith({
        requiredNamespaces: {
          tezos: {
            chains: ['tezos:ghostnet'],
            methods: ['tezos_send'],
            events: [],
          },
        },
      });
    });

    it('should fail to establish a connection if an account in the received namespace do not contain the namespace prefix', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#27-all-accounts-in-the-namespace-must-contain-the-namespace-prefix

      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: [
                  'tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
                  'unknown:ghostnet:tz2BxqkU3UvZrqA22vbEaSGyjR9bEQwc4k2G',
                ],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.TEZOS_SEND],
            networks: [NetworkType.GHOSTNET],
          },
        })
      ).rejects.toThrow(
        '5103: Accounts must be defined in matching namespace. "unknown:ghostnet:tz2BxqkU3UvZrqA22vbEaSGyjR9bEQwc4k2G" is invalid.'
      );
    });

    it('should establish a connection successfully even if the received namespace contain an account from a chain not defined in Proposal Namespaces', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#28-session-namespaces-may-contain-accounts-from-chains-not-defined-in-proposal-namespaces

      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: [
                  'tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
                  'tezos:limanet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
                ],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [PermissionScopeEvents.ACCOUNTS_CHANGED],
              },
            },
          };
        },
      });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });

      expect(mockSignClient.connect).toHaveBeenCalledWith({
        requiredNamespaces: {
          tezos: {
            chains: ['tezos:ghostnet'],
            methods: ['tezos_send'],
            events: [],
          },
        },
      });
    });

    it('should fail to establish a connection if received namespace does not contain tezos', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#29-session-namespaces-must-have-at-least-the-same-namespaces-as-the-proposal-namespaces

      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              unknown: {
                accounts: ['unknown:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.TEZOS_SEND],
            networks: [NetworkType.GHOSTNET],
          },
        })
      ).rejects.toThrow(
        '5000: All namespaces must be approved. "tezos" is missing in the session namespace.'
      );
    });

    it('should fail to establish a connection if received namespace is mising requested events', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#211-session-namespaces-must-approve-all-events

      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.TEZOS_SEND],
            networks: [NetworkType.GHOSTNET],
            events: [PermissionScopeEvents.ACCOUNTS_CHANGED],
          },
        })
      ).rejects.toThrow(
        '5003: All events must be approved. "accountsChanged" is missing in the session namespace.'
      );
    });
  });

  describe('test sendOperations', () => {
    it('should send transaction operation successfully', async () => {
      const mockRequestResponse = {
        transactionHash: 'onoNdgS5qcpuxyQVUEerSGCZQdyA3aGbC3nKoQmHJGic5AH9kQf',
      };
      mockSignClient.request.mockResolvedValue(mockRequestResponse);
      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });

      const params: TransferParams[] = [
        {
          kind: OpKind.TRANSACTION,
          amount: '100000',
          destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
        },
      ];

      const opHash = await walletConnect.sendOperations(params);

      expect(mockSignClient.request).toHaveBeenCalledWith({
        topic: sessionExample.topic,
        chainId: `tezos:ghostnet`,
        request: {
          method: PermissionScopeMethods.TEZOS_SEND,
          params: {
            account: 'tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
            operations: params,
          },
        },
      });

      expect(opHash).toEqual(mockRequestResponse.transactionHash);
    });

    it('should send transaction operation with defined limits successfully', async () => {
      const mockRequestResponse = {
        transactionHash: 'onoNdgS5qcpuxyQVUEerSGCZQdyA3aGbC3nKoQmHJGic5AH9kQf',
      };
      mockSignClient.request.mockResolvedValue(mockRequestResponse);
      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });

      const params: TransferParams[] = [
        {
          kind: OpKind.TRANSACTION,
          fee: '400',
          gas_limit: '4000',
          storage_limit: '400',
          amount: '0',
          destination: 'KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5',
          parameters: {
            entrypoint: 'simple_param',
            value: {
              int: '5',
            },
          },
        },
      ];

      const opHash = await walletConnect.sendOperations(params);

      expect(mockSignClient.request).toHaveBeenCalledWith({
        topic: sessionExample.topic,
        chainId: `tezos:ghostnet`,
        request: {
          method: PermissionScopeMethods.TEZOS_SEND,
          params: {
            account: 'tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
            operations: params,
          },
        },
      });

      expect(opHash).toEqual(mockRequestResponse.transactionHash);
    });

    it('should fail to send transaction operation if permission is not granted', async () => {
      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [PermissionScopeMethods.TEZOS_SIGN],
                events: [],
              },
            },
            requiredNamespaces: {
              tezos: {
                methods: [PermissionScopeMethods.TEZOS_SIGN],
                chains: ['tezos:ghostnet'],
                events: [],
              },
            },
          };
        },
      });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SIGN],
          networks: [NetworkType.GHOSTNET],
        },
      });

      const params: TransferParams[] = [
        {
          kind: OpKind.TRANSACTION,
          amount: '100000',
          destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
        },
      ];

      await expect(walletConnect.sendOperations(params)).rejects.toThrow(
        'Required permission scope were not granted for "tezos_send"'
      );
    });

    it('should fail to send operation if mismatch between account-network', async () => {
      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: [
                  'tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
                  'tezos:parisnet:tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                ],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [],
              },
            },
            requiredNamespaces: {
              tezos: {
                methods: [PermissionScopeMethods.TEZOS_SEND],
                chains: ['tezos:ghostnet', 'tezos:parisnet'],
                events: [],
              },
            },
          };
        },
      });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET, NetworkType.PARISNET],
        },
      });

      walletConnect.setActiveAccount('tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh');
      walletConnect.setActiveNetwork(NetworkType.PARISNET);

      const params: TransferParams[] = [
        {
          kind: OpKind.TRANSACTION,
          amount: '100000',
          destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
        },
      ];

      await expect(walletConnect.sendOperations(params)).rejects.toThrow(
        'No permission. The combinaison "parisnet" and "tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh" is not part of the active session.'
      );
    });
  });

  describe('test sign payload', () => {
    it('should sign payload successfully', async () => {
      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [PermissionScopeMethods.TEZOS_SIGN],
                events: [],
              },
            },
            requiredNamespaces: {
              tezos: {
                methods: [PermissionScopeMethods.TEZOS_SIGN],
                chains: ['tezos:ghostnet'],
                events: [],
              },
            },
          };
        },
      });

      const mockedSignature =
        'edsigtpDN7L5LfzvYWM22fvYA4dPVr9wXaYje7z4nmBrT6ZxkGnHS6u3UuvD9TQv3BmNRSUgnMH1dKsAaLWhfuXXj63myo2m3De';
      mockSignClient.request.mockResolvedValue(mockedSignature);
      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SIGN],
          networks: [NetworkType.GHOSTNET],
        },
      });

      const params = {
        signingType: SigningType.MICHELINE,
        payload:
          '05010031363454657a6f73205369676e6564204d6573736167653a207461717569746f2d746573742d646170702e6e65746c6966792e6170702f20323032322d31322d31335432333a30353a30372e3938375a2074657374',
        sourceAddress: 'tz1hWt34L3dnwrpBeG9RWJPQVTgTTAmH1b1p',
      };

      const sig = await walletConnect.signPayload(params);

      expect(mockSignClient.request).toHaveBeenCalledWith({
        topic: sessionExample.topic,
        chainId: `tezos:ghostnet`,
        request: {
          method: PermissionScopeMethods.TEZOS_SIGN,
          params: {
            account: 'tz1hWt34L3dnwrpBeG9RWJPQVTgTTAmH1b1p',
            expression: params.payload,
            signingType: params.signingType,
          },
        },
      });

      expect(sig).toEqual(mockedSignature);
    });

    it('should sign payload successfully when params.sourceAddress is undefined', async () => {
      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:ghostnet:tz1hWt34L3dnwrpBeG9RWJPQVTgTTAmH1b1p'],
                methods: [PermissionScopeMethods.TEZOS_SIGN],
                events: [],
              },
            },
            requiredNamespaces: {
              tezos: {
                methods: [PermissionScopeMethods.TEZOS_SIGN],
                chains: ['tezos:ghostnet'],
                events: [],
              },
            },
          };
        },
      });

      const mockedSignature =
        'edsigtpDN7L5LfzvYWM22fvYA4dPVr9wXaYje7z4nmBrT6ZxkGnHS6u3UuvD9TQv3BmNRSUgnMH1dKsAaLWhfuXXj63myo2m3De';
      mockSignClient.request.mockResolvedValue(mockedSignature);
      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SIGN],
          networks: [NetworkType.GHOSTNET],
        },
      });

      const params = {
        signingType: SigningType.MICHELINE,
        payload:
          '05010031363454657a6f73205369676e6564204d6573736167653a207461717569746f2d746573742d646170702e6e65746c6966792e6170702f20323032322d31322d31335432333a30353a30372e3938375a2074657374',
      };

      const sig = await walletConnect.signPayload(params);

      expect(mockSignClient.request).toHaveBeenCalledWith({
        topic: sessionExample.topic,
        chainId: `tezos:ghostnet`,
        request: {
          method: PermissionScopeMethods.TEZOS_SIGN,
          params: {
            account: 'tz1hWt34L3dnwrpBeG9RWJPQVTgTTAmH1b1p',
            expression: params.payload,
            signingType: params.signingType,
          },
        },
      });

      expect(sig).toEqual(mockedSignature);
    });

    it('should fail to sign payload if permission is not granted', async () => {
      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [],
              },
            },
            requiredNamespaces: {
              tezos: {
                methods: [PermissionScopeMethods.TEZOS_SEND],
                chains: ['tezos:ghostnet'],
                events: [],
              },
            },
          };
        },
      });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });

      const params = {
        signingType: SigningType.MICHELINE,
        payload:
          '05010031363454657a6f73205369676e6564204d6573736167653a207461717569746f2d746573742d646170702e6e65746c6966792e6170702f20323032322d31322d31335432333a30353a30372e3938375a2074657374',
      };

      await expect(walletConnect.signPayload(params)).rejects.toThrow(
        'Required permission scope were not granted for "tezos_sign"'
      );
    });
  });

  describe('test sign', () => {
    it('should sign successfully', async () => {
      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [PermissionScopeMethods.TEZOS_SIGN],
                events: [],
              },
            },
            requiredNamespaces: {
              tezos: {
                methods: [PermissionScopeMethods.TEZOS_SIGN],
                chains: ['tezos:ghostnet'],
                events: [],
              },
            },
          };
        },
      });

      const mockedSignature =
        'edsigtpDN7L5LfzvYWM22fvYA4dPVr9wXaYje7z4nmBrT6ZxkGnHS6u3UuvD9TQv3BmNRSUgnMH1dKsAaLWhfuXXj63myo2m3De';
      mockSignClient.request.mockResolvedValue(mockedSignature);
      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SIGN],
          networks: [NetworkType.GHOSTNET],
        },
      });

      const sig = await walletConnect.sign(
        '010031363454657a6f73205369676e6564204d6573736167653a207461717569746f2d746573742d646170702e6e65746c6966792e6170702f20323032322d31322d31335432333a30353a30372e3938375a2074657374',
        new Uint8Array([5])
      );

      expect(mockSignClient.request).toHaveBeenCalledWith({
        topic: sessionExample.topic,
        chainId: `tezos:ghostnet`,
        request: {
          method: PermissionScopeMethods.TEZOS_SIGN,
          params: {
            expression:
              '05010031363454657a6f73205369676e6564204d6573736167653a207461717569746f2d746573742d646170702e6e65746c6966792e6170702f20323032322d31322d31335432333a30353a30372e3938375a2074657374',
            signingType: SigningType.RAW,
          },
        },
      });

      expect(sig).toEqual(mockedSignature);
    });

    it('should fail to sign payload if permission is not granted', async () => {
      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: ['tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'],
                methods: [PermissionScopeMethods.TEZOS_SEND],
                events: [],
              },
            },
            requiredNamespaces: {
              tezos: {
                methods: [PermissionScopeMethods.TEZOS_SEND],
                chains: ['tezos:ghostnet'],
                events: [],
              },
            },
          };
        },
      });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });

      await expect(
        walletConnect.sign(
          '010031363454657a6f73205369676e6564204d6573736167653a207461717569746f2d746573742d646170702e6e65746c6966792e6170702f20323032322d31322d31335432333a30353a30372e3938375a2074657374',
          new Uint8Array([5])
        )
      ).rejects.toThrow('Required permission scope were not granted for "tezos_sign"');
    });
  });

  describe('test map params to wallet params', () => {
    it('should transform the transfer parameters appropriately', async () => {
      const params = async () => {
        return {
          to: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          amount: 0.1,
        };
      };

      const mappedParams = {
        kind: 'transaction',
        amount: '100000',
        destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      };

      expect(await walletConnect.mapTransferParamsToWalletParams(params)).toEqual(mappedParams);
    });

    it('should transform the transfer parameters appropriately including limits', async () => {
      const params = async () => {
        return {
          to: 'KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5',
          amount: 0,
          fee: 400,
          mutez: false,
          gasLimit: 4000,
          storageLimit: 0,
          parameter: {
            entrypoint: 'simple_param',
            value: {
              int: '5',
            },
          },
        };
      };

      const mappedParams = {
        kind: 'transaction',
        fee: '400',
        gas_limit: '4000',
        storage_limit: '0',
        amount: '0',
        destination: 'KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5',
        parameters: {
          entrypoint: 'simple_param',
          value: {
            int: '5',
          },
        },
      };

      expect(await walletConnect.mapTransferParamsToWalletParams(params)).toEqual(mappedParams);
    });

    it('should transform the origination parameters appropriately', async () => {
      const params = async () => {
        return {
          code: fakeCode,
          init: [],
        };
      };

      const mappedParams = {
        kind: 'origination',
        balance: '0',
        script: {
          code: fakeCode,
          storage: [],
        },
      };

      expect(await walletConnect.mapOriginateParamsToWalletParams(params)).toEqual(mappedParams);
    });

    it('should transform the transfer parameters appropriately including limits', async () => {
      const params = async () => {
        return {
          code: fakeCode,
          init: [],
          fee: 400,
          mutez: false,
          gasLimit: 4000,
          storageLimit: 0,
        };
      };

      const mappedParams = {
        kind: 'origination',
        balance: '0',
        script: {
          code: fakeCode,
          storage: [],
        },
        fee: '400',
        gas_limit: '4000',
        storage_limit: '0',
      };

      expect(await walletConnect.mapOriginateParamsToWalletParams(params)).toEqual(mappedParams);
    });

    it('should transform the delegation parameters appropriately', async () => {
      const params = async () => {
        return {
          delegate: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
        };
      };

      const mappedParams = {
        kind: 'delegation',
        delegate: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      };

      expect(await walletConnect.mapDelegateParamsToWalletParams(params)).toEqual(mappedParams);
    });

    it('should transform the delegation parameters appropriately including limits', async () => {
      const params = async () => {
        return {
          delegate: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          fee: 400,
          gasLimit: 4000,
          storageLimit: 0,
        };
      };

      const mappedParams = {
        kind: 'delegation',
        delegate: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
        fee: '400',
        gas_limit: '4000',
        storage_limit: '0',
      };

      expect(await walletConnect.mapDelegateParamsToWalletParams(params)).toEqual(mappedParams);
    });
  });

  describe('test events', () => {
    beforeEach(async () => {
      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.TEZOS_SEND],
          networks: [NetworkType.GHOSTNET],
        },
      });
    });

    it('should delete session when session_delete event is received', async () => {
      expect(walletConnect.isActiveSession()).toBeTruthy();
      sessionDeletedEvent({ topic: sessionExample.topic });
      expect(walletConnect.isActiveSession()).toBeFalsy();
    });

    it('should delete session when session_expire event is received', async () => {
      expect(walletConnect.isActiveSession()).toBeTruthy();
      sessionExpiredEvent({ topic: sessionExample.topic });
      expect(walletConnect.isActiveSession()).toBeFalsy();
    });

    it('should update session when session_update event is received', async () => {
      expect(walletConnect.getSession().namespaces).toEqual(sessionExample.namespaces);
      sessionUpdatedEvent({ topic: sessionExample.topic, params: sessionMultipleChains });
      expect(walletConnect.getSession().namespaces).toEqual(sessionMultipleChains.namespaces);
    });
  });
});
