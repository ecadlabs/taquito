import React from 'react';

import { Tezos } from 'tezos-dapp-toolkit';
import { TezosContext } from './tezos-context';

export class Balance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      balance: null
    };
  }

  async refreshBalance() {
    const balance = await this.context.tz.getBalance(this.props.address);
    this.setState({ balance });
  }

  componentDidUpdate() {
    this.refreshBalance();
  }

  componentDidMount() {
    this.refreshBalance();
  }

  render() {
    return <span>{this.state.balance}</span>;
  }
}

Balance.contextType = TezosContext;
