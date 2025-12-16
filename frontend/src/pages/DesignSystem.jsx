import React, { useState } from 'react';
import Button from '../components/common/Buttons/Button';
import IconButton from '../components/common/Buttons/IconButton';
import Input from '../components/common/Form/Input';
import Select from '../components/common/Form/Select';
import Checkbox from '../components/common/Form/Checkbox';
import Radio from '../components/common/Form/Radio';
import Switch from '../components/common/Form/Switch';
import Textarea from '../components/common/Form/Textarea';
import Badge from '../components/common/Feedback/Badge';
import Card from '../components/common/Layout/Card';
import Modal from '../components/common/Modal/Modal';
import Alert from '../components/common/Feedback/Alert';
import Tabs from '../components/common/Navigation/Tabs';
import SearchBar from '../components/common/Form/SearchBar';
import Avatar from '../components/common/Display/Avatar';
import Tooltip from '../components/common/Display/Tooltip';
import Table from '../components/common/Display/Table';
import Pagination from '../components/common/Navigation/Pagination';
import Rating from '../components/common/Display/Rating';
import ReviewCard from '../components/common/Display/ReviewCard';
import FileUpload from '../components/common/Form/FileUpload';
import { Home, Search, Bell } from 'lucide-react';

const DesignSystem = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(3);
    const [page, setPage] = useState(1);
    const [switchVal, setSwitchVal] = useState(false);
    const [activeTab, setActiveTab] = useState('tab1');

    return (
        <div className="min-h-screen bg-bg-primary p-8 space-y-12">
            <h1 className="text-4xl font-bold font-logo text-text-primary">Design System</h1>

            {/* Buttons */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Buttons</h2>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="text">Text</Button>
                    <Button variant="primary" isLoading>Loading</Button>
                    <IconButton icon={<Bell size={20} />} variant="surface" label="Notifications" />
                    <IconButton icon={<Home size={20} />} variant="primary" label="Home" />
                </div>
            </section>

            {/* Inputs */}
            <section className="space-y-4 max-w-2xl">
                <h2 className="text-2xl font-bold">Forms</h2>
                <div className="space-y-4">
                    <Input label="Standard Input" placeholder="Type something..." />
                    <Input label="Error Input" error="This field is required" placeholder="Error state" />
                    <Input label="Success Input" success placeholder="Success state" />
                    <Select
                        label="Select Option"
                        options={[{ value: 1, label: 'Option 1' }, { value: 2, label: 'Option 2' }]}
                    />
                    <div className="flex gap-4">
                        <Checkbox label="Checkbox" />
                        <Radio label="Radio" name="radio-group" value="1" />
                        <Switch label="Toggle Switch" checked={switchVal} onChange={() => setSwitchVal(!switchVal)} />
                    </div>
                    <FileUpload label="Upload File" />
                </div>
            </section>

            {/* Feedback */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Feedback</h2>
                <div className="flex gap-2">
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="brand">Brand</Badge>
                </div>
                <div className="space-y-2 max-w-xl">
                    <Alert variant="info" title="Info Alert">This is an info alert.</Alert>
                    <Alert variant="success" title="Success Alert">Operation completed successfully.</Alert>
                </div>
            </section>

            {/* Layout & Display */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Layout & Display</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <h3 className="font-bold">Basic Card</h3>
                        <p>This is a basic card content.</p>
                    </Card>
                    <ReviewCard
                        author="John Doe"
                        date="2 days ago"
                        rating={5}
                        content="Amazing platform! Found my best friend here."
                        avatar="https://via.placeholder.com/150"
                    />
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <Tooltip content="This is a tooltip">
                                <Button size="sm" variant="outline">Hover me</Button>
                            </Tooltip>
                            <Avatar initials="JD" status="online" />
                        </div>
                        <Rating value={rating} onChange={setRating} />
                    </div>
                </div>

                <h3 className="font-bold mt-4">Tabs</h3>
                <Tabs
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    tabs={[
                        { label: 'Tab 1', value: 'tab1', content: <div className="p-4 bg-white rounded">Content 1</div> },
                        { label: 'Tab 2', value: 'tab2', content: <div className="p-4 bg-white rounded">Content 2</div> }
                    ]}
                />
            </section>

            {/* Modals */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold">Modals</h2>
                <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Test Modal">
                    <p>This is a test modal content.</p>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Close</Button>
                        <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirm</Button>
                    </div>
                </Modal>
            </section>
        </div>
    );
};

export default DesignSystem;
