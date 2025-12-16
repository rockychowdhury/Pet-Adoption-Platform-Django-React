import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { UploadCloud, X, File, Image as ImageIcon } from 'lucide-react';
import Button from '../Buttons/Button'; // Assuming relative path

const FileUpload = ({
    label,
    accept,
    multiple,
    onChange,
    error,
    helperText,
    className = '',
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (fileList) => {
        const newFiles = Array.from(fileList);
        setFiles((prev) => [...prev, ...newFiles]);
        if (onChange) onChange([...files, ...newFiles]);
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        if (onChange) onChange(newFiles);
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    return (
        <div className={`w-full ${className}`}>
            {label && <label className="block text-sm font-semibold text-text-primary mb-2">{label}</label>}

            <div
                className={`
            relative w-full h-48 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-4 text-center
            ${dragActive ? 'border-brand-secondary bg-brand-secondary/5' : 'border-border-light bg-bg-surface'}
            ${error ? 'border-status-error' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    multiple={multiple}
                    accept={accept}
                    onChange={handleChange}
                />

                <div className="bg-bg-secondary p-3 rounded-full mb-3 text-brand-secondary">
                    <UploadCloud size={24} />
                </div>

                <p className="text-sm font-medium text-text-primary mb-1">
                    <span className="text-brand-secondary cursor-pointer hover:underline" onClick={onButtonClick}>Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-text-tertiary">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
            </div>

            {/* File List / Previews */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-bg-surface border border-border rounded-lg shadow-sm">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 rounded bg-bg-secondary flex items-center justify-center text-text-secondary shrink-0">
                                    {file.type.startsWith('image/') ? <ImageIcon size={20} /> : <File size={20} />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
                                    <p className="text-xs text-text-tertiary">{(file.size / 1024).toFixed(0)} KB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="p-1 text-text-tertiary hover:text-status-error hover:bg-status-error/10 rounded-full transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="mt-1.5 text-sm text-status-error font-medium">{error}</p>}
            {!error && helperText && <p className="mt-1.5 text-sm text-text-secondary">{helperText}</p>}
        </div>
    );
};

FileUpload.propTypes = {
    label: PropTypes.string,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    onChange: PropTypes.func, // receives array of files
    error: PropTypes.string,
    helperText: PropTypes.string,
    className: PropTypes.string,
};

export default FileUpload;
