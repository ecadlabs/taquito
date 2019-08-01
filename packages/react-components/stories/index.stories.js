import React from 'react';

import { storiesOf } from '@storybook/react';
import { Balance } from '../src/balance';

import { TezosToolkit } from 'tezos-dapp-toolkit';
import { TezosContext } from '../src/tezos-context';

storiesOf('Balance', module).add('standard', () => {
  const tk = new TezosToolkit();
  tk.setProvider('https://alphanet-node.tzscan.io');
  return (
    <TezosContext.Provider value={tk}>
      <Balance address='KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN'></Balance>
    </TezosContext.Provider>
  );
});
