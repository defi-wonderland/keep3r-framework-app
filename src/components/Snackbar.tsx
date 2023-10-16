import { useSnackbar, ClickAwayListener } from '@mui/base';
import { css, keyframes, styled } from '@mui/system';
import { Button } from '@mui/material';

import { useStateContext } from '~/hooks';
import { StyledText, StyledTitle, Icon } from '~/components';
import { zIndex } from '~/utils';

export function UseSnackbar() {
  const { notification, setNotification, currentTheme } = useStateContext();

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  const { getRootProps, onClickAway } = useSnackbar({
    onClose: handleClose,
    open: notification.open,
    autoHideDuration: 5000,
  });

  return (
    <>
      {notification.open && (
        <ClickAwayListener onClickAway={onClickAway}>
          <CustomSnackbar {...getRootProps()}>
            <div>
              <SCheckIcon name='check-circle' size='2rem' />
            </div>

            <TextContainer>
              <Title>{notification?.title}</Title>
              <Text>{notification?.message}</Text>
            </TextContainer>

            <SButton variant='text' onClick={handleClose}>
              <Icon name='close' size='2rem' color={currentTheme.textTertiary} />
            </SButton>
          </CustomSnackbar>
        </ClickAwayListener>
      )}
    </>
  );
}

const snackbarInRight = keyframes`
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
`;

const CustomSnackbar = styled('div')(() => {
  const { currentTheme } = useStateContext();
  return css`
    background-color: ${currentTheme.backgroundPrimary};
    border: ${currentTheme.border};
    border-radius: ${currentTheme.borderRadius};
    z-index: ${zIndex.TOAST};
    position: fixed;
    display: flex;
    gap: 1.4rem;
    right: 1.6rem;
    bottom: 1.6rem;
    left: auto;
    justify-content: start;
    width: 36.8rem;
    box-shadow:
      0px 4px 6px -2px rgba(16, 24, 40, 0.03),
      0px 12px 16px -4px rgba(16, 24, 40, 0.08);
    padding: 1.6rem;
    font-weight: 500;
    animation: ${snackbarInRight} 200ms;
    transition: transform 0.2s ease-out;
    &:hover {
      border-color: ${currentTheme.textSecondaryDisabled};
      box-shadow: '0px 2px 12px 0px rgba(16, 24, 40, 0.04)';
      transition: 'all 0.2s ease-in-out';
    }
  `;
});

const TextContainer = styled('div')(() => {
  const { currentTheme } = useStateContext();
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    a: {
      color: currentTheme.actionButton,
    },
  };
});

const Title = styled(StyledTitle)(() => {
  const { currentTheme } = useStateContext();
  return {
    fontSize: '1.4rem',
    lineHeight: '2rem',
    fontWeight: 600,
    color: currentTheme.textPrimary,
    '&::first-letter': {
      textTransform: 'capitalize',
    },
  };
});

const Text = styled(StyledText)(() => {
  const { currentTheme } = useStateContext();
  return {
    fontSize: '1.4rem',
    lineHeight: '2rem',
    fontWeight: 500,
    color: currentTheme.textTertiary,
    span: {
      fontWeight: 600,
    },
  };
});

const SButton = styled(Button)(() => {
  const { currentTheme } = useStateContext();
  return {
    padding: 0,
    minWidth: 'auto',
    width: '2rem',
    minHeight: 'auto',
    alignItems: 'start',
    '&:hover': {
      background: 'inherit',
    },
    '&:hover i:before': {
      color: currentTheme.textPrimary,
    },
  };
});

const SCheckIcon = styled(Icon)(() => {
  const { currentTheme } = useStateContext();

  return {
    color: currentTheme.checkColor,
    background: currentTheme.checkBackground,
    padding: '0.8rem',
    border: '0.8rem solid',
    borderColor: currentTheme.checkBorderColor,
    borderRadius: '100%',
  };
});
