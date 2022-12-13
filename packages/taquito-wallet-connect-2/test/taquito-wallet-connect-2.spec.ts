import {
  NetworkType,
  PermissionScopeEvents,
  PermissionScopeMethods,
  WalletConnect2,
} from '../src/taquito-wallet-connect-2';
import { existingPairings, sessionExample, sessionMultipleChains } from './data';

describe('Wallet connect 2 tests', () => {
  let walletConnect: WalletConnect2;
  let mockSignClient: {
    on: jest.Mock<any, any>;
    connect: jest.Mock<any, any>;
    pairing: {
      getAll: jest.Mock<any, any>;
    }
    session: {
      keys: string[];
      get: jest.Mock<any, any>;
    }
  };

  beforeEach(() => {
    mockSignClient = {
      on: jest.fn(),
      connect: jest.fn(),
      pairing: {
        getAll: jest.fn()
      },
      session: {
        keys: [sessionExample.topic, sessionMultipleChains.topic],
        get: jest.fn()
      }
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
        methods: [PermissionScopeMethods.OPERATION_REQUEST],
        networks: [NetworkType.GHOSTNET],
      },
    });

    expect(mockSignClient.connect).toHaveBeenCalledWith({
      requiredNamespaces: {
        tezos: {
          chains: ['tezos:ghostnet'],
          methods: ['tezos_sendOperations'],
          events: [],
        },
      },
    });
  });

  it('should return active account when session namespace only have one', async () => {
    await walletConnect.requestPermissions({
      permissionScope: {
        methods: [PermissionScopeMethods.OPERATION_REQUEST],
        networks: [NetworkType.GHOSTNET],
      },
    });

    expect(await walletConnect.getPKH()).toEqual('tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh');
  });

  it('should throw an error when no active account is set and session namespace has multiple accounts', async () => {
    mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

    await walletConnect.requestPermissions({
      permissionScope: {
        methods: [PermissionScopeMethods.SIGN],
        networks: [NetworkType.GHOSTNET],
      },
    });

    await expect(
      walletConnect.getPKH()
    ).rejects.toThrow('Please specify the active account using the "setActiveAccount" method.');
  });

  it('should set the active account successfully', async () => {
    mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

    await walletConnect.requestPermissions({
      permissionScope: {
        methods: [PermissionScopeMethods.SIGN],
        networks: [NetworkType.GHOSTNET],
      },
    });

    walletConnect.setActiveAccount('tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh');
    expect(await walletConnect.getPKH()).toEqual('tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh');

  });

  it('should fail to set the active account when it is not part of the session namespace', async () => {
    mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

    await walletConnect.requestPermissions({
      permissionScope: {
        methods: [PermissionScopeMethods.SIGN],
        networks: [NetworkType.GHOSTNET],
      },
    });

    expect(() =>
      walletConnect.setActiveAccount('test')
    ).toThrow('Invalid pkh "test"');
  });

  it('should access all existing active pairings with getAvailablePairing', async () => {
    mockSignClient.pairing.getAll.mockReturnValue(existingPairings)

    await walletConnect.requestPermissions({
      permissionScope: {
        methods: [PermissionScopeMethods.OPERATION_REQUEST],
        networks: [NetworkType.GHOSTNET],
      },
    });

    expect(walletConnect.getAvailablePairing()).toEqual(existingPairings)
  });

  it('should access all existing session keys with getAllExistingSessionKeys', async () => {

    await walletConnect.requestPermissions({
      permissionScope: {
        methods: [PermissionScopeMethods.OPERATION_REQUEST],
        networks: [NetworkType.GHOSTNET],
      },
    });

    expect(walletConnect.getAllExistingSessionKeys()).toEqual([sessionExample.topic, sessionMultipleChains.topic])
  });

  it('should use an existing session with configureWithExistingSessionKey', async () => {
    mockSignClient.session.get.mockReturnValue(sessionExample);
    walletConnect.configureWithExistingSessionKey(sessionExample.topic);

    expect(mockSignClient.session.get).toHaveBeenCalledWith(sessionExample.topic);
  });

  it('should access permitted networks', async () => {
    mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

    await walletConnect.requestPermissions({
      permissionScope: {
        methods: [PermissionScopeMethods.SIGN],
        networks: [NetworkType.GHOSTNET],
      },
    });

    expect(walletConnect.getNetworks()).toEqual([NetworkType.GHOSTNET, NetworkType.LIMANET])
  });

  it('should set the active network successfully', async () => {
    mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

    await walletConnect.requestPermissions({
      permissionScope: {
        methods: [PermissionScopeMethods.SIGN],
        networks: [NetworkType.GHOSTNET, NetworkType.LIMANET],
      },
    });

    walletConnect.setActiveNetwork(NetworkType.LIMANET);
    expect(await walletConnect.getActiveNetwork()).toEqual(NetworkType.LIMANET);

  });

  it('should fail to set the active network when it is not part of the session namespace', async () => {
    mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

    await walletConnect.requestPermissions({
      permissionScope: {
        methods: [PermissionScopeMethods.SIGN],
        networks: [NetworkType.GHOSTNET, NetworkType.LIMANET],
      },
    });

    expect(() =>
      walletConnect.setActiveNetwork(NetworkType.KATHMANDUNET)
    ).toThrow('Invalid network "kathmandunet"');
  });

  it('should throw an error when no active network is set and session namespace has multiple networks', async () => {
    mockSignClient.connect.mockReturnValue({ approval: async () => sessionMultipleChains });

    await walletConnect.requestPermissions({
      permissionScope: {
        methods: [PermissionScopeMethods.SIGN],
        networks: [NetworkType.GHOSTNET, NetworkType.LIMANET],
      },
    });

    await expect(
      walletConnect.getActiveNetwork()
    ).rejects.toThrow('Please specify the active network using the "setActiveNetwork" method.');
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
                methods: [PermissionScopeMethods.OPERATION_REQUEST],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.OPERATION_REQUEST],
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
                methods: [PermissionScopeMethods.OPERATION_REQUEST],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.OPERATION_REQUEST],
            networks: [NetworkType.GHOSTNET],
          },
        })
      ).rejects.toThrow('5001: Accounts must be CAIP-10 compliant. "tezos:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh" is invalid.');
    });

    it('should fail to establish a connection if the received namespace is missing a requested method', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#23-session-namespaces-must-approve-all-methods

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.OPERATION_REQUEST, PermissionScopeMethods.SIGN],
            networks: [NetworkType.GHOSTNET],
          },
        })
      ).rejects.toThrow('5002: All methods must be approved. "tezos_signExpression" is missing in the session namespace.');
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
            methods: [PermissionScopeMethods.OPERATION_REQUEST, PermissionScopeMethods.SIGN],
            networks: [NetworkType.GHOSTNET],
          },
        })
      ).rejects.toThrow('5002: All methods must be approved. "tezos_sendOperations,tezos_signExpression" is missing in the session namespace.');
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
                methods: [PermissionScopeMethods.OPERATION_REQUEST],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.OPERATION_REQUEST],
            networks: [NetworkType.GHOSTNET, NetworkType.LIMANET],
          },
        })
      ).rejects.toThrow('5001: All chains must have at least one account. "limanet" is missing in the session namespace.');
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
                methods: [PermissionScopeMethods.OPERATION_REQUEST],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.OPERATION_REQUEST],
            networks: [NetworkType.GHOSTNET, NetworkType.LIMANET, NetworkType.KATHMANDUNET],
          },
        })
      ).rejects.toThrow('5001: All chains must have at least one account. "limanet,kathmandunet" is missing in the session namespace.');
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
                  'tezos:ghostnet:tz2BxqkU3UvZrqA22vbEaSGyjR9bEQwc4k2G'
                ],
                methods: [PermissionScopeMethods.OPERATION_REQUEST],
                events: [],
              },
            },
          };
        },
      });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.OPERATION_REQUEST],
          networks: [NetworkType.GHOSTNET],
        },
      });

      expect(mockSignClient.connect).toHaveBeenCalledWith({
        requiredNamespaces: {
          tezos: {
            chains: ['tezos:ghostnet'],
            methods: ['tezos_sendOperations'],
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
                accounts: [
                  'tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'
                ],
                methods: [PermissionScopeMethods.OPERATION_REQUEST, PermissionScopeMethods.SIGN],
                events: [PermissionScopeEvents.ACCOUNTS_CHANGED],
              },
            },
          };
        },
      });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.OPERATION_REQUEST],
          networks: [NetworkType.GHOSTNET],
        },
      });

      expect(mockSignClient.connect).toHaveBeenCalledWith({
        requiredNamespaces: {
          tezos: {
            chains: ['tezos:ghostnet'],
            methods: ['tezos_sendOperations'],
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
                  'unknown:ghostnet:tz2BxqkU3UvZrqA22vbEaSGyjR9bEQwc4k2G'
                ],
                methods: [PermissionScopeMethods.OPERATION_REQUEST],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.OPERATION_REQUEST],
            networks: [NetworkType.GHOSTNET],
          },
        })
      ).rejects.toThrow('5103: Accounts must be defined in matching namespace. "unknown:ghostnet:tz2BxqkU3UvZrqA22vbEaSGyjR9bEQwc4k2G" is invalid.');
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
                  'tezos:limanet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh'
                ],
                methods: [PermissionScopeMethods.OPERATION_REQUEST],
                events: [PermissionScopeEvents.ACCOUNTS_CHANGED],
              },
            },
          };
        },
      });

      await walletConnect.requestPermissions({
        permissionScope: {
          methods: [PermissionScopeMethods.OPERATION_REQUEST],
          networks: [NetworkType.GHOSTNET],
        },
      });

      expect(mockSignClient.connect).toHaveBeenCalledWith({
        requiredNamespaces: {
          tezos: {
            chains: ['tezos:ghostnet'],
            methods: ['tezos_sendOperations'],
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
                accounts: [
                  'unknown:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
                ],
                methods: [PermissionScopeMethods.OPERATION_REQUEST],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.OPERATION_REQUEST],
            networks: [NetworkType.GHOSTNET],
          },
        })
      ).rejects.toThrow('5000: All namespaces must be approved. "tezos" is missing in the session namespace.');
    });

    it('should fail to establish a connection if received namespace is mising requested events', async () => {
      // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#211-session-namespaces-must-approve-all-events


      mockSignClient.connect.mockReturnValue({
        approval: async () => {
          return {
            ...sessionExample,
            namespaces: {
              tezos: {
                accounts: [
                  'tezos:ghostnet:tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
                ],
                methods: [PermissionScopeMethods.OPERATION_REQUEST],
                events: [],
              },
            },
          };
        },
      });

      await expect(
        walletConnect.requestPermissions({
          permissionScope: {
            methods: [PermissionScopeMethods.OPERATION_REQUEST],
            networks: [NetworkType.GHOSTNET],
            events: [PermissionScopeEvents.ACCOUNTS_CHANGED],
          },
        })
      ).rejects.toThrow('5003: All events must be approved. "accountsChanged" is missing in the session namespace.');
    });

  });

});
