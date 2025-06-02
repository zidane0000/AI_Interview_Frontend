import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorDisplayProps {
  error: string;
  title?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  title = 'Error',
  onRetry,
  showRetry = true 
}) => {
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <AlertTitle>{title}</AlertTitle>
      {error}
      {showRetry && onRetry && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        </Box>
      )}
    </Alert>
  );
};

export default ErrorDisplay;
