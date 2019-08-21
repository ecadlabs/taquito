import React from 'react';
import { TezosContext } from './tezos-context';
import { tzFormatter } from './format';

export interface BalanceProps {
  address: string;
  format?: 'tz' | 'mtz';
}

export class Balance extends React.Component<
  BalanceProps,
  { balance: string | null; error: boolean }
> {
  static contextType = TezosContext;
  constructor(props: BalanceProps) {
    super(props);

    this.state = {
      balance: null,
      error: false
    };
  }

  async refreshBalance() {
    // tslint:disable-next-line: deprecation
    try {
      const balance = await this.context.tz.getBalance(this.props.address);
      this.setState({ balance, error: false });
    } catch (ex) {
      this.setState({ error: true });
    }
  }

  async componentDidMount() {
    await this.refreshBalance();
  }

  async componentDidUpdate(prevProps: BalanceProps) {
    if (prevProps.address !== this.props.address) {
      await this.refreshBalance();
    }
  }

  render() {
    if (this.state.error) {
      return <span>Error fetching balance</span>;
    }
    return <span>{tzFormatter(this.state.balance || '', this.props.format)}</span>;
  }
}
