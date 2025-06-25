import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logger } from '../utils/logger';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  alpha,
  Card,
  CardContent,
  Chip,
  Alert,
  IconButton,
  Divider
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import { interviewApi } from '../services/api';

const MockInterview: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  // Resume and job description state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [interviewType, setInterviewType] = useState('general');
  const [dragOver, setDragOver] = useState(false);
  
  // Question management state (from CreateInterview)
  const [candidateName, setCandidateName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const theme = useTheme();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
      setResumeFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  // Question management functions (from CreateInterview)
  const addQuestion = () => {
    if (currentQuestion.trim()) {
      setQuestions([...questions, currentQuestion.trim()]);
      setCurrentQuestion('');
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };  // Submit interview (merged functionality)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      setError('Please provide candidate name');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // If no questions provided, use default AI-generated questions based on interview type
      let finalQuestions = questions;
      
      if (questions.length === 0) {
        switch (interviewType) {
          case 'technical':
            finalQuestions = [
              'Tell me about your technical background and experience.',
              'Describe a challenging technical problem you solved recently.',
              'How do you approach debugging and troubleshooting?',
              'What technologies are you most excited about learning?',
              'Walk me through your development process for a new feature.'
            ];
            break;
          case 'behavioral':
            finalQuestions = [
              'Tell me about a time when you had to work under pressure.',
              'Describe a situation where you had to resolve a conflict with a colleague.',
              'Give me an example of when you showed leadership.',
              'Tell me about a time you failed and what you learned from it.',
              'How do you handle feedback and criticism?'
            ];
            break;
          default: // general
            finalQuestions = [
              'Tell me about yourself and your background.',
              'What are your greatest strengths and how do they apply to this role?',
              'Describe a challenging situation you faced and how you handled it.',
              'Where do you see yourself professionally in the next few years?',
              'Do you have any questions for us?'
            ];
        }
      }
      const interview = await interviewApi.createInterview({
        candidate_name: candidateName.trim(),
        questions: finalQuestions,
        interview_type: interviewType,
        interview_language: (i18n.language === 'zh-TW' ? 'zh-TW' : 'en') as 'en' | 'zh-TW',
        job_description: jobDescription.trim() || undefined
      });
      navigate(`/interview/${interview.id}`);
    } catch (err) {
      setError('Failed to create interview. Please try again.');
      logger.error('Error creating interview', {
        component: 'MockInterview',
        action: 'handleSubmit',
        data: err
      });
    } finally {
      setLoading(false);
    }
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'general': return <BusinessIcon />;
      case 'technical': return <CodeIcon />;
      case 'behavioral': return <PsychologyIcon />;
      default: return <BusinessIcon />;
    }
  };

  const getInterviewTypeColor = (type: string) => {
    switch (type) {
      case 'general': return theme.palette.primary.main;
      case 'technical': return theme.palette.success.main;
      case 'behavioral': return theme.palette.warning.main;
      default: return theme.palette.primary.main;
    }
  };

  return (    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: '#ffffff',
          py: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(0deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <IconButton onClick={() => navigate('/')} sx={{ mr: 2, color: '#ffffff' }}>
                <ArrowBackIcon />
              </IconButton>
              <PsychologyIcon sx={{ fontSize: 64, opacity: 0.9 }} />
            </Box>            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {t('pages:mockInterview.title')}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 600, mx: 'auto' }}>
              {t('pages:mockInterview.subtitle')}
            </Typography>
          </Box>
        </Container>      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box 
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 4,
            }}
          >
            {/* Main Content */}
            <Box sx={{ display: 'grid', gap: 4 }}>
                {/* Candidate Information */}
              <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}` }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    {t('pages:mockInterview.candidateInfo')}
                  </Typography>
                  <TextField
                    fullWidth
                    label={t('pages:mockInterview.candidateName')}
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder={t('pages:mockInterview.candidateNamePlaceholder')}
                    required
                    sx={{ 
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </CardContent>
              </Card>              {/* Resume Upload Section */}
              <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}` }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon color="primary" />
                    {t('pages:mockInterview.resumeUpload')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('pages:mockInterview.resumeSupported')}
                  </Typography>

                  <Paper
                    sx={{
                      border: `2px dashed ${dragOver ? theme.palette.primary.main : alpha(theme.palette.grey[400], 0.5)}`,
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      backgroundColor: dragOver ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('resume-upload')?.click()}
                  >
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.png"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />                    {resumeFile ? (
                      <Box>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {t('pages:mockInterview.resumeUploaded')}
                        </Typography>
                        <Chip 
                          label={resumeFile.name} 
                          color="primary" 
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    ) : (
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {t('pages:mockInterview.resumeDropzone')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('pages:mockInterview.resumeFormats')}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </CardContent>
              </Card>              {/* Job Description Section */}
              <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}` }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="primary" />
                    {t('pages:mockInterview.jobDescription')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('pages:mockInterview.jobDescriptionSubtitle')}
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder={t('pages:mockInterview.jobDescriptionPlaceholder')}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </CardContent>
              </Card>              {/* Interview Questions Section */}
              <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}` }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QuizIcon color="primary" />
                    {t('pages:mockInterview.customQuestions', { count: questions.length })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('pages:mockInterview.customQuestionsSubtitle')}
                  </Typography>
                    <Box display="flex" gap={1} mb={2}>
                    <TextField
                      fullWidth
                      label={t('pages:mockInterview.addQuestion')}
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      placeholder={t('pages:mockInterview.questionPlaceholder')}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={addQuestion}
                      disabled={!currentQuestion.trim()}
                      sx={{ minWidth: '100px', borderRadius: 2 }}
                    >
                      <AddIcon />
                    </Button>
                  </Box>                  {questions.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('pages:mockInterview.questionsList')}
                      </Typography>
                      {questions.map((question, index) => (
                        <Chip
                          key={index}
                          label={`${index + 1}. ${question}`}
                          onDelete={() => removeQuestion(index)}
                          deleteIcon={<DeleteIcon />}
                          sx={{ m: 0.5, maxWidth: '100%' }}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}                  {/* Interview Type Section */}                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PsychologyIcon color="primary" />
                    {t('pages:mockInterview.interviewType')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('pages:mockInterview.interviewTypeSubtitle')}
                  </Typography>

                  <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
                    <RadioGroup
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                      sx={{ gap: 2 }}
                    >                      {[
                        { 
                          value: 'general', 
                          label: t('pages:mockInterview.interviewTypes.general'), 
                          description: t('pages:mockInterview.interviewTypes.generalDesc') 
                        },
                        { 
                          value: 'technical', 
                          label: t('pages:mockInterview.interviewTypes.technical'), 
                          description: t('pages:mockInterview.interviewTypes.technicalDesc') 
                        },
                        { 
                          value: 'behavioral', 
                          label: t('pages:mockInterview.interviewTypes.behavioral'), 
                          description: t('pages:mockInterview.interviewTypes.behavioralDesc') 
                        }
                      ].map((option) => (
                        <Paper
                          key={option.value}
                          sx={{
                            p: 2,
                            border: `2px solid ${interviewType === option.value ? getInterviewTypeColor(option.value) : alpha(theme.palette.grey[300], 0.5)}`,
                            borderRadius: 2,
                            backgroundColor: interviewType === option.value ? alpha(getInterviewTypeColor(option.value), 0.05) : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => setInterviewType(option.value)}
                        >
                          <FormControlLabel
                            value={option.value}
                            control={
                              <Radio 
                                sx={{ 
                                  color: getInterviewTypeColor(option.value),
                                  '&.Mui-checked': {
                                    color: getInterviewTypeColor(option.value)
                                  }
                                }} 
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <Box sx={{ color: getInterviewTypeColor(option.value) }}>
                                  {getInterviewTypeIcon(option.value)}
                                </Box>
                                <Box>
                                  <Typography variant="body1" fontWeight="600">
                                    {option.label}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {option.description}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            sx={{ margin: 0, width: '100%' }}
                          />
                        </Paper>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>                <Button
                  component={Link}
                  to="/"
                  variant="outlined"
                  size="large"
                  disabled={loading}
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  {t('pages:mockInterview.cancel')}
                </Button>                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!candidateName.trim() || loading}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    minWidth: '150px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                    }
                  }}
                >
                  {loading ? t('pages:mockInterview.creating') : t('pages:mockInterview.createInterview')}
                </Button>
              </Box>              {!candidateName.trim() && (
                <Alert 
                  severity="info" 
                  sx={{ borderRadius: 2, mt: 2 }}
                >
                  {t('pages:mockInterview.fillCandidateName')}
                </Alert>
              )}
            </Box>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default MockInterview;
