import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you with your hotel booking today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  // Function to handle user message
  const handleUserMessage = async () => {
    if (!input) return;

    // Add the user's message to the chat
    setMessages([...messages, { sender: 'user', text: input }]);
    setIsLoading(true); // Set loading to true while waiting for response

    try {
      // Fetch all responses from the mock API
      const response = await axios.get(`http://localhost:4000/responses`);
      
      // Look for the first response whose keywords match the user input
      let matchedResponse = "Sorry, I couldn't understand that. Can you please contact us through mail or phone?"; // Default response

      // Check each response for matching keywords
      for (let item of response.data) {
        for (let keyword of item.keywords) {
          // If any keyword matches part of the user input (case insensitive), show the related response
          if (input.toLowerCase().includes(keyword.toLowerCase())) {
            matchedResponse = item.response;
            break; // Stop checking after the first match
          }
        }
        if (matchedResponse !== "Sorry, I couldn't understand that. Can you please contact us through mail or phone?") {
          break;
        }
      }

      // Add bot's response to the chat
      setMessages([
        ...messages,
        { sender: 'user', text: input },
        { sender: 'bot', text: matchedResponse }
      ]);
    } catch (err) {
      console.error('Error fetching response from the backend:', err);
      setMessages([
        ...messages,
        { sender: 'bot', text: 'Sorry, there was an error. Please try again later.' }
      ]);
    }

    // Clear the input field and stop the loading state
    setInput('');
    setIsLoading(false); // Set loading to false after processing
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: '300px',
        height: '400px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 2,
        padding: '10px',
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" sx={{ textAlign: 'center' }}>Chat with us</Typography>
      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.sender === 'bot' ? 'left' : 'right' }}>
            <Typography
              variant="body2"
              sx={{
                backgroundColor: message.sender === 'bot' ? '#f1f1f1' : '#007bff',
                color: message.sender === 'bot' ? '#000' : '#fff',
                borderRadius: '8px',
                padding: '5px',
                marginBottom: '5px',
                maxWidth: '80%',
              }}
            >
              {message.text}
            </Typography>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress size={24} /> {/* Show a spinner when loading */}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleUserMessage()}
          placeholder="Type a message..."
          disabled={isLoading} // Disable input while loading
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUserMessage}
          sx={{ marginLeft: '10px' }}
          disabled={isLoading} // Disable button while loading
        >
          Send
        </Button>
      </div>
      <Button
        variant="text"
        onClick={onClose}
        sx={{ position: 'absolute', top: 5, right: 5 }}
      >
        X
      </Button>
    </Box>
  );
};

export default Chatbot;
