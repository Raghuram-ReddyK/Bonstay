import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Avatar, 
  Chip,
  Fade,
  Slide,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Send as SendIcon, 
  Close as CloseIcon, 
  SupportAgent as BotIcon,
  Person as UserIcon,
  SmartToy as AIIcon
} from '@mui/icons-material';
import axios from 'axios';
import { getApiUrl } from './config/apiConfig';

const TypingIndicator = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
      <BotIcon fontSize="small" />
    </Avatar>
    <Paper 
      elevation={2} 
      sx={{ 
        p: 1.5, 
        borderRadius: 3,
        bgcolor: 'grey.100',
        minWidth: 60
      }}
    >
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
              '@keyframes pulse': {
                '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
                '40%': { transform: 'scale(1)', opacity: 1 },
              }
            }}
          />
        ))}
      </Box>
    </Paper>
  </Box>
);

const MessageBubble = ({ message, isUser }) => (
  <Fade in={true} timeout={500}>
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        alignItems: 'flex-end',
        gap: 1
      }}
    >
      {!isUser && (
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          <BotIcon fontSize="small" />
        </Avatar>
      )}
      
      <Paper
        elevation={3}
        sx={{
          p: 2,
          maxWidth: '75%',
          borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
          background: isUser 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          color: isUser ? 'white' : 'text.primary',
          boxShadow: isUser 
            ? '0 4px 12px rgba(102, 126, 234, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          '&::before': isUser ? {} : {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: -8,
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #f5f7fa',
          }
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            lineHeight: 1.4,
            fontWeight: isUser ? 500 : 400
          }}
        >
          {message.text}
        </Typography>
        
        <Typography 
          variant="caption" 
          sx={{ 
            opacity: 0.7, 
            fontSize: '0.7rem',
            mt: 0.5,
            display: 'block'
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Typography>
      </Paper>
      
      {isUser && (
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
          <UserIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  </Fade>
);

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hello! 👋 Welcome to Bonstay Hotel! I\'m here to help you with your booking needs. How can I assist you today?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const simulateTyping = (responseText) => {
    setIsTyping(true);
    
    // Simulate realistic typing delay based on message length
    const typingDelay = Math.min(Math.max(responseText.length * 50, 1000), 3000);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: responseText,
        timestamp: Date.now()
      }]);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleUserMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: 'user',
      text: input.trim(),
      timestamp: Date.now()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Show typing indicator
      setIsTyping(true);
      
      const response = await axios.get(getApiUrl('/responses'));
      
      let matchedResponse = "I apologize, but I couldn't understand that specific request. 🤔 Could you please rephrase your question or contact our support team at support@bonstay.com or call us at +1-800-BONSTAY for immediate assistance?";

      // Enhanced keyword matching
      for (let item of response.data) {
        for (let keyword of item.keywords) {
          if (input.toLowerCase().includes(keyword.toLowerCase())) {
            matchedResponse = item.response;
            break;
          }
        }
        if (matchedResponse !== "I apologize, but I couldn't understand that specific request. 🤔 Could you please rephrase your question or contact our support team at support@bonstay.com or call us at +1-800-BONSTAY for immediate assistance?") {
          break;
        }
      }

      // Add helpful suggestions for common topics
      if (matchedResponse.includes("couldn't understand")) {
        matchedResponse += "\n\n💡 Try asking about:\n• Room bookings\n• Hotel amenities\n• Pricing information\n• Cancellation policies\n• Special offers";
      }

      simulateTyping(matchedResponse);

    } catch (err) {
      console.error('Error fetching response:', err);
      simulateTyping("I'm experiencing some technical difficulties right now. 😔 Please try again in a moment or contact our support team directly. We're here to help!");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage();
    }
  };

  const quickActions = [
    "Check room availability",
    "View hotel amenities", 
    "Pricing information",
    "Contact support"
  ];

  return (
    <Slide direction="up" in={isOpen} timeout={300}>
      <Paper
        elevation={24}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: { xs: '90vw', sm: 400 },
          height: { xs: '80vh', sm: 500 },
          borderRadius: 4,
          overflow: 'hidden',
          zIndex: 1300,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              <AIIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                Bonstay Assistant
              </Typography>
              <Chip 
                label="Online" 
                size="small" 
                sx={{ 
                  bgcolor: '#4caf50', 
                  color: 'white',
                  height: 20,
                  fontSize: '0.7rem'
                }} 
              />
            </Box>
          </Box>
          
          <Tooltip title="Close chat">
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Messages Area */}
        <Box 
          sx={{ 
            height: 'calc(100% - 140px)',
            overflowY: 'auto',
            p: 1,
            bgcolor: 'white',
            backgroundImage: 'linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '3px',
            },
          }}
        >
          {messages.map((message, index) => (
            <MessageBubble 
              key={index} 
              message={message} 
              isUser={message.sender === 'user'} 
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          {messages.length === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, px: 2 }}>
                Quick actions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, px: 2 }}>
                {quickActions.map((action, index) => (
                  <Chip
                    key={index}
                    label={action}
                    size="small"
                    clickable
                    onClick={() => setInput(action)}
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'white',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            gap: 1,
            alignItems: 'flex-end'
          }}
        >
          <TextField
            ref={inputRef}
            variant="outlined"
            size="small"
            fullWidth
            multiline
            maxRows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isTyping}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'grey.50',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={handleUserMessage}
            disabled={!input.trim() || isTyping}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'primary.dark'
              },
              '&:disabled': {
                bgcolor: 'grey.300'
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Slide>
  );
};

export default Chatbot;