type GlobalWithVendoredParams = typeof globalThis & {
  __taquitoVendoredParams?: {
    saplingOutputParams?: {
      saplingOutputParams: string;
    };
  };
};

const globalWithVendoredParams = globalThis as GlobalWithVendoredParams;

globalWithVendoredParams.__taquitoVendoredParams = globalWithVendoredParams.__taquitoVendoredParams ?? {};
globalWithVendoredParams.__taquitoVendoredParams.saplingOutputParams = {
  saplingOutputParams: '',
};
