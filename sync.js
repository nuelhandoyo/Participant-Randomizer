/**
 * Real-time synchronization system for participant randomizer
 * Uses BroadcastChannel API for cross-tab communication
 */

class SyncManager {
    constructor() {
        this.channel = new BroadcastChannel('participantRandomizer');
        this.state = {
            participants: [],
            selectedParticipants: [],
            isRandomizing: false,
            currentSelection: null,
            lastUpdate: Date.now()
        };
        
        this.listeners = {};
        this.init();
    }

    init() {
        // Listen for messages from other tabs
        this.channel.addEventListener('message', (event) => {
            this.handleRemoteUpdate(event.data);
        });

        // Load saved state from localStorage
        this.loadState();

        // Heartbeat to detect active tabs
        this.startHeartbeat();
    }

    // State management
    loadState() {
        try {
            const saved = localStorage.getItem('participantRandomizerState');
            if (saved) {
                const state = JSON.parse(saved);
                this.state = { ...this.state, ...state };
                this.emit('stateLoaded', this.state);
            }
        } catch (error) {
            console.error('Error loading state:', error);
        }
    }

    saveState() {
        try {
            const stateToSave = {
                ...this.state,
                lastUpdate: Date.now()
            };
            localStorage.setItem('participantRandomizerState', JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }

    // Event system
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in event listener:', error);
                }
            });
        }
    }

    // Synchronization methods
    broadcast(action, data) {
        const message = {
            action,
            data,
            timestamp: Date.now(),
            sender: this.getTabId()
        };

        this.channel.postMessage(message);
        this.handleLocalUpdate(action, data);
    }

    handleRemoteUpdate(message) {
        if (message.sender === this.getTabId()) return; // Ignore own messages
        
        this.handleLocalUpdate(message.action, message.data, false);
    }

    handleLocalUpdate(action, data, saveState = true) {
        switch (action) {
            case 'setParticipants':
                this.state.participants = [...data];
                break;
                
            case 'addParticipant':
                if (!this.state.participants.find(p => p.id === data.id)) {
                    this.state.participants.push(data);
                }
                break;
                
            case 'selectParticipant':
                const participant = this.state.participants.find(p => p.id === data.id);
                if (participant && !participant.selected) {
                    participant.selected = true;
                    participant.selectedAt = data.selectedAt;
                    this.state.selectedParticipants.push(participant);
                    this.state.currentSelection = participant;
                }
                break;
                
            case 'startRandomizing':
                this.state.isRandomizing = true;
                this.state.currentSelection = null;
                break;
                
            case 'stopRandomizing':
                this.state.isRandomizing = false;
                break;
                
            case 'clearAll':
                this.state.participants = [];
                this.state.selectedParticipants = [];
                this.state.currentSelection = null;
                this.state.isRandomizing = false;
                break;
                
            case 'updateCurrentName':
                // Temporary display update during randomization
                if (this.state.isRandomizing) {
                    this.emit('currentNameUpdate', data.name);
                }
                break;
        }

        if (saveState) {
            this.saveState();
        }
        
        this.emit('stateUpdate', this.state);
    }

    // Public API
    setParticipants(participants) {
        this.broadcast('setParticipants', participants);
    }

    addParticipant(participant) {
        this.broadcast('addParticipant', participant);
    }

    selectParticipant(participantId) {
        const data = {
            id: participantId,
            selectedAt: new Date().toLocaleTimeString()
        };
        this.broadcast('selectParticipant', data);
    }

    startRandomizing() {
        this.broadcast('startRandomizing', {});
    }

    stopRandomizing() {
        this.broadcast('stopRandomizing', {});
    }

    clearAll() {
        this.broadcast('clearAll', {});
    }

    updateCurrentName(name) {
        this.broadcast('updateCurrentName', { name });
    }

    getState() {
        return { ...this.state };
    }

    getAvailableParticipants() {
        return this.state.participants.filter(p => !p.selected);
    }

    getSelectedParticipants() {
        return this.state.selectedParticipants;
    }

    // Utility methods
    getTabId() {
        if (!this.tabId) {
            this.tabId = 'tab_' + Math.random().toString(36).substr(2, 9);
        }
        return this.tabId;
    }

    startHeartbeat() {
        setInterval(() => {
            this.broadcast('heartbeat', { tabId: this.getTabId() });
        }, 5000);
    }

    // CSV Export functionality
    exportToCSV() {
        const allParticipants = this.state.participants.map(p => ({
            name: p.name,
            selected: p.selected ? 'Yes' : 'No',
            selectedAt: p.selectedAt || ''
        }));

        let csvContent = 'Name,Selected,Selected At\n';
        allParticipants.forEach(p => {
            csvContent += `"${p.name}","${p.selected}","${p.selectedAt}"\n`;
        });

        return csvContent;
    }

    downloadCSV() {
        const csvContent = this.exportToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `participants_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Create global sync manager instance
window.syncManager = new SyncManager();