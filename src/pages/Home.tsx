import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../utils/dateFormat';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  Container,
  Paper,
  Avatar,
  Divider,
  Fab,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Add as AddIcon, 
  PlayArrow as PlayIcon, 
  Assessment as AssessmentIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { interviewApi } from '../services/api';
import type { Interview } from '../types';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [interviews, setInterviews] = useState<Interview[]>([]);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const loadInterviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await interviewApi.getInterviews();
      setInterviews(response.interviews);
    } catch (err) {
      console.error('Error loading interviews:', err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK' || !err.response) {
          setError(t('common:errors.networkError'));
        } else {
          setError(t('common:errors.serverError', { status: err.response.status }));
        }
      } else {
        setError(t('common:errors.loadInterviews'));
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            {t('common:status.loading')}
          </Typography>
        </Box>
      </Box>
    );
  }  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box        
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: '#ffffff',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ position: 'relative', zIndex: 2 }}>
            <AutoAwesomeIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              {t('pages:home.title')}
            </Typography>            <Typography variant="h5" sx={{ mb: 6, opacity: 0.95, maxWidth: 600, mx: 'auto' }}>
              {t('pages:home.subtitle')}
            </Typography><Button
              component={Link}
              to="/mock-interview"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              sx={{
                mt: 4,
                py: 2,
                px: 4,
                borderRadius: 8,
                backgroundColor: '#ffffff',
                color: '#1a1a1a',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: `0 8px 32px ${alpha('#ffffff', 0.4)}`,
                border: '2px solid rgba(255,255,255,0.8)',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 40px ${alpha('#ffffff', 0.5)}`,
                  color: '#0f172a',
                  border: '2px solid rgba(255,255,255,1)'
                },
                transition: 'all 0.3s ease'
              }}            >
              {t('pages:home.createNewInterview')}
            </Button>
          </Box>
        </Container>

        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.5
          }}
        />      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: 24
              }
            }}
          >
            {error}
          </Alert>
        )}        {/* Interview Cards Grid */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
            gap: 3,
            mb: 4
          }}
        >
          {/* Existing Interviews */}
          {interviews.map((interview, index) => (
            <Card 
              key={interview.id} 
              elevation={0}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 40px ${alpha(theme.palette.grey[400], 0.15)}`,
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar                    sx={{ 
                      width: 50, 
                      height: 50, 
                      mr: 2,
                      backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                      color: '#ffffff',
                      fontWeight: 600
                    }}
                  >
                    {interview.candidate_name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h2" fontWeight="600" noWrap>
                      {interview.candidate_name}
                    </Typography>                    <Typography variant="caption" color="text.secondary">
                      {formatDate(interview.created_at, i18n.language)}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box display="flex" alignItems="center" mb={2}>                  <Chip 
                    label={t('pages:home.questionsCount', { count: interview.questions.length })}
                    size="small"
                    color="primary"
                    variant="outlined"
                    icon={<AssessmentIcon />}
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('pages:home.questionsPreview')}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    backgroundColor: alpha(theme.palette.grey[100], 0.8),
                    p: 2,
                    borderRadius: 2,
                    fontStyle: 'italic',
                    border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
                  }}
                >
                  {interview.questions.slice(0, 2).join('、')}
                  {interview.questions.length > 2 && '...'}
                </Typography>
              </CardContent>
              
              <Divider />
              
              <CardActions sx={{ p: 3, gap: 1 }}>
                <Button
                  component={Link}
                  to={`/interview/${interview.id}`}
                  size="medium"
                  startIcon={<AssessmentIcon />}
                  sx={{ borderRadius: 2 }}                >
                  {t('common:buttons.details')}
                </Button>
                <Button
                  component={Link}
                  to={`/take-interview/${interview.id}`}
                  size="medium"
                  variant="contained"
                  startIcon={<PlayIcon />}
                  sx={{ 
                    borderRadius: 2,
                    ml: 'auto',
                    fontWeight: 600
                  }}                >
                  {t('common:buttons.startInterview')}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>

        {/* Empty State */}
        {interviews.length === 0 && !loading && (
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              backgroundColor: alpha(theme.palette.grey[50], 0.8),
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />            <Typography variant="h5" gutterBottom fontWeight="600">
              {t('pages:home.noInterviews')}
            </Typography>            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              {t('pages:home.noInterviews')}
            </Typography>
            <Button
              component={Link}
              to="/mock-interview"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 6,
                py: 2,
                px: 4,
                fontWeight: 600,
                fontSize: '1.1rem'
              }}            >
              {t('pages:home.createNewInterview')}
            </Button>
          </Paper>
        )}
      </Container>      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label={t('common:accessibility.createInterview')}
        sx={{ 
          position: 'fixed', 
          bottom: 32, 
          right: 32,
          width: 64,
          height: 64,
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`
          },
          transition: 'all 0.3s ease'
        }}
        component={Link}
        to="/mock-interview"
      >
        <AddIcon sx={{ fontSize: 32 }} />
      </Fab>
    </Box>
  );
};

export default Home;
