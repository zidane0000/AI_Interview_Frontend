import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { interviewApi } from '../services/api';
import type { Interview, ChatInterviewSession } from '../types';

const TakeInterview: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [chatSession, setChatSession] = useState<ChatInterviewSession | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef(false);
  useEffect(() => {
    if (id && !initializingRef.current) {
      initializingRef.current = true;
      initializeInterview(id);
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [chatSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeInterview = async (interviewId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Load interview details
      const interviewData = await interviewApi.getInterview(interviewId);
      setInterview(interviewData);
      
      // Start chat session
      const session = await interviewApi.startChatSession(interviewId);
      setChatSession(session);
    } catch (err) {
      setError('Failed to start interview session');
      console.error('Error initializing interview:', err);
    } finally {
      setLoading(false);
    }
  };  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !chatSession || sending) return;

    const messageToSend = currentMessage.trim();
    
    try {
      setSending(true);
      setError(null);

      // 立即顯示用戶訊息
      const userMessage = {
        id: `temp_msg_${Date.now()}`,
        type: 'user' as const,
        content: messageToSend,
        timestamp: new Date().toISOString()
      };

      setChatSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, userMessage]
      } : null);

      // 清空輸入框
      setCurrentMessage('');      // 發送訊息到 API 並等待 AI 回應
      const response = await interviewApi.sendMessage(chatSession.id, {
        interview_id: chatSession.interview_id,
        message: messageToSend
      });

      // 添加 AI 回應到聊天記錄並更新會話狀態
      if (response.ai_response) {
        const aiResponse = response.ai_response;
        setChatSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, aiResponse],
          status: response.session_status === 'completed' ? 'completed' : prev.status
        } : null);
      } else {
        // 如果沒有 AI 回應，仍然要更新會話狀態
        setChatSession(prev => prev ? {
          ...prev,
          status: response.session_status === 'completed' ? 'completed' : prev.status
        } : null);
      }

    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
      // 如果發生錯誤，恢復輸入內容
      setCurrentMessage(messageToSend);
    } finally {
      setSending(false);
    }
  };

  const handleEndInterview = async () => {
    if (!chatSession) return;

    try {
      setLoading(true);
      const evaluation = await interviewApi.endChatSession(chatSession.id);
      navigate(`/evaluation/${evaluation.id}`);
    } catch (err) {
      setError('Failed to end interview. Please try again.');
      console.error('Error ending interview:', err);
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />        <Typography variant="body1" sx={{ ml: 2 }}>
          {interview ? t('pages:takeInterview.startingSession') : t('pages:takeInterview.loadingInterview')}
        </Typography>
      </Box>
    );
  }

  if (error || !interview || !chatSession) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>          <Typography variant="h4" component="h1">
            {t('pages:takeInterview.title')}
          </Typography>
        </Box>
        <Alert severity="error">
          {error || t('pages:takeInterview.sessionError')}
        </Alert>
      </Box>
    );
  }

  const isSessionCompleted = chatSession.status === 'completed';

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 0 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => navigate(`/interview/${interview.id}`)} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>            <Box>
              <Typography variant="h5" component="h1">
                {t('pages:takeInterview.interviewTitle', { candidate: interview.candidate_name })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isSessionCompleted ? t('pages:takeInterview.completed') : t('pages:takeInterview.inProgress')}
              </Typography>
            </Box>
          </Box>
          
          {isSessionCompleted && (
            <Button
              variant="contained"
              color="success"              onClick={handleEndInterview}
              disabled={loading}
            >
              {loading ? t('pages:takeInterview.processing') : t('pages:takeInterview.viewResults')}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Chat Messages */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2,
          backgroundColor: 'grey.50'
        }}
      >
        {chatSession.messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                maxWidth: '70%',
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <Avatar
                sx={{
                  bgcolor: message.type === 'user' ? 'primary.main' : 'secondary.main',
                  mx: 1,
                  width: 32,
                  height: 32
                }}
              >
                {message.type === 'user' ? <PersonIcon /> : <AIIcon />}
              </Avatar>
              
              <Card
                sx={{
                  bgcolor: message.type === 'user' ? 'primary.main' : 'white',
                  color: message.type === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  boxShadow: 1
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.7, 
                      mt: 1, 
                      display: 'block',
                      fontSize: '0.75rem'
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        ))}
        
        {sending && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 1, width: 32, height: 32 }}>
                <AIIcon />
              </Avatar>
              <Card sx={{ bgcolor: 'white', p: 2 }}>                <Typography variant="body2" color="text.secondary">
                  {t('pages:takeInterview.aiTyping')}
                </Typography>
                <CircularProgress size={16} sx={{ ml: 1 }} />
              </Card>
            </Box>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      {!isSessionCompleted && (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 0 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box display="flex" gap={1}>            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={t('pages:takeInterview.responsePlaceholder')}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || sending}
              sx={{
                minWidth: '100px',
                borderRadius: 3,
                height: 'fit-content',
                alignSelf: 'flex-end'
              }}
            >
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Press Enter to send, Shift+Enter for new line
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TakeInterview;
