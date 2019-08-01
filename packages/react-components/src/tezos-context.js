import { TezosToolkit } from 'tezos-dapp-toolkit';
import React from 'react';

export const TezosContext = React.createContext(new TezosToolkit());
