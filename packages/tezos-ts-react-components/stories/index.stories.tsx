import React from 'react';

import { storiesOf } from '@storybook/react';
import { Balance } from '../src/balance';

import { withKnobs, text, select } from '@storybook/addon-knobs';
import { TezosToolkit } from '@tezos-ts/tezos-ts';
import { TezosContext } from '../src/tezos-context';

const stories = storiesOf('Balance component', module);
stories.addDecorator(withKnobs);

function createTK() {
  const tk = new TezosToolkit();
  tk.setProvider('https://alphanet-node.tzscan.io');
  return tk;
}

stories.add('default', () => {
  const tk = createTK();
  return (
    <TezosContext.Provider value={tk}>
      <Balance
        format={select(
          'Format',
          {
            None: undefined,
            mꜩ: 'mtz',
            ꜩ: 'tz'
          },
          undefined
        )}
        address={text('Address', 'KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN')}
      ></Balance>
    </TezosContext.Provider>
  );
});

stories.add('mꜩ formatted', () => {
  const tk = createTK();
  return (
    <TezosContext.Provider value={tk}>
      <Balance
        format={select(
          'Format',
          {
            None: undefined,
            mꜩ: 'mtz',
            ꜩ: 'tz'
          },
          'mtz'
        )}
        address={text('Address', 'KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN')}
      ></Balance>
    </TezosContext.Provider>
  );
});

stories.add('ꜩ formatted', () => {
  const tk = createTK();
  return (
    <TezosContext.Provider value={tk}>
      <Balance
        format={select(
          'Format',
          {
            None: undefined,
            mꜩ: 'mtz',
            ꜩ: 'tz'
          },
          'tz'
        )}
        address={text('Address', 'KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN')}
      ></Balance>
    </TezosContext.Provider>
  );
});

stories.add('Errored', () => {
  const tk = createTK();
  return (
    <TezosContext.Provider value={tk}>
      <Balance address={text('Address', 'KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9A')}></Balance>
    </TezosContext.Provider>
  );
});
