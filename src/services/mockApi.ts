import type {
  Interview,
  CreateInterviewRequest,
  SubmitEvaluationRequest,
  Evaluation,
  ListInterviewsResponse,
  ChatMessage,
  ChatInterviewSession,
  SendMessageRequest,
  SendMessageResponse,
} from '../types';

// Mock data
const mockInterviews: Interview[] = [
  {
    id: '1',
    candidate_name: '張小明',
    questions: [
      'Tell me about yourself and your background.',
      'What are your greatest strengths and weaknesses?',
      'Why are you interested in this position?'
    ],
    created_at: '2025-05-30T10:30:00Z'
  },
  {
    id: '2',
    candidate_name: '李美華',
    questions: [
      'Describe a challenging project you worked on.',
      'How do you handle stress and pressure?',
      'Where do you see yourself in 5 years?'
    ],
    created_at: '2025-05-29T14:20:00Z'
  }
];

const mockEvaluations: Evaluation[] = [
  {
    id: '1',
    interview_id: '1',
    answers: {
      'question_0': 'I am a software engineer with 5 years of experience in frontend development, particularly with React and TypeScript. I have worked on various projects from e-commerce platforms to enterprise applications.',
      'question_1': 'My greatest strength is my ability to learn quickly and adapt to new technologies. I am also very detail-oriented which helps me write clean, maintainable code. As for weaknesses, I sometimes spend too much time perfecting code when good enough would suffice, but I am working on balancing quality with efficiency.',
      'question_2': 'I am very interested in this position because it aligns perfectly with my career goals of working on innovative AI-driven products. Your company\'s focus on cutting-edge technology and the opportunity to work with a talented team really excites me.'
    },
    score: 0.85,
    feedback: 'Excellent performance! You demonstrated strong technical knowledge and communication skills. Your answers were well-structured and showed deep understanding of software development principles. Areas for improvement: Could provide more specific examples of past projects. Overall, you would be a great fit for our team.',
    created_at: '2025-05-30T11:45:00Z'
  },
  {
    id: '2',
    interview_id: '2',
    answers: {
      'question_0': 'I worked on a complex e-commerce platform where we had to integrate multiple payment systems and handle high traffic loads. It was challenging because of the strict deadline and technical requirements.',
      'question_1': 'I handle stress by breaking down tasks into smaller, manageable pieces and prioritizing them. I also make sure to take regular breaks and communicate with my team when I need support.',
      'question_2': 'This position offers great growth opportunities and the chance to work with modern technologies. I believe my skills would contribute well to your development team.'
    },
    score: 0.78,
    feedback: 'Good interview performance! You showed solid technical fundamentals and enthusiasm for learning. Your answers were clear and honest. Suggestions for improvement: Provide more specific examples of your achievements and impact in previous roles. Consider preparing more detailed stories about challenging projects you have worked on.',
    created_at: '2025-05-28T14:20:00Z'
  }
];

// Mock chat sessions for conversation-based interviews
const mockChatSessions: Record<string, ChatInterviewSession> = {};

// AI response templates for different types of questions
const aiQuestionTemplates = [
  "Let's start with a basic question: Tell me about yourself and your background.",
  "That's interesting! Can you describe a challenging project you've worked on recently?",
  "Great! How do you handle working under pressure or tight deadlines?",
  "I'd like to know more about your technical skills. What technologies are you most comfortable with?",
  "Can you walk me through your problem-solving approach when facing a difficult technical challenge?",
  "Tell me about a time when you had to learn something new quickly. How did you approach it?",
  "What motivates you in your work, and what kind of environment helps you perform your best?",
  "Do you have any questions about our company, the role, or our team culture?"
];

const generateAIResponse = (messageCount: number): string => {
  if (messageCount <= aiQuestionTemplates.length) {
    const index = messageCount - 1; // Adjust for 0-based array
    return aiQuestionTemplates[index] || aiQuestionTemplates[aiQuestionTemplates.length - 1];
  } else {
    return "Thank you for your comprehensive answers. Our interview is now complete. You'll receive detailed feedback and evaluation results shortly.";
  }
};

// Mock API functions
export const mockApi = {
  createInterview: async (data: CreateInterviewRequest): Promise<Interview> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newInterview: Interview = {
      id: Date.now().toString(),
      candidate_name: data.candidate_name,
      questions: data.questions,
      created_at: new Date().toISOString()
    };
    
    mockInterviews.unshift(newInterview);
    return newInterview;
  },

  getInterviews: async (): Promise<ListInterviewsResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      interviews: mockInterviews,
      total: mockInterviews.length
    };
  },

  getInterview: async (id: string): Promise<Interview> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const interview = mockInterviews.find(i => i.id === id);
    if (!interview) {
      throw new Error('Interview not found');
    }
    return interview;
  },

  submitEvaluation: async (data: SubmitEvaluationRequest): Promise<Evaluation> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newEvaluation: Evaluation = {
      id: Date.now().toString(),
      interview_id: data.interview_id,
      answers: data.answers,
      score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      feedback: 'Great answers! You demonstrated good communication skills and relevant experience.',
      created_at: new Date().toISOString()
    };
    
    mockEvaluations.push(newEvaluation);
    return newEvaluation;
  },

  getEvaluation: async (id: string): Promise<Evaluation> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const evaluation = mockEvaluations.find(e => e.id === id);
    if (!evaluation) {
      throw new Error('Evaluation not found');
    }
    return evaluation;
  },

  // Chat-based interview functions
  startChatSession: async (interviewId: string): Promise<ChatInterviewSession> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const session: ChatInterviewSession = {
      id: `chat_${Date.now()}`,
      interview_id: interviewId,
      messages: [
        {
          id: '1',
          type: 'ai',
          content: "Hello! Welcome to your interview. I'm excited to learn more about you and your background. Let's start with a basic question: Tell me about yourself and your background.",
          timestamp: new Date().toISOString()
        }
      ],
      status: 'active',
      created_at: new Date().toISOString()
    };
    
    mockChatSessions[session.id] = session;
    return session;
  },

  sendMessage: async (sessionId: string, data: SendMessageRequest): Promise<SendMessageResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const session = mockChatSessions[sessionId];
    if (!session) {
      throw new Error('Chat session not found');
    }

    // Create user message (for return value and AI generation, but frontend handles adding to UI)
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: data.message,
      timestamp: new Date().toISOString()
    };

    // Generate AI response based on current user message count + 1
    const currentUserCount = session.messages.filter(m => m.type === 'user').length + 1;
    const aiResponseContent = generateAIResponse(currentUserCount);
    
    const aiMessage: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      type: 'ai',
      content: aiResponseContent,
      timestamp: new Date().toISOString()
    };

    // Only add the messages to session for persistence (frontend handles UI updates)
    session.messages.push(userMessage, aiMessage);

    // Check if interview should end
    if (currentUserCount >= 8) {
      session.status = 'completed';
    }

    return {
      message: userMessage,
      ai_response: aiMessage
    };
  },

  getChatSession: async (sessionId: string): Promise<ChatInterviewSession> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const session = mockChatSessions[sessionId];
    if (!session) {
      throw new Error('Chat session not found');
    }
    return session;
  },

  endChatSession: async (sessionId: string): Promise<Evaluation> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const session = mockChatSessions[sessionId];
    if (!session) {
      throw new Error('Chat session not found');
    }

    session.status = 'completed';

    // Convert chat messages to answers for evaluation
    const answers: Record<string, string> = {};
    const userMessages = session.messages.filter(m => m.type === 'user');
    userMessages.forEach((msg, index) => {
      answers[`question_${index}`] = msg.content;
    });

    const evaluation: Evaluation = {
      id: `eval_${Date.now()}`,
      interview_id: session.interview_id,
      answers,
      score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      feedback: 'Excellent conversation! You provided thoughtful and detailed responses throughout our discussion. Your communication skills are strong, and you demonstrated good self-awareness and professional experience.',
      created_at: new Date().toISOString()
    };

    mockEvaluations.push(evaluation);
    return evaluation;
  }
};
