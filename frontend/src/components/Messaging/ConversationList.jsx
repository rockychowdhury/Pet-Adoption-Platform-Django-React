import React, { useState } from 'react';
import { Search, Edit, Filter } from 'lucide-react';
import Badge from '../common/Feedback/Badge';
import { useNavigate } from 'react-router-dom';

const ConversationList = ({ conversations, activeId, onNewMessage }) => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = conversations.filter(c => {
        // Filter logic
        if (filter === 'Unread' && !c.unreadCount) return false;
        if (filter === 'Archived' && !c.isArchived) return false;
        if (filter !== 'Archived' && c.isArchived) return false;

        // Search logic
        const name = c.participant.name.toLowerCase();
        const msg = c.lastMessage.text.toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || msg.includes(query);
    });

    const getTabCount = (type) => {
        if (type === 'All') return conversations.filter(c => !c.isArchived).length;
        if (type === 'Unread') return conversations.filter(c => c.unreadCount > 0 && !c.isArchived).length;
        if (type === 'Archived') return conversations.filter(c => c.isArchived).length;
        return 0;
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-border w-full md:w-80 lg:w-96">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-text-primary font-merriweather">Messages</h2>
                    <button
                        onClick={onNewMessage}
                        className="w-10 h-10 rounded-full bg-bg-secondary hover:bg-gray-200 flex items-center justify-center text-text-primary transition"
                        title="New Message"
                    >
                        <Edit size={18} />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-secondary pl-10 pr-4 py-2.5 rounded-xl text-sm border-none focus:ring-1 focus:ring-brand-primary placeholder:text-text-tertiary"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-6 text-sm font-medium border-b border-transparent">
                    {['All', 'Unread', 'Archived'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`pb-2 relative transition-colors ${filter === tab
                                    ? 'text-brand-primary font-bold'
                                    : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {tab}
                            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === tab ? 'bg-brand-primary text-white' : 'bg-gray-100 text-text-tertiary'
                                }`}>
                                {getTabCount(tab)}
                            </span>
                            {filter === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map(c => (
                        <div
                            key={c.id}
                            onClick={() => navigate(`/messages/${c.id}`)}
                            className={`p-4 flex gap-3 cursor-pointer transition border-b border-border/50 hover:bg-bg-secondary/50 ${parseInt(activeId) === c.id ? 'bg-[#FFF8F0] border-l-4 border-l-brand-primary ml-[-1px]' : ''
                                }`}
                        >
                            <div className="relative flex-shrink-0">
                                <img src={c.participant.image} alt={c.participant.name} className="w-12 h-12 rounded-full object-cover" />
                                {c.participant.isOnline && (
                                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className={`text-sm truncate ${c.unreadCount > 0 ? 'font-bold text-text-primary' : 'font-medium text-text-primary'}`}>
                                        {c.participant.name}
                                    </h4>
                                    <span className={`text-xs ${c.unreadCount > 0 ? 'text-brand-primary font-bold' : 'text-text-tertiary'}`}>
                                        {c.lastMessage.time}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="min-w-0 pr-2">
                                        {c.about && (
                                            <p className="text-[10px] uppercase font-bold text-brand-secondary mb-0.5">
                                                About {c.about}
                                            </p>
                                        )}
                                        <p className={`text-sm truncate ${c.unreadCount > 0 ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                                            {c.lastMessage.sender === 'You' && <span className="text-text-tertiary">You: </span>}
                                            {c.lastMessage.text}
                                        </p>
                                    </div>
                                    {c.unreadCount > 0 && (
                                        <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-brand-primary text-white text-[10px] font-bold rounded-full px-1">
                                            {c.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 px-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                            <Filter size={24} />
                        </div>
                        <h3 className="text-text-primary font-bold">No messages found</h3>
                        <p className="text-sm text-text-secondary mt-1">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationList;
