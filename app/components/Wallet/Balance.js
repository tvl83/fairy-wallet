// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { Table, Segment, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addToken } from '../../actions/settings';
import { getCurrencyStats } from '../../actions/currency';

import TokenAddModal from './TokenAddModal';
import TokenRemoveModal from './TokenRemoveModal';
import AccountSwitcher from '../Shared/AccountSwitcher';
import PublicKeyComponent from '../Shared/PublicKeyComponent';
import StakedStats from './StakedStats';

type Props = {
  showStakedData: boolean,
  accounts: {}
};

class Balance extends Component<Props> {
  state = {
    openTokenAddModal: false,
    openTokenRemoveModal: false,
    tokenSymbol: ''
  };

  handleAccountSwitch = name => {
    console.log(name);
  };
  handleTokenAddOpen = () => this.setState({ openTokenAddModal: true });
  handleTokenAddClose = () => this.setState({ openTokenAddModal: false });
  handleTokenRemoveOpen = e =>
    this.setState({ openTokenRemoveModal: true, tokenSymbol: e.target.id });
  handleTokenRemoveClose = () =>
    this.setState({ openTokenRemoveModal: false, tokenSymbol: '' });

  render() {
    const { accounts, showStakedData } = this.props;
    const { openTokenAddModal, openTokenRemoveModal, tokenSymbol } = this.state;

    if (accounts.balances !== null) {
      delete accounts.balances.EOS;
    }

    let details = (
      <div>
        <TokenRemoveModal
          open={openTokenRemoveModal}
          handleClose={this.handleTokenRemoveClose}
          symbol={tokenSymbol}
        />
        <Table basic="very" compact="very" unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token</Table.HeaderCell>
              <Table.HeaderCell>Balance</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(accounts.balances, (balance, symbol) => (
              <Table.Row key={symbol}>
                <Table.Cell collapsing>{symbol}</Table.Cell>
                <Table.Cell collapsing>{balance}</Table.Cell>
                <Table.Cell collapsing>
                  <Button
                    icon="close"
                    basic
                    id={symbol}
                    onClick={this.handleTokenRemoveOpen}
                  />
                </Table.Cell>
              </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    );
    if (showStakedData) {
      details = <StakedStats account={accounts.account} />;
    }

    return (
      <Segment.Group className="no-border no-padding">
        <Segment>
          <PublicKeyComponent />
        </Segment>
        <Segment>
          <AccountSwitcher
            accounts={accounts}
            onChange={this.handleAccountSwitch}
          />
        </Segment>
        { !showStakedData &&
          <Segment>
            <Button fluid onClick={this.handleTokenAddOpen}>
            Add new token
            </Button>
            <TokenAddModal
              open={openTokenAddModal}
              handleClose={this.handleTokenAddClose}
            />
          </Segment>
        }
        <Segment>
          {details}
        </Segment>
      </Segment.Group>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.loading,
  currency: state.currency
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      addToken,
      getCurrencyStats
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Balance);
