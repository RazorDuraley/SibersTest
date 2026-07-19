import React, { useState } from 'react';
import axios from 'axios';

const FileUploader = ({ onUploadComplete }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prev) => [...prev, ...droppedFiles]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert('Выберите хотя бы один файл');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));

        try {
            const response = await axios.post('/api/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadResult(response.data);
            setFiles([]);
            if (onUploadComplete) onUploadComplete(response.data);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            alert('Не удалось загрузить файлы');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div
                style={{
                    border: `2px dashed ${isDragging ? '#007bff' : '#ccc'}`,
                    padding: '30px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    transition: 'border-color 0.3s',
                    backgroundColor: isDragging ? '#f0f8ff' : 'transparent',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="fileInput"
                />
                <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                    <p>Перетащите файлы сюда или</p>
                    <button type="button" onClick={() => document.getElementById('fileInput').click()}>
                        Выберите файлы
                    </button>
                </label>
            </div>

            {files.length > 0 && (
                <>
                    <ul style={{ marginTop: '16px' }}>
                        {files.map((file, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{file.name} ({(file.size / 1024).toFixed(2)} КБ)</span>
                                <button onClick={() => removeFile(index)}>Удалить</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleUpload} disabled={uploading}>
                        {uploading ? 'Загрузка...' : `Загрузить (${files.length})`}
                    </button>
                </>
            )}

            {uploadResult && (
                <div style={{ marginTop: '16px', color: 'green' }}>
                    Успешно загружено {uploadResult.length} файлов
                </div>
            )}
        </div>
    );
};

export default FileUploader;