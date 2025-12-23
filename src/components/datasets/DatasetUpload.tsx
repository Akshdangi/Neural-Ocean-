import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, Database, Dna, CheckCircle, X } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

function DatasetUpload() {
  const { addNotification } = useNotifications();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
      
      // Simulate upload progress
      acceptedFiles.forEach(file => {
        const fileName = file.name;
        setUploadProgress(prev => ({ ...prev, [fileName]: 0 }));
        
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileName] || 0;
            const newProgress = currentProgress + Math.random() * 30;
            
            if (newProgress >= 100) {
              clearInterval(interval);
              addNotification({
                type: 'success',
                title: 'Upload Complete',
                message: `${fileName} has been successfully uploaded and processed.`
              });
              return { ...prev, [fileName]: 100 };
            }
            
            return { ...prev, [fileName]: newProgress };
          });
        }, 500);
      });
    }
  });

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
      case 'xlsx':
      case 'xls':
        return <Database className="w-6 h-6 text-green-400" />;
      case 'json':
        return <FileText className="w-6 h-6 text-blue-400" />;
      case 'txt':
        return <Dna className="w-6 h-6 text-purple-400" />;
      default:
        return <FileText className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8"
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-cyan-500 bg-cyan-500/10'
              : 'border-white/30 hover:border-cyan-500/50 hover:bg-white/5'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          {isDragActive ? (
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">Drop files here</h3>
              <p className="text-gray-300">Release to upload your datasets</p>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">Upload Your Datasets</h3>
              <p className="text-gray-300 mb-4">
                Drag and drop your files here, or click to browse
              </p>
              <p className="text-sm text-gray-400">
                Supported formats: CSV, JSON, TXT, XLS, XLSX (Max 100MB per file)
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Dataset Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Dataset Classification</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              type: 'Fisheries Data',
              description: 'Stock assessments, catch records, fishing quotas',
              icon: <Database className="w-8 h-8" />,
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              type: 'Biodiversity Records',
              description: 'Species observations, population counts, habitat data',
              icon: <FileText className="w-8 h-8" />,
              gradient: 'from-green-500 to-teal-500'
            },
            {
              type: 'eDNA Samples',
              description: 'Environmental DNA sequences, genetic markers',
              icon: <Dna className="w-8 h-8" />,
              gradient: 'from-purple-500 to-indigo-500'
            }
          ].map((category) => (
            <div
              key={category.type}
              className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-4 cursor-pointer transition-all duration-200"
            >
              <div className={`bg-gradient-to-r ${category.gradient} p-3 rounded-lg w-fit mb-3`}>
                {category.icon}
              </div>
              <h4 className="text-white font-medium mb-2">{category.type}</h4>
              <p className="text-gray-400 text-sm">{category.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Upload Progress</h3>
          <div className="space-y-4">
            {uploadedFiles.map((file) => {
              const progress = uploadProgress[file.name] || 0;
              const isComplete = progress >= 100;
              
              return (
                <div key={file.name} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.name)}
                      <div>
                        <div className="text-white font-medium">{file.name}</div>
                        <div className="text-sm text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="text-sm text-gray-400">
                          {Math.round(progress)}%
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(file.name)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        isComplete ? 'bg-green-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default DatasetUpload;