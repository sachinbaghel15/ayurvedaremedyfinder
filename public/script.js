// API Configuration
const API_BASE = window.location.origin; // Use current domain for production

// Global variables
let currentStep = 1;
let selectedSymptoms = [];
let doshaScores = { vata: 0, pitta: 0, kapha: 0 };
let userData = {};
let assessmentData = {};
let allRemedies = [];
let isPremiumUser = false; // Track premium status
let remedyCount = 0; // Track free remedy usage
let userUsage = null; // Track user usage
let pricing = null; // Store pricing information

// Sample symptoms data
const symptomsData = {
    digestive: [
        { id: 'indigestion', name: 'Indigestion', category: 'digestive' },
        { id: 'bloating', name: 'Bloating', category: 'digestive' },
        { id: 'constipation', name: 'Constipation', category: 'digestive' },
        { id: 'diarrhea', name: 'Diarrhea', category: 'digestive' },
        { id: 'acid_reflux', name: 'Acid Reflux', category: 'digestive' },
        { id: 'nausea', name: 'Nausea', category: 'digestive' },
        { id: 'loss_of_appetite', name: 'Loss of Appetite', category: 'digestive' },
        { id: 'abdominal_pain', name: 'Abdominal Pain', category: 'digestive' }
    ],
    respiratory: [
        { id: 'cough', name: 'Cough', category: 'respiratory' },
        { id: 'congestion', name: 'Nasal Congestion', category: 'respiratory' },
        { id: 'shortness_of_breath', name: 'Shortness of Breath', category: 'respiratory' },
        { id: 'sore_throat', name: 'Sore Throat', category: 'respiratory' },
        { id: 'runny_nose', name: 'Runny Nose', category: 'respiratory' },
        { id: 'chest_tightness', name: 'Chest Tightness', category: 'respiratory' },
        { id: 'wheezing', name: 'Wheezing', category: 'respiratory' }
    ],
    nervous: [
        { id: 'anxiety', name: 'Anxiety', category: 'nervous' },
        { id: 'insomnia', name: 'Insomnia', category: 'nervous' },
        { id: 'headache', name: 'Headache', category: 'nervous' },
        { id: 'dizziness', name: 'Dizziness', category: 'nervous' },
        { id: 'fatigue', name: 'Fatigue', category: 'nervous' },
        { id: 'stress', name: 'Stress', category: 'nervous' },
        { id: 'mood_swings', name: 'Mood Swings', category: 'nervous' },
        { id: 'memory_problems', name: 'Memory Problems', category: 'nervous' }
    ],
    skin: [
        { id: 'acne', name: 'Acne', category: 'skin' },
        { id: 'eczema', name: 'Eczema', category: 'skin' },
        { id: 'dry_skin', name: 'Dry Skin', category: 'skin' },
        { id: 'itching', name: 'Itching', category: 'skin' },
        { id: 'rashes', name: 'Rashes', category: 'skin' },
        { id: 'inflammation', name: 'Skin Inflammation', category: 'skin' }
    ],
    joints: [
        { id: 'joint_pain', name: 'Joint Pain', category: 'joints' },
        { id: 'stiffness', name: 'Joint Stiffness', category: 'joints' },
        { id: 'swelling', name: 'Joint Swelling', category: 'joints' },
        { id: 'back_pain', name: 'Back Pain', category: 'joints' },
        { id: 'muscle_pain', name: 'Muscle Pain', category: 'joints' },
        { id: 'arthritis', name: 'Arthritis', category: 'joints' }
    ],
    general: [
        { id: 'fever', name: 'Fever', category: 'general' },
        { id: 'chills', name: 'Chills', category: 'general' },
        { id: 'sweating', name: 'Excessive Sweating', category: 'general' },
        { id: 'weight_gain', name: 'Weight Gain', category: 'general' },
        { id: 'weight_loss', name: 'Weight Loss', category: 'general' },
        { id: 'low_energy', name: 'Low Energy', category: 'general' },
        { id: 'inflammation', name: 'General Inflammation', category: 'general' }
    ]
};

// Dosha assessment questions
const doshaQuestions = [
    {
        question: "What is your typical body build?",
        options: [
            { text: "Thin, lean, difficulty gaining weight", dosha: "vata" },
            { text: "Medium build, muscular", dosha: "pitta" },
            { text: "Large, heavy, gains weight easily", dosha: "kapha" }
        ]
    },
    {
        question: "How would you describe your skin?",
        options: [
            { text: "Dry, rough, thin", dosha: "vata" },
            { text: "Warm, reddish, prone to rashes", dosha: "pitta" },
            { text: "Thick, oily, smooth", dosha: "kapha" }
        ]
    },
    {
        question: "What is your typical appetite like?",
        options: [
            { text: "Variable, sometimes forget to eat", dosha: "vata" },
            { text: "Strong, irritable when hungry", dosha: "pitta" },
            { text: "Steady, can skip meals easily", dosha: "kapha" }
        ]
    },
    {
        question: "How do you typically sleep?",
        options: [
            { text: "Light sleeper, easily disturbed", dosha: "vata" },
            { text: "Moderate sleep, wake up hot", dosha: "pitta" },
            { text: "Deep sleep, hard to wake up", dosha: "kapha" }
        ]
    },
    {
        question: "What is your typical energy level?",
        options: [
            { text: "Variable energy, bursts of activity", dosha: "vata" },
            { text: "Intense energy, goal-oriented", dosha: "pitta" },
            { text: "Steady energy, slow to start", dosha: "kapha" }
        ]
    },
    {
        question: "How do you handle stress?",
        options: [
            { text: "Worry, anxiety, overthinking", dosha: "vata" },
            { text: "Irritability, anger, intensity", dosha: "pitta" },
            { text: "Calm, slow to anger, steady", dosha: "kapha" }
        ]
    },
    {
        question: "What is your typical memory?",
        options: [
            { text: "Quick to learn, quick to forget", dosha: "vata" },
            { text: "Sharp memory, good concentration", dosha: "pitta" },
            { text: "Slow to learn, excellent retention", dosha: "kapha" }
        ]
    },
    {
        question: "How do you typically speak?",
        options: [
            { text: "Fast, sometimes unclear", dosha: "vata" },
            { text: "Clear, sharp, persuasive", dosha: "pitta" },
            { text: "Slow, methodical, thoughtful", dosha: "kapha" }
        ]
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Load user usage and pricing first
    loadUserUsage();
    
    // Initialize the application
    initializeApp();
    
    // Add event delegation for all button clicks
    document.addEventListener('click', function(e) {
        console.log('Click event detected on:', e.target);
        
        const target = e.target.closest('[data-action]');
        if (!target) {
            // Check for category tabs
            if (e.target.classList.contains('category-tab')) {
                const category = e.target.getAttribute('data-category');
                console.log('Category tab clicked:', category);
                loadSymptomsByCategory(category);
                
                // Update active tab
                document.querySelectorAll('.category-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                e.target.classList.add('active');
                return;
            }
            
            // Check for symptom items
            if (e.target.closest('.symptom-item')) {
                const symptomItem = e.target.closest('.symptom-item');
                const symptomId = symptomItem.getAttribute('data-symptom-id');
                const symptomName = symptomItem.getAttribute('data-symptom-name');
                console.log('Symptom clicked:', symptomId, symptomName);
                toggleSymptom(symptomId, symptomName);
                return;
            }
            
            // Check for remove symptom buttons
            if (e.target.closest('.remove-btn')) {
                const removeBtn = e.target.closest('.remove-btn');
                const index = parseInt(removeBtn.getAttribute('data-index'));
                console.log('Remove symptom clicked, index:', index);
                removeSymptom(index);
                return;
            }
            
            // Check for dosha assessment options
            if (e.target.closest('.option-btn')) {
                const optionBtn = e.target.closest('.option-btn');
                const questionIndex = parseInt(optionBtn.getAttribute('data-question-index'));
                const optionIndex = parseInt(optionBtn.getAttribute('data-option-index'));
                console.log('Dosha option clicked, question:', questionIndex, 'option:', optionIndex);
                selectDoshaOption(questionIndex, optionIndex);
                return;
            }
            
            // Check for pricing button
            if (e.target.id === 'pricing-btn') {
                showPricingModal();
                return;
            }
            
            console.log('No data-action found on clicked element or its parents');
            return;
        }
        
        const action = target.getAttribute('data-action');
        const step = target.getAttribute('data-step');
        
        console.log('Action detected:', action, 'Step:', step);
        
        switch(action) {
            case 'next-step':
                nextStep(parseInt(step));
                break;
            case 'prev-step':
                prevStep(parseInt(step));
                break;
            case 'prioritize-symptoms':
                prioritizeSymptoms();
                break;
            case 'start-assessment':
                startAssessment();
                break;
            case 'generate-report':
                generateReport();
                break;
            case 'restart-assessment':
                restartAssessment();
                break;
            default:
                console.log('Unknown action:', action);
        }
    });
    
    // Add event listeners for form inputs
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    
    if (nameInput) {
        nameInput.addEventListener('input', validateBasicInfo);
    }
    if (ageInput) {
        ageInput.addEventListener('input', validateBasicInfo);
    }
    if (genderSelect) {
        genderSelect.addEventListener('change', validateBasicInfo);
    }
    
    // Add event listener for symptom search
    const symptomSearch = document.getElementById('symptom-search');
    if (symptomSearch) {
        symptomSearch.addEventListener('input', function() {
            filterSymptoms(this.value);
        });
    }
    
    // Add event listeners for filter dropdowns
    const categoryFilter = document.getElementById('remedy-category-filter');
    const doshaFilter = document.getElementById('remedy-dosha-filter');
    const difficultyFilter = document.getElementById('remedy-difficulty-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterRemedies);
    }
    if (doshaFilter) {
        doshaFilter.addEventListener('change', filterRemedies);
    }
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', filterRemedies);
    }
});

function initializeApp() {
    console.log('Initializing app...');
    try {
        loadSymptoms('digestive');
        updateProgressSteps();
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Step navigation functions
function nextStep(step) {
    console.log('nextStep called with step:', step, 'currentStep:', currentStep);
    
    try {
        if (validateCurrentStep()) {
            currentStep = step;
            showStep(step);
            updateProgressSteps();
            
            // Load remedies when reaching step 4
            if (step === 4) {
                setTimeout(() => {
                    loadRemedies();
                }, 100);
            }
            console.log('Successfully moved to step:', step);
        } else {
            console.log('Validation failed for current step');
        }
    } catch (error) {
        console.error('Error in nextStep:', error);
    }
}

function prevStep(step) {
    console.log('prevStep called with step:', step);
    try {
        currentStep = step;
        showStep(step);
        updateProgressSteps();
        console.log('Successfully moved to step:', step);
    } catch (error) {
        console.error('Error in prevStep:', error);
    }
}

function showStep(step) {
    console.log('showStep called with step:', step);
    
    try {
        // Hide all steps
        const allSteps = document.querySelectorAll('.step-content');
        console.log('Found', allSteps.length, 'step content elements');
        
        allSteps.forEach(content => {
            content.classList.remove('active');
        });
        
        // Show current step
        const currentStepContent = document.getElementById(`step-${step}`);
        if (currentStepContent) {
            currentStepContent.classList.add('active');
            console.log('Step', step, 'is now active');
        } else {
            console.error('Step content not found for step:', step);
        }
    } catch (error) {
        console.error('Error in showStep:', error);
    }
}

function updateProgressSteps() {
    try {
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === currentStep) {
                step.classList.add('active');
            } else if (stepNumber < currentStep) {
                step.classList.add('completed');
            }
        });
    } catch (error) {
        console.error('Error in updateProgressSteps:', error);
    }
}

function validateCurrentStep() {
    console.log('Validating current step:', currentStep);
    
    try {
        switch (currentStep) {
            case 1:
                // Temporarily bypass validation for testing
                console.log('Bypassing validation for step 1');
                return true;
                // return validateBasicInfo();
            case 2:
                return validateSymptoms();
            case 3:
                return true; // Dosha assessment is optional
            default:
                return true;
        }
    } catch (error) {
        console.error('Error in validateCurrentStep:', error);
        return false;
    }
}

function validateBasicInfo() {
    console.log('Validating basic info...');
    
    try {
        const gender = document.querySelector('input[name="gender"]:checked');
        const age = document.getElementById('age').value;
        
        console.log('Gender selected:', gender ? gender.value : 'none');
        console.log('Age selected:', age);
        
        // Add visual feedback
        const genderOptions = document.querySelectorAll('input[name="gender"]');
        const ageSelect = document.getElementById('age');
        
        // Remove any existing error styling
        genderOptions.forEach(opt => opt.closest('.radio-option').style.borderColor = '#e9ecef');
        ageSelect.style.borderColor = '#e9ecef';
        
        let hasError = false;
        
        if (!gender) {
            console.log('Gender validation failed');
            genderOptions.forEach(opt => opt.closest('.radio-option').style.borderColor = '#dc3545');
            hasError = true;
        }
        
        if (!age) {
            console.log('Age validation failed');
            ageSelect.style.borderColor = '#dc3545';
            hasError = true;
        }
        
        if (hasError) {
            alert('Please select your gender and age range to continue.');
            return false;
        }
        
        // Store user data
        userData = {
            gender: gender.value,
            age: age,
            weight: document.getElementById('weight').value,
            height: document.getElementById('height').value,
            riskFactors: Array.from(document.querySelectorAll('input[name="riskFactors"]:checked')).map(cb => cb.value)
        };
        
        console.log('User data stored:', userData);
        return true;
    } catch (error) {
        console.error('Error in validateBasicInfo:', error);
        return false;
    }
}

function validateSymptoms() {
    console.log('Validating symptoms, count:', selectedSymptoms.length);
    
    if (selectedSymptoms.length < 3) {
        alert('Please select at least 3 symptoms to continue.');
        return false;
    }
    return true;
}

// Symptoms management
function loadSymptoms(category) {
    console.log('Loading symptoms for category:', category);
    
    try {
        const symptomsGrid = document.getElementById('symptoms-grid');
        const symptoms = symptomsData[category] || [];
        
        symptomsGrid.innerHTML = symptoms.map(symptom => `
            <div class="symptom-item" data-symptom-id="${symptom.id}" data-symptom-name="${symptom.name}">
                <i class="fas fa-plus"></i>
                ${symptom.name}
            </div>
        `).join('');
        
        console.log('Loaded', symptoms.length, 'symptoms');
    } catch (error) {
        console.error('Error in loadSymptoms:', error);
    }
}

function searchSymptoms(query) {
    if (!query.trim()) {
        const activeCategory = document.querySelector('.category-tab.active').dataset.category;
        loadSymptoms(activeCategory);
        return;
    }
    
    const allSymptoms = Object.values(symptomsData).flat();
    const filteredSymptoms = allSymptoms.filter(symptom => 
        symptom.name.toLowerCase().includes(query.toLowerCase())
    );
    
    const symptomsGrid = document.getElementById('symptoms-grid');
    symptomsGrid.innerHTML = filteredSymptoms.map(symptom => `
        <div class="symptom-item" data-symptom-id="${symptom.id}" data-symptom-name="${symptom.name}">
            <i class="fas fa-plus"></i>
            ${symptom.name}
        </div>
    `).join('');
}

function toggleSymptom(id, name) {
    console.log('Toggling symptom:', id, name);
    
    const index = selectedSymptoms.findIndex(s => s.id === id);
    
    if (index === -1) {
        selectedSymptoms.push({ id, name });
        console.log('Added symptom:', name);
        
        // Add visual feedback - find the symptom item and add selected class
        const symptomItem = document.querySelector(`[data-symptom-id="${id}"]`);
        if (symptomItem) {
            symptomItem.classList.add('selected');
            const icon = symptomItem.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-check';
            }
        }
    } else {
        selectedSymptoms.splice(index, 1);
        console.log('Removed symptom:', name);
        
        // Remove visual feedback
        const symptomItem = document.querySelector(`[data-symptom-id="${id}"]`);
        if (symptomItem) {
            symptomItem.classList.remove('selected');
            const icon = symptomItem.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-plus';
            }
        }
    }
    
    updateSelectedSymptoms();
    updateNextButton();
}

function updateSelectedSymptoms() {
    const selectedList = document.getElementById('selected-symptoms');
    
    if (selectedSymptoms.length === 0) {
        selectedList.innerHTML = '<p class="empty-message">No symptoms selected yet. Please select at least 3 symptoms.</p>';
        return;
    }
    
    selectedList.innerHTML = selectedSymptoms.map((symptom, index) => `
        <div class="selected-symptom">
            <span>${symptom.name}</span>
            <button class="remove-btn" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // Update visual state of symptom items
    document.querySelectorAll('.symptom-item').forEach(item => {
        const symptomId = item.getAttribute('data-symptom-id');
        const isSelected = selectedSymptoms.some(s => s.id === symptomId);
        
        if (isSelected) {
            item.classList.add('selected');
            const icon = item.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-check';
            }
        } else {
            item.classList.remove('selected');
            const icon = item.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-plus';
            }
        }
    });
}

function removeSymptom(index) {
    selectedSymptoms.splice(index, 1);
    updateSelectedSymptoms();
    updateNextButton();
}

function updateNextButton() {
    const nextButton = document.getElementById('next-step-2');
    if (nextButton) {
        nextButton.disabled = selectedSymptoms.length < 3;
        console.log('Next button disabled:', nextButton.disabled);
    }
}

function prioritizeSymptoms() {
    if (selectedSymptoms.length < 2) {
        alert('Please select at least 2 symptoms to prioritize.');
        return;
    }
    
    // Simple prioritization - move first symptom to end
    const first = selectedSymptoms.shift();
    selectedSymptoms.push(first);
    updateSelectedSymptoms();
}

// Dosha assessment functions
function startDoshaAssessment() {
    console.log('Starting dosha assessment...');
    document.getElementById('assessment-intro').style.display = 'none';
    document.getElementById('assessment-questions').style.display = 'block';
    showDoshaQuestion(0);
}

function showDoshaQuestion(questionIndex) {
    if (questionIndex >= doshaQuestions.length) {
        showDoshaResults();
        return;
    }
    
    const question = doshaQuestions[questionIndex];
    const questionText = document.getElementById('question-text');
    const questionOptions = document.getElementById('question-options');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    questionText.textContent = question.question;
    questionOptions.innerHTML = question.options.map((option, index) => `
        <button class="option-btn" data-question-index="${questionIndex}" data-option-index="${index}">
            ${option.text}
        </button>
    `).join('');
    
    const progress = ((questionIndex + 1) / doshaQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Question ${questionIndex + 1} of ${doshaQuestions.length}`;
    
    // Store current question index
    assessmentData.currentQuestion = questionIndex;
}

function selectDoshaOption(questionIndex, optionIndex) {
    const question = doshaQuestions[questionIndex];
    const selectedOption = question.options[optionIndex];
    
    // Add score to the selected dosha
    doshaScores[selectedOption.dosha]++;
    
    // Store the answer
    if (!assessmentData.answers) assessmentData.answers = [];
    assessmentData.answers.push({
        question: question.question,
        answer: selectedOption.text,
        dosha: selectedOption.dosha
    });
    
    // Show next question
    showDoshaQuestion(questionIndex + 1);
}

function showDoshaResults() {
    document.getElementById('assessment-questions').style.display = 'none';
    document.getElementById('assessment-result').style.display = 'block';
    
    const resultContent = document.getElementById('result-content');
    const dominantDosha = Object.keys(doshaScores).reduce((a, b) => 
        doshaScores[a] > doshaScores[b] ? a : b
    );
    
    const doshaInfo = {
        vata: { name: 'Vata', color: '#e74c3c', description: 'Air & Ether elements' },
        pitta: { name: 'Pitta', color: '#f39c12', description: 'Fire & Water elements' },
        kapha: { name: 'Kapha', color: '#3498db', description: 'Earth & Water elements' }
    };
    
    resultContent.innerHTML = `
        <div class="result-card" style="border-left: 5px solid ${doshaInfo[dominantDosha].color}">
            <h4>Your Dominant Dosha: ${doshaInfo[dominantDosha].name}</h4>
            <p>${doshaInfo[dominantDosha].description}</p>
            <div class="result-scores">
                <div class="score-item">
                    <span class="score-value" style="color: ${doshaInfo.vata.color}">${doshaScores.vata}</span>
                    <span class="score-label">Vata</span>
                </div>
                <div class="score-item">
                    <span class="score-value" style="color: ${doshaInfo.pitta.color}">${doshaScores.pitta}</span>
                    <span class="score-label">Pitta</span>
                </div>
                <div class="score-item">
                    <span class="score-value" style="color: ${doshaInfo.kapha.color}">${doshaScores.kapha}</span>
                    <span class="score-label">Kapha</span>
                </div>
            </div>
        </div>
    `;
    
    // Enable next step button
    const nextButton = document.getElementById('next-step-3');
    if (nextButton) {
        nextButton.disabled = false;
    }
    
    // Show upgrade suggestion after showing results
    setTimeout(() => {
        showUpgradeSuggestion();
    }, 2000);
}

// Show upgrade suggestion after assessment
function showUpgradeSuggestion() {
    if (isPremiumUser || !userUsage || userUsage.assessments < 2) return;
    
    const suggestion = document.createElement('div');
    suggestion.className = 'upgrade-suggestion';
    suggestion.innerHTML = `
        <div class="suggestion-content">
            <div class="suggestion-icon">
                <i class="fas fa-crown"></i>
            </div>
            <div class="suggestion-text">
                <h4>Unlock Premium Features!</h4>
                <p>You've completed ${userUsage.assessments} assessments. Upgrade to get detailed PDF reports, personalized wellness plans, and exclusive content.</p>
                <div class="suggestion-actions">
                    <button class="btn btn-primary btn-small" onclick="showPricingModal()">
                        <i class="fas fa-arrow-up"></i> Upgrade Now
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="this.closest('.upgrade-suggestion').remove()">
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add to the page
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(suggestion, mainContent.firstChild);
    }
}

// Remedies functions
function loadRemedies() {
    console.log('Loading remedies...');
    
    // Show assessment summary
    showAssessmentSummary();
    
    // Load and display remedies
    fetch('/api/remedies')
        .then(response => response.json())
        .then(response => {
            console.log('API response:', response);
            
            // Handle the API response structure - remedies are in response.data
            const remedies = response.data || response;
            
            if (!Array.isArray(remedies)) {
                console.error('Remedies is not an array:', remedies);
                throw new Error('Invalid remedies data');
            }
            
            if (!isPremiumUser) {
                // Limit free users to 3 remedies
                const limitedRemedies = remedies.slice(0, 3);
                displayRemedies(limitedRemedies);
                
                // Show premium banner
                const premiumBanner = document.getElementById('premium-banner');
                if (premiumBanner) {
                    premiumBanner.style.display = 'block';
                }
            } else {
                // Premium users get all remedies
                displayRemedies(remedies);
            }
        })
        .catch(error => {
            console.error('Error loading remedies:', error);
            // Fallback to sample data
            const sampleRemedies = getSampleRemedies();
            if (!isPremiumUser) {
                displayRemedies(sampleRemedies.slice(0, 3));
            } else {
                displayRemedies(sampleRemedies);
            }
        });
}

function showAssessmentSummary() {
    const summary = document.getElementById('assessment-summary');
    const dominantDosha = Object.keys(doshaScores).reduce((a, b) => 
        doshaScores[a] > doshaScores[b] ? a : b
    );
    
    // Safely handle riskFactors - ensure it's an array
    const riskFactors = userData.riskFactors || [];
    
    summary.innerHTML = `
        <div class="summary-item">
            <h4>Basic Info</h4>
            <p>${userData.gender || 'Not specified'}, ${userData.age || 'Not specified'}</p>
        </div>
        <div class="summary-item">
            <h4>Selected Symptoms</h4>
            <p>${selectedSymptoms.length} symptoms</p>
        </div>
        <div class="summary-item">
            <h4>Dominant Dosha</h4>
            <p>${dominantDosha.charAt(0).toUpperCase() + dominantDosha.slice(1)}</p>
        </div>
        <div class="summary-item">
            <h4>Risk Factors</h4>
            <p>${riskFactors.length > 0 ? riskFactors.join(', ') : 'None'}</p>
        </div>
    `;
}

function displayRemedies(remedies) {
    const remediesGrid = document.getElementById('remedies-grid');
    
    remediesGrid.innerHTML = remedies.map(remedy => {
        // Handle different property names from API vs fallback data
        const dosha = remedy.dosha || (remedy.suitableFor ? remedy.suitableFor.join(', ') : 'All');
        const ingredients = remedy.ingredients || [];
        const instructions = remedy.instructions || [];
        
        return `
            <div class="remedy-card">
                <div class="remedy-header">
                    <div>
                        <div class="remedy-title">${remedy.name}</div>
                        <div class="remedy-category">${remedy.category}</div>
                    </div>
                </div>
                <div class="remedy-description">${remedy.description}</div>
                <div class="remedy-details">
                    <div class="detail-item">
                        <i class="fas fa-balance-scale"></i>
                        <span>Dosha: ${dosha}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-signal"></i>
                        <span class="difficulty-${remedy.difficulty}">${remedy.difficulty}</span>
                    </div>
                </div>
                ${ingredients.length > 0 ? `
                    <div class="remedy-ingredients">
                        <h4>Ingredients</h4>
                        <div class="ingredients-list">
                            ${ingredients.map(ingredient => 
                                `<span class="ingredient-tag">${ingredient}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
                ${instructions.length > 0 ? `
                    <div class="remedy-instructions">
                        <h4>Instructions</h4>
                        <ol>
                            ${instructions.map(instruction => 
                                `<li>${instruction}</li>`
                            ).join('')}
                        </ol>
                    </div>
                ` : ''}
                ${remedy.benefits ? `
                    <div class="remedy-benefits">
                        <h4>Benefits</h4>
                        <div class="benefits-list">
                            ${remedy.benefits.map(benefit => 
                                `<span class="benefit-tag">${benefit}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function filterRemedies() {
    const categoryFilter = document.getElementById('remedy-category-filter').value;
    const doshaFilter = document.getElementById('remedy-dosha-filter').value;
    const difficultyFilter = document.getElementById('remedy-difficulty-filter').value;
    
    const remedyCards = document.querySelectorAll('.remedy-card');
    
    remedyCards.forEach(card => {
        const category = card.querySelector('.remedy-category').textContent.toLowerCase();
        const dosha = card.querySelector('.detail-item span').textContent.split(': ')[1].toLowerCase();
        const difficulty = card.querySelector('.difficulty-easy, .difficulty-medium, .difficulty-hard').textContent.toLowerCase();
        
        const categoryMatch = !categoryFilter || category === categoryFilter;
        const doshaMatch = !doshaFilter || dosha === doshaFilter;
        const difficultyMatch = !difficultyFilter || difficulty === difficultyFilter;
        
        if (categoryMatch && doshaMatch && difficultyMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Utility functions
function getSampleRemedies() {
    return [
        {
            name: "Ginger-Turmeric Tea",
            description: "A warming tea that helps with digestion and reduces inflammation.",
            category: "digestive",
            dosha: "vata",
            difficulty: "easy",
            ingredients: ["Fresh ginger", "Turmeric powder", "Honey", "Black pepper"],
            instructions: [
                "Boil 2 cups of water",
                "Add 1 inch of fresh ginger and 1/2 tsp turmeric",
                "Simmer for 10 minutes",
                "Strain and add honey to taste"
            ]
        },
        {
            name: "Triphala Churna",
            description: "Traditional Ayurvedic formula for digestive health and detoxification.",
            category: "digestive",
            dosha: "all",
            difficulty: "easy",
            ingredients: ["Amla", "Bibhitaki", "Haritaki"],
            instructions: [
                "Take 1/2 tsp with warm water",
                "Best taken before bedtime",
                "Start with small dose and increase gradually"
            ]
        },
        {
            name: "Ashwagandha Milk",
            description: "A calming drink that helps with stress and promotes better sleep.",
            category: "nervous",
            dosha: "vata",
            difficulty: "medium",
            ingredients: ["Ashwagandha powder", "Milk", "Honey", "Cardamom"],
            instructions: [
                "Warm 1 cup of milk",
                "Add 1/2 tsp ashwagandha powder",
                "Add honey and cardamom to taste",
                "Drink before bedtime"
            ]
        }
    ];
}

function generateReport() {
    const report = {
        userData,
        selectedSymptoms,
        doshaScores,
        assessmentData,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ayurveda-assessment-report.json';
    a.click();
    URL.revokeObjectURL(url);
}

function restartAssessment() {
    console.log('Restarting assessment...');
    
    // Reset all data
    currentStep = 1;
    selectedSymptoms = [];
    doshaScores = { vata: 0, pitta: 0, kapha: 0 };
    userData = {};
    assessmentData = {};
    remedyCount = 0;
    
    // Reset UI
    showStep(1);
    updateProgressSteps();
    
    // Reset form fields
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    
    if (nameInput) nameInput.value = '';
    if (ageInput) ageInput.value = '';
    if (genderSelect) genderSelect.value = '';
    
    // Reset radio buttons
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Reset checkboxes
    document.querySelectorAll('input[name="riskFactors"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    console.log('Assessment restarted successfully');
}

// Alias for backward compatibility
function startAssessment() {
    startDoshaAssessment();
}

function loadSymptomsByCategory(category) {
    console.log('Loading symptoms for category:', category);
    
    try {
        const symptomsGrid = document.getElementById('symptoms-grid');
        const symptoms = symptomsData[category] || [];
        
        symptomsGrid.innerHTML = symptoms.map(symptom => `
            <div class="symptom-item" data-symptom-id="${symptom.id}" data-symptom-name="${symptom.name}">
                <i class="fas fa-plus"></i>
                ${symptom.name}
            </div>
        `).join('');
        
        console.log('Loaded', symptoms.length, 'symptoms');
    } catch (error) {
        console.error('Error in loadSymptomsByCategory:', error);
    }
}

function filterSymptoms(query) {
    console.log('Filtering symptoms with query:', query);
    
    try {
        const symptomsGrid = document.getElementById('symptoms-grid');
        const allSymptoms = [];
        
        // Collect all symptoms from all categories
        Object.values(symptomsData).forEach(categorySymptoms => {
            allSymptoms.push(...categorySymptoms);
        });
        
        // Filter symptoms based on query
        const filteredSymptoms = allSymptoms.filter(symptom => 
            symptom.name.toLowerCase().includes(query.toLowerCase()) ||
            symptom.id.toLowerCase().includes(query.toLowerCase())
        );
        
        // Display filtered symptoms
        symptomsGrid.innerHTML = filteredSymptoms.map(symptom => `
            <div class="symptom-item" data-symptom-id="${symptom.id}" data-symptom-name="${symptom.name}">
                <i class="fas fa-plus"></i>
                ${symptom.name}
            </div>
        `).join('');
        
        console.log('Filtered to', filteredSymptoms.length, 'symptoms');
    } catch (error) {
        console.error('Error in filterSymptoms:', error);
    }
}

// Load user usage and pricing information
async function loadUserUsage() {
    try {
        const response = await fetch(`${API_BASE}/api/usage`);
        const data = await response.json();
        
        if (data.success) {
            userUsage = data.data.usage;
            pricing = data.data.pricing;
            isPremiumUser = data.data.usage.isPremium;
            
            updateUsageDisplay();
        }
    } catch (error) {
        console.error('Error loading user usage:', error);
        // Set default values if API fails
        userUsage = { assessments: 0, isPremium: false };
        pricing = { freeAssessments: 3, paidAssessmentPrice: 2.99 };
    }
}

// Update usage display in the header
function updateUsageDisplay() {
    const usageText = document.getElementById('usage-text');
    if (!usageText || !userUsage || !pricing) return;
    
    if (isPremiumUser) {
        usageText.textContent = 'Premium User - All Features Unlocked';
    } else {
        usageText.textContent = `Free User - ${userUsage.assessments} assessment${userUsage.assessments !== 1 ? 's' : ''} completed`;
    }
}

// Show pricing modal
function showPricingModal() {
    if (!pricing) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-crown"></i> Upgrade to Premium</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="pricing-grid">
                    <div class="pricing-card">
                        <h3>Free</h3>
                        <div class="price">$0<span>/forever</span></div>
                        <ul>
                            <li><i class="fas fa-check"></i> Unlimited assessments</li>
                            <li><i class="fas fa-check"></i> Basic dosha results</li>
                            <li><i class="fas fa-check"></i> General remedy suggestions</li>
                            <li><i class="fas fa-check"></i> Symptom-based filtering</li>
                            <li><i class="fas fa-check"></i> Mobile-friendly interface</li>
                        </ul>
                        <button class="btn btn-secondary" disabled>Current Plan</button>
                    </div>
                    <div class="pricing-card featured">
                        <div class="popular-badge">Most Popular</div>
                        <h3>Premium Monthly</h3>
                        <div class="price">$${pricing.premiumMonthlyPrice}<span>/month</span></div>
                        <ul>
                            <li><i class="fas fa-check"></i> All free features</li>
                            <li><i class="fas fa-check"></i> Detailed PDF reports</li>
                            <li><i class="fas fa-check"></i> Personalized wellness plans</li>
                            <li><i class="fas fa-check"></i> Priority customer support</li>
                            <li><i class="fas fa-check"></i> Exclusive content access</li>
                            <li><i class="fas fa-check"></i> Monthly wellness newsletters</li>
                            <li><i class="fas fa-check"></i> Advanced recommendations</li>
                        </ul>
                        <button class="btn btn-primary" onclick="handleSubscription('monthly')">Upgrade Now</button>
                    </div>
                    <div class="pricing-card">
                        <h3>Premium Yearly</h3>
                        <div class="price">$${pricing.premiumYearlyPrice}<span>/year</span></div>
                        <ul>
                            <li><i class="fas fa-check"></i> All monthly features</li>
                            <li><i class="fas fa-check"></i> 2 months free</li>
                            <li><i class="fas fa-check"></i> Priority customer support</li>
                            <li><i class="fas fa-check"></i> Early access to new features</li>
                        </ul>
                        <button class="btn btn-primary" onclick="handleSubscription('yearly')">Upgrade Now</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Handle subscription
async function handleSubscription(plan) {
    try {
        const response = await fetch(`${API_BASE}/api/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ plan })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Subscription successful!', 'success');
            // Reload usage to update premium status
            await loadUserUsage();
        } else {
            showNotification(data.message || 'Subscription failed', 'error');
        }
    } catch (error) {
        console.error('Error handling subscription:', error);
        showNotification('Subscription failed. Please try again.', 'error');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Check premium status (placeholder function)
function checkPremiumStatus() {
    // This function is now handled by loadUserUsage()
    console.log('Premium status checked via loadUserUsage()');
} 