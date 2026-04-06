import React, { useState, useRef, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import baseAxios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('selection');
    const [isTawkActive, setIsTawkActive] = useState(false);
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
        if (isOpen && view === 'ai') scrollToBottom();
    }, [messages, isOpen, isTyping, view]);

    useEffect(() => {
        // Embed Tawk.to script
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();
        
        window.Tawk_API.onLoad = function() {
            window.Tawk_API.hideWidget();
        };
        
        window.Tawk_API.onChatMinimized = function() {
            window.Tawk_API.hideWidget();
            setIsTawkActive(false);
        };

        const s1 = document.createElement("script");
        const s0 = document.getElementsByTagName("script")[0];
        if (!document.querySelector('script[src="https://embed.tawk.to/69d3b0152bcfb31c3daa295c/1jlheflvh"]')) {
            s1.async = true;
            s1.src = 'https://embed.tawk.to/69d3b0152bcfb31c3daa295c/1jlheflvh';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            if (s0 && s0.parentNode) {
                s0.parentNode.insertBefore(s1, s0);
            } else {
                document.head.appendChild(s1);
            }
        }
    }, []);

    const handleCustomerCareClick = () => {
        if (window.Tawk_API && window.Tawk_API.maximize) {
            window.Tawk_API.showWidget();
            window.Tawk_API.maximize();
            setIsOpen(false);
            setView('selection');
            setIsTawkActive(true);
        } else {
            alert('Customer care chat is still loading. Please try again in a moment.');
        }
    };

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
            {!isOpen && !isTawkActive && (
                <button className="chatbot-toggle-btn" onClick={() => { setIsOpen(true); setView('selection'); }}>
                    <span className="chatbot-icon">💬</span>
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            {view === 'ai' ? (
                                <><span className="bot-avatar">🛕</span> Temple Assistant</>
                            ) : (
                                <><span className="bot-avatar">💬</span> Need Help?</>
                            )}
                        </div>
                        {view === 'ai' ? (
                            <button className="chatbot-close-btn" onClick={() => setView('selection')}>←</button>
                        ) : (
                            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>✖</button>
                        )}
                    </div>

                    {view === 'selection' ? (
                        <div className="chatbot-selection">
                            <div className="selection-message">How would you like to get help?</div>
                            <button className="selection-btn" onClick={() => setView('ai')}>
                                <span className="selection-icon">🤖</span>
                                <div>
                                    <div className="selection-title">AI Assistant</div>
                                    <div className="selection-desc">Get instant answers to common questions</div>
                                </div>
                            </button>
                            <button className="selection-btn" onClick={handleCustomerCareClick}>
                                <span className="selection-icon">🎧</span>
                                <div>
                                    <div className="selection-title">Customer Care</div>
                                    <div className="selection-desc">Talk to our live support team</div>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Chatbot;
