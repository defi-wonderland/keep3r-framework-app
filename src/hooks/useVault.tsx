import { Address, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { WriteContractResult } from 'wagmi/actions';
import { TransactionExecutionError } from 'viem';

import { useStateContext } from './useStateContext';
import { useCustomClient } from './useCustomClient';
import { getViewTransaction } from '~/utils';
import { vaultABI } from '~/generated';
import { ModalType } from '~/types';

interface SendTransactionProps {
  contractAddress?: string;
  functionName:
    | 'acceptOwner'
    | 'approveJobFunctions'
    | 'approveRelayCallers'
    | 'changeOwner'
    | 'exec'
    | 'revokeJobFunctions'
    | 'revokeRelayCallers'
    | 'withdrawFunds'
    | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any;

  notificationTitle?: string;
  notificationMessage?: string | JSX.Element;
  showReceipt?: boolean;
}

export const useVault = ({
  contractAddress,
  functionName,
  args,
  notificationTitle,
  notificationMessage,
  showReceipt,
}: SendTransactionProps): {
  handleSendTransaction: () => Promise<void>;
  writeAsync: (() => Promise<WriteContractResult>) | undefined;
} => {
  const { currentNetwork, setLoading, setModalOpen, setNotification } = useStateContext();
  const { publicClient } = useCustomClient();

  const { config } = usePrepareContractWrite({
    address: contractAddress as Address,
    abi: vaultABI,
    functionName: functionName,
    args: args,
  });

  const { writeAsync } = useContractWrite(config);

  const handleSendTransaction = async () => {
    setLoading(true);
    try {
      if (writeAsync) {
        const writeResult = await writeAsync();
        await publicClient.waitForTransactionReceipt(writeResult);
        setModalOpen(ModalType.NONE);

        setNotification({
          open: true,
          title: notificationTitle,
          message: showReceipt ? getViewTransaction(writeResult.hash, currentNetwork) : notificationMessage,
        });
      }
    } catch (error) {
      console.error(error);
      const e = error as TransactionExecutionError;
      setNotification({
        open: true,
        error: true,
        title: e.name,
        message: e.shortMessage,
      });
    }
    setLoading(false);
  };

  return {
    handleSendTransaction,
    writeAsync,
  };
};
