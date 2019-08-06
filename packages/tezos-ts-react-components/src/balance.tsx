import React from 'react';
import { TezosContext } from './tezos-context';

export class Balance extends React.Component<{ address: string }, { balance: string | null }> {
  static contextType = TezosContext;
  constructor(props: { address: string }) {
    super(props);

    this.state = {
      balance: null
    };
  }

  async refreshBalance() {
    // tslint:disable-next-line: deprecation
    const balance = await this.context.tz.getBalance(this.props.address);
    this.setState({ balance });
  }

  async componentDidUpdate() {
    await this.refreshBalance();
  }

  async componentDidMount() {
    await this.refreshBalance();
  }

  render() {
    return <span>{this.state.balance}</span>;
  }
}
