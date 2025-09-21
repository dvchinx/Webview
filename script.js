// Diario Mood - Main Application JavaScript
class DiarioMoodApp {
    constructor() {
        this.currentUser = null;
        this.entries = [];
        this.currentTheme = 'default';
        this.settings = {
            notifications: false,
            notificationTime: '20:00',
            locationEnabled: false
        };
        this.dailyQuestions = [
            '¿Qué agradeces hoy?',
            '¿Qué te hizo sonreír?',
            '¿Qué aprendiste?',
            '¿Cuál fue el mejor momento de tu día?',
            '¿Qué te inspiró hoy?',
            '¿Cómo te cuidaste hoy?',
            '¿Qué te sorprendió hoy?'
        ];
        this.currentMood = null;
        this.currentMinimalMood = null;
        this.moodChart = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.checkAuth();
        this.updateDate();
        this.setDailyQuestion();
        this.setupNotifications();
    }

    // Data Management
    loadData() {
        try {
            this.currentUser = localStorage.getItem('diario_user');
            this.entries = JSON.parse(localStorage.getItem('diario_entries') || '[]');
            this.currentTheme = localStorage.getItem('diario_theme') || 'default';
            this.settings = JSON.parse(localStorage.getItem('diario_settings') || JSON.stringify(this.settings));
            
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            this.updateSettingsUI();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showToast('Error al cargar datos', 'error');
        }
    }

    saveData() {
        try {
            localStorage.setItem('diario_entries', JSON.stringify(this.entries));
            localStorage.setItem('diario_theme', this.currentTheme);
            localStorage.setItem('diario_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showToast('Error al guardar datos', 'error');
        }
    }

    // Authentication
    checkAuth() {
        if (this.currentUser) {
            this.showScreen('mainScreen');
            this.loadEntries();
        } else {
            this.showScreen('loginScreen');
        }
    }

    setupAuth() {
        const password = document.getElementById('passwordInput').value;
        if (password.length >= 4) {
            localStorage.setItem('diario_user', password);
            this.currentUser = password;
            this.showScreen('mainScreen');
            this.showToast('¡Bienvenido a Diario Mood!', 'success');
            this.loadEntries();
        } else {
            this.showToast('El PIN debe tener al menos 4 dígitos', 'error');
        }
    }

    login() {
        const password = document.getElementById('passwordInput').value;
        const storedPassword = localStorage.getItem('diario_user');
        
        if (!storedPassword) {
            this.setupAuth();
            return;
        }
        
        if (password === storedPassword) {
            this.currentUser = password;
            this.showScreen('mainScreen');
            this.showToast('¡Bienvenido de vuelta!', 'success');
            this.loadEntries();
        } else {
            this.showToast('PIN incorrecto', 'error');
            document.getElementById('passwordInput').value = '';
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('diario_user');
        this.showScreen('loginScreen');
        document.getElementById('passwordInput').value = '';
        this.showToast('Sesión cerrada', 'success');
    }

    // Screen Management
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // Event Listeners
    setupEventListeners() {
        // Login
        document.getElementById('loginBtn').addEventListener('click', () => this.login());
        document.getElementById('setupBtn').addEventListener('click', () => this.setupAuth());
        document.getElementById('passwordInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });

        // Numeric Keypad
        document.querySelectorAll('.keypad-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const number = e.target.dataset.number;
                const passwordInput = document.getElementById('passwordInput');
                
                if (action === 'clear') {
                    passwordInput.value = passwordInput.value.slice(0, -1);
                } else if (action === 'delete') {
                    passwordInput.value = '';
                } else if (number && passwordInput.value.length < 6) {
                    passwordInput.value += number;
                }
            });
        });

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Mood Selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const moodValue = parseInt(e.currentTarget.dataset.value);
                const isMinimal = e.currentTarget.closest('#minimalTab');
                
                if (isMinimal) {
                    this.selectMinimalMood(e.currentTarget, moodValue);
                } else {
                    this.selectMood(e.currentTarget, moodValue);
                }
            });
        });

        // Save Entries
        document.getElementById('saveEntry').addEventListener('click', () => this.saveEntry());
        document.getElementById('saveMinimal').addEventListener('click', () => this.saveMinimalEntry());

        // Media Buttons (placeholder functionality)
        document.getElementById('audioBtn').addEventListener('click', () => {
            this.showToast('Función de grabación disponible próximamente', 'info');
        });
        document.getElementById('photoBtn').addEventListener('click', () => {
            this.showToast('Función de cámara disponible próximamente', 'info');
        });

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        document.getElementById('themeToggle').addEventListener('click', () => this.cycleTheme());

        // Theme Selection
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.setTheme(theme);
            });
        });

        // Settings Controls
        document.getElementById('notificationsEnabled').addEventListener('change', (e) => {
            this.settings.notifications = e.target.checked;
            this.saveData();
            this.setupNotifications();
        });

        document.getElementById('notificationTime').addEventListener('change', (e) => {
            this.settings.notificationTime = e.target.value;
            this.saveData();
        });

        document.getElementById('locationEnabled').addEventListener('change', (e) => {
            this.settings.locationEnabled = e.target.checked;
            this.saveData();
        });

        document.getElementById('changePin').addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres cambiar tu PIN? Tendrás que configurar uno nuevo.')) {
                this.logout();
            }
        });

        document.getElementById('exportData').addEventListener('click', () => this.exportData());

        // Character Counter for Minimal Mode
        document.getElementById('minimalText').addEventListener('input', (e) => {
            const counter = document.querySelector('.char-counter');
            const length = e.target.value.length;
            counter.textContent = `${length}/100`;
            
            if (length > 90) {
                counter.style.color = 'var(--error-color)';
            } else {
                counter.style.color = 'var(--text-secondary)';
            }
        });

        // Modal Close on Outside Click
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.closeSettings();
            }
        });
    }

    // Tab Management
    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        // Special handling for mood tab
        if (tabName === 'mood') {
            this.updateMoodChart();
        }
    }

    // Mood Selection
    selectMood(button, value) {
        document.querySelectorAll('#diaryTab .mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        this.currentMood = value;
    }

    selectMinimalMood(button, value) {
        document.querySelectorAll('#minimalTab .mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        this.currentMinimalMood = value;
    }

    // Entry Management
    saveEntry() {
        const text = document.getElementById('diaryText').value.trim();
        const question = document.getElementById('dailyQuestionText').textContent;
        
        if (!text && !this.currentMood) {
            this.showToast('Escribe algo o selecciona tu estado de ánimo', 'warning');
            return;
        }

        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            text: text,
            mood: this.currentMood,
            question: question,
            type: 'full'
        };

        this.entries.unshift(entry);
        this.saveData();
        this.loadEntries();
        this.clearForm();
        this.showToast('Entrada guardada correctamente', 'success');
    }

    saveMinimalEntry() {
        const text = document.getElementById('minimalText').value.trim();
        
        if (!text && !this.currentMinimalMood) {
            this.showToast('Escribe algo o selecciona tu estado de ánimo', 'warning');
            return;
        }

        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            text: text,
            mood: this.currentMinimalMood,
            question: null,
            type: 'minimal'
        };

        this.entries.unshift(entry);
        this.saveData();
        this.loadEntries();
        this.clearMinimalForm();
        this.showToast('Entrada rápida guardada', 'success');
    }

    clearForm() {
        document.getElementById('diaryText').value = '';
        document.querySelectorAll('#diaryTab .mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.currentMood = null;
    }

    clearMinimalForm() {
        document.getElementById('minimalText').value = '';
        document.querySelector('.char-counter').textContent = '0/100';
        document.querySelectorAll('#minimalTab .mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.currentMinimalMood = null;
    }

    loadEntries() {
        const entriesList = document.getElementById('entriesList');
        entriesList.innerHTML = '';

        if (this.entries.length === 0) {
            entriesList.innerHTML = `
                <div class="entry-item">
                    <p style="text-align: center; color: var(--text-secondary); font-style: italic;">
                        No hay entradas aún. ¡Escribe tu primera experiencia!
                    </p>
                </div>
            `;
            return;
        }

        // Show only the last 10 entries to avoid performance issues
        const recentEntries = this.entries.slice(0, 10);
        
        recentEntries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'entry-item';
            
            const date = new Date(entry.date);
            const formattedDate = date.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const moodEmoji = this.getMoodEmoji(entry.mood);
            
            entryElement.innerHTML = `
                <div class="entry-header">
                    <span class="entry-date">${formattedDate}</span>
                    <span class="entry-mood">${moodEmoji}</span>
                </div>
                ${entry.text ? `<div class="entry-text">${entry.text}</div>` : ''}
                ${entry.question ? `<div class="entry-question">"${entry.question}"</div>` : ''}
                ${entry.type === 'minimal' ? `<div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 8px;">✨ Entrada rápida</div>` : ''}
            `;
            
            entriesList.appendChild(entryElement);
        });

        if (this.entries.length > 10) {
            const moreElement = document.createElement('div');
            moreElement.className = 'entry-item';
            moreElement.style.textAlign = 'center';
            moreElement.innerHTML = `
                <p style="color: var(--text-secondary); font-style: italic;">
                    ... y ${this.entries.length - 10} entradas más
                </p>
            `;
            entriesList.appendChild(moreElement);
        }
    }

    getMoodEmoji(moodValue) {
        const moods = {
            1: '😢',
            2: '😞',
            3: '😐',
            4: '😊',
            5: '😄'
        };
        return moods[moodValue] || '😐';
    }

    // Daily Question
    setDailyQuestion() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const questionIndex = dayOfYear % this.dailyQuestions.length;
        
        document.getElementById('dailyQuestionText').textContent = this.dailyQuestions[questionIndex];
    }

    // Date Display
    updateDate() {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('currentDate').textContent = formattedDate;
    }

    // Theme Management
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        
        this.saveData();
        this.showToast(`Tema "${theme}" aplicado`, 'success');
    }

    cycleTheme() {
        const themes = ['default', 'dark', 'pastel', 'minimal'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }

    // Mood Chart
    updateMoodChart() {
        const canvas = document.getElementById('moodChart');
        const ctx = canvas.getContext('2d');

        // Get last 7 days of data
        const last7Days = this.getLast7DaysData();
        
        if (this.moodChart) {
            this.moodChart.destroy();
        }

        this.moodChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.labels,
                datasets: [{
                    label: 'Estado de ánimo',
                    data: last7Days.moods,
                    borderColor: 'var(--primary-color)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'var(--primary-color)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                const moods = ['', '😢', '😞', '😐', '😊', '😄'];
                                return moods[value] || '';
                            }
                        },
                        grid: {
                            color: 'var(--border-color)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'var(--border-color)'
                        }
                    }
                }
            }
        });

        // Update stats
        this.updateMoodStats(last7Days);
    }

    getLast7DaysData() {
        const today = new Date();
        const labels = [];
        const moods = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
            labels.push(dayName);

            // Find entries for this day
            const dayEntries = this.entries.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.toDateString() === date.toDateString();
            });

            // Calculate average mood for the day
            if (dayEntries.length > 0) {
                const validMoods = dayEntries.filter(entry => entry.mood).map(entry => entry.mood);
                if (validMoods.length > 0) {
                    const average = validMoods.reduce((sum, mood) => sum + mood, 0) / validMoods.length;
                    moods.push(Math.round(average));
                } else {
                    moods.push(null);
                }
            } else {
                moods.push(null);
            }
        }

        return { labels, moods };
    }

    updateMoodStats(weekData) {
        const validMoods = weekData.moods.filter(mood => mood !== null);
        
        if (validMoods.length > 0) {
            const average = validMoods.reduce((sum, mood) => sum + mood, 0) / validMoods.length;
            document.getElementById('weeklyAverage').textContent = this.getMoodEmoji(Math.round(average));

            // Find best day
            const maxMood = Math.max(...validMoods);
            const bestDayIndex = weekData.moods.indexOf(maxMood);
            if (bestDayIndex !== -1) {
                document.getElementById('bestDay').textContent = weekData.labels[bestDayIndex];
            }
        } else {
            document.getElementById('weeklyAverage').textContent = '😐';
            document.getElementById('bestDay').textContent = 'Sin datos';
        }
    }

    // Settings
    openSettings() {
        document.getElementById('settingsModal').classList.add('active');
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    updateSettingsUI() {
        document.getElementById('notificationsEnabled').checked = this.settings.notifications;
        document.getElementById('notificationTime').value = this.settings.notificationTime;
        document.getElementById('locationEnabled').checked = this.settings.locationEnabled;
        
        // Update theme selection
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${this.currentTheme}"]`)?.classList.add('active');
    }

    // Notifications
    setupNotifications() {
        if (this.settings.notifications && 'Notification' in window) {
            this.requestNotificationPermission();
        }
    }

    requestNotificationPermission() {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.scheduleNotifications();
                    this.showToast('Notificaciones activadas', 'success');
                }
            });
        } else if (Notification.permission === 'granted') {
            this.scheduleNotifications();
        }
    }

    scheduleNotifications() {
        // Clear existing notifications
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }

        if (!this.settings.notifications) return;

        const now = new Date();
        const [hours, minutes] = this.settings.notificationTime.split(':');
        const notificationTime = new Date();
        notificationTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // If notification time has passed today, schedule for tomorrow
        if (notificationTime <= now) {
            notificationTime.setDate(notificationTime.getDate() + 1);
        }

        const timeUntilNotification = notificationTime.getTime() - now.getTime();

        this.notificationTimeout = setTimeout(() => {
            this.showDailyNotification();
            // Schedule next day
            this.scheduleNotifications();
        }, timeUntilNotification);
    }

    showDailyNotification() {
        if (Notification.permission === 'granted') {
            new Notification('Diario Mood', {
                body: '¿Quieres escribir cómo estuvo tu día?',
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📖</text></svg>',
                tag: 'daily-reminder'
            });
        }
    }

    // Data Export
    exportData() {
        try {
            const exportData = {
                entries: this.entries,
                settings: this.settings,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `diario-mood-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showToast('Datos exportados correctamente', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showToast('Error al exportar datos', 'error');
        }
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.diarioApp = new DiarioMoodApp();
});

// Service Worker Registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
