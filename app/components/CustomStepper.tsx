import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { CustomAccordion } from './CustomAccordion';
import Avvvatars from 'avvvatars-react';

const steps = ['Choose or insert contract address', 'Create an ad group', 'Create an ad'];

export default function CustomStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const [contractAddress, setContractAddress] = React.useState<string>('');

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  function createData(
    users: string,
  ) {
    return { users };
  }

  const rows = [
    createData('Frozen yoghurt'),
    createData('Ice cream sandwich'),
    createData('Eclair'),
    createData('Cupcake'),
    createData('Gingerbread'),
  ];

  const renderSteps = (activeStep: number) => {
    return activeStep === 0 ?
      <Stack gap={2} alignItems='center'>
        <CustomAccordion title='Insert contract address'>
          <TextField
            onChange={(event) => setContractAddress(event.target.value)}
            error={contractAddress.length !== 42 && contractAddress.length !== 0}
            helperText={ contractAddress.length !== 42 && contractAddress.length !== 0 &&
              <Typography>Please insert a valid contract address</Typography>
            }
            fullWidth 
            variant="outlined" 
          />
        </CustomAccordion>

        OR

        <CustomAccordion title='Choose contract address'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Contranct address</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.users}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Stack direction='row' alignItems='center' gap={2}>
                      <Avvvatars style='shape' value={row.users} />
                      {row.users}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Button>
                      CHAT
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </CustomAccordion>
      </Stack>
      
    :  'non lo so'
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', zIndex: 1 }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        
          <React.Fragment>
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} padding={6}>
                {renderSteps(activeStep)}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                variant='contained'
                color='secondary'
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1}}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button variant='contained' onClick={handleNext} sx={{ mr: 1 }}>
                Next
              </Button>
            </Box>
          </React.Fragment>
        
      </div>
    </Box>
  );
}