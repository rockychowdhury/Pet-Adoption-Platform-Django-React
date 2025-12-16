import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Phone, Video, Info, Paperclip, Send, Image as ImageIcon, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConversationView = ({ conversation, onSendMessage }) => {
    const navigate = useNavigate();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation.messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
        // Reset height
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleInput = (e) => {
        setNewMessage(e.target.value);
        // Auto-expand
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-bg-surface md:rounded-r-3xl relative">
            {/* Header */}
            <div className="h-16 px-4 border-b border-border flex justify-between items-center bg-white z-10">
                <div className="flex items-center gap-3">
                    <button className="md:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary" onClick={() => navigate('/messages')}>
                        <ArrowLeft size={20} />
                    </button>

                    <img src={conversation.participant.image} alt={conversation.participant.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <h3 className="font-bold text-text-primary text-sm">{conversation.participant.name}</h3>
                        <p className={`text-xs flex items-center gap-1 ${conversation.participant.isOnline ? 'text-green-600' : 'text-text-tertiary'}`}>
                            {conversation.participant.isOnline && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                            {conversation.participant.isOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-2 text-text-secondary hover:bg-gray-100 rounded-full transition" title="View Profile">
                        <Info size={20} />
                    </button>
                    <button className="p-2 text-text-secondary hover:bg-gray-100 rounded-full transition">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#FDFBF7]">
                {/* Date Separators would go here logically */}
                {conversation.messages.map((msg, index) => {
                    const isMe = msg.sender === 'You';
                    const isSystem = msg.type === 'system';

                    if (isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center my-4">
                                <span className="text-xs bg-gray-200 text-text-secondary px-3 py-1 rounded-full">{msg.text}</span>
                            </div>
                        );
                    }

                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`relative px-4 py-3 text-sm shadow-sm ${isMe
                                        ? 'bg-brand-primary text-white rounded-2xl rounded-tr-sm'
                                        : 'bg-white text-text-primary rounded-2xl rounded-tl-sm border border-border'
                                    }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-[10px] text-text-tertiary px-1">
                                    <span>{msg.time}</span>
                                    {isMe && <span>• {msg.status}</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-border">
                {/* Toolbar */}
                <div className="flex items-end gap-2 bg-gray-50 border border-border rounded-xl p-2 transition-shadow focus-within:ring-1 focus-within:ring-brand-primary focus-within:border-brand-primary">

                    <div className="flex pb-2 gap-1 text-text-tertiary">
                        <button className="p-2 hover:bg-gray-200 rounded-full transition"><Paperclip size={20} /></button>
                        <button className="p-2 hover:bg-gray-200 rounded-full transition"><ImageIcon size={20} /></button>
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={handleInput}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-none resize-none max-h-32 min-h-[40px] py-3 text-sm focus:ring-0 placeholder:text-text-secondary/50"
                        rows={1}
                    />

                    <div className="pb-1.5">
                        <button
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            className="p-2 rounded-full bg-brand-primary text-white shadow-md hover:bg-brand-primary-dark transition disabled:opacity-50 disabled:shadow-none"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
                <div className="text-right mt-1">
                    <span className="text-[10px] text-text-tertiary">{newMessage.length}/5000</span>
                </div>
            </div>
        </div>
    );
};

export default ConversationView;
