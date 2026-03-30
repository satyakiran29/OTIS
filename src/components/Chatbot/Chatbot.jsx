import React, { useState, useRef, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import baseAxios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Namaskaram! I am your Temple Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSend = async (messageText = input) => {
        if (!messageText.trim()) return;

        // Add user message
        const newMessages = [...messages, { sender: 'user', text: messageText }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            // Attempt to call the Local Chat API instead of the cloud deployment
            const response = await baseAxios.post('http://localhost:5000/api/chat', { message: messageText });
            setMessages([...newMessages, { sender: 'bot', text: response.data.reply }]);
        } catch (error) {
            // Provide a graceful fallback to prevent app crashing if production API lacks /chat
            console.error('Chat API Error:', error);
            let errorText = "I apologize, but our temple communication lines are currently busy. Please try again later.";
            if (error.response?.status === 404) {
                errorText = "I'm sorry, my Artificial Intelligence module hasn't been deployed to the live server yet! Please test me on the local backend.";
            }
            setMessages([...newMessages, { sender: 'bot', text: errorText }]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickReplies = [
        "What are the temple timings?",
        "Are there any upcoming events?",
        "How can I book a Seva?",
        "How can I make a donation?"
    ];

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'open' : 'closed'}`}>
            {!isOpen && (
                <button className="chatbot-toggle-btn" onClick={() => setIsOpen(true)}>
                    <span className="chatbot-icon">💬</span>
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            <span className="bot-avatar">🛕</span> Temple Assistant
                        </div>
                        <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>✖</button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-bubble ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chat-bubble bot typing">
                                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length === 1 && (
                        <div className="quick-replies">
                            {quickReplies.map((reply, i) => (
                                <button key={i} className="quick-reply-btn" onClick={() => handleSend(reply)}>
                                    {reply}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="chatbot-input-area">
                        <input
                            type="text"
                            placeholder="Ask me something..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="chatbot-send-btn" onClick={() => handleSend()}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
