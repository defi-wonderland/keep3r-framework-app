import { useMemo, useState } from 'react';
import { Box, styled } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { isAddress } from 'viem';

import { useTheme } from '~/hooks';
import { Icon, StyledTitle } from '~/components';
import { CallerSection } from './CallerSection';
import { JobSection } from './JobSection';
import { truncateAddress } from '~/utils';
import { JobsData } from '~/types';

interface StyledAccordionProps {
  relayAddress: string;
  callersList: string[];
  setCallersList: (value: string[]) => void;
  jobsData: JobsData;
  setJobsData: (value: JobsData) => void;
  jobsCount: number;
  setJobsCount: (value: number) => void;
  isLoading: boolean;
  isError: boolean;
  setIsError: (value: boolean) => void;
}

export const StyledAccordion = ({
  relayAddress,
  callersList,
  setCallersList,
  isLoading,
  isError,
  setIsError,
  jobsData,
  setJobsData,
  jobsCount,
  setJobsCount,
}: StyledAccordionProps) => {
  const { currentTheme } = useTheme();
  const [addCallerOpen, setAddCallerOpen] = useState<boolean>(true);
  const [callerExpanded, setCallerExpanded] = useState<boolean>(false);
  const jobsList = new Array(jobsData.length).fill(0);

  const handleAddCaller = () => {
    setAddCallerOpen(!addCallerOpen);
    setCallerExpanded(!callerExpanded);
  };

  const handleAddJob = () => {
    const newJobsData = [...jobsData];
    newJobsData.push({ job: '', functionSelectors: [] });
    setCallerExpanded(false);
    setJobsData(newJobsData);
    setJobsCount(jobsCount + 1);
  };

  const handleRemoveJob = (index: number) => {
    const newJobsData = [...jobsData];
    newJobsData.splice(index, 1);
    setJobsData(newJobsData);
    setJobsCount(jobsCount - 1);
  };

  const allowAddNewJob = useMemo(() => {
    // if there are no jobs, allow adding a new one
    if (!jobsData.length) return true;

    // if there are jobs, check if the last job has an address
    return jobsData[jobsData.length - 1].job !== '';
  }, [jobsData]);

  return (
    <AccordionContainer>
      <AccordionBox disableGutters expanded={callerExpanded}>
        <SAccordionSummary
          onClick={handleAddCaller}
          disabled={!isAddress(relayAddress)}
          expandIcon={
            <Icon
              name={!callersList.length && addCallerOpen ? 'plus' : 'chevron-down'}
              color={currentTheme.textDisabled}
              size='2rem'
            />
          }
        >
          <STitle>{callersList.length ? `Callers (${callersList.length})` : 'Add Callers'}</STitle>
        </SAccordionSummary>

        <SAccordionDetails>
          {/* Callers section */}
          <CallerSection
            callersList={callersList}
            setCallersList={setCallersList}
            isLoading={isLoading}
            isError={isError}
            setIsError={setIsError}
            isEdit={!!relayAddress}
          />
        </SAccordionDetails>
      </AccordionBox>

      {jobsList.map((_value, index) => (
        <JobAccordionBox disableGutters key={jobsData[index]?.job} defaultExpanded={index === jobsCount - 1}>
          <SAccordionSummary
            expandIcon={
              <>
                <SIcon
                  name='close'
                  color={currentTheme.textDisabled}
                  size='2rem'
                  onClick={() => handleRemoveJob(index)}
                />
              </>
            }
          >
            <STitle>
              Job {index + 1} {isAddress(jobsData[index]?.job) ? `(${truncateAddress(jobsData[index]?.job)})` : ''}
            </STitle>
          </SAccordionSummary>

          <SAccordionDetails>
            {/* Job section */}
            <JobSection jobIndex={index} isLoading={isLoading} jobsData={jobsData} setJobsData={setJobsData} />
          </SAccordionDetails>
        </JobAccordionBox>
      ))}

      <JobAccordionBox disableGutters expanded={false}>
        <SAccordionSummary
          disabled={!isAddress(relayAddress) || !allowAddNewJob || isLoading}
          onClick={handleAddJob}
          expandIcon={<Icon name='plus' color={currentTheme.textDisabled} size='2rem' />}
        >
          <STitle>Add Job</STitle>
        </SAccordionSummary>
      </JobAccordionBox>
    </AccordionContainer>
  );
};

const STitle = styled(StyledTitle)(() => {
  return {
    fontSize: '1.6rem',
    fontWeight: '600',
  };
});

const AccordionContainer = styled(Box)(() => {
  const { currentTheme } = useTheme();

  return {
    marginTop: '-1.2rem',
    padding: '0 0 2.4rem',
    '& .MuiPaper-root.Mui-disabled': {
      backgroundColor: currentTheme.actionButtonDisabled,
      color: currentTheme.actionButtonColorDisabled,
      cursor: 'default',
    },
  };
});

const SAccordionSummary = styled(AccordionSummary)(() => {
  return {
    padding: '1.2rem 0',
  };
});

const AccordionBox = styled(Accordion)(() => {
  const { currentTheme } = useTheme();
  return {
    position: 'inherit',
    backgroundColor: currentTheme.backgroundPrimary,
    backgroundImage: 'none',
    boxShadow: 'none',
  };
});

const JobAccordionBox = styled(AccordionBox)(() => {
  const { currentTheme } = useTheme();
  return {
    borderTop: `${currentTheme.inputBorder}`,
  };
});

const SAccordionDetails = styled(AccordionDetails)(() => {
  return {
    padding: '0',
  };
});

const SIcon = styled(Icon)(() => {
  const { currentTheme } = useTheme();

  return {
    cursor: 'pointer',
    '&:hover::before': {
      color: currentTheme.textPrimary,
    },
  };
});
