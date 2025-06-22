// API Configuration
console.log('=== SCRIPT-NEW.JS LOADED - QUICK SEARCH ONLY ===');

const API_BASE = window.location.origin; // Use current domain for production

// Global variables
let selectedSymptoms = [];

// ===== QUICK SEARCH FUNCTIONS =====
// Quick search function
function quickSearch() {
    const searchInput = document.getElementById('symptom-search').value.trim();
    if (!searchInput) {
        alert('Please enter your symptoms');
        return;
    }
    // Convert natural language to symptom IDs
    const symptoms = parseSymptoms(searchInput);
    if (symptoms.length === 0) {
        alert('Please enter valid symptoms. Try: headache, fever, stomach pain, etc.');
        return;
    }
    selectedSymptoms = symptoms;
    getRemedies();
}

// Parse natural language to symptoms
function parseSymptoms(text) {
    const symptomMap = {
        'headache': 'headache',
        'migraine': 'migraine',
        'fever': 'fever',
        'stomach pain': 'abdominal_pain',
        'stomachache': 'abdominal_pain',
        'nausea': 'nausea',
        'vomiting': 'vomiting',
        'diarrhea': 'diarrhea',
        'constipation': 'constipation',
        'cough': 'cough',
        'cold': 'congestion',
        'sore throat': 'sore_throat',
        'fatigue': 'fatigue',
        'tired': 'fatigue',
        'insomnia': 'insomnia',
        'anxiety': 'anxiety',
        'stress': 'stress',
        'depression': 'depression',
        'back pain': 'back_pain',
        'joint pain': 'joint_pain',
        'acne': 'acne',
        'skin rash': 'rashes',
        'digestive issues': 'indigestion',
        'bloating': 'bloating',
        'gas': 'gas',
        'heartburn': 'heartburn',
        'acid reflux': 'acid_reflux',
        'indigestion': 'indigestion',
        'abdominal pain': 'abdominal_pain',
        'chest pain': 'chest_pain',
        'shortness of breath': 'shortness_of_breath',
        'wheezing': 'wheezing',
        'asthma': 'asthma',
        'bronchitis': 'bronchitis',
        'pneumonia': 'pneumonia',
        'sinusitis': 'sinusitis',
        'allergic rhinitis': 'allergic_rhinitis',
        'sleep apnea': 'sleep_apnea',
        'pleurisy': 'pleurisy',
        'dizziness': 'dizziness',
        'vertigo': 'vertigo',
        'mood swings': 'mood_swings',
        'memory problems': 'memory_problems',
        'concentration issues': 'concentration_issues',
        'panic attacks': 'panic_attacks',
        'obsessive compulsive disorder': 'ocd',
        'attention deficit disorder': 'adhd',
        'epilepsy': 'epilepsy',
        'parkinsons': 'parkinsons',
        'alzheimers': 'alzheimers',
        'neuralgia': 'neuralgia',
        'eczema': 'eczema',
        'psoriasis': 'psoriasis',
        'dry skin': 'dry_skin',
        'oily skin': 'oily_skin',
        'itching': 'itching',
        'rashes': 'rashes',
        'hives': 'hives',
        'inflammation': 'inflammation',
        'dermatitis': 'dermatitis',
        'vitiligo': 'vitiligo',
        'rosacea': 'rosacea',
        'fungal infection': 'fungal_infection',
        'bacterial infection': 'bacterial_infection',
        'warts': 'warts',
        'moles': 'moles',
        'skin cancer': 'skin_cancer',
        'joint stiffness': 'stiffness',
        'joint swelling': 'swelling',
        'neck pain': 'neck_pain',
        'muscle pain': 'muscle_pain',
        'arthritis': 'arthritis',
        'rheumatoid arthritis': 'rheumatoid_arthritis',
        'gout': 'gout',
        'bursitis': 'bursitis',
        'tendonitis': 'tendonitis',
        'carpal tunnel': 'carpal_tunnel',
        'sciatica': 'sciatica',
        'fibromyalgia': 'fibromyalgia',
        'osteoporosis': 'osteoporosis',
        'heart palpitations': 'palpitations',
        'high blood pressure': 'high_blood_pressure',
        'low blood pressure': 'low_blood_pressure',
        'irregular heartbeat': 'irregular_heartbeat',
        'swollen ankles': 'swollen_ankles',
        'varicose veins': 'varicose_veins',
        'poor circulation': 'poor_circulation',
        'heart disease': 'heart_disease',
        'angina': 'angina',
        'diabetes': 'diabetes',
        'thyroid problems': 'thyroid_problems',
        'weight gain': 'weight_gain',
        'weight loss': 'weight_loss',
        'hot flashes': 'hot_flashes',
        'night sweats': 'night_sweats',
        'irregular periods': 'irregular_periods',
        'polycystic ovary syndrome': 'pcos',
        'adrenal fatigue': 'adrenal_fatigue',
        'frequent infections': 'frequent_infections',
        'allergies': 'allergies',
        'food allergies': 'food_allergies',
        'seasonal allergies': 'seasonal_allergies',
        'autoimmune disease': 'autoimmune_disease',
        'lupus': 'lupus',
        'multiple sclerosis': 'multiple_sclerosis',
        'hiv': 'hiv_aids',
        'aids': 'hiv_aids',
        'cancer': 'cancer',
        'infertility': 'infertility',
        'premenstrual syndrome': 'pms',
        'menstrual cramps': 'menstrual_cramps',
        'endometriosis': 'endometriosis',
        'uterine fibroids': 'fibroids',
        'prostate problems': 'prostate_problems',
        'erectile dysfunction': 'erectile_dysfunction',
        'low libido': 'low_libido',
        'menopause': 'menopause',
        'andropause': 'andropause',
        'frequent urination': 'frequent_urination',
        'painful urination': 'painful_urination',
        'urinary incontinence': 'urinary_incontinence',
        'kidney stones': 'kidney_stones',
        'urinary tract infection': 'uti',
        'kidney disease': 'kidney_disease',
        'bladder infection': 'bladder_infection',
        'blurred vision': 'blurred_vision',
        'eye pain': 'eye_pain',
        'dry eyes': 'dry_eyes',
        'cataracts': 'cataracts',
        'glaucoma': 'glaucoma',
        'macular degeneration': 'macular_degeneration',
        'ear pain': 'ear_pain',
        'tinnitus': 'tinnitus',
        'hearing loss': 'hearing_loss',
        'chills': 'chills',
        'excessive sweating': 'sweating',
        'low energy': 'low_energy',
        'general inflammation': 'inflammation',
        'chronic pain': 'chronic_pain',
        'sleep problems': 'sleep_problems',
        'appetite changes': 'appetite_changes',
        'temperature sensitivity': 'temperature_sensitivity',
        'aging concerns': 'aging_concerns'
    };
    const words = text.toLowerCase().split(/[\,\s]+/);
    const foundSymptoms = [];
    words.forEach(word => {
        if (symptomMap[word]) {
            foundSymptoms.push({
                id: symptomMap[word],
                name: word.charAt(0).toUpperCase() + word.slice(1)
            });
        }
    });
    return foundSymptoms;
}

// Add symptom from tag
function addSymptom(symptomName) {
    const symptoms = parseSymptoms(symptomName);
    if (symptoms.length > 0) {
        // Avoid duplicates
        symptoms.forEach(symptom => {
            if (!selectedSymptoms.some(s => s.id === symptom.id)) {
                selectedSymptoms.push(symptom);
            }
        });
        getRemedies();
    }
}

// Show symptoms for a category (for modal)
function showCategorySymptoms(category) {
    // Fetch symptoms for the category from API
    fetch(`/api/symptoms?category=${category}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('category-symptoms');
            if (container) {
                if (data.success && data.data && data.data.length > 0) {
                    container.innerHTML = data.data.map(symptom => `
                        <label class="symptom-checkbox">
                            <input type="checkbox" value="${symptom.id}" data-name="${symptom.name}" ${selectedSymptoms.some(s => s.id === symptom.id) ? 'checked' : ''}>
                            ${symptom.name}
                        </label>
                    `).join('');
                } else {
                    container.innerHTML = '<div class="no-symptoms">No symptoms found for this category.</div>';
                }
            }
        })
        .catch(() => {
            const container = document.getElementById('category-symptoms');
            if (container) {
                container.innerHTML = '<div class="no-symptoms">No symptoms found for this category.</div>';
            }
        });
    // Show modal
    const modal = document.getElementById('category-modal');
    if (modal) modal.style.display = 'block';
}

function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    if (modal) modal.style.display = 'none';
}

function getRemediesFromModal() {
    const checkboxes = document.querySelectorAll('#category-symptoms input:checked');
    selectedSymptoms = Array.from(checkboxes).map(cb => ({
        id: cb.value,
        name: cb.dataset.name
    }));
    if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom');
        return;
    }
    closeCategoryModal();
    getRemedies();
}

// Get remedies for selected symptoms
async function getRemedies() {
    const resultsSection = document.getElementById('results-section');
    const remediesContainer = document.getElementById('remedies-container');
    if (!resultsSection || !remediesContainer) return;
    // Show loading
    resultsSection.style.display = 'block';
    remediesContainer.innerHTML = '<div class="loading">Finding remedies for your symptoms...</div>';
    // Get symptom IDs
    const symptomIds = selectedSymptoms.map(s => s.id).join(',');
    try {
        const response = await fetch(`/api/remedies/by-symptoms?symptoms=${symptomIds}&api_key=frontend-key`);
        const data = await response.json();
        if (data.success && data.data) {
            displayRemedies(data.data);
        } else {
            displayRemedies(getSampleRemedies());
        }
    } catch (error) {
        console.error('Error loading remedies:', error);
        displayRemedies(getSampleRemedies());
    }
}

// Display remedies
function displayRemedies(remedies) {
    const remediesContainer = document.getElementById('remedies-container');
    if (!remediesContainer) return;
    if (remedies.length === 0) {
        remediesContainer.innerHTML = '<div class="no-remedies">No remedies found for your symptoms. Please try different symptoms or consult a healthcare provider.</div>';
        return;
    }
    const symptomsText = selectedSymptoms.map(s => s.name).join(', ');
    remediesContainer.innerHTML = `
        <div class="symptoms-summary">
            <h4>Symptoms: ${symptomsText}</h4>
        </div>
        <div class="remedies-grid">
            ${remedies.map(remedy => `
                <div class="remedy-card">
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
                </div>
            `).join('')}
        </div>
    `;
}

// Sample remedies fallback
function getSampleRemedies() {
    return [
        {
            id: 'ginger_tea_sample',
            name: 'Ginger Tea',
            category: 'digestive',
            description: 'Traditional remedy for digestive issues',
            ingredients: ['Fresh ginger root', 'Hot water', 'Honey (optional)'],
            instructions: 'Slice fresh ginger, steep in hot water for 10 minutes',
            origin: 'Asia',
            effectiveness: 'high',
            contraindications: 'May interact with blood thinners'
        },
        {
            id: 'turmeric_milk_sample',
            name: 'Turmeric Milk (Golden Milk)',
            category: 'general',
            description: 'Anti-inflammatory Ayurvedic remedy',
            ingredients: ['Turmeric powder', 'Milk', 'Honey', 'Black pepper'],
            instructions: 'Mix turmeric, black pepper in warm milk with honey',
            origin: 'India',
            effectiveness: 'high',
            contraindications: 'May interact with blood thinners'
        }
    ];
}

// Generate PDF report
function generatePDFReport() {
    if (selectedSymptoms.length === 0) {
        alert('Please search for remedies first');
        return;
    }
    
    // Check if jsPDF is available
    if (typeof jsPDF === 'undefined') {
        alert('PDF generation is not available. Please refresh the page and try again.');
        return;
    }
    
    const symptomsText = selectedSymptoms.map(s => s.name).join(', ');
    // Create PDF content
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Ayurveda Remedy Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Symptoms: ${symptomsText}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.setFontSize(14);
    doc.text('Recommended Remedies:', 20, 70);
    // Add remedy details
    const remediesContainer = document.getElementById('remedies-container');
    const remedyCards = remediesContainer ? remediesContainer.querySelectorAll('.remedy-card') : [];
    let yPosition = 85;
    remedyCards.forEach((card, index) => {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        const name = card.querySelector('h4').textContent;
        const description = card.querySelector('.remedy-description p').textContent;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${name}`, 20, yPosition);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        const splitDesc = doc.splitTextToSize(description, 170);
        doc.text(splitDesc, 20, yPosition + 5);
        yPosition += 15 + (splitDesc.length * 5);
    });
    doc.save('ayurveda-remedy-report.pdf');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('category-modal');
    if (event.target === modal) {
        closeCategoryModal();
    }
};

// Enter key to search
// (Keep this for UX)
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('symptom-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                quickSearch();
            }
        });
    }
}); 