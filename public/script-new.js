// API Configuration
console.log('=== SCRIPT-NEW.JS LOADED - QUICK SEARCH ONLY ===');

const API_BASE = window.location.origin; // Use current domain for production

// Global variables
let selectedSymptoms = [];
let allSymptoms = [];
let userProfile = null;

// Fetch all symptoms for autocomplete
fetch('/api/symptoms')
    .then(res => res.json())
    .then(data => {
        if (data.success && Array.isArray(data.data)) {
            allSymptoms = data.data.map(s => ({
                id: s.symptom || s.id,
                name: s.name
            }));
        }
    });

// Removed autocomplete logic for symptom search bar

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
const symptomMap = {
    'tired': { id: 'fatigue', ayurvedic: 'Ojas depletion' },
    'fatigue': { id: 'fatigue', ayurvedic: 'Ojas depletion' },
    'low energy': { id: 'low_energy', ayurvedic: 'Ojas depletion' },
    'no energy': { id: 'low_energy', ayurvedic: 'Ojas depletion' },
    'exhausted': { id: 'fatigue', ayurvedic: 'Ojas depletion' },
    'weakness': { id: 'weakness', ayurvedic: 'Ojas depletion' },
    'pimples': { id: 'acne', ayurvedic: 'Yuvan Pidika' },
    'acne': { id: 'acne', ayurvedic: 'Yuvan Pidika' },
    'breakouts': { id: 'acne', ayurvedic: 'Yuvan Pidika' },
    'zits': { id: 'acne', ayurvedic: 'Yuvan Pidika' },
    'indigestion': { id: 'indigestion', ayurvedic: 'Ajeerna' },
    'digestive issues': { id: 'indigestion', ayurvedic: 'Ajeerna' },
    'stomach upset': { id: 'indigestion', ayurvedic: 'Ajeerna' },
    'bloating': { id: 'bloating', ayurvedic: 'Adhmana' },
    'gas': { id: 'gas', ayurvedic: 'Aadhmana' },
    'heaviness': { id: 'heaviness', ayurvedic: 'Gourava' },
    'constipation': { id: 'constipation', ayurvedic: 'Vibandha' },
    'not able to poop': { id: 'constipation', ayurvedic: 'Vibandha' },
    'hard stool': { id: 'constipation', ayurvedic: 'Vibandha' },
    'diarrhea': { id: 'diarrhea', ayurvedic: 'Atisara' },
    'loose motions': { id: 'diarrhea', ayurvedic: 'Atisara' },
    'watery stool': { id: 'diarrhea', ayurvedic: 'Atisara' },
    'headache': { id: 'headache', ayurvedic: 'Shirashoola' },
    'migraine': { id: 'migraine', ayurvedic: 'Ardhavabhedaka' },
    'cough': { id: 'cough', ayurvedic: 'Kasa' },
    'coughing': { id: 'cough', ayurvedic: 'Kasa' },
    'cold': { id: 'congestion', ayurvedic: 'Pratishyaya' },
    'runny nose': { id: 'congestion', ayurvedic: 'Pratishyaya' },
    'blocked nose': { id: 'congestion', ayurvedic: 'Pratishyaya' },
    'sore throat': { id: 'sore_throat', ayurvedic: 'Kanthashoola' },
    'throat pain': { id: 'sore_throat', ayurvedic: 'Kanthashoola' },
    'fever': { id: 'fever', ayurvedic: 'Jwara' },
    'temperature': { id: 'fever', ayurvedic: 'Jwara' },
    'joint pain': { id: 'joint_pain', ayurvedic: 'Sandhishoola' },
    'arthritis': { id: 'arthritis', ayurvedic: 'Amavata' },
    'stiffness': { id: 'stiffness', ayurvedic: 'Stambha' },
    'swelling': { id: 'swelling', ayurvedic: 'Shotha' },
    'back pain': { id: 'back_pain', ayurvedic: 'Katishoola' },
    'anxiety': { id: 'anxiety', ayurvedic: 'Chittodvega' },
    'feeling anxious': { id: 'anxiety', ayurvedic: 'Chittodvega' },
    'stress': { id: 'stress', ayurvedic: 'Manasika Shoka' },
    'depression': { id: 'depression', ayurvedic: 'Vishada' },
    'feeling depressed': { id: 'depression', ayurvedic: 'Vishada' },
    'insomnia': { id: 'insomnia', ayurvedic: 'Anidra' },
    'can\'t sleep': { id: 'insomnia', ayurvedic: 'Anidra' },
    'trouble sleeping': { id: 'insomnia', ayurvedic: 'Anidra' },
    'skin rash': { id: 'rashes', ayurvedic: 'Kustha' },
    'rashes': { id: 'rashes', ayurvedic: 'Kustha' },
    'itching': { id: 'itching', ayurvedic: 'Kandu' },
    'hives': { id: 'hives', ayurvedic: 'Urticaria' },
    'nausea': { id: 'nausea', ayurvedic: 'Chhardi' },
    'vomiting': { id: 'vomiting', ayurvedic: 'Chhardi' },
    'throwing up': { id: 'vomiting', ayurvedic: 'Chhardi' },
    'chest pain': { id: 'chest_pain', ayurvedic: 'Urahshoola', urgent: true },
    'palpitations': { id: 'palpitations', ayurvedic: 'Hridspandana', urgent: true },
    'fainting': { id: 'fainting', ayurvedic: 'Murcha', urgent: true },
    'paralysis': { id: 'paralysis', ayurvedic: 'Pakshaghata', urgent: true },
    // ...add more as needed
};

function parseSymptoms(text) {
    // Fuzzy matching helper (Levenshtein distance)
    function levenshtein(a, b) {
        const matrix = [];
        let i;
        for (i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        let j;
        for (j = 0; j <= a.length; j++) { matrix[0][j] = j; }
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }
    const words = text.toLowerCase().split(/[\,]+/).map(w => w.trim()).filter(Boolean);
    const foundSymptoms = [];
    words.forEach(word => {
        if (symptomMap[word]) {
            foundSymptoms.push({
                id: symptomMap[word].id,
                name: word.charAt(0).toUpperCase() + word.slice(1),
                ayurvedic: symptomMap[word].ayurvedic,
                urgent: symptomMap[word].urgent || false
            });
        } else {
            // Fuzzy match: find closest symptom phrase
            let minDist = 3; // allow up to 2 typos
            let bestKey = null;
            for (const key in symptomMap) {
                const dist = levenshtein(word, key);
                if (dist < minDist) {
                    minDist = dist;
                    bestKey = key;
                }
            }
            if (bestKey) {
                foundSymptoms.push({
                    id: symptomMap[bestKey].id,
                    name: bestKey.charAt(0).toUpperCase() + bestKey.slice(1),
                    ayurvedic: symptomMap[bestKey].ayurvedic,
                    urgent: symptomMap[bestKey].urgent || false
                });
            }
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
        // Update search bar to show selected symptoms
        updateSearchBarDisplay();
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
                            <input type="checkbox" value="${symptom.symptom}" data-name="${symptom.name}" ${selectedSymptoms.some(s => s.id === symptom.symptom) ? 'checked' : ''}>
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
    // Update search bar to show selected symptoms
    updateSearchBarDisplay();
    closeCategoryModal();
    getRemedies();
}

// Update search bar to show selected symptoms
function updateSearchBarDisplay() {
    const searchInput = document.getElementById('symptom-search');
    if (searchInput) {
        searchInput.value = selectedSymptoms.map(s => s.name).join(', ');
    }
}

// Get remedies from API
async function getRemedies() {
    if (selectedSymptoms.length === 0) {
        // Clear remedies if no symptoms are selected
        displayRemedies([]);
        return;
    }
    const symptomIds = selectedSymptoms.map(s => s.id).join(',');
    const url = `${API_BASE}/api/remedies/search?symptoms=${symptomIds}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
            displayRemedies(data.data);
        } else {
            displayRemedies([]);
        }
    } catch (error) {
        console.error('Error fetching remedies:', error);
        displayRemedies([]);
    }
}

// Display remedies in the UI
function displayRemedies(remedies) {
    const remediesContainer = document.getElementById('remedies-container');
    const resultsSection = document.getElementById('results-section');

    if (!remediesContainer || !resultsSection) {
        console.error('Required elements not found in the DOM');
        return;
    }

    if (remedies && remedies.length > 0) {
        resultsSection.style.display = 'block';
        remediesContainer.innerHTML = remedies.map((remedy, index) => `
            <div class="remedy-card">
                <h3>${index + 1}. ${remedy.name}</h3>
                <p><strong>Category:</strong> ${remedy.category}</p>
                <p><strong>Benefits:</strong> ${remedy.benefits}</p>
                <div class="ingredients">
                    <strong>Ingredients:</strong>
                    <ul>
                        ${remedy.ingredients.map(ingredient => `<li><strong>${ingredient.name}</strong>${ingredient.nutritional_info ? ` - ${ingredient.nutritional_info}` : ''}</li>`).join('')}
                    </ul>
                </div>
                <div class="instructions">
                    <strong>Instructions:</strong>
                    <p>${remedy.instructions}</p>
                </div>
                ${remedy.contraindications ? `<div class="contraindications"><strong>Precautions:</strong> ${remedy.contraindications}</div>` : ''}
            </div>
        `).join('');
    } else {
        resultsSection.style.display = 'block'; // Show the section to display the message
        remediesContainer.innerHTML = '<div class="no-remedies">No remedies found for the selected symptoms. Please try again.</div>';
    }
}

// Get sample remedies for initial display
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
    if (typeof jsPDF === 'undefined') {
        alert('PDF generation is not available. Please refresh the page and try again.');
        return;
    }
    const name = userProfile && userProfile.name ? userProfile.name : 'User';
    const symptomsText = selectedSymptoms.map(s => s.name).join(', ');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Ayurveda Remedy Report for ${name}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Symptoms: ${symptomsText}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    let y = 55;
    const remediesContainer = document.getElementById('remedies-container');
    const remedyCards = remediesContainer ? remediesContainer.querySelectorAll('.remedy-card') : [];
    if (remedyCards.length === 0) {
        doc.text('No remedies found for the selected symptoms.', 20, y);
    } else {
        doc.setFontSize(14);
        doc.text('Recommended Remedies:', 20, y);
        y += 10;
        remediesContainer.querySelectorAll('.remedy-card').forEach((card, idx) => {
            if (y > 250) { doc.addPage(); y = 20; }
            const title = card.querySelector('h3').textContent;
            doc.setFontSize(12);
            doc.text(`${idx + 1}. ${title}`, 20, y);
            y += 7;
            // Extract rich details from the API data (if available)
            const remedyId = title.split('.')[1] ? title.split('.')[1].trim() : '';
            // Try to find the remedy in the API data
            const remedy = window.lastRemediesData ? window.lastRemediesData.find(r => r.name === title.replace(/^[0-9]+\.\s*/, '')) : null;
            if (remedy) {
                if (remedy.matched_condition) { doc.text(`Condition: ${remedy.matched_condition}`, 22, y); y += 6; }
                if (remedy.herbs && remedy.herbs.length) {
                    doc.text('Herbs:', 22, y); y += 6;
                    remedy.herbs.forEach(h => {
                        doc.text(`- ${h.name} (${h.form || ''}): ${h.reason} ${h.dosage ? 'Dosage: ' + h.dosage : ''} ${h.timing ? 'Timing: ' + h.timing : ''}`, 24, y);
                        y += 6;
                    });
                }
                if (remedy.instructions) { doc.text(`Instructions: ${remedy.instructions}`, 22, y); y += 6; }
                if (remedy.lifestyle_tips && remedy.lifestyle_tips.length) {
                    doc.text('Lifestyle Tips:', 22, y); y += 6;
                    remedy.lifestyle_tips.forEach(tip => { doc.text(`- ${tip}`, 24, y); y += 6; });
                }
                if (remedy.food_suggestions && remedy.food_suggestions.length) {
                    doc.text('Food Suggestions:', 22, y); y += 6;
                    remedy.food_suggestions.forEach(food => { doc.text(`- ${food}`, 24, y); y += 6; });
                }
                if (remedy.classical_reference) { doc.text(`Classical Reference: ${remedy.classical_reference}`, 22, y); y += 6; }
                if (remedy.urgent) { doc.setTextColor(200,0,0); doc.text('URGENT: Seek medical attention if symptoms are severe.', 22, y); doc.setTextColor(0,0,0); y += 8; }
            }
            y += 4;
        });
    }
    y += 10;
    doc.setFontSize(10);
    doc.text('Disclaimer: This report is for educational purposes only. Consult a qualified healthcare provider for medical advice. Classical references are cited for informational use.', 20, y, { maxWidth: 170 });
    doc.save(`Ayurveda-Remedy-Report-${name.replace(/\s+/g, '_')}.pdf`);
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

function handleDownloadReport() {
    generatePDFReport();
}

function showProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.style.display = 'block';
}

function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.style.display = 'none';
}

function submitProfileForm() {
    const form = document.getElementById('profile-form');
    if (!form) return;
    const formData = new FormData(form);
    userProfile = {};
    for (let [key, value] of formData.entries()) {
        userProfile[key] = value;
    }
    // Determine Prakriti type from quiz answers
    const prakritiScores = { vata: 0, pitta: 0, kapha: 0 };
    ['q1','q2','q3','q4','q5'].forEach(q => {
        if (userProfile[q]) prakritiScores[userProfile[q]]++;
    });
    let prakriti = 'unknown';
    let maxScore = 0;
    for (const type in prakritiScores) {
        if (prakritiScores[type] > maxScore) {
            maxScore = prakritiScores[type];
            prakriti = type;
        }
    }
    userProfile.prakriti = prakriti;
    closeProfileModal();
    alert(`Profile saved!\nName: ${userProfile.name}\nPrakriti: ${prakriti.charAt(0).toUpperCase() + prakriti.slice(1)}`);
    // You can now use userProfile to personalize remedies, diet, etc.
} 