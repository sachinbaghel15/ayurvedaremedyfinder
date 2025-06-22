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

// Sample symptoms data - Updated with comprehensive worldwide database
const symptomsData = {
    digestive: [
        { id: 'indigestion', name: 'Indigestion', category: 'digestive', severity: 'moderate' },
        { id: 'bloating', name: 'Bloating', category: 'digestive', severity: 'mild' },
        { id: 'constipation', name: 'Constipation', category: 'digestive', severity: 'moderate' },
        { id: 'diarrhea', name: 'Diarrhea', category: 'digestive', severity: 'moderate' },
        { id: 'acid_reflux', name: 'Acid Reflux', category: 'digestive', severity: 'moderate' },
        { id: 'nausea', name: 'Nausea', category: 'digestive', severity: 'moderate' },
        { id: 'vomiting', name: 'Vomiting', category: 'digestive', severity: 'severe' },
        { id: 'loss_of_appetite', name: 'Loss of Appetite', category: 'digestive', severity: 'moderate' },
        { id: 'abdominal_pain', name: 'Abdominal Pain', category: 'digestive', severity: 'moderate' },
        { id: 'gas', name: 'Excessive Gas', category: 'digestive', severity: 'mild' },
        { id: 'heartburn', name: 'Heartburn', category: 'digestive', severity: 'moderate' },
        { id: 'ulcer', name: 'Stomach Ulcer', category: 'digestive', severity: 'severe' },
        { id: 'ibs', name: 'Irritable Bowel Syndrome', category: 'digestive', severity: 'moderate' },
        { id: 'colitis', name: 'Colitis', category: 'digestive', severity: 'severe' },
        { id: 'gastritis', name: 'Gastritis', category: 'digestive', severity: 'moderate' },
        { id: 'food_poisoning', name: 'Food Poisoning', category: 'digestive', severity: 'severe' },
        { id: 'celiac', name: 'Celiac Disease', category: 'digestive', severity: 'severe' },
        { id: 'lactose_intolerance', name: 'Lactose Intolerance', category: 'digestive', severity: 'moderate' }
    ],
    respiratory: [
        { id: 'cough', name: 'Cough', category: 'respiratory', severity: 'moderate' },
        { id: 'congestion', name: 'Nasal Congestion', category: 'respiratory', severity: 'mild' },
        { id: 'shortness_of_breath', name: 'Shortness of Breath', category: 'respiratory', severity: 'severe' },
        { id: 'sore_throat', name: 'Sore Throat', category: 'respiratory', severity: 'moderate' },
        { id: 'runny_nose', name: 'Runny Nose', category: 'respiratory', severity: 'mild' },
        { id: 'chest_tightness', name: 'Chest Tightness', category: 'respiratory', severity: 'severe' },
        { id: 'wheezing', name: 'Wheezing', category: 'respiratory', severity: 'severe' },
        { id: 'asthma', name: 'Asthma', category: 'respiratory', severity: 'severe' },
        { id: 'bronchitis', name: 'Bronchitis', category: 'respiratory', severity: 'moderate' },
        { id: 'pneumonia', name: 'Pneumonia', category: 'respiratory', severity: 'severe' },
        { id: 'sinusitis', name: 'Sinusitis', category: 'respiratory', severity: 'moderate' },
        { id: 'allergic_rhinitis', name: 'Allergic Rhinitis', category: 'respiratory', severity: 'moderate' },
        { id: 'sleep_apnea', name: 'Sleep Apnea', category: 'respiratory', severity: 'severe' },
        { id: 'pleurisy', name: 'Pleurisy', category: 'respiratory', severity: 'severe' }
    ],
    nervous: [
        { id: 'anxiety', name: 'Anxiety', category: 'nervous', severity: 'moderate' },
        { id: 'depression', name: 'Depression', category: 'nervous', severity: 'severe' },
        { id: 'insomnia', name: 'Insomnia', category: 'nervous', severity: 'moderate' },
        { id: 'headache', name: 'Headache', category: 'nervous', severity: 'moderate' },
        { id: 'migraine', name: 'Migraine', category: 'nervous', severity: 'severe' },
        { id: 'dizziness', name: 'Dizziness', category: 'nervous', severity: 'moderate' },
        { id: 'vertigo', name: 'Vertigo', category: 'nervous', severity: 'moderate' },
        { id: 'fatigue', name: 'Fatigue', category: 'nervous', severity: 'moderate' },
        { id: 'stress', name: 'Stress', category: 'nervous', severity: 'moderate' },
        { id: 'mood_swings', name: 'Mood Swings', category: 'nervous', severity: 'moderate' },
        { id: 'memory_problems', name: 'Memory Problems', category: 'nervous', severity: 'moderate' },
        { id: 'concentration_issues', name: 'Concentration Issues', category: 'nervous', severity: 'moderate' },
        { id: 'panic_attacks', name: 'Panic Attacks', category: 'nervous', severity: 'severe' },
        { id: 'ocd', name: 'Obsessive-Compulsive Disorder', category: 'nervous', severity: 'severe' },
        { id: 'adhd', name: 'Attention Deficit Disorder', category: 'nervous', severity: 'moderate' },
        { id: 'epilepsy', name: 'Epilepsy', category: 'nervous', severity: 'severe' },
        { id: 'parkinsons', name: 'Parkinson\'s Disease', category: 'nervous', severity: 'severe' },
        { id: 'alzheimers', name: 'Alzheimer\'s Disease', category: 'nervous', severity: 'severe' },
        { id: 'neuralgia', name: 'Neuralgia', category: 'nervous', severity: 'severe' }
    ],
    skin: [
        { id: 'acne', name: 'Acne', category: 'skin', severity: 'moderate' },
        { id: 'eczema', name: 'Eczema', category: 'skin', severity: 'moderate' },
        { id: 'psoriasis', name: 'Psoriasis', category: 'skin', severity: 'moderate' },
        { id: 'dry_skin', name: 'Dry Skin', category: 'skin', severity: 'mild' },
        { id: 'oily_skin', name: 'Oily Skin', category: 'skin', severity: 'mild' },
        { id: 'itching', name: 'Itching', category: 'skin', severity: 'moderate' },
        { id: 'rashes', name: 'Rashes', category: 'skin', severity: 'moderate' },
        { id: 'hives', name: 'Hives', category: 'skin', severity: 'moderate' },
        { id: 'inflammation', name: 'Skin Inflammation', category: 'skin', severity: 'moderate' },
        { id: 'dermatitis', name: 'Dermatitis', category: 'skin', severity: 'moderate' },
        { id: 'vitiligo', name: 'Vitiligo', category: 'skin', severity: 'moderate' },
        { id: 'rosacea', name: 'Rosacea', category: 'skin', severity: 'moderate' },
        { id: 'fungal_infection', name: 'Fungal Infection', category: 'skin', severity: 'moderate' },
        { id: 'bacterial_infection', name: 'Bacterial Infection', category: 'skin', severity: 'moderate' },
        { id: 'warts', name: 'Warts', category: 'skin', severity: 'mild' },
        { id: 'moles', name: 'Moles', category: 'skin', severity: 'mild' },
        { id: 'skin_cancer', name: 'Skin Cancer', category: 'skin', severity: 'severe' }
    ],
    joints: [
        { id: 'joint_pain', name: 'Joint Pain', category: 'joints', severity: 'moderate' },
        { id: 'stiffness', name: 'Joint Stiffness', category: 'joints', severity: 'moderate' },
        { id: 'swelling', name: 'Joint Swelling', category: 'joints', severity: 'moderate' },
        { id: 'back_pain', name: 'Back Pain', category: 'joints', severity: 'moderate' },
        { id: 'neck_pain', name: 'Neck Pain', category: 'joints', severity: 'moderate' },
        { id: 'muscle_pain', name: 'Muscle Pain', category: 'joints', severity: 'moderate' },
        { id: 'arthritis', name: 'Arthritis', category: 'joints', severity: 'severe' },
        { id: 'rheumatoid_arthritis', name: 'Rheumatoid Arthritis', category: 'joints', severity: 'severe' },
        { id: 'gout', name: 'Gout', category: 'joints', severity: 'severe' },
        { id: 'bursitis', name: 'Bursitis', category: 'joints', severity: 'moderate' },
        { id: 'tendonitis', name: 'Tendonitis', category: 'joints', severity: 'moderate' },
        { id: 'carpal_tunnel', name: 'Carpal Tunnel Syndrome', category: 'joints', severity: 'moderate' },
        { id: 'sciatica', name: 'Sciatica', category: 'joints', severity: 'severe' },
        { id: 'fibromyalgia', name: 'Fibromyalgia', category: 'joints', severity: 'severe' },
        { id: 'osteoporosis', name: 'Osteoporosis', category: 'joints', severity: 'severe' }
    ],
    cardiovascular: [
        { id: 'chest_pain', name: 'Chest Pain', category: 'cardiovascular', severity: 'severe' },
        { id: 'palpitations', name: 'Heart Palpitations', category: 'cardiovascular', severity: 'moderate' },
        { id: 'high_blood_pressure', name: 'High Blood Pressure', category: 'cardiovascular', severity: 'severe' },
        { id: 'low_blood_pressure', name: 'Low Blood Pressure', category: 'cardiovascular', severity: 'moderate' },
        { id: 'irregular_heartbeat', name: 'Irregular Heartbeat', category: 'cardiovascular', severity: 'severe' },
        { id: 'swollen_ankles', name: 'Swollen Ankles', category: 'cardiovascular', severity: 'moderate' },
        { id: 'varicose_veins', name: 'Varicose Veins', category: 'cardiovascular', severity: 'moderate' },
        { id: 'poor_circulation', name: 'Poor Circulation', category: 'cardiovascular', severity: 'moderate' },
        { id: 'heart_disease', name: 'Heart Disease', category: 'cardiovascular', severity: 'severe' },
        { id: 'angina', name: 'Angina', category: 'cardiovascular', severity: 'severe' }
    ],
    endocrine: [
        { id: 'diabetes', name: 'Diabetes', category: 'endocrine', severity: 'severe' },
        { id: 'thyroid_problems', name: 'Thyroid Problems', category: 'endocrine', severity: 'moderate' },
        { id: 'weight_gain', name: 'Weight Gain', category: 'endocrine', severity: 'moderate' },
        { id: 'weight_loss', name: 'Weight Loss', category: 'endocrine', severity: 'moderate' },
        { id: 'fatigue', name: 'Fatigue', category: 'endocrine', severity: 'moderate' },
        { id: 'mood_swings', name: 'Mood Swings', category: 'endocrine', severity: 'moderate' },
        { id: 'hot_flashes', name: 'Hot Flashes', category: 'endocrine', severity: 'moderate' },
        { id: 'night_sweats', name: 'Night Sweats', category: 'endocrine', severity: 'moderate' },
        { id: 'irregular_periods', name: 'Irregular Periods', category: 'endocrine', severity: 'moderate' },
        { id: 'pcos', name: 'Polycystic Ovary Syndrome', category: 'endocrine', severity: 'moderate' },
        { id: 'adrenal_fatigue', name: 'Adrenal Fatigue', category: 'endocrine', severity: 'moderate' }
    ],
    immune: [
        { id: 'frequent_infections', name: 'Frequent Infections', category: 'immune', severity: 'moderate' },
        { id: 'allergies', name: 'Allergies', category: 'immune', severity: 'moderate' },
        { id: 'food_allergies', name: 'Food Allergies', category: 'immune', severity: 'severe' },
        { id: 'seasonal_allergies', name: 'Seasonal Allergies', category: 'immune', severity: 'moderate' },
        { id: 'autoimmune_disease', name: 'Autoimmune Disease', category: 'immune', severity: 'severe' },
        { id: 'lupus', name: 'Lupus', category: 'immune', severity: 'severe' },
        { id: 'rheumatoid_arthritis', name: 'Rheumatoid Arthritis', category: 'immune', severity: 'severe' },
        { id: 'multiple_sclerosis', name: 'Multiple Sclerosis', category: 'immune', severity: 'severe' },
        { id: 'hiv_aids', name: 'HIV/AIDS', category: 'immune', severity: 'severe' },
        { id: 'cancer', name: 'Cancer', category: 'immune', severity: 'severe' }
    ],
    reproductive: [
        { id: 'infertility', name: 'Infertility', category: 'reproductive', severity: 'moderate' },
        { id: 'pms', name: 'Premenstrual Syndrome', category: 'reproductive', severity: 'moderate' },
        { id: 'menstrual_cramps', name: 'Menstrual Cramps', category: 'reproductive', severity: 'moderate' },
        { id: 'endometriosis', name: 'Endometriosis', category: 'reproductive', severity: 'severe' },
        { id: 'fibroids', name: 'Uterine Fibroids', category: 'reproductive', severity: 'moderate' },
        { id: 'prostate_problems', name: 'Prostate Problems', category: 'reproductive', severity: 'moderate' },
        { id: 'erectile_dysfunction', name: 'Erectile Dysfunction', category: 'reproductive', severity: 'moderate' },
        { id: 'low_libido', name: 'Low Libido', category: 'reproductive', severity: 'moderate' },
        { id: 'menopause', name: 'Menopause', category: 'reproductive', severity: 'moderate' },
        { id: 'andropause', name: 'Andropause', category: 'reproductive', severity: 'moderate' }
    ],
    urinary: [
        { id: 'frequent_urination', name: 'Frequent Urination', category: 'urinary', severity: 'moderate' },
        { id: 'painful_urination', name: 'Painful Urination', category: 'urinary', severity: 'moderate' },
        { id: 'urinary_incontinence', name: 'Urinary Incontinence', category: 'urinary', severity: 'moderate' },
        { id: 'kidney_stones', name: 'Kidney Stones', category: 'urinary', severity: 'severe' },
        { id: 'uti', name: 'Urinary Tract Infection', category: 'urinary', severity: 'moderate' },
        { id: 'kidney_disease', name: 'Kidney Disease', category: 'urinary', severity: 'severe' },
        { id: 'bladder_infection', name: 'Bladder Infection', category: 'urinary', severity: 'moderate' }
    ],
    eye_ear: [
        { id: 'blurred_vision', name: 'Blurred Vision', category: 'eye_ear', severity: 'moderate' },
        { id: 'eye_pain', name: 'Eye Pain', category: 'eye_ear', severity: 'moderate' },
        { id: 'dry_eyes', name: 'Dry Eyes', category: 'eye_ear', severity: 'mild' },
        { id: 'cataracts', name: 'Cataracts', category: 'eye_ear', severity: 'moderate' },
        { id: 'glaucoma', name: 'Glaucoma', category: 'eye_ear', severity: 'severe' },
        { id: 'macular_degeneration', name: 'Macular Degeneration', category: 'eye_ear', severity: 'severe' },
        { id: 'ear_pain', name: 'Ear Pain', category: 'eye_ear', severity: 'moderate' },
        { id: 'tinnitus', name: 'Tinnitus', category: 'eye_ear', severity: 'moderate' },
        { id: 'hearing_loss', name: 'Hearing Loss', category: 'eye_ear', severity: 'moderate' },
        { id: 'vertigo', name: 'Vertigo', category: 'eye_ear', severity: 'moderate' }
    ],
    general: [
        { id: 'fever', name: 'Fever', category: 'general', severity: 'moderate' },
        { id: 'chills', name: 'Chills', category: 'general', severity: 'moderate' },
        { id: 'sweating', name: 'Excessive Sweating', category: 'general', severity: 'moderate' },
        { id: 'low_energy', name: 'Low Energy', category: 'general', severity: 'moderate' },
        { id: 'inflammation', name: 'General Inflammation', category: 'general', severity: 'moderate' },
        { id: 'chronic_pain', name: 'Chronic Pain', category: 'general', severity: 'severe' },
        { id: 'sleep_problems', name: 'Sleep Problems', category: 'general', severity: 'moderate' },
        { id: 'appetite_changes', name: 'Appetite Changes', category: 'general', severity: 'moderate' },
        { id: 'temperature_sensitivity', name: 'Temperature Sensitivity', category: 'general', severity: 'mild' },
        { id: 'aging_concerns', name: 'Aging Concerns', category: 'general', severity: 'moderate' }
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
            
            // Check for subscription buttons
            if (e.target.closest('[data-action="subscribe"]')) {
                const subscribeBtn = e.target.closest('[data-action="subscribe"]');
                const plan = subscribeBtn.getAttribute('data-plan');
                console.log('Subscription button clicked, plan:', plan);
                handleSubscription(plan);
                return;
            }
            
            // Check for pricing button
            if (e.target.id === 'pricing-btn') {
                showPricingModal();
                return;
            }
            
            // Check for close modal button
            if (e.target.closest('.close-btn') || e.target.closest('[data-action="close-modal"]')) {
                const modal = document.querySelector('.modal.show');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('show');
                }
                return;
            }
            
            // Check for modal background click
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
                e.target.classList.remove('show');
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
    const symptomsContainer = document.getElementById('symptoms-container');
    
    // Show loading state
    symptomsContainer.innerHTML = '<div class="loading">Loading symptoms...</div>';
    
    // Try to fetch from API first
    fetch(`/api/symptoms?category=${category}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data && data.data.length > 0) {
                displaySymptoms(data.data, symptomsContainer);
            } else {
                // Fallback to static data if API fails or returns empty
                const staticSymptoms = symptomsData[category] || [];
                displaySymptoms(staticSymptoms, symptomsContainer);
            }
        })
        .catch(error => {
            console.error('Error loading symptoms from API:', error);
            // Fallback to static data
            const staticSymptoms = symptomsData[category] || [];
            displaySymptoms(staticSymptoms, symptomsContainer);
        });
}

function displaySymptoms(symptoms, container) {
    if (symptoms.length === 0) {
        container.innerHTML = '<div class="no-symptoms">No symptoms found for this category.</div>';
        return;
    }
    
    container.innerHTML = symptoms.map(symptom => `
        <div class="symptom-item" data-symptom-id="${symptom.id}" data-symptom-name="${symptom.name}">
            <div class="symptom-info">
                <span class="symptom-name">${symptom.name}</span>
                ${symptom.severity ? `<span class="severity-badge ${symptom.severity}">${symptom.severity}</span>` : ''}
            </div>
            <div class="symptom-checkbox">
                <input type="checkbox" id="symptom-${symptom.id}" ${selectedSymptoms.some(s => s.id === symptom.id) ? 'checked' : ''}>
                <label for="symptom-${symptom.id}"></label>
            </div>
        </div>
    `).join('');
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
    const selectedContainer = document.getElementById('selected-symptoms');
    const symptomCount = document.getElementById('symptom-count');
    
    // Update count
    symptomCount.textContent = selectedSymptoms.length;
    
    if (selectedSymptoms.length === 0) {
        selectedContainer.innerHTML = '<p class="empty-message">No symptoms selected yet. Please select at least 3 symptoms.</p>';
        return;
    }
    
    selectedContainer.innerHTML = selectedSymptoms.map((symptom, index) => `
        <div class="selected-symptom">
            <span class="symptom-name">${symptom.name}</span>
            <button class="remove-btn" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
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
    const remediesContainer = document.getElementById('remedies-container');
    const selectedSymptomIds = selectedSymptoms.map(s => s.id);
    
    if (selectedSymptomIds.length === 0) {
        remediesContainer.innerHTML = '<div class="no-remedies">Please select symptoms first to get personalized remedies.</div>';
        return;
    }
    
    // Show loading state
    remediesContainer.innerHTML = '<div class="loading">Finding remedies for your symptoms...</div>';
    
    // Fetch remedies from API based on selected symptoms
    fetch(`/api/remedies/by-symptoms?symptoms=${selectedSymptomIds.join(',')}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayRemedies(data.data);
            } else {
                // Fallback to sample remedies
                displayRemedies(getSampleRemedies());
            }
        })
        .catch(error => {
            console.error('Error loading remedies:', error);
            // Fallback to sample remedies
            displayRemedies(getSampleRemedies());
        });
}

function displayRemedies(remedies) {
    const remediesContainer = document.getElementById('remedies-container');
    
    if (remedies.length === 0) {
        remediesContainer.innerHTML = '<div class="no-remedies">No remedies found for your symptoms. Please try different symptoms or consult a healthcare provider.</div>';
        return;
    }
    
    remediesContainer.innerHTML = `
        <div class="remedies-header">
            <h3>Found ${remedies.length} remedies for your symptoms</h3>
            <div class="remedies-filters">
                <select id="category-filter">
                    <option value="">All Categories</option>
                    ${[...new Set(remedies.map(r => r.category))].map(category => 
                        `<option value="${category}">${category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}</option>`
                    ).join('')}
                </select>
                <select id="origin-filter">
                    <option value="">All Origins</option>
                    ${[...new Set(remedies.map(r => r.origin))].map(origin => 
                        `<option value="${origin}">${origin}</option>`
                    ).join('')}
                </select>
                <select id="effectiveness-filter">
                    <option value="">All Effectiveness</option>
                    <option value="high">High</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                </select>
            </div>
        </div>
        <div class="remedies-grid">
            ${remedies.map(remedy => `
                <div class="remedy-card" data-category="${remedy.category}" data-origin="${remedy.origin}" data-effectiveness="${remedy.effectiveness}">
                    <div class="remedy-header">
                        <h4>${remedy.name}</h4>
                        <div class="remedy-badges">
                            <span class="category-badge">${remedy.category}</span>
                            <span class="origin-badge">${remedy.origin}</span>
                            <span class="effectiveness-badge ${remedy.effectiveness}">${remedy.effectiveness}</span>
                        </div>
                    </div>
                    <div class="remedy-description">
                        <p>${remedy.description}</p>
                    </div>
                    <div class="remedy-details">
                        <div class="ingredients">
                            <h5>Ingredients:</h5>
                            <ul>
                                ${remedy.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="instructions">
                            <h5>Instructions:</h5>
                            <p>${remedy.instructions}</p>
                        </div>
                        ${remedy.contraindications ? `
                            <div class="contraindications">
                                <h5>⚠️ Precautions:</h5>
                                <p>${remedy.contraindications}</p>
                            </div>
                        ` : ''}
                    </div>
                    <div class="remedy-actions">
                        <button class="btn btn-primary" onclick="saveRemedy('${remedy.id}')">Save Remedy</button>
                        <button class="btn btn-secondary" onclick="shareRemedy('${remedy.id}')">Share</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add filter functionality
    setupRemedyFilters();
}

function setupRemedyFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const originFilter = document.getElementById('origin-filter');
    const effectivenessFilter = document.getElementById('effectiveness-filter');
    
    function filterRemedies() {
        const category = categoryFilter.value;
        const origin = originFilter.value;
        const effectiveness = effectivenessFilter.value;
        
        const remedyCards = document.querySelectorAll('.remedy-card');
        
        remedyCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardOrigin = card.dataset.origin;
            const cardEffectiveness = card.dataset.effectiveness;
            
            const categoryMatch = !category || cardCategory === category;
            const originMatch = !origin || cardOrigin === origin;
            const effectivenessMatch = !effectiveness || cardEffectiveness === effectiveness;
            
            if (categoryMatch && originMatch && effectivenessMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    categoryFilter.addEventListener('change', filterRemedies);
    originFilter.addEventListener('change', filterRemedies);
    effectivenessFilter.addEventListener('change', filterRemedies);
}

// Helper functions for remedies
function saveRemedy(remedyId) {
    // In a real app, this would save to user's account
    showNotification('Remedy saved to your favorites!', 'success');
}

function shareRemedy(remedyId) {
    // In a real app, this would share the remedy
    if (navigator.share) {
        navigator.share({
            title: 'Ayurvedic Remedy',
            text: 'Check out this natural remedy!',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link copied to clipboard!', 'success');
    }
}

function getSampleRemedies() {
    // Fallback sample remedies with new structure
    return [
        {
            id: 'ginger_tea_sample',
            name: 'Ginger Tea',
            category: 'digestive',
            symptoms: ['indigestion', 'nausea', 'bloating'],
            description: 'Traditional remedy for digestive issues',
            ingredients: ['Fresh ginger root', 'Hot water', 'Honey (optional)'],
            instructions: 'Slice fresh ginger, steep in hot water for 10 minutes',
            origin: 'Asia',
            effectiveness: 'high',
            safety: 'safe',
            contraindications: 'May interact with blood thinners'
        },
        {
            id: 'turmeric_milk_sample',
            name: 'Turmeric Milk (Golden Milk)',
            category: 'general',
            symptoms: ['inflammation', 'low_energy'],
            description: 'Anti-inflammatory Ayurvedic remedy',
            ingredients: ['Turmeric powder', 'Milk', 'Honey', 'Black pepper'],
            instructions: 'Mix turmeric, black pepper in warm milk with honey',
            origin: 'India',
            effectiveness: 'high',
            safety: 'safe',
            contraindications: 'May interact with blood thinners'
        },
        {
            id: 'chamomile_tea_sample',
            name: 'Chamomile Tea',
            category: 'nervous',
            symptoms: ['anxiety', 'insomnia', 'stress'],
            description: 'Calming herb for nervous system',
            ingredients: ['Chamomile flowers', 'Hot water'],
            instructions: 'Steep chamomile flowers in hot water for 5 minutes',
            origin: 'Europe',
            effectiveness: 'moderate',
            safety: 'safe',
            contraindications: 'May cause allergic reactions'
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
        console.log('Handling subscription for plan:', plan);
        
        // In a real implementation, this would integrate with a payment processor
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan: plan,
                email: userData.email || 'user@example.com'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Subscription successful! Welcome to premium features.', 'success');
            isPremiumUser = true;
            
            // Close modal
            const modal = document.querySelector('.modal.show');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
            
            // Refresh remedies if on remedies page
            if (currentStep === 4) {
                loadRemedies();
            }
        } else {
            showNotification('Subscription failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Subscription error:', error);
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