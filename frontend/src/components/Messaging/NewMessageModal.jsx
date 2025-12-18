
import React, { useState } from 'react';
import Modal from "../common/Modal";
import Button from '../common/Buttons/Button';
import { Search, X } from 'lucide-react';
import { toast } from 'react-toastify';

const NewMessageModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');

    // Mock recent users / results
    const users = [
        { id: 1, name: 'Sarah Jenkins', role: 'Applicant', context: 'Applied to adopt Buddy', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
        { id: 2, name: 'Paws Rescue', role: 'Rescue', context: 'Adoption Inquiry', image: 'https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
        { id: 3, name: 'Mike Ross', role: 'Pet Owner', context: 'Owner of Luna', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
    ];

    const filteredUsers = searchTerm ? users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())) : users;

    const handleSend = () => {
        if (!selectedUser || !message.trim()) return;
        toast.success(`Message sent to ${selectedUser.name} `);
        onClose();
        // In real app, this would create a conversation and redirect
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Message">
            <div className="space-y-4">
                {/* To Field */}
                <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">To:</label>
                    {selectedUser ? (
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-2 rounded-lg w-fit border border-blue-100">
                            <span className="text-sm font-medium">{selectedUser.name}</span>
                            <button onClick={() => setSelectedUser(null)} className="text-blue-500 hover:text-blue-700">
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Search users by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-brand-primary outline-none"
                                autoFocus
                            />
                            {/* Autocomplete Dropdown */}
                            {searchTerm && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                    {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                        <div
                                            key={user.id}
                                            onClick={() => { setSelectedUser(user); setSearchTerm(''); }}
                                            className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-0"
                                        >
                                            <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                            <div>
                                                <p className="text-sm font-bold text-text-primary">{user.name}</p>
                                                <p className="text-xs text-text-tertiary">{user.context}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-3 text-sm text-text-secondary text-center">No users found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Message Field */}
                <div>
                    <label className="block text-sm font-bold text-text-primary mb-1">Message:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message..."
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-brand-primary outline-none min-h-[120px] resize-y"
                    />
                    <div className="text-right text-xs text-text-tertiary mt-1">
                        {message.length}/5000
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={handleSend}
                        disabled={!selectedUser || !message.trim()}
                    >
                        Send Message
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default NewMessageModal;
