class ParticipantApp {
    constructor() {
        this.ws = null;
        this.state = {
            participants: [],
            selectedParticipants: [],
            isAnimating: false
        };
        
        this.initializeElements();
        this.initializeWebSocket();
    }

    initializeElements() {
        this.elements = {
            connectionStatus: document.getElementById('connectionStatus'),
            matrixText: document.getElementById('matrixText'),
            matrixContainer: document.getElementById('matrixContainer'),
            statusMessage: document.getElementById('statusMessage'),
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
            this.updateConnectionStatus(true);
        };
        
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleWebSocketMessage(message);
        };
        
        this.ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
            this.updateConnectionStatus(false);
            
            // Attempt to reconnect after 3 seconds
            setTimeout(() => {
                this.initializeWebSocket();
            }, 3000);
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.updateConnectionStatus(false);
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
        const wasAnimating = this.state.isAnimating;
        this.state = { ...newState };
        
        // Show notification for new selection
        if (!wasAnimating && !this.state.isAnimating && this.state.selectedParticipants.length > 0) {
            const lastSelected = this.state.selectedParticipants[this.state.selectedParticipants.length - 1];
            if (lastSelected) {
                this.showNotification(`${lastSelected.name} terpilih!`, 'success');
            }
        }
        
        this.updateUI();
    }

    updateConnectionStatus(connected) {
        if (connected) {
            this.elements.connectionStatus.innerHTML = '🟢 Terhubung';
            this.elements.connectionStatus.style.background = 'rgba(0, 255, 0, 0.2)';
        } else {
            this.elements.connectionStatus.innerHTML = '🔴 Tidak terhubung';
            this.elements.connectionStatus.style.background = 'rgba(255, 0, 0, 0.2)';
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

        // Show exciting status message
        this.elements.statusMessage.textContent = '🎲 Sedang mengacak...';
        this.elements.statusMessage.classList.add('pulse');

        setTimeout(() => {
            clearInterval(animationInterval);
            this.elements.matrixContainer.classList.remove('matrix-scrolling');
            this.elements.statusMessage.classList.remove('pulse');
            this.clearMatrixRain();
            
            // The final result will be updated via WebSocket
        }, 3000);
    }

    createMatrixRain() {
        const rain = document.createElement('div');
        rain.className = 'matrix-rain';
        
        for (let i = 0; i < 15; i++) {
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

        // Update matrix display and status message
        if (this.state.isAnimating) {
            this.elements.statusMessage.textContent = '🎲 Sedang mengacak...';
        } else if (this.state.participants.length === 0) {
            this.elements.matrixText.textContent = 'Menunggu daftar peserta...';
            this.elements.statusMessage.textContent = 'Menunggu narasumber menambahkan peserta';
        } else if (availableParticipants.length === 0 && this.state.participants.length > 0) {
            this.elements.matrixText.textContent = 'Semua peserta sudah terpilih';
            this.elements.statusMessage.textContent = '🎉 Pengacakan selesai!';
        } else if (this.state.selectedParticipants.length > 0) {
            const lastSelected = this.state.selectedParticipants[this.state.selectedParticipants.length - 1];
            this.elements.matrixText.textContent = lastSelected.name;
            this.elements.statusMessage.textContent = `🎯 ${lastSelected.name} terpilih!`;
            
            // Add success animation
            this.elements.matrixContainer.classList.add('success-animation');
            setTimeout(() => {
                this.elements.matrixContainer.classList.remove('success-animation');
            }, 600);
        } else {
            this.elements.matrixText.textContent = 'Siap untuk pengacakan';
            this.elements.statusMessage.textContent = 'Menunggu pengacakan dimulai...';
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
                        <span class="participant-name">
                            ${index + 1}. ${participant.name}
                        </span>
                        <span class="participant-time">${participant.timestamp}</span>
                    </div>
                `).join('');
        }

        // Update unselected list
        const availableParticipants = this.getAvailableParticipants();
        if (availableParticipants.length === 0) {
            if (this.state.participants.length === 0) {
                this.elements.unselectedList.innerHTML = '<div class="empty-state">Menunggu daftar peserta</div>';
            } else {
                this.elements.unselectedList.innerHTML = '<div class="empty-state">Semua sudah terpilih</div>';
            }
        } else {
            this.elements.unselectedList.innerHTML = availableParticipants
                .map(name => `
                    <div class="participant-item">
                        <span class="participant-name">${name}</span>
                    </div>
                `).join('');
        }
    }

    showNotification(message, type = 'info') {
        this.elements.notification.textContent = message;
        this.elements.notification.className = `notification ${type}`;
        this.elements.notification.classList.add('show');

        setTimeout(() => {
            this.elements.notification.classList.remove('show');
        }, 4000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticipantApp();
});