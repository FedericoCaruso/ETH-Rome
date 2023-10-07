import { SxProps, Theme, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

export interface ITypeWriter {
    text: string;
    delay: number;
    infinite: boolean;
    TypographyOwnProps?: SxProps<Theme> | undefined;
}

const Typewriter = ({ text, delay, infinite, TypographyOwnProps }: ITypeWriter) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout>;
  
      if (currentIndex <= text.length) {
        timeout = setTimeout(() => {
          setCurrentText(prevText => prevText + text[currentIndex]);
          setCurrentIndex(prevIndex => prevIndex + 1);
        }, delay);
  
      } else if (infinite) { // ADD THIS CHECK
        setCurrentIndex(0);
        setCurrentText('');
      }
  
      return () => clearTimeout(timeout);
    }, [currentIndex, delay, infinite, text]);
  
    return <Typography sx={{...TypographyOwnProps}}>{currentText}</Typography>;
  };
  
  export default Typewriter;