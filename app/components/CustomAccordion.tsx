import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface ICustomAccordion {
    title: string;
    children: React.ReactNode;
}

export const CustomAccordion = ({title, children}: ICustomAccordion) => {
  return (
    <Accordion sx={{width: '100%',  boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)'}}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            {children}
        </AccordionDetails>
    </Accordion>
  )
}
