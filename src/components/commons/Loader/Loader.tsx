import { FC } from 'react';
import { CircularProgress, Box } from '@mui/material';
import './Loader.scss'

const Loader: FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
