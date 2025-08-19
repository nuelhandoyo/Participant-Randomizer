import Papa from 'papaparse';
import { Participant } from '../types';

export function parseCSV(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          const names = results.data
            .flat()
            .filter((name): name is string => typeof name === 'string' && name.trim() !== '')
            .map(name => name.trim());
          resolve(names);
        } catch (error) {
          reject(error);
        }
      },
      error: reject,
      skipEmptyLines: true
    });
  });
}

export function exportToCSV(participants: Participant[], filename: string = 'participants') {
  const csvData = participants.map(participant => ({
    Name: participant.name,
    Selected: participant.selected ? 'Yes' : 'No',
    'Selected At': participant.selectedAt ? new Date(participant.selectedAt).toLocaleString() : ''
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}