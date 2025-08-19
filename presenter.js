class PresenterApp {
    constructor() {
        this.ws = null;
        this.state = {
            participants: [],
            selectedParticipants: [],
            isAnimating: false
        };
        
        this.initializeElements();
        this.initializeWebSocket();
        this.attachEventListeners();
        this.setupFileUpload();
    }

    initializeElements() {
        this.elements = {
            csvFile: document.getElementById('csvFile'),
            fileDropZone: document.getElementById('fileDropZone'),
            participantList: document.getElementById('participantList'),
            addParticipants: document.getElementById('addParticipants'),
            startAnimation: document.getElementById('startAnimation'),
            exportBtn: document.getElementById('exportBtn'),
            resetBtn: document.getElementById('resetBtn'),
            matrixText: document.getElementById('matrixText'),
            matrixContainer: document.getElementById('matrixContainer'),
            selectedList: document.getElementById('selectedList'),
            unselectedList: document.getElementById('unselectedList'),
            totalCount: document.getElementById('totalCount'),
            remainingCount: document.getElementById('remainingCount'),
            selectedCount: document.getElementById('selectedCount'),
            unselectedCount: document.getElementById('unselectedCount'),
            notification: document.getElementById('notification')
        };
    }

    initializeWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
            console.log('Connected to WebSocket server');
            this.showNotification('Terhubung ke server', 'success');
        };
        
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleWebSocketMessage(message);
        };
        
        this.ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
            this.showNotification('Koneksi terputus', 'error');
            
            // Attempt to reconnect after 3 seconds
            setTimeout(() => {
                this.initializeWebSocket();
            }, 3000);
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.showNotification('Terjadi kesalahan koneksi', 'error');
        };
    }

    handleWebSocketMessage(message) {
        switch (message.type) {
            case 'STATE_UPDATE':
                this.updateState(message.data);
                break;
            case 'ANIMATION_START':
                this.startMatrixAnimation();
                break;
        }
    }

    updateState(newState) {
        this.state = { ...newState };
        this.updateUI();
    }

    attachEventListeners() {
        this.elements.addParticipants.addEventListener('click', () => {
            this.addParticipantsFromTextarea();
        });

        this.elements.startAnimation.addEventListener('click', () => {
            this.startRandomization();
        });

        this.elements.exportBtn.addEventListener('click', () => {
            this.exportData();
        });

        this.elements.resetBtn.addEventListener('click', () => {
            this.resetData();
        });

        // Enter key support for textarea
        this.elements.participantList.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.addParticipantsFromTextarea();
            }
        });
    }

    setupFileUpload() {
        // Click to upload
        this.elements.fileDropZone.addEventListener('click', () => {
            this.elements.csvFile.click();
        });

        // File selection
        this.elements.csvFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        // Drag and drop
        this.elements.fileDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.fileDropZone.classList.add('drag-over');
        });

        this.elements.fileDropZone.addEventListener('dragleave', () => {
            this.elements.fileDropZone.classList.remove('drag-over');
        });

        this.elements.fileDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.fileDropZone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'text/csv') {
                this.handleFileUpload(files[0]);
            } else {
                this.showNotification('Hanya file CSV yang diperbolehkan', 'error');
            }
        });
    }

    async handleFileUpload(file) {
        const formData = new FormData();
        formData.append('csvFile', file);

        try {
            const response = await fetch('/upload-csv', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                this.updateParticipants(data.participants);
                this.showNotification(`Berhasil menambahkan ${data.participants.length} peserta`, 'success');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            this.showNotification('Gagal mengunggah file', 'error');
        }
    }

    addParticipantsFromTextarea() {
        const text = this.elements.participantList.value.trim();
        if (!text) {
            this.showNotification('Masukkan nama peserta terlebih dahulu', 'error');
            return;
        }

        const names = text.split('\n')
            .map(name => name.trim())
            .filter(name => name.length > 0);

        if (names.length === 0) {
            this.showNotification('Tidak ada nama yang valid', 'error');
            return;
        }

        this.updateParticipants([...this.state.participants, ...names]);
        this.elements.participantList.value = '';
        this.showNotification(`Berhasil menambahkan ${names.length} peserta`, 'success');
    }

    updateParticipants(participants) {
        // Remove duplicates
        const uniqueParticipants = [...new Set(participants)];
        
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'UPDATE_PARTICIPANTS',
                participants: uniqueParticipants
            }));
        }
    }

    startRandomization() {
        if (this.state.participants.length === 0) {
            this.showNotification('Tambahkan peserta terlebih dahulu', 'error');
            return;
        }

        const availableParticipants = this.getAvailableParticipants();
        if (availableParticipants.length === 0) {
            this.showNotification('Tidak ada peserta yang tersisa', 'info');
            return;
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'START_ANIMATION'
            }));
        }
    }

    startMatrixAnimation() {
        this.state.isAnimating = true;
        this.updateUI();

        const availableParticipants = this.getAvailableParticipants();
        this.elements.matrixContainer.classList.add('matrix-scrolling');
        
        // Create matrix rain effect
        this.createMatrixRain();
        
        let animationInterval = setInterval(() => {
            if (availableParticipants.length > 0) {
                const randomName = availableParticipants[Math.floor(Math.random() * availableParticipants.length)];
                this.elements.matrixText.textContent = randomName;
            }
        }, 50);

        setTimeout(() => {
            clearInterval(animationInterval);
            this.elements.matrixContainer.classList.remove('matrix-scrolling');
            this.clearMatrixRain();
            
            // The final result will be updated via WebSocket
        }, 3000);
    }

    createMatrixRain() {
        const rain = document.createElement('div');
        rain.className = 'matrix-rain';
        
        for (let i = 0; i < 10; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 3 + 1) + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            drop.textContent = String.fromCharCode(33 + Math.random() * 94);
            rain.appendChild(drop);
        }
        
        this.elements.matrixContainer.appendChild(rain);
    }

    clearMatrixRain() {
        const rain = this.elements.matrixContainer.querySelector('.matrix-rain');
        if (rain) {
            rain.remove();
        }
    }

    getAvailableParticipants() {
        return this.state.participants.filter(name => 
            !this.state.selectedParticipants.some(selected => selected.name === name)
        );
    }

    updateUI() {
        const availableParticipants = this.getAvailableParticipants();
        
        // Update counts
        this.elements.totalCount.textContent = this.state.participants.length;
        this.elements.remainingCount.textContent = availableParticipants.length;
        this.elements.selectedCount.textContent = this.state.selectedParticipants.length;
        this.elements.unselectedCount.textContent = availableParticipants.length;

        // Update button state
        this.elements.startAnimation.disabled = this.state.isAnimating || availableParticipants.length === 0;
        
        if (this.state.isAnimating) {
            this.elements.startAnimation.innerHTML = '<span class="loading"></span> Mengacak...';
        } else if (availableParticipants.length === 0 && this.state.participants.length > 0) {
            this.elements.startAnimation.innerHTML = '✅ Semua Sudah Terpilih';
        } else {
            this.elements.startAnimation.innerHTML = '🎯 Mulai Pengacakan';
        }

        // Update matrix display
        if (!this.state.isAnimating) {
            if (this.state.participants.length === 0) {
                this.elements.matrixText.textContent = 'Tambahkan peserta untuk memulai';
            } else if (availableParticipants.length === 0) {
                this.elements.matrixText.textContent = 'Semua peserta sudah terpilih';
            } else if (this.state.selectedParticipants.length > 0) {
                const lastSelected = this.state.selectedParticipants[this.state.selectedParticipants.length - 1];
                this.elements.matrixText.textContent = lastSelected.name;
                this.elements.matrixContainer.classList.add('success-animation');
                setTimeout(() => {
                    this.elements.matrixContainer.classList.remove('success-animation');
                }, 600);
            } else {
                this.elements.matrixText.textContent = 'Siap untuk pengacakan';
            }
        }

        // Update participant lists
        this.updateParticipantLists();
    }

    updateParticipantLists() {
        // Update selected list
        if (this.state.selectedParticipants.length === 0) {
            this.elements.selectedList.innerHTML = '<div class="empty-state">Belum ada yang terpilih</div>';
        } else {
            this.elements.selectedList.innerHTML = this.state.selectedParticipants
                .map((participant, index) => `
                    <div class="participant-item">
                        <span class="participant-name">${participant.name}</span>
                        <span class="participant-time">${participant.timestamp}</span>
                    </div>
                `).join('');
        }

        // Update unselected list
        const availableParticipants = this.getAvailableParticipants();
        if (availableParticipants.length === 0) {
            this.elements.unselectedList.innerHTML = '<div class="empty-state">Semua sudah terpilih</div>';
        } else {
            this.elements.unselectedList.innerHTML = availableParticipants
                .map(name => `
                    <div class="participant-item">
                        <span class="participant-name">${name}</span>
                    </div>
                `).join('');
        }
    }

    exportData() {
        if (this.state.participants.length === 0) {
            this.showNotification('Tidak ada data untuk diekspor', 'error');
            return;
        }

        window.open('/export-csv', '_blank');
        this.showNotification('Data berhasil diekspor', 'success');
    }

    resetData() {
        if (confirm('Apakah Anda yakin ingin mereset semua data?')) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: 'RESET_DATA'
                }));
            }
            this.showNotification('Data berhasil direset', 'info');
        }
    }

    showNotification(message, type = 'info') {
        this.elements.notification.textContent = message;
        this.elements.notification.className = `notification ${type}`;
        this.elements.notification.classList.add('show');

        setTimeout(() => {
            this.elements.notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PresenterApp();
});