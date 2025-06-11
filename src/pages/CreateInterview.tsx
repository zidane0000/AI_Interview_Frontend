import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logger } from '../utils/logger';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  IconButton,
  Alert,
  Divider,
  Card,
  CardContent,
} from '@mui/material';

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import { interviewApi } from '../services/api';

const CreateInterview: React.FC = () => {
  const navigate = useNavigate();
  const [candidateName, setCandidateName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultQuestions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and weaknesses?",
    "Why are you interested in this position?",
    "Where do you see yourself in 5 years?",
    "Describe a challenging project you worked on.",
    "How do you handle stress and pressure?",
    "What motivates you in your work?",
    "Tell me about a time you worked in a team.",
  ];

  const addQuestion = () => {
    if (currentQuestion.trim() && !questions.includes(currentQuestion.trim())) {
      setQuestions([...questions, currentQuestion.trim()]);
      setCurrentQuestion('');
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addDefaultQuestion = (question: string) => {
    if (!questions.includes(question)) {
      setQuestions([...questions, question]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || questions.length === 0) {
      setError('Please provide candidate name and at least one question');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const interview = await interviewApi.createInterview({
        candidate_name: candidateName.trim(),
        questions,
      });

      navigate(`/interview/${interview.id}`);    } catch (err) {
      setError('Failed to create interview. Please try again.');
      logger.error('Error creating interview', {
        component: 'CreateInterview',
        action: 'handleSubmit',
        data: err
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Create New Interview
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>      )}      
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Box>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Box mb={3}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Candidate Information
                </Typography>
                <TextField
                  fullWidth
                  label="Candidate Name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter candidate's full name"
                  required
                  sx={{ mb: 2 }}
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box mb={3}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <QuizIcon sx={{ mr: 1 }} />
                  Interview Questions ({questions.length})
                </Typography>
                
                <Box display="flex" gap={1} mb={2}>
                  <TextField
                    fullWidth
                    label="Add a question"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
                  />
                  <Button
                    variant="contained"
                    onClick={addQuestion}
                    disabled={!currentQuestion.trim()}
                    sx={{ minWidth: '100px' }}
                  >
                    <AddIcon />
                  </Button>
                </Box>

                {questions.length > 0 && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Questions to be asked:
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
                )}

                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mt={3}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!candidateName.trim() || questions.length === 0 || loading}
                    sx={{ minWidth: '150px' }}
                  >
                    {loading ? 'Creating...' : 'Create Interview'}
                  </Button>
                </Box>
              </Box>
            </form>          </Paper>
        </Box>

        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 Suggested Questions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click to add these common interview questions:
              </Typography>
              <Box>
                {defaultQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    onClick={() => addDefaultQuestion(question)}
                    sx={{ 
                      m: 0.5, 
                      cursor: 'pointer',
                      maxWidth: '100%',
                      height: 'auto',
                      '& .MuiChip-label': {
                        whiteSpace: 'normal',
                        textAlign: 'left',
                        padding: '8px 12px',
                      }
                    }}
                    variant={questions.includes(question) ? "filled" : "outlined"}
                    color={questions.includes(question) ? "success" : "default"}
                    disabled={questions.includes(question)}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateInterview;
