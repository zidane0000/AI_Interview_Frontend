import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../utils/dateFormat';
import {
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  Person as PersonIcon,
  Quiz as QuizIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { interviewApi } from '../services/api';
import type { Interview } from '../types';

const InterviewDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);  const [error, setError] = useState<string | null>(null);

  const loadInterview = useCallback(async (interviewId: string) => {
    try {
      setLoading(true);
      const data = await interviewApi.getInterview(interviewId);
      setInterview(data);
    } catch (err) {
      setError(t('common:errors.loadInterview'));
      console.error('Error loading interview:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (id) {
      loadInterview(id);
    }
  }, [id, loadInterview]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !interview) {
    return (
      <Box>        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {t('pages:interviewDetail.title')}
          </Typography>
        </Box>
        <Alert severity="error">
          {error || t('pages:interviewDetail.interviewNotFound')}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>      <Box display="flex" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {t('pages:interviewDetail.title')}
          </Typography>
        </Box>
      </Box>
      
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Box>
          <Paper sx={{ p: 3 }}>            <Box mb={3}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                {t('pages:interviewDetail.candidate')}
              </Typography>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
                {interview.candidate_name}
              </Typography>              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 1, fontSize: 16 }} />
                {t('pages:interviewDetail.createdAt')} {formatDate(interview.created_at, i18n.language)}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <QuizIcon sx={{ mr: 1, color: 'primary.main' }} />
                {t('pages:interviewDetail.questions')} ({interview.questions.length})
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('pages:interviewDetail.questionsDescription')}
              </Typography>
              
              {interview.questions.map((question, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="flex-start">
                      <Chip
                        label={`Q${index + 1}`}
                        size="small"
                        color="primary"
                        sx={{ mr: 2, mt: 0.5, minWidth: '40px' }}
                      />
                      <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {question}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>          </Paper>
        </Box>

        <Box>          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 {t('pages:interviewDetail.interviewSummary')}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('pages:interviewDetail.interviewId')}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {interview.id}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('pages:interviewDetail.numberOfQuestions')}
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {interview.questions.length}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('pages:interviewDetail.estimatedDuration')}
                </Typography>
                <Typography variant="body1">
                  {Math.ceil(interview.questions.length * 2)} - {Math.ceil(interview.questions.length * 3)} {t('pages:interviewDetail.minutes')}
                </Typography>
              </Box><Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PlayIcon />}
                onClick={() => navigate(`/take-interview/${interview.id}`)}
              >
                {t('pages:interviewDetail.startInterview')}
              </Button>
            </CardContent>
          </Card>          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 {t('pages:interviewDetail.instructions')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(t('pages:interviewDetail.instructionsList', { returnObjects: true }) as string[]).map((instruction: string, index: number) => (
                  <React.Fragment key={index}>
                    • {instruction}
                    {index < (t('pages:interviewDetail.instructionsList', { returnObjects: true }) as string[]).length - 1 && <br />}
                  </React.Fragment>
                ))}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default InterviewDetail;
