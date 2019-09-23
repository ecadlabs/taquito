import React from 'react';
import { TezosContext } from './tezos-context';
import { LineChart, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, Line, YAxis } from 'recharts'
import { tzFormatter } from './format';

export interface BalanceProps {
  start: number;
  end: number;
  address: string;
  format?: 'tz' | 'mtz';
}

const CustomToolTip = (props: any) => {
  const { active, payload, label } = props;
  if (!active || !payload) {
    return null;
  }
  return (
    <div
      className="custom-tooltip"
    >
      <p>
        <strong>{label}</strong>
      </p>
      {payload.map((item: any, i: any) => (
        <p key={i}>
          {item.name}: <strong>{item.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

export class BalanceHistory extends React.Component<
  BalanceProps,
  { balance?: object[]; error: boolean }
  > {
  static contextType = TezosContext;
  constructor(props: BalanceProps) {
    super(props);

    this.state = {
      error: false,
    };
  }

  async refreshBalance() {
    try {
      // tslint:disable-next-line: deprecation
      const { value, timestamp } = await this.context.query.balanceHistory(this.props.address, { start: new Date(this.props.start), end: new Date(this.props.end) });
      const values = value
        .map((val: number, i: number) => ({ value: val, timestamp: timestamp[i] }))
        .sort(({ timestamp1 }: any, { timestamp2 }: any) => timestamp1 < timestamp2 ? 1 : -1);
      this.setState({ balance: values, error: false });
    } catch (ex) {
      this.setState({ error: true });
    }
  }

  async componentDidMount() {
    await this.refreshBalance();
  }

  async componentDidUpdate(prevProps: BalanceProps) {
    if (prevProps.end !== this.props.end || prevProps.address !== this.props.address || prevProps.start !== this.props.start) {
      await this.refreshBalance();
    }
  }

  render() {
    if (this.state.error) {
      return <span>Error fetching balance</span>;
    }
    return <ResponsiveContainer width='100%' height={400}>
      <LineChart data={this.state.balance}>
        <XAxis dataKey="timestamp" />
        <Tooltip formatter={(val) => (<span>{tzFormatter(val as string, 'tz')}</span>)}></Tooltip>
        <YAxis tickFormatter={(val: string) => tzFormatter(val, 'tz')}>
        </YAxis>
        <Line type="monotone" dataKey="value" stroke="#ff7300" yAxisId={0}>
        </Line>
      </LineChart>
    </ResponsiveContainer>;
  }
}
