import { RpcContractProvider } from "../../src/contract/rpc-contract-provider";
import { sample, sampleStorage, sampleBigMapValue } from "./data";

/**
 * RPCContractProvider test
 */
describe("RpcContractProvider test", () => {
  let rpcContractProvider: RpcContractProvider;
  let mockRpcClient: {
    getScript: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
    getBigMapKey: jest.Mock<any, any>;
  };

  beforeEach(() => {
    mockRpcClient = {
      getScript: jest.fn(),
      getStorage: jest.fn(),
      getBigMapKey: jest.fn()
    };

    rpcContractProvider = new RpcContractProvider(mockRpcClient as any);
  });

  describe("getStorage", () => {
    it("should call getStorage", async done => {
      mockRpcClient.getScript.mockResolvedValue({ code: [sample] });
      mockRpcClient.getStorage.mockResolvedValue(sampleStorage);
      const result = await rpcContractProvider.getStorage("test");
      expect(result).toEqual({
        "0": {},
        "1": "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn",
        "2": "False",
        "3": "200"
      });
      done();
    });
  });

  describe("getBigMapKey", () => {
    it("should call getBigMapKey", async done => {
      mockRpcClient.getScript.mockResolvedValue({ code: [sample] });
      mockRpcClient.getBigMapKey.mockResolvedValue(sampleBigMapValue);
      const result = await rpcContractProvider.getBigMapKey(
        "test",
        "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn"
      );
      expect(result).toEqual({
        "0": "261",
        "1": {
          KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN: "100",
          tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn: "100"
        }
      });
      expect(mockRpcClient.getBigMapKey.mock.calls[0][0]).toEqual("test");
      expect(mockRpcClient.getBigMapKey.mock.calls[0][1]).toEqual({
        key: { bytes: "000035e993d8c7aaa42b5e3ccd86a33390ececc73abd" },
        type: { prim: "bytes" }
      });
      done();
    });
  });
});
