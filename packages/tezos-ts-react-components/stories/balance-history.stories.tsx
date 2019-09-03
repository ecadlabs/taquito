import React from 'react';

import { storiesOf } from '@storybook/react';
import { BalanceHistory } from '../src/balance-history';

import { withKnobs, text, date } from '@storybook/addon-knobs';
import { TezosToolkit } from '@tezos-ts/tezos-ts';
import { TezosContext } from '../src/tezos-context';

const stories = storiesOf('Balance history component', module);
stories.addDecorator(withKnobs);

function createTK() {
    const tk = new TezosToolkit();
    tk.setProvider({ rpc: 'https://alphanet-node.tzscan.io' });
    return tk;
}

stories.add('default', () => {
    const tk = createTK();
    return (
        <>
            <h2>Balance over time for {text('Address', 'KT1DzGefKWdrwWn9HxcYtKR46todiC66bxsH')}</h2>
            <TezosContext.Provider value={tk}>
                <BalanceHistory start={date('Start', new Date(new Date().getFullYear(), 0, 1))} end={date('End', new Date())} address={text('Address', 'KT1DzGefKWdrwWn9HxcYtKR46todiC66bxsH')}></BalanceHistory>
            </TezosContext.Provider>
        </>
    );
});
