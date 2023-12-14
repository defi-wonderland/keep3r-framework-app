import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import {
  RevokeButton,
  AddressChip,
  BackToTop,
  BasicTabs,
  BreadCrumbs,
  CloseButton as EditAliasButton,
  Icon,
  InfoChip,
  MadeByWonderland,
  STooltip,
  StyledText,
} from '~/components';
import { useFetchSelectedVault, useStateContext } from '~/hooks';
import { Tokens } from './Tokens';
import { EnabledRelays } from './EnabledRelays';
import { EnabledJobs } from './EnabledJobs';
import { Activity } from './Activity';
import { ModalType, Status } from '~/types';

export const Vault = () => {
  const { userAddress, currentTheme, currentNetwork, aliasData, setModalOpen, setSelectedItem } = useStateContext();

  const { requestStatus, data: selectedVault } = useFetchSelectedVault();

  const chainName = currentNetwork.displayName;
  const vaultAddress = selectedVault?.address || '';
  const version = 'V1.0.0';

  const sections = [
    {
      title: 'Vault Overview',
      items: (
        <>
          <Tokens />
          <EnabledRelays />
          <EnabledJobs />
        </>
      ),
    },
    {
      title: 'Activity',
      items: <Activity />,
    },
  ];

  const handleEditAlias = () => {
    setSelectedItem({ type: 'vault', address: selectedVault?.address || '0x', params: [] });
    setModalOpen(ModalType.EDIT_ALIAS);
  };

  const handleOpenAddMetadata = () => {
    setModalOpen(ModalType.ADD_METADATA);
  };

  return (
    <PageContainer>
      {/* Navigation */}
      <BreadCrumbs previousPage='Home' currentPage='Vault' />

      <VaultContainer>
        <Header>
          {/* Vault Address | Vault Alias */}
          <TitleContainer>
            <TitleBox>
              <Title>{aliasData[vaultAddress] || selectedVault?.name}</Title>

              <STooltip text='Edit vault alias'>
                <EditAliasButton variant='text' onClick={handleEditAlias}>
                  <Icon name='pencil-square' color={currentTheme.textDisabled} size='2rem' />
                </EditAliasButton>
              </STooltip>
            </TitleBox>

            {/* Owner Icon */}
            <STooltip text='You own this vault'>
              <SInfoChip>
                <Icon name='owned' />
              </SInfoChip>
            </STooltip>
          </TitleContainer>

          <DataSection>
            {/* Contract and Owner addresses */}
            <DataContainer>
              <AddressChip label='Contract' text={selectedVault?.address || ''} />
              <AddressChip label='Owner' text={selectedVault?.owner || ''} />
            </DataContainer>

            {/* Vault version and Chain */}
            <DataContainer>
              <Version sx={{ color: currentTheme.textDisabled }}>{version}</Version>
              <InfoChip>{chainName}</InfoChip>
            </DataContainer>
          </DataSection>

          <DescriptionContainer>
            {/* Vault Description */}
            {selectedVault?.description && (
              <Description>
                {selectedVault.description + selectedVault.description + selectedVault.description}
              </Description>
            )}

            {!selectedVault?.description && (
              <DescriptionChip>
                <Icon name='exclamation-triangle' size='2.4rem' color={currentTheme.warningChipColor} />
                Define your vault metadata for keepers to better understand your jobs
                {selectedVault?.owner === userAddress && (
                  <DescriptionButton disabled={selectedVault?.owner !== userAddress} onClick={handleOpenAddMetadata}>
                    Add Metadata
                  </DescriptionButton>
                )}
              </DescriptionChip>
            )}
          </DescriptionContainer>
        </Header>

        <BasicTabs sections={sections} isLoading={requestStatus === Status.LOADING} />
      </VaultContainer>

      {/* Back To Top Button */}
      <BackToTop />

      {/* Made By Wonderland Button */}
      <MadeByWonderland />
    </PageContainer>
  );
};

const PageContainer = styled(Box)({
  width: '100%',
  margin: '0 auto',
  padding: '9.6rem 4.8rem',
  backgroundColor: 'inherit',
});

export const VaultContainer = styled(Box)({
  maxWidth: '80rem',
  margin: '0 auto',
});

export const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  alignItems: 'start',
  justifyContent: 'center',
  width: '100%',
  marginTop: '2.8rem',
  marginBottom: '2rem',
});

export const TitleContainer = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
});

export const TitleBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
  gap: '0.8rem',
});

export const Title = styled(Typography)({
  fontSize: '3rem',
  lineHeight: '3.8rem',
  fontWeight: 600,
});

export const DataSection = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
});

export const DataContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.8rem',
});

const Version = styled(Typography)({
  fontSize: '1.4rem',
  fontWeight: '400',
  lineHeight: '2rem',
  padding: '0.2rem 1rem',
});

const SInfoChip = styled(Box)(() => {
  const { currentTheme } = useStateContext();

  return {
    color: currentTheme.infoChipColor,
    backgroundColor: currentTheme.infoChipBackground,
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontWeight: '500',
    height: 'auto',
    borderRadius: '100%',
    padding: '0.6rem 0.6rem 0.5rem 0.6rem',
    lineHeight: '2rem',
    width: 'fit-content',
  };
});

const DescriptionContainer = styled('div')({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
  paddingTop: '0.8rem',
});

export const Description = styled(StyledText)(() => {
  const { currentTheme } = useStateContext();
  return {
    color: currentTheme.textSecondary,
    fontSize: '1.6rem',
  };
});

const DescriptionChip = styled(Box)(() => {
  const { currentTheme, theme } = useStateContext();
  const border = theme === 'light' ? `1px solid ${currentTheme.warningChipColor}` : undefined;
  return {
    color: currentTheme.warningChipColor,
    backgroundColor: currentTheme.warningChipBackground,
    borderRadius: currentTheme.borderRadius,
    fontSize: '1.6rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    fontWeight: '500',
    height: 'auto',
    padding: '1rem',
    paddingLeft: '1.6rem',
    lineHeight: '2rem',
    width: '100%',
    minHeight: '6.65rem',
    border,
  };
});

const DescriptionButton = styled(RevokeButton)(() => {
  const { currentTheme } = useStateContext();

  return {
    marginLeft: 'auto',
    color: currentTheme.warningChipColor,
    backgroundColor: currentTheme.warningChipBackground,
    border: `1px solid ${currentTheme.warningChipColor}`,
    '&:hover': {
      backgroundColor: currentTheme.warningChipColor,
      color: currentTheme.warningChipBackground,
    },
    '&:disabled': {
      opacity: 0.6,
      color: currentTheme.actionButtonColor,
    },
  };
});
