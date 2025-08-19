// Socket.io connection
const socket = io();

// Global variables
let participants = [];
let selectedParticipants = [];
let isRandomizing = false;

// DOM elements
const elements = {
    csvFile: document.getElementById('csvFile'),
    participantTextarea: document.getElementById('participantTextarea'),
    loadParticipants: document.getElementById('loadParticipants'),
    startRandomization: document.getElementById('startRandomization'),
    downloadData: document.getElementById('downloadData'),
    resetData: document.getElementById('resetData'),
    matrixDisplay: document.getElementById('matrixDisplay'),
    selectedResult: document.getElementById('selectedResult'),
    totalParticipants: document.getElementById('totalParticipants'),
    selectedCount: document.getElementById('selectedCount'),
    remainingCount: document.getElementById('remainingCount'),
    selectedList: document.getElementById('selectedList'),
    remainingList: document.getElementById('remainingList'),
    errorModal: document.getElementById('errorModal'),
    errorMessage: document.getElementById('errorMessage'),
    lastSelected: document.getElementById('lastSelected'),
    lastSelectedName: document.getElementById('lastSelectedName'),
    lastSelectedTime: document.getElementById('lastSelectedTime')
};

// Check if we're on admin or participant view
const isAdminView = document.body.classList.contains('admin-view');
const isParticipantView = document.body.classList.contains('participant-view');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateUI();
    
    // Set initial message based on view
    if (isParticipantView && elements.matrixDisplay) {
        elements.matrixDisplay.innerHTML = '<div class="matrix-text">Menunggu narasumber memulai pengacakan...</div>';
    }
});

// Socket event listeners
socket.on('gameState', (gameState) => {
    participants = gameState.participants;
    selectedParticipants = gameState.selected;
    isRandomizing = gameState.isRandomizing;
    updateUI();
});

socket.on('participantsUpdated', (gameState) => {
    participants = gameState.participants;
    selectedParticipants = gameState.selected;
    updateUI();
    
    // Update participant view message
    if (isParticipantView && elements.matrixDisplay && participants.length > 0) {
        elements.matrixDisplay.innerHTML = '<div class="matrix-text">Siap untuk pengacakan...</div>';
    }
});

socket.on('randomizationStarted', () => {
    isRandomizing = true;
    startMatrixAnimation();
    updateUI();
});

socket.on('participantSelected', (data) => {
    selectedParticipants = data.gameState.selected;
    isRandomizing = false;
    showSelectedResult(data.selected.name);
    
    // Update last selected for participant view
    if (isParticipantView) {
        updateLastSelected(data.selected);
    }
    
    updateUI();
});

socket.on('animationComplete', () => {
    hideSelectedResult();
});

socket.on('error', (message) => {
    showError(message);
});

// Initialize event listeners
function initializeEventListeners() {
    if (!isAdminView) return;

    // File upload
    if (elements.csvFile) {
        elements.csvFile.addEventListener('change', handleFileUpload);
    }

    // Load participants
    if (elements.loadParticipants) {
        elements.loadParticipants.addEventListener('click', loadParticipants);
    }

    // Start randomization
    if (elements.startRandomization) {
        elements.startRandomization.addEventListener('click', startRandomization);
    }

    // Download data
    if (elements.downloadData) {
        elements.downloadData.addEventListener('click', downloadData);
    }

    // Reset data
    if (elements.resetData) {
        elements.resetData.addEventListener('click', resetData);
    }
}

// Handle CSV file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        showError('Silakan pilih file CSV yang valid');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split('\n').map(line => line.trim()).filter(line => line);
        
        if (lines.length === 0) {
            showError('File CSV kosong atau tidak valid');
            return;
        }

        // Assume first column contains names, ignore headers if present
        const names = lines.map(line => {
            const firstColumn = line.split(',')[0].replace(/"/g, '').trim();
            return firstColumn;
        }).filter(name => name && !isHeaderRow(name));

        if (names.length === 0) {
            showError('Tidak ditemukan nama peserta yang valid dalam file CSV');
            return;
        }

        elements.participantTextarea.value = names.join('\n');
        showSuccess(`Berhasil memuat ${names.length} nama dari file CSV`);
    };

    reader.onerror = function() {
        showError('Error membaca file CSV');
    };

    reader.readAsText(file);
}

// Check if a row is likely a header row
function isHeaderRow(text) {
    const headers = ['nama', 'name', 'peserta', 'participant', 'no', 'number'];
    return headers.some(header => text.toLowerCase().includes(header.toLowerCase()));
}

// Load participants from textarea
function loadParticipants() {
    const text = elements.participantTextarea.value.trim();
    
    if (!text) {
        showError('Silakan masukkan daftar nama peserta');
        return;
    }

    const names = text.split('\n')
        .map(name => name.trim())
        .filter(name => name && name.length > 0);

    if (names.length === 0) {
        showError('Tidak ada nama peserta yang valid');
        return;
    }

    // Remove duplicates
    const uniqueNames = [...new Set(names)];
    
    if (uniqueNames.length !== names.length) {
        showSuccess(`Menghapus ${names.length - uniqueNames.length} nama duplikat`);
    }

    // Send to server
    socket.emit('updateParticipants', uniqueNames);
    showSuccess(`Berhasil memuat ${uniqueNames.length} peserta`);
}

// Start randomization
function startRandomization() {
    if (participants.length === 0) {
        showError('Tidak ada peserta yang tersedia');
        return;
    }

    const remainingParticipants = participants.filter(
        p => !selectedParticipants.find(s => s.name === p)
    );

    if (remainingParticipants.length === 0) {
        showError('Semua peserta sudah terpilih');
        return;
    }

    socket.emit('startRandomization');
}

// Matrix animation
function startMatrixAnimation() {
    const display = elements.matrixDisplay;
    if (!display) return;

    const animationText = isParticipantView ? 'Sedang mengacak...' : 'Mengacak...';
    display.innerHTML = `<div class="matrix-text matrix-animation">${animationText}</div>`;
    
    const remainingParticipants = participants.filter(
        p => !selectedParticipants.find(s => s.name === p)
    );

    let animationInterval = setInterval(() => {
        if (!isRandomizing) {
            clearInterval(animationInterval);
            return;
        }

        const randomName = remainingParticipants[Math.floor(Math.random() * remainingParticipants.length)];
        display.innerHTML = `<div class="matrix-text matrix-animation">${randomName}</div>`;
    }, 100);
}

// Show selected result
function showSelectedResult(name) {
    const result = elements.selectedResult;
    if (!result) return;

    result.textContent = name;
    result.style.display = 'block';
    result.classList.add('glow');

    // Update matrix display
    const resultText = isParticipantView ? `🎉 ${name} 🎉` : `Terpilih: ${name}`;
    elements.matrixDisplay.innerHTML = `<div class="matrix-text">${resultText}</div>`;
}

// Hide selected result
function hideSelectedResult() {
    const result = elements.selectedResult;
    if (!result) return;

    result.style.display = 'none';
    result.classList.remove('glow');

    // Reset matrix display
    const readyText = isParticipantView ? 
        'Menunggu pengacakan berikutnya...' : 
        'Siap untuk pengacakan berikutnya...';
    elements.matrixDisplay.innerHTML = `<div class="matrix-text">${readyText}</div>`;
}

// Update last selected for participant view
function updateLastSelected(selectedData) {
    if (!isParticipantView || !elements.lastSelected) return;
    
    if (elements.lastSelectedName) {
        elements.lastSelectedName.textContent = selectedData.name;
    }
    
    if (elements.lastSelectedTime) {
        elements.lastSelectedTime.textContent = `Terpilih pada: ${selectedData.date}`;
    }
    
    elements.lastSelected.style.display = 'block';
}

// Update UI
function updateUI() {
    updateCounts();
    updateLists();
    updateButtons();
}

// Update counts
function updateCounts() {
    const total = participants.length;
    const selected = selectedParticipants.length;
    const remaining = total - selected;

    if (elements.totalParticipants) elements.totalParticipants.textContent = total;
    if (elements.selectedCount) elements.selectedCount.textContent = selected;
    if (elements.remainingCount) elements.remainingCount.textContent = remaining;
}

// Update participant lists
function updateLists() {
    updateSelectedList();
    updateRemainingList();
}

// Update selected participants list
function updateSelectedList() {
    const list = elements.selectedList;
    if (!list) return;

    if (selectedParticipants.length === 0) {
        list.innerHTML = '<div class="participant-item">Belum ada peserta yang terpilih</div>';
        return;
    }

    list.innerHTML = selectedParticipants
        .slice().reverse() // Show most recent first
        .map(participant => `
            <div class="participant-item selected slide-in">
                <div class="participant-name">${participant.name}</div>
                <div class="participant-time">${participant.date}</div>
            </div>
        `).join('');
}

// Update remaining participants list
function updateRemainingList() {
    const list = elements.remainingList;
    if (!list) return;

    const remainingParticipants = participants.filter(
        p => !selectedParticipants.find(s => s.name === p)
    );

    if (remainingParticipants.length === 0) {
        list.innerHTML = '<div class="participant-item">Semua peserta sudah terpilih</div>';
        return;
    }

    list.innerHTML = remainingParticipants
        .map(name => `
            <div class="participant-item fade-in">
                <div class="participant-name">${name}</div>
            </div>
        `).join('');
}

// Update buttons state
function updateButtons() {
    if (!isAdminView) return;

    const hasParticipants = participants.length > 0;
    const hasUnselected = participants.some(p => !selectedParticipants.find(s => s.name === p));
    const hasSelected = selectedParticipants.length > 0;

    if (elements.startRandomization) {
        elements.startRandomization.disabled = !hasParticipants || !hasUnselected || isRandomizing;
    }

    if (elements.downloadData) {
        elements.downloadData.disabled = !hasParticipants;
    }
}

// Download data as CSV
function downloadData() {
    if (participants.length === 0) {
        showError('Tidak ada data untuk diunduh');
        return;
    }

    let csvContent = 'Nama,Status,Tanggal Terpilih\n';

    participants.forEach(name => {
        const selectedData = selectedParticipants.find(s => s.name === name);
        if (selectedData) {
            csvContent += `"${name}","Terpilih","${selectedData.date}"\n`;
        } else {
            csvContent += `"${name}","Belum Terpilih",""\n`;
        }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `hasil-pengacakan-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess('Data berhasil diunduh');
}

// Reset all data
function resetData() {
    if (confirm('Apakah Anda yakin ingin mereset semua data? Tindakan ini tidak dapat dibatalkan.')) {
        socket.emit('reset');
        
        if (elements.participantTextarea) {
            elements.participantTextarea.value = '';
        }
        
        if (elements.csvFile) {
            elements.csvFile.value = '';
        }

        showSuccess('Semua data telah direset');
    }
}

// Show error modal
function showError(message) {
    if (!elements.errorModal || !elements.errorMessage) {
        alert(message); // Fallback for participant view
        return;
    }
    
    elements.errorMessage.textContent = message;
    elements.errorModal.style.display = 'flex';
}

// Close error modal
function closeErrorModal() {
    if (elements.errorModal) {
        elements.errorModal.style.display = 'none';
    }
}

// Show success message
function showSuccess(message) {
    // Create temporary success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--matrix-success);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Handle modal close on outside click
window.onclick = function(event) {
    if (elements.errorModal && event.target === elements.errorModal) {
        closeErrorModal();
    }
};

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && elements.errorModal && elements.errorModal.style.display === 'flex') {
        closeErrorModal();
    }
});