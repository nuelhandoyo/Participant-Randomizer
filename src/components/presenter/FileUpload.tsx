import React, { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { parseCSV } from '../../utils/csvUtils';
import { useApp } from '../../contexts/AppContext';

export function FileUpload() {
  const { dispatch } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const names = await parseCSV(file);
      const participants = names.map(name => ({
        id: Date.now().toString() + Math.random(),
        name,
        selected: false
      }));
      
      dispatch({ type: 'SET_PARTICIPANTS', payload: participants });
    } catch (error) {
      alert('Error parsing CSV file. Please check the format.');
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="
          border-2 border-dashed border-cyan-500/50 rounded-xl p-8
          hover:border-cyan-400 hover:bg-cyan-500/5
          transition-all duration-300 cursor-pointer
          bg-gradient-to-br from-gray-900/50 to-gray-800/50
          backdrop-blur-sm
        "
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <p className="text-white font-medium">Upload CSV File</p>
            <p className="text-gray-400 text-sm mt-1">
              Click to select a CSV file with participant names
            </p>
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}