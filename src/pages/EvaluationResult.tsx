import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../utils/dateFormat';
import {
  Paper,
  Typography,
  Button,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { interviewApi } from '../services/api';
import type { Evaluation } from '../types';

const EvaluationResult: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  useEffect(() => {
    if (id) {
      loadEvaluation(id);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadEvaluation = async (evaluationId: string) => {
    try {
      setLoading(true);
      const data = await interviewApi.getEvaluation(evaluationId);
      setEvaluation(data);    } catch (err) {
      setError(t('pages:evaluationResult.failedToLoad'));
      console.error('Error loading evaluation:', err);
    } finally {
      setLoading(false);
    }
  };
  const formatDateLocal = (dateString: string) => {
    return formatDate(dateString, i18n.language);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };
  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return t('pages:evaluationResult.scoreLabels.excellent');
    if (score >= 0.8) return t('pages:evaluationResult.scoreLabels.veryGood');
    if (score >= 0.7) return t('pages:evaluationResult.scoreLabels.good');
    if (score >= 0.6) return t('pages:evaluationResult.scoreLabels.fair');
    return t('pages:evaluationResult.scoreLabels.needsImprovement');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !evaluation) {
    return (
      <Box>        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {t('pages:evaluationResult.title')}
          </Typography>
        </Box>
        <Alert severity="error">
          {error || t('pages:evaluationResult.evaluationNotFound')}
        </Alert>
      </Box>
    );
  }

  const scorePercentage = Math.round(evaluation.score * 100);

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>            <Typography variant="h4" component="h1">
              {t('pages:evaluationResult.title')}
            </Typography>            <Typography variant="subtitle1" color="text.secondary">
              {t('pages:evaluationResult.completedOn')} {formatDateLocal(evaluation.created_at)}
            </Typography>
          </Box>
        </Box>
        <CheckIcon sx={{ fontSize: 48, color: 'success.main' }} />      </Box>
      
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <AssessmentIcon sx={{ mr: 2, color: 'primary.main' }} />              <Typography variant="h5" component="h2">
                {t('pages:evaluationResult.overallPerformance')}
              </Typography>
            </Box>

            <Card variant="outlined" sx={{ mb: 3, backgroundColor: `${getScoreColor(evaluation.score)}.50` }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h2" color={`${getScoreColor(evaluation.score)}.main`} gutterBottom>
                  {scorePercentage}%
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {getScoreLabel(evaluation.score)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={scorePercentage}
                  color={getScoreColor(evaluation.score)}
                  sx={{ mt: 2, height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>

            <Divider sx={{ my: 3 }} />

            <Box>              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                {t('pages:evaluationResult.aiFeedback')}
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {evaluation.feedback}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📊 {t('pages:evaluationResult.performanceBreakdown')}
            </Typography>
            
            <Box 
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                gap: 2,
              }}
            >
              <Box>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary.main">
                    {scorePercentage}
                  </Typography>                  <Typography variant="caption" color="text.secondary">
                    {t('pages:evaluationResult.overallScore')}
                  </Typography>
                </Card>
              </Box>
              <Box>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="info.main">
                    A+
                  </Typography>                  <Typography variant="caption" color="text.secondary">
                    {t('pages:evaluationResult.grade')}
                  </Typography>
                </Card>
              </Box>
              <Box>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main">
                    ✓
                  </Typography>                  <Typography variant="caption" color="text.secondary">
                    {t('pages:evaluationResult.completed')}
                  </Typography>
                </Card>
              </Box>
              <Box>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main">
                    AI
                  </Typography>                  <Typography variant="caption" color="text.secondary">
                    {t('pages:evaluationResult.evaluated')}
                  </Typography>
                </Card>
              </Box>
            </Box>          </Paper>
        </Box>

        <Box>
          <Card>
            <CardContent>              <Typography variant="h6" gutterBottom>
                📋 {t('pages:evaluationResult.evaluationDetails')}
              </Typography>
              
              <Box sx={{ mb: 2 }}>                <Typography variant="body2" color="text.secondary">
                  {t('pages:evaluationResult.evaluationId')}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {evaluation.id}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>                <Typography variant="body2" color="text.secondary">
                  {t('pages:evaluationResult.interviewId')}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {evaluation.interview_id}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>                <Typography variant="body2" color="text.secondary">
                  {t('pages:evaluationResult.score')}
                </Typography>
                <Chip 
                  label={`${scorePercentage}% - ${getScoreLabel(evaluation.score)}`}
                  color={getScoreColor(evaluation.score)}
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>                <Typography variant="body2" color="text.secondary">
                  {t('pages:evaluationResult.evaluationDate')}
                </Typography>
                <Typography variant="body1">
                  {formatDateLocal(evaluation.created_at)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 1 }}              >
                {t('pages:evaluationResult.backToHome')}
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>              <Typography variant="h6" gutterBottom>
                🎯 {t('pages:evaluationResult.nextSteps')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('pages:evaluationResult.nextStepsDescription')}
                <br /><br />
                {(t('pages:evaluationResult.nextStepsList', { returnObjects: true }) as string[]).map((step: string, index: number) => (
                  <React.Fragment key={index}>
                    • {step}
                    {index < (t('pages:evaluationResult.nextStepsList', { returnObjects: true }) as string[]).length - 1 && <br />}
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

export default EvaluationResult;
