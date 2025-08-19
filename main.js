/**
 * Main application logic for Disney Futuristic Participant Randomizer
 */

class ParticipantRandomizer {
    constructor() {
        this.currentView = 'speaker';
        this.randomizationInterval = null;
        this.randomizationSpeed = 100;
        this.isRandomizing = false;
        
        this.init();
    }

    init() {
        this.setupViewSwitching();
        this.setupSpeakerView();
        this.setupParticipantView();
        this.setupSyncListeners();
        
        // Initial state update
        this.updateUI(window.syncManager.getState());
        
        console.log('🚀 Futuristic Participant Randomizer initialized');
    }

    setupViewSwitching() {
        const speakerBtn = document.getElementById('speakerBtn');
        const participantBtn = document.getElementById('participantBtn');
        const speakerView = document.getElementById('speakerView');
        const participantView = document.getElementById('participantView');

        speakerBtn.addEventListener('click', () => {
            this.switchView('speaker');
        });

        participantBtn.addEventListener('click', () => {
            this.switchView('participant');
        });
    }

    switchView(view) {
        const speakerBtn = document.getElementById('speakerBtn');
        const participantBtn = document.getElementById('participantBtn');
        const speakerView = document.getElementById('speakerView');
        const participantView = document.getElementById('participantView');

        if (view === 'speaker') {
            speakerBtn.classList.add('active');
            participantBtn.classList.remove('active');
            speakerView.classList.add('active');
            participantView.classList.remove('active');
        } else {
            participantBtn.classList.add('active');
            speakerBtn.classList.remove('active');
            participantView.classList.add('active');
            speakerView.classList.remove('active');
        }

        this.currentView = view;
    }

    setupSpeakerView() {
        // File upload
        const csvFile = document.getElementById('csvFile');
        const dropZone = document.getElementById('dropZone');
        
        csvFile.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processCSVFile(files[0]);
            }
        });

        // Text input
        const namesInput = document.getElementById('namesInput');
        const loadNamesBtn = document.getElementById('loadNamesBtn');
        
        loadNamesBtn.addEventListener('click', () => {
            const text = namesInput.value.trim();
            if (text) {
                this.loadNamesFromText(text);
                namesInput.value = '';
            }
        });

        // Control buttons
        const startRandomBtn = document.getElementById('startRandomBtn');
        const stopRandomBtn = document.getElementById('stopRandomBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        startRandomBtn.addEventListener('click', () => this.startRandomization());
        stopRandomBtn.addEventListener('click', () => this.stopRandomization());
        clearAllBtn.addEventListener('click', () => this.clearAll());
        downloadBtn.addEventListener('click', () => this.downloadCSV());
    }

    setupParticipantView() {
        // Participant view is primarily display-only
        // All interactions come through sync from speaker view
    }

    setupSyncListeners() {
        window.syncManager.on('stateUpdate', (state) => {
            this.updateUI(state);
        });

        window.syncManager.on('currentNameUpdate', (name) => {
            this.updateCurrentNameDisplays(name);
        });

        window.syncManager.on('stateLoaded', (state) => {
            this.updateUI(state);
        });
    }

    // File handling
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.processCSVFile(file);
        }
    }

    processCSVFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const names = this.parseCSV(csv);
                this.loadParticipants(names);
                this.showNotification('✅ CSV file loaded successfully!', 'success');
            } catch (error) {
                this.showNotification('❌ Error reading CSV file', 'error');
                console.error('CSV parsing error:', error);
            }
        };
        reader.readAsText(file);
    }

    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        const names = [];
        
        lines.forEach(line => {
            // Handle quoted values and split by comma
            const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (matches && matches.length > 0) {
                const name = matches[0].replace(/^"|"$/g, '').trim();
                if (name) {
                    names.push(name);
                }
            }
        });
        
        return names;
    }

    loadNamesFromText(text) {
        // Split by commas or new lines
        const names = text.split(/[,\n]/)
            .map(name => name.trim())
            .filter(name => name.length > 0);
        
        this.loadParticipants(names);
        this.showNotification(`✅ Loaded ${names.length} participants!`, 'success');
    }

    loadParticipants(names) {
        const participants = names.map(name => ({
            id: this.generateId(),
            name: name,
            selected: false,
            selectedAt: null
        }));

        window.syncManager.setParticipants(participants);
    }

    // Randomization logic
    startRandomization() {
        const availableParticipants = window.syncManager.getAvailableParticipants();
        if (availableParticipants.length === 0) {
            this.showNotification('❌ No participants available for selection', 'error');
            return;
        }

        this.isRandomizing = true;
        window.syncManager.startRandomizing();
        window.animationManager.startSelectionAnimation();

        // Start the randomization animation
        this.randomizationInterval = setInterval(() => {
            const randomParticipant = availableParticipants[
                Math.floor(Math.random() * availableParticipants.length)
            ];
            window.syncManager.updateCurrentName(randomParticipant.name);
        }, this.randomizationSpeed);

        // Auto-stop after random time (3-8 seconds)
        const stopTime = 3000 + Math.random() * 5000;
        setTimeout(() => {
            if (this.isRandomizing) {
                this.stopRandomization();
            }
        }, stopTime);
    }

    stopRandomization() {
        if (!this.isRandomizing) return;

        this.isRandomizing = false;
        clearInterval(this.randomizationInterval);

        const availableParticipants = window.syncManager.getAvailableParticipants();
        if (availableParticipants.length > 0) {
            // Select final participant
            const selectedParticipant = availableParticipants[
                Math.floor(Math.random() * availableParticipants.length)
            ];
            
            window.syncManager.selectParticipant(selectedParticipant.id);
            
            // Animate selection complete
            setTimeout(() => {
                const nameElements = document.querySelectorAll('.selected-name');
                nameElements.forEach(element => {
                    window.animationManager.animateSelectionComplete(element, selectedParticipant.name);
                });
            }, 300);
        }

        window.syncManager.stopRandomizing();
        window.animationManager.stopSelectionAnimation();
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all participants? This cannot be undone.')) {
            window.syncManager.clearAll();
            this.showNotification('🗑️ All participants cleared', 'info');
        }
    }

    downloadCSV() {
        window.syncManager.downloadCSV();
        this.showNotification('📥 CSV file downloaded!', 'success');
    }

    // UI Updates
    updateUI(state) {
        this.updateCounts(state);
        this.updateParticipantLists(state);
        this.updateControls(state);
        this.updateCurrentSelection(state);
    }

    updateCounts(state) {
        const totalCount = document.getElementById('totalCount');
        const selectedCount = document.getElementById('selectedCount');
        const remainingCount = document.getElementById('remainingCount');

        if (totalCount) totalCount.textContent = state.participants.length;
        if (selectedCount) selectedCount.textContent = state.selectedParticipants.length;
        if (remainingCount) remainingCount.textContent = state.participants.length - state.selectedParticipants.length;
    }

    updateParticipantLists(state) {
        const notSelectedList = document.getElementById('notSelectedList');
        const selectedList = document.getElementById('selectedList');

        if (notSelectedList) {
            notSelectedList.innerHTML = '';
            const available = state.participants.filter(p => !p.selected);
            available.forEach(participant => {
                const item = this.createParticipantItem(participant, false);
                notSelectedList.appendChild(item);
                window.animationManager.animateParticipantAdd(item);
            });
        }

        if (selectedList) {
            selectedList.innerHTML = '';
            state.selectedParticipants.forEach(participant => {
                const item = this.createParticipantItem(participant, true);
                selectedList.appendChild(item);
            });
        }
    }

    createParticipantItem(participant, isSelected) {
        const item = document.createElement('div');
        item.className = 'participant-item';
        item.innerHTML = `
            <div class="participant-name">${participant.name}</div>
            ${isSelected && participant.selectedAt ? 
                `<div class="participant-timestamp">Selected at ${participant.selectedAt}</div>` : 
                ''
            }
        `;
        return item;
    }

    updateControls(state) {
        const startBtn = document.getElementById('startRandomBtn');
        const stopBtn = document.getElementById('stopRandomBtn');

        if (startBtn) {
            const hasAvailable = state.participants.some(p => !p.selected);
            startBtn.disabled = !hasAvailable || state.isRandomizing;
        }

        if (stopBtn) {
            stopBtn.disabled = !state.isRandomizing;
        }
    }

    updateCurrentSelection(state) {
        const speakerName = document.getElementById('selectedNameSpeaker');
        const participantName = document.getElementById('selectedNameParticipant');

        let displayText = 'Ready to Begin';
        
        if (state.isRandomizing) {
            displayText = 'Selecting...';
        } else if (state.currentSelection) {
            displayText = state.currentSelection.name;
        } else if (state.participants.length === 0) {
            displayText = 'Load Participants';
        } else if (state.participants.every(p => p.selected)) {
            displayText = 'All Selected!';
        }

        if (speakerName && speakerName.textContent !== displayText) {
            window.animationManager.animateNameChange(speakerName, displayText);
        }
        
        if (participantName && participantName.textContent !== displayText) {
            window.animationManager.animateNameChange(participantName, displayText);
        }
    }

    updateCurrentNameDisplays(name) {
        const speakerName = document.getElementById('selectedNameSpeaker');
        const participantName = document.getElementById('selectedNameParticipant');

        if (speakerName) speakerName.textContent = name;
        if (participantName) participantName.textContent = name;
    }

    // Utility methods
    generateId() {
        return 'participant_' + Math.random().toString(36).substr(2, 9) + Date.now();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--glass-bg);
            border: 1px solid var(--primary-cyan);
            border-radius: var(--border-radius);
            padding: 15px 25px;
            color: var(--text-primary);
            backdrop-filter: blur(15px);
            z-index: 10000;
            opacity: 0;
            transition: var(--transition);
        `;

        if (type === 'success') {
            notification.style.borderColor = 'var(--success)';
            notification.style.boxShadow = '0 0 20px var(--success)';
        } else if (type === 'error') {
            notification.style.borderColor = 'var(--danger)';
            notification.style.boxShadow = '0 0 20px var(--danger)';
        }

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.participantRandomizer = new ParticipantRandomizer();
});

// Handle page visibility changes for better sync
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Refresh state when page becomes visible
        const state = window.syncManager.getState();
        window.participantRandomizer.updateUI(state);
    }
});