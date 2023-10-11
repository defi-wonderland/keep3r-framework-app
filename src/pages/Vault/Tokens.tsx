import React from 'react';
import {
  Card,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from '@mui/material';

import { ActiveButton, CancelButton, StyledText, TokenIcon } from '~/components';
import { formatDataNumber } from '~/utils';
import { useStateContext } from '~/hooks';
import { ModalType } from '~/types';

export const Tokens = () => {
  const { userAddress, setModalOpen, selectedVault, currentNetwork } = useStateContext();

  return (
    <SCard variant='outlined'>
      <SectionHeader>
        <Box>
          <Title>Tokens</Title>

          <TotalValue>
            Total Value: <span>{formatDataNumber(selectedVault?.totalValue || '0', 18, 2, true)}</span>
          </TotalValue>
        </Box>

        <ButtonsContainer>
          {selectedVault?.owner === userAddress && (
            <CancelButton variant='outlined' onClick={() => setModalOpen(ModalType.WITHDRAW)}>
              Withdraw funds
            </CancelButton>
          )}

          <ActiveButton variant='contained' disabled={!userAddress} onClick={() => setModalOpen(ModalType.DEPOSIT)}>
            Deposit funds
          </ActiveButton>
        </ButtonsContainer>
      </SectionHeader>

      {!!Number(selectedVault?.totalValue) && (
        <TableContainer>
          <STable aria-label='tokens table'>
            <TableHead>
              <TableRow>
                <SColumnTitle>
                  <ColumnText>Token Name</ColumnText>
                </SColumnTitle>

                <ColumnTitle align='left'>
                  <ColumnText>Amount</ColumnText>
                </ColumnTitle>

                <ColumnTitle align='left'>
                  <ColumnText>Value (USD)</ColumnText>
                </ColumnTitle>
              </TableRow>
            </TableHead>

            <TableBody>
              {selectedVault?.tokens.map((row) => (
                <React.Fragment key={row.address}>
                  {!!Number(row.balance) && (
                    <STableRow>
                      <SRowText component='th' scope='row'>
                        {/* Token Info */}
                        <TokenContainer>
                          <TokenIcon chainName={currentNetwork.name} tokenAddress={row.address} />
                          <TokenSymbol>{row.symbol}</TokenSymbol>
                          <TokenName>{row.name}</TokenName>
                        </TokenContainer>
                      </SRowText>

                      {/* Token amount */}
                      <RowText align='left'>{formatDataNumber(row.balanceE18, row.decimals, 2)}</RowText>

                      {/* Token amount in USD */}
                      <RowText align='left'>{formatDataNumber(row.balanceUSD, row.decimals, 2, true)}</RowText>
                    </STableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </STable>
        </TableContainer>
      )}
    </SCard>
  );
};

export const SCard = styled(Card)(() => {
  const { currentTheme } = useStateContext();
  return {
    backgroundColor: currentTheme.backgroundPrimary,
    borderRadius: currentTheme.borderRadius,
    padding: '2rem 3.2rem 0',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    boxShadow: '0px 2px 10px 0px rgba(16, 24, 40, 0.02)',
    marginTop: '2.4rem',
  };
});

export const SectionHeader = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2.4rem',
});

export const Title = styled(Typography)({
  fontSize: '2rem',
  lineHeight: '3rem',
  fontWeight: 700,
});

const TotalValue = styled(Typography)(() => {
  const {
    currentTheme: { textDisabled },
  } = useStateContext();
  return {
    color: textDisabled,
    fontSize: '1.4rem',
    lineHeight: '2rem',
    fontWeight: 400,
    span: {
      fontWeight: 500,
    },
  };
});

const ButtonsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '0.8rem',
  button: {
    width: 'max-content',
  },
});

export const ColumnTitle = styled(TableCell)(() => {
  const {
    currentTheme: { textTertiary },
  } = useStateContext();
  return {
    fontSize: '1.2rem',
    padding: '1.2rem 2.4rem',
    color: textTertiary,
  };
});

export const STable = styled(Table)({
  minWidth: '65rem',
});

export const RowText = styled(TableCell)(() => {
  const {
    currentTheme: { textSecondary },
  } = useStateContext();
  return {
    color: textSecondary,
    fontSize: '1.4rem',
    height: '3.2rem',
    fontWeight: 500,
    padding: '1.6rem 2.4rem',
  };
});

export const STableRow = styled(TableRow)({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
});

const SColumnTitle = styled(TableCell)({
  width: '33rem',
});

const SRowText = styled(TableCell)({
  width: '33rem',
});

const TokenSymbol = styled(StyledText)({});

const TokenName = styled(StyledText)(() => {
  const { currentTheme } = useStateContext();
  return {
    color: currentTheme.textDisabled,
    fontSize: '1.2rem',
  };
});

const TokenContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'start',
  gap: '1.2rem',
});

const ColumnText = styled(StyledText)(() => {
  const { currentTheme } = useStateContext();
  return {
    fontSize: '1.2rem',
    fontWeight: 500,
    color: currentTheme.textTertiary,
  };
});
