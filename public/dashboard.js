// Dashboard functionality
let currentUser = null;
let charts = {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadUserData();
    setupEventListeners();
});

function initializeDashboard() {
    // Check if user is logged in
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = '/';
        return;
    }

    // Set user email
    document.getElementById('user-email').textContent = userEmail;
    
    // Load initial data
    loadDashboardData();
    initializeCharts();
}

function setupEventListeners() {
    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', handleProfileUpdate);

    // API key form submission
    const apiKeyForm = document.getElementById('api-key-form');
    apiKeyForm.addEventListener('submit', handleApiKeyGeneration);

    // Search and filter events
    document.getElementById('remedy-search').addEventListener('input', filterRemedies);
    document.getElementById('remedy-category-filter').addEventListener('change', filterRemedies);

    // Settings checkboxes
    document.getElementById('email-notifications').addEventListener('change', updateNotificationSettings);
    document.getElementById('weekly-reports').addEventListener('change', updateNotificationSettings);
    document.getElementById('reminder-emails').addEventListener('change', updateNotificationSettings);
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update navigation
    document.querySelectorAll('.sidebar-nav li').forEach(li => {
        li.classList.remove('active');
    });
    event.target.closest('li').classList.add('active');

    // Update section title
    const titles = {
        overview: 'Dashboard Overview',
        assessments: 'Your Assessments',
        remedies: 'Saved Remedies',
        reports: 'Health Reports',
        analytics: 'Advanced Analytics',
        subscription: 'Subscription Details',
        'api-keys': 'API Keys',
        settings: 'Settings'
    };
    document.getElementById('section-title').textContent = titles[sectionId];

    // Load section-specific data
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'assessments':
            loadAssessments();
            break;
        case 'remedies':
            loadSavedRemedies();
            break;
        case 'reports':
            loadReports();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'subscription':
            loadSubscriptionDetails();
            break;
        case 'api-keys':
            loadApiKeys();
            break;
        case 'settings':
            loadUserSettings();
            break;
    }
}

// Dashboard data loading
async function loadDashboardData() {
    try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();

        if (data.success) {
            updateDashboardStats(data.data);
            updateActivityList(data.data.recentActivity);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateDashboardStats(stats) {
    document.getElementById('total-assessments').textContent = stats.totalAssessments || 0;
    document.getElementById('remedies-viewed').textContent = stats.remediesViewed || 0;
    document.getElementById('api-calls').textContent = stats.apiCalls || 0;
    document.getElementById('days-active').textContent = stats.daysActive || 0;
    
    // Update plan badge
    const planBadge = document.getElementById('plan-badge');
    planBadge.textContent = stats.plan || 'Free';
    planBadge.className = `plan-badge ${stats.plan?.toLowerCase() || 'free'}`;
}

function updateActivityList(activities) {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    if (!activities || activities.length === 0) {
        activityList.innerHTML = '<p class="no-data">No recent activity</p>';
        return;
    }

    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-text">${activity.description}</p>
                <span class="activity-time">${formatTime(activity.timestamp)}</span>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

function getActivityIcon(type) {
    const icons = {
        assessment: 'fa-clipboard-list',
        remedy: 'fa-pills',
        report: 'fa-file-medical',
        subscription: 'fa-credit-card',
        api: 'fa-key'
    };
    return icons[type] || 'fa-info-circle';
}

// Charts initialization
function initializeCharts() {
    // Assessment history chart
    const assessmentCtx = document.getElementById('assessment-chart').getContext('2d');
    charts.assessment = new Chart(assessmentCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Assessments',
                data: [],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Dosha distribution chart
    const doshaCtx = document.getElementById('dosha-chart').getContext('2d');
    charts.dosha = new Chart(doshaCtx, {
        type: 'doughnut',
        data: {
            labels: ['Vata', 'Pitta', 'Kapha'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#e74c3c', '#f39c12', '#27ae60']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Assessments section
async function loadAssessments() {
    try {
        const response = await fetch('/api/assessments');
        const data = await response.json();

        if (data.success) {
            displayAssessments(data.data);
        }
    } catch (error) {
        console.error('Error loading assessments:', error);
    }
}

function displayAssessments(assessments) {
    const assessmentsList = document.getElementById('assessments-list');
    assessmentsList.innerHTML = '';

    if (!assessments || assessments.length === 0) {
        assessmentsList.innerHTML = '<p class="no-data">No assessments found</p>';
        return;
    }

    assessments.forEach(assessment => {
        const assessmentCard = document.createElement('div');
        assessmentCard.className = 'assessment-card';
        assessmentCard.innerHTML = `
            <div class="assessment-header">
                <h4>Assessment #${assessment.id}</h4>
                <span class="assessment-date">${formatDate(assessment.createdAt)}</span>
            </div>
            <div class="assessment-details">
                <p><strong>Primary Dosha:</strong> ${assessment.primaryDosha}</p>
                <p><strong>Secondary Dosha:</strong> ${assessment.secondaryDosha}</p>
                <p><strong>Health Score:</strong> ${assessment.healthScore}/100</p>
            </div>
            <div class="assessment-actions">
                <button class="btn btn-secondary" onclick="viewAssessment(${assessment.id})">View Details</button>
                <button class="btn btn-outline" onclick="downloadReport(${assessment.id})">Download Report</button>
            </div>
        `;
        assessmentsList.appendChild(assessmentCard);
    });
}

function startNewAssessment() {
    window.location.href = '/';
}

// Remedies section
async function loadSavedRemedies() {
    try {
        const response = await fetch('/api/remedies/saved');
        const data = await response.json();

        if (data.success) {
            displaySavedRemedies(data.data);
        }
    } catch (error) {
        console.error('Error loading saved remedies:', error);
    }
}

function displaySavedRemedies(remedies) {
    const remediesGrid = document.getElementById('remedies-grid');
    remediesGrid.innerHTML = '';

    if (!remedies || remedies.length === 0) {
        remediesGrid.innerHTML = '<p class="no-data">No saved remedies found</p>';
        return;
    }

    remedies.forEach(remedy => {
        const remedyCard = document.createElement('div');
        remedyCard.className = 'remedy-card';
        remedyCard.innerHTML = `
            <div class="remedy-header">
                <h4>${remedy.name}</h4>
                <span class="remedy-category">${remedy.category}</span>
            </div>
            <p class="remedy-description">${remedy.description}</p>
            <div class="remedy-actions">
                <button class="btn btn-secondary" onclick="viewRemedy(${remedy.id})">View Details</button>
                <button class="btn btn-outline" onclick="removeRemedy(${remedy.id})">Remove</button>
            </div>
        `;
        remediesGrid.appendChild(remedyCard);
    });
}

function filterRemedies() {
    const searchTerm = document.getElementById('remedy-search').value.toLowerCase();
    const categoryFilter = document.getElementById('remedy-category-filter').value;
    
    const remedyCards = document.querySelectorAll('.remedy-card');
    
    remedyCards.forEach(card => {
        const name = card.querySelector('h4').textContent.toLowerCase();
        const category = card.querySelector('.remedy-category').textContent;
        
        const matchesSearch = name.includes(searchTerm);
        const matchesCategory = !categoryFilter || category === categoryFilter;
        
        card.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
    });
}

// Reports section
async function loadReports() {
    try {
        const response = await fetch('/api/reports');
        const data = await response.json();

        if (data.success) {
            displayReports(data.data);
        }
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

function displayReports(reports) {
    const reportsList = document.getElementById('reports-list');
    reportsList.innerHTML = '';

    if (!reports || reports.length === 0) {
        reportsList.innerHTML = '<p class="no-data">No reports found</p>';
        return;
    }

    reports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';
        reportCard.innerHTML = `
            <div class="report-header">
                <h4>${report.title}</h4>
                <span class="report-date">${formatDate(report.createdAt)}</span>
            </div>
            <p class="report-description">${report.description}</p>
            <div class="report-actions">
                <button class="btn btn-secondary" onclick="viewReport(${report.id})">View Report</button>
                <button class="btn btn-outline" onclick="downloadReport(${report.id})">Download PDF</button>
            </div>
        `;
        reportsList.appendChild(reportCard);
    });
}

function generateNewReport() {
    // Show report generation modal or redirect to report creation
    alert('Report generation feature coming soon!');
}

// Analytics section
async function loadAnalytics() {
    try {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        const response = await fetch(`/api/analytics?start=${startDate}&end=${endDate}`);
        const data = await response.json();

        if (data.success) {
            updateAnalyticsCharts(data.data);
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function updateAnalyticsCharts(analyticsData) {
    // Update usage trends chart
    if (charts.usageTrends) {
        charts.usageTrends.destroy();
    }

    const usageCtx = document.getElementById('usage-trends-chart').getContext('2d');
    charts.usageTrends = new Chart(usageCtx, {
        type: 'line',
        data: {
            labels: analyticsData.usageTrends.labels,
            datasets: [{
                label: 'API Calls',
                data: analyticsData.usageTrends.data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Update health score chart
    if (charts.healthScore) {
        charts.healthScore.destroy();
    }

    const healthCtx = document.getElementById('health-score-chart').getContext('2d');
    charts.healthScore = new Chart(healthCtx, {
        type: 'radar',
        data: {
            labels: ['Physical', 'Mental', 'Emotional', 'Spiritual', 'Social'],
            datasets: [{
                label: 'Health Score',
                data: analyticsData.healthScores,
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.2)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function updateAnalytics() {
    loadAnalytics();
}

// Subscription section
async function loadSubscriptionDetails() {
    try {
        const response = await fetch('/api/subscription');
        const data = await response.json();

        if (data.success) {
            updateSubscriptionDisplay(data.data);
        }
    } catch (error) {
        console.error('Error loading subscription:', error);
    }
}

function updateSubscriptionDisplay(subscription) {
    document.getElementById('current-plan').textContent = subscription.plan;
    document.getElementById('plan-status').textContent = subscription.status;
    document.getElementById('next-billing').textContent = subscription.nextBilling || 'N/A';
    document.getElementById('billing-amount').textContent = subscription.amount || '$0/month';
    document.getElementById('plan-features').textContent = subscription.features || 'Basic features';
}

function upgradePlan() {
    window.location.href = '/pricing.html';
}

async function cancelSubscription() {
    if (confirm('Are you sure you want to cancel your subscription?')) {
        try {
            const response = await fetch('/api/subscription/cancel', {
                method: 'POST'
            });
            const data = await response.json();

            if (data.success) {
                alert('Subscription cancelled successfully');
                loadSubscriptionDetails();
            } else {
                alert('Error cancelling subscription: ' + data.message);
            }
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            alert('Error cancelling subscription');
        }
    }
}

// API Keys section
async function loadApiKeys() {
    try {
        const response = await fetch('/api/keys');
        const data = await response.json();

        if (data.success) {
            displayApiKeys(data.data);
        }
    } catch (error) {
        console.error('Error loading API keys:', error);
    }
}

function displayApiKeys(keys) {
    const keysList = document.getElementById('api-keys-list');
    keysList.innerHTML = '';

    if (!keys || keys.length === 0) {
        keysList.innerHTML = '<p class="no-data">No API keys found</p>';
        return;
    }

    keys.forEach(key => {
        const keyCard = document.createElement('div');
        keyCard.className = 'api-key-card';
        keyCard.innerHTML = `
            <div class="key-header">
                <h4>${key.name}</h4>
                <span class="key-status ${key.status}">${key.status}</span>
            </div>
            <div class="key-details">
                <p><strong>Permissions:</strong> ${key.permissions}</p>
                <p><strong>Rate Limit:</strong> ${key.rateLimit} requests/day</p>
                <p><strong>Created:</strong> ${formatDate(key.createdAt)}</p>
                <p><strong>Last Used:</strong> ${key.lastUsed ? formatDate(key.lastUsed) : 'Never'}</p>
            </div>
            <div class="key-actions">
                <button class="btn btn-secondary" onclick="copyApiKey('${key.key}')">Copy Key</button>
                <button class="btn btn-outline" onclick="revokeApiKey('${key.id}')">Revoke</button>
            </div>
        `;
        keysList.appendChild(keyCard);
    });
}

function generateApiKey() {
    document.getElementById('api-key-modal').style.display = 'block';
}

async function handleApiKeyGeneration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const keyData = {
        name: formData.get('key-name'),
        permissions: formData.get('key-permissions'),
        rateLimit: parseInt(formData.get('key-rate-limit'))
    };

    try {
        const response = await fetch('/api/keys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(keyData)
        });
        const data = await response.json();

        if (data.success) {
            alert('API key generated successfully!');
            document.getElementById('api-key-modal').style.display = 'none';
            loadApiKeys();
        } else {
            alert('Error generating API key: ' + data.message);
        }
    } catch (error) {
        console.error('Error generating API key:', error);
        alert('Error generating API key');
    }
}

function copyApiKey(key) {
    navigator.clipboard.writeText(key).then(() => {
        alert('API key copied to clipboard!');
    });
}

async function revokeApiKey(keyId) {
    if (confirm('Are you sure you want to revoke this API key?')) {
        try {
            const response = await fetch(`/api/keys/${keyId}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                alert('API key revoked successfully');
                loadApiKeys();
            } else {
                alert('Error revoking API key: ' + data.message);
            }
        } catch (error) {
            console.error('Error revoking API key:', error);
            alert('Error revoking API key');
        }
    }
}

// Settings section
async function loadUserSettings() {
    try {
        const response = await fetch('/api/user/settings');
        const data = await response.json();

        if (data.success) {
            updateSettingsDisplay(data.data);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function updateSettingsDisplay(settings) {
    document.getElementById('profile-email').value = settings.email || '';
    document.getElementById('profile-name').value = settings.name || '';
    document.getElementById('email-notifications').checked = settings.emailNotifications;
    document.getElementById('weekly-reports').checked = settings.weeklyReports;
    document.getElementById('reminder-emails').checked = settings.reminderEmails;
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const profileData = {
        email: formData.get('profile-email'),
        name: formData.get('profile-name')
    };

    try {
        const response = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        const data = await response.json();

        if (data.success) {
            alert('Profile updated successfully!');
        } else {
            alert('Error updating profile: ' + data.message);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    }
}

async function updateNotificationSettings() {
    const settings = {
        emailNotifications: document.getElementById('email-notifications').checked,
        weeklyReports: document.getElementById('weekly-reports').checked,
        reminderEmails: document.getElementById('reminder-emails').checked
    };

    try {
        const response = await fetch('/api/user/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        const data = await response.json();

        if (data.success) {
            console.log('Settings updated successfully');
        } else {
            console.error('Error updating settings:', data.message);
        }
    } catch (error) {
        console.error('Error updating settings:', error);
    }
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
}

function logout() {
    localStorage.removeItem('userEmail');
    window.location.href = '/';
}

// Modal handling
document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function(event) {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});

function downloadReport(reportId) {
    // Generate PDF report for the given report ID
    generatePDFReport(reportId);
}

function generatePDFReport(reportId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set up the PDF document
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Ayurveda Health Assessment Report', 20, 30);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 50;
    
    // Report Information
    doc.setFont('helvetica', 'bold');
    doc.text(`Report ID: ${reportId}`, 20, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 15;
    
    // Assessment Summary
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Summary', 20, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text('This report contains your personalized Ayurvedic assessment results,', 20, yPosition);
    yPosition += 7;
    doc.text('dosha analysis, and recommended remedies for optimal health.', 20, yPosition);
    yPosition += 15;
    
    // Recommendations
    doc.setFont('helvetica', 'bold');
    doc.text('General Health Recommendations:', 20, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    const recommendations = [
        'Follow a balanced diet according to your dosha type',
        'Maintain regular sleep patterns (7-8 hours per night)',
        'Practice stress-reducing activities like meditation and yoga',
        'Exercise regularly but moderately',
        'Stay hydrated throughout the day',
        'Consider consulting with an Ayurvedic practitioner for personalized guidance',
        'Track your progress and adjust recommendations as needed'
    ];
    
    recommendations.forEach((rec, index) => {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(`${index + 1}. ${rec}`, 20, yPosition);
        yPosition += 7;
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 20, doc.internal.pageSize.height - 10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 120, doc.internal.pageSize.height - 10);
    }
    
    // Save the PDF
    doc.save(`ayurveda-report-${reportId}.pdf`);
} 