import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectFileManager = ({ projectId }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const fetchFiles = () => {
        if (!projectId) return;
        axios.get(`/api/projectfiles/${projectId}`)
            .then(response => setFiles(response.data))
            .catch(error => {
                console.error('Ошибка загрузки файлов:', error);
                setError('Не удалось загрузить файлы');
            });
    };

    useEffect(() => {
        fetchFiles();
    }, [projectId]);

    const handleUpload = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;

        setUploading(true);
        setError('');
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));

        try {
            await axios.post(`/api/projectfiles/${projectId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchFiles();
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            setError('Не удалось загрузить файлы');
        } finally {
            setUploading(false);
        }
    };

    const deleteFile = (fileId) => {
        if (window.confirm('Удалить файл?')) {
            axios.delete(`/api/projectfiles/${fileId}`)
                .then(() => fetchFiles())
                .catch(error => console.error(error));
        }
    };

    return (
        <div>
            <h4>Файлы проекта</h4>

            <div style={{ marginBottom: '16px' }}>
                <input
                    type="file"
                    multiple
                    onChange={handleUpload}
                    disabled={uploading}
                />
                {uploading && <span style={{ marginLeft: '8px' }}>Загрузка...</span>}
                {error && <div style={{ color: 'red', marginTop: '4px' }}>{error}</div>}
            </div>

            {files.length === 0 ? (
                <p>Нет загруженных файлов</p>
            ) : (
                <ul>
                    {files.map(file => (
                        <li key={file.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>
                                {file.fileName} ({(file.fileSize / 1024).toFixed(2)} КБ)
                            </span>
                            <div>
                                <a href={`http://localhost:5153${file.filePath}`} download target="_blank">Скачать</a>
                                <button onClick={() => deleteFile(file.id)}>🗑️</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProjectFileManager;