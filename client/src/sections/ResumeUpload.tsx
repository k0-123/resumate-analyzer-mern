import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Check, AlertCircle, Loader2 } from 'lucide-react';

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<{ success: boolean; resumeId?: string; error?: string }>;
  isLoading: boolean;
}

const ResumeUpload = ({ onUpload, isLoading }: ResumeUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExtensions = ['.pdf', '.docx'];
    
    if (!validTypes.includes(file.type) && !validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      setErrorMessage('Please upload a PDF or DOCX file');
      return false;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size must be less than 5MB');
      return false;
    }
    
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setUploadStatus('idle');
        setErrorMessage('');
      } else {
        setUploadStatus('error');
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setUploadStatus('idle');
        setErrorMessage('');
      } else {
        setUploadStatus('error');
      }
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const result = await onUpload(selectedFile);
    
    if (result.success) {
      setUploadStatus('success');
      setSelectedFile(null);
    } else {
      setUploadStatus('error');
      setErrorMessage(result.error || 'Upload failed');
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Upload Your <span className="text-gradient">Resume</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Drag and drop your resume or click to browse. We support PDF and DOCX formats.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            className={`drop-zone rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragOver ? 'drag-over' : ''
            } ${selectedFile ? 'border-solid border-cyan-500/50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div
                  key="upload-prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <motion.div
                    animate={{ 
                      y: isDragOver ? -10 : 0,
                      scale: isDragOver ? 1.1 : 1 
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-20 h-20 mx-auto rounded-2xl glass-card flex items-center justify-center"
                  >
                    <Upload className="w-10 h-10 text-cyan-400" />
                  </motion.div>
                  
                  <div>
                    <p className="text-lg font-medium text-white mb-2">
                      {isDragOver ? 'Drop your file here' : 'Drag & drop your resume'}
                    </p>
                    <p className="text-sm text-gray-500">
                      or click to browse files
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <File className="w-3 h-3" /> PDF
                    </span>
                    <span className="flex items-center gap-1">
                      <File className="w-3 h-3" /> DOCX
                    </span>
                    <span>Max 5MB</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-xl gradient-purple flex items-center justify-center">
                      <File className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-white truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={clearFile}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={isLoading}
                    className="btn-primary flex items-center justify-center gap-2 mx-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Analyze Resume
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status messages */}
          <AnimatePresence>
            {uploadStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400">Resume uploaded successfully!</span>
              </motion.div>
            )}

            {uploadStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center gap-2 shake"
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ResumeUpload;
