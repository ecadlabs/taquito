import '../saplingOutputParams.js';

type SaplingOutputParamsModule = {
  saplingOutputParams: string;
};

type GlobalWithVendoredParams = typeof globalThis & {
  __taquitoVendoredParams?: {
    saplingOutputParams?: SaplingOutputParamsModule;
  };
};

const loadSaplingOutputParams = (): SaplingOutputParamsModule => {
  const saplingOutputParams = (globalThis as GlobalWithVendoredParams).__taquitoVendoredParams
    ?.saplingOutputParams;

  if (!saplingOutputParams) {
    throw new Error('Vendored sapling output params failed to load');
  }

  return saplingOutputParams;
};

export default loadSaplingOutputParams();
