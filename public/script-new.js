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
    // Added mappings for stomach pain
    'stomach pain': { id: 'indigestion', ayurvedic: 'Ajeerna' },
    'abdominal pain': { id: 'indigestion', ayurvedic: 'Ajeerna' },
    'belly pain': { id: 'indigestion', ayurvedic: 'Ajeerna' },
    'tummy pain': { id: 'indigestion', ayurvedic: 'Ajeerna' },
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
        symptoms.forEach(symptom => {
            const existingIndex = selectedSymptoms.findIndex(s => s.id === symptom.id);
            if (existingIndex !== -1) {
                // Update the display name to the latest clicked synonym
                selectedSymptoms[existingIndex].name = symptom.name;
            } else {
                selectedSymptoms.push(symptom);
            }
        });
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
    // Show the personalized remedies button
    const personalizedBtn = document.getElementById('show-personalized-btn');
    if (personalizedBtn) personalizedBtn.style.display = '';
    // You can now use userProfile to personalize remedies, diet, etc.
}

async function showPersonalizedModal() {
    const modal = document.getElementById('personalized-modal');
    const content = document.getElementById('personalized-content');
    if (modal && content) {
        content.innerHTML = '<div style="text-align:center;padding:2em;">Loading personalized info...</div>';
        let doshaInfo = null;
        try {
            const res = await fetch('/api/doshas/info');
            const data = await res.json();
            if (data.success && data.data) {
                doshaInfo = data.data;
            }
        } catch (e) {
            content.innerHTML = '<div style="color:red;">Failed to load dosha info. Please try again later.</div>';
        return;
    }
        let profileHtml = '';
        if (userProfile) {
            profileHtml = `<div style='background:#f8f9fa;padding:1em;border-radius:8px;margin-bottom:1em;'>
                <strong>Name:</strong> ${userProfile.name || ''} &nbsp; 
                <strong>Age:</strong> ${userProfile.age || ''} &nbsp; 
                <strong>Gender:</strong> ${userProfile.gender || ''} &nbsp; 
                <strong>Diet:</strong> ${userProfile.diet || ''} &nbsp; 
                <strong>Sleep:</strong> ${userProfile.sleep || ''} &nbsp; 
                <strong>Stress:</strong> ${userProfile.stress || ''} &nbsp; 
                <strong>Prakriti:</strong> <span style='color:#007bff'>${userProfile.prakriti ? userProfile.prakriti.charAt(0).toUpperCase() + userProfile.prakriti.slice(1) : ''}</span>
            </div>`;
        }
        let prakriti = userProfile && userProfile.prakriti ? userProfile.prakriti : 'unknown';
        let dosha = doshaInfo && doshaInfo[prakriti] ? doshaInfo[prakriti] : null;
        let doshaHtml = '';
        if (dosha) {
            doshaHtml = `
                <div style='display:flex;justify-content:space-between;align-items:center;'>
                  <h4 style='margin-bottom:0;'>${dosha.name} Dosha</h4>
                  <div>
                    <button class='btn btn-primary' style='margin-right:8px;' onclick='downloadPersonalizedPDF()'><i class="fas fa-download"></i> Download PDF</button>
                    <button class='btn btn-secondary' onclick='sharePersonalizedAdvice()'><i class="fas fa-share-alt"></i> Share</button>
                  </div>
                </div>
                <p style='margin-top:0.5em;'><strong>Elements:</strong> ${dosha.elements.join(', ')}</p>
                <p><strong>Qualities:</strong> ${dosha.qualities.join(', ')}</p>
                <div class='personalized-tabs' style='margin:1em 0 0.5em 0;display:flex;gap:8px;'>
                    <button class='tab-btn btn btn-secondary' id='tab-remedies' onclick='showPersonalizedTab("remedies")'><i class="fas fa-leaf"></i> Remedies</button>
                    <button class='tab-btn btn btn-secondary' id='tab-favorites' onclick='showPersonalizedTab("favorites")'><i class="fas fa-star"></i> Favorites</button>
                    <button class='tab-btn btn btn-secondary' id='tab-herbs' onclick='showPersonalizedTab("herbs")'><i class="fas fa-seedling"></i> Herbs</button>
                    <button class='tab-btn btn btn-secondary' id='tab-lifestyle' onclick='showPersonalizedTab("lifestyle")'><i class="fas fa-spa"></i> Lifestyle</button>
                    <button class='tab-btn btn btn-secondary' id='tab-diet' onclick='showPersonalizedTab("diet")'><i class="fas fa-apple-alt"></i> Diet</button>
                    <button class='tab-btn btn btn-secondary' id='tab-classical' onclick='showPersonalizedTab("classical")'><i class="fas fa-book"></i> Classical References</button>
                    <button class='tab-btn btn btn-secondary' id='tab-faq' onclick='showPersonalizedTab("faq")'><i class="fas fa-question-circle"></i> FAQ</button>
                </div>
                <div id='personalized-tab-content'></div>
            `;
        } else {
            doshaHtml = `<p style='color:red;'>No dosha info found for your Prakriti. Please complete your profile and quiz.</p>`;
        }
        content.innerHTML = profileHtml + doshaHtml;
        modal.style.display = 'block';
        showPersonalizedTab('remedies');
    }
}

function getFavoriteRemedies() {
    try {
        return JSON.parse(localStorage.getItem('favoriteRemedies') || '[]');
    } catch {
        return [];
    }
}

function setFavoriteRemedies(favs) {
    localStorage.setItem('favoriteRemedies', JSON.stringify(favs));
}

function toggleFavoriteRemedy(remedy) {
    let favs = getFavoriteRemedies();
    const idx = favs.findIndex(r => r.name === remedy.name);
    if (idx !== -1) {
        favs.splice(idx, 1);
    } else {
        favs.push(remedy);
    }
    setFavoriteRemedies(favs);
    // Refresh current tab
    const active = document.querySelector('.tab-btn.active');
    if (active) showPersonalizedTab(active.id.replace('tab-', ''));
}

async function showPersonalizedTab(tab) {
    ['remedies','favorites','herbs','lifestyle','diet','classical','faq'].forEach(t => {
        const btn = document.getElementById('tab-' + t);
        if (btn) btn.classList.remove('active');
    });
    const activeBtn = document.getElementById('tab-' + tab);
    if (activeBtn) activeBtn.classList.add('active');
    const tabContent = document.getElementById('personalized-tab-content');
    if (!tabContent) return;
    const prakriti = userProfile && userProfile.prakriti ? userProfile.prakriti : 'unknown';
    if (tab === 'remedies') {
        tabContent.innerHTML = '<div style="text-align:center;padding:1em;">Loading remedies...</div>';
        try {
            const res = await fetch(`/api/doshas/recommendations/${prakriti}`);
            const data = await res.json();
            const favs = getFavoriteRemedies();
            if (data.success && data.data && data.data.remedies && data.data.remedies.length > 0) {
                tabContent.innerHTML = `<h5 style='margin-top:0;'>Recommended Remedies for ${prakriti.charAt(0).toUpperCase() + prakriti.slice(1)}</h5>` +
                    data.data.remedies.map(remedy => {
                        const isFav = favs.some(r => r.name === remedy.name);
                        return `
                        <div class='remedy-card personalized-remedy-card' style='margin-bottom:1.5em;padding:1em 1.2em;border-radius:10px;background:#f9f9fc;box-shadow:0 2px 8px rgba(0,0,0,0.04);transition:box-shadow 0.2s;position:relative;'>
                            <span onclick='toggleFavoriteRemedy(${JSON.stringify(remedy).replace(/'/g, "&#39;")})' title='${isFav ? "Remove from Favorites" : "Add to Favorites"}' style='position:absolute;top:12px;right:16px;font-size:1.4em;cursor:pointer;color:${isFav ? "#ffc107" : "#bbb"};transition:color 0.2s;'>
                                <i class="fas fa-star"></i>
                            </span>
                            <div style='font-size:1.1em;font-weight:600;margin-bottom:0.3em;'>${remedy.name}</div>
                            ${remedy.category ? `<div style='color:#888;font-size:0.95em;margin-bottom:0.2em;'><i class="fas fa-tag"></i> ${remedy.category}</div>` : ''}
                            ${remedy.benefits ? `<div style='margin-bottom:0.2em;'><strong>Benefits:</strong> ${remedy.benefits}</div>` : ''}
                            ${remedy.ingredients && remedy.ingredients.length ? `<div style='margin-bottom:0.2em;'><strong>Ingredients:</strong> <ul style='margin:0 0 0 1.2em;padding:0;'>${remedy.ingredients.map(ing => `<li>${typeof ing === 'string' ? ing : ing.name}</li>`).join('')}</ul></div>` : ''}
                            ${remedy.instructions ? `<div style='margin-bottom:0.2em;'><strong>Instructions:</strong> ${remedy.instructions}</div>` : ''}
                            ${remedy.contraindications ? `<div style='margin-bottom:0.2em;'><strong>Precautions:</strong> ${remedy.contraindications}</div>` : ''}
                            ${remedy.description ? `<div style='margin-bottom:0.2em;'><em>${remedy.description}</em></div>` : ''}
                        </div>
                        `;
                    }).join('') + `
                    <style>
                    .personalized-remedy-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.10); background:#f4f8ff; }
                    </style>`;
            } else {
                tabContent.innerHTML = '<p>No personalized remedies found for your dosha.</p>';
            }
        } catch (e) {
            tabContent.innerHTML = '<p style="color:red;">Failed to load remedies.</p>';
        }
    } else if (tab === 'favorites') {
        const favs = getFavoriteRemedies();
        if (favs.length === 0) {
            tabContent.innerHTML = '<p>You have not saved any favorite remedies yet. Click the star on a remedy to save it here!</p>';
        } else {
            tabContent.innerHTML = `<h5 style='margin-top:0;'>Your Favorite Remedies</h5>` +
                favs.map(remedy => `
                    <div class='remedy-card personalized-remedy-card' style='margin-bottom:1.5em;padding:1em 1.2em;border-radius:10px;background:#f9f9fc;box-shadow:0 2px 8px rgba(0,0,0,0.04);transition:box-shadow 0.2s;position:relative;'>
                        <span onclick='toggleFavoriteRemedy(${JSON.stringify(remedy).replace(/'/g, "&#39;")})' title='Remove from Favorites' style='position:absolute;top:12px;right:16px;font-size:1.4em;cursor:pointer;color:#ffc107;transition:color 0.2s;'>
                            <i class="fas fa-star"></i>
                        </span>
                        <div style='font-size:1.1em;font-weight:600;margin-bottom:0.3em;'>${remedy.name}</div>
                        ${remedy.category ? `<div style='color:#888;font-size:0.95em;margin-bottom:0.2em;'><i class="fas fa-tag"></i> ${remedy.category}</div>` : ''}
                        ${remedy.benefits ? `<div style='margin-bottom:0.2em;'><strong>Benefits:</strong> ${remedy.benefits}</div>` : ''}
                        ${remedy.ingredients && remedy.ingredients.length ? `<div style='margin-bottom:0.2em;'><strong>Ingredients:</strong> <ul style='margin:0 0 0 1.2em;padding:0;'>${remedy.ingredients.map(ing => `<li>${typeof ing === 'string' ? ing : ing.name}</li>`).join('')}</ul></div>` : ''}
                        ${remedy.instructions ? `<div style='margin-bottom:0.2em;'><strong>Instructions:</strong> ${remedy.instructions}</div>` : ''}
                        ${remedy.contraindications ? `<div style='margin-bottom:0.2em;'><strong>Precautions:</strong> ${remedy.contraindications}</div>` : ''}
                        ${remedy.description ? `<div style='margin-bottom:0.2em;'><em>${remedy.description}</em></div>` : ''}
                    </div>
                `).join('') + `
                <style>
                .personalized-remedy-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.10); background:#f4f8ff; }
                </style>`;
        }
    } else if (tab === 'herbs') {
        tabContent.innerHTML = '<div style="text-align:center;padding:1em;">Loading herbs...</div>';
        try {
            const res = await fetch(`/api/doshas/recommendations/${prakriti}`);
            const data = await res.json();
            if (data.success && data.data && data.data.herbs && data.data.herbs.length > 0) {
                tabContent.innerHTML = `<h5 style='margin-top:0;'>Recommended Herbs for ${prakriti.charAt(0).toUpperCase() + prakriti.slice(1)}</h5>` +
                    data.data.herbs.map(herb => `
                        <div class='remedy-card personalized-remedy-card' style='margin-bottom:1.2em;padding:1em 1.2em;border-radius:10px;background:#f6fff6;box-shadow:0 2px 8px rgba(0,0,0,0.04);transition:box-shadow 0.2s;'>
                            <div style='font-size:1.1em;font-weight:600;margin-bottom:0.3em;'>${herb.name}</div>
                            ${herb.description ? `<div style='margin-bottom:0.2em;'>${herb.description}</div>` : ''}
                            ${herb.classical_reference ? `<div style='margin-bottom:0.2em;'><strong>Classical Reference:</strong> ${herb.classical_reference}</div>` : ''}
                        </div>
                    `).join('') + `
                    <style>
                    .personalized-remedy-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.10); background:#f0fff0; }
                    </style>`;
            } else {
                tabContent.innerHTML = '<p>No recommended herbs found for your dosha.</p>';
            }
        } catch (e) {
            tabContent.innerHTML = '<p style="color:red;">Failed to load herbs.</p>';
        }
    } else if (tab === 'lifestyle') {
        const res = await fetch('/api/doshas/info');
        const data = await res.json();
        const dosha = data.data && data.data[prakriti] ? data.data[prakriti] : null;
        if (dosha && dosha.balancing && dosha.balancing.lifestyle) {
            tabContent.innerHTML = `<h5 style='margin-top:0;'>Lifestyle Tips</h5><ul style='margin-left:1.2em;'>` + dosha.balancing.lifestyle.map(tip => `<li>${tip}</li>`).join('') + `</ul>`;
        } else {
            tabContent.innerHTML = '<p>No lifestyle tips found for your dosha.</p>';
        }
    } else if (tab === 'diet') {
        const res = await fetch('/api/doshas/info');
        const data = await res.json();
        const dosha = data.data && data.data[prakriti] ? data.data[prakriti] : null;
        if (dosha && dosha.balancing && dosha.balancing.foods) {
            tabContent.innerHTML = `<h5 style='margin-top:0;'>Diet Suggestions</h5><ul style='margin-left:1.2em;'>` + dosha.balancing.foods.map(food => `<li>${food}</li>`).join('') + `</ul>`;
        } else {
            tabContent.innerHTML = '<p>No diet suggestions found for your dosha.</p>';
        }
    } else if (tab === 'classical') {
        const classicalRefs = {
            vata: [
                'Charaka Samhita: Sutrasthana 1/59',
                'Ashtanga Hridaya: Sutrasthana 1/7',
                'Sushruta Samhita: Sutrasthana 15/41'
            ],
            pitta: [
                'Charaka Samhita: Sutrasthana 1/60',
                'Ashtanga Hridaya: Sutrasthana 1/8',
                'Sushruta Samhita: Sutrasthana 15/42'
            ],
            kapha: [
                'Charaka Samhita: Sutrasthana 1/61',
                'Ashtanga Hridaya: Sutrasthana 1/9',
                'Sushruta Samhita: Sutrasthana 15/43'
            ]
        };
        const refs = classicalRefs[prakriti] || [];
        if (refs.length > 0) {
            tabContent.innerHTML = `<h5 style='margin-top:0;'>Classical References for ${prakriti.charAt(0).toUpperCase() + prakriti.slice(1)}</h5><ul style='margin-left:1.2em;'>` + refs.map(ref => `<li>${ref}</li>`).join('') + `</ul>`;
        } else {
            tabContent.innerHTML = '<p>No classical references found for your dosha.</p>';
        }
    } else if (tab === 'faq') {
        // Static FAQ content
        const faqs = [
            { q: 'What is Ayurveda?', a: 'Ayurveda is an ancient system of natural healing that originated in India over 5,000 years ago. It focuses on balancing the body, mind, and spirit using diet, lifestyle, herbs, and therapies.' },
            { q: 'What are doshas?', a: 'Doshas are the three fundamental energies (Vata, Pitta, Kapha) that govern physiological and psychological functions in the body. Each person has a unique combination of doshas.' },
            { q: 'How do I know my dosha?', a: 'You can determine your dosha by taking a Prakriti (constitution) quiz, which assesses your physical, mental, and emotional traits.' },
            { q: 'Can Ayurveda help with chronic conditions?', a: 'Ayurveda offers holistic approaches for managing chronic conditions, but you should always consult a qualified healthcare provider for serious or persistent issues.' },
            { q: 'Are Ayurvedic remedies safe?', a: 'Most Ayurvedic remedies use natural ingredients, but it is important to use them appropriately and consult a practitioner, especially if you have underlying health conditions or are taking medications.' },
            { q: 'What is the role of diet in Ayurveda?', a: 'Diet is central in Ayurveda. Foods are chosen based on your dosha and the current season to maintain balance and health.' },
            { q: 'Can I use Ayurveda with modern medicine?', a: 'Ayurveda can complement modern medicine, but always inform your healthcare provider about any herbs or supplements you are taking.' }
        ];
        tabContent.innerHTML = `<h5 style='margin-top:0;'>Frequently Asked Questions</h5>` +
            faqs.map(faq => `
                <div style='margin-bottom:1.2em;padding:1em 1.2em;border-radius:10px;background:#f8f9fa;box-shadow:0 1px 4px rgba(0,0,0,0.03);'>
                    <div style='font-weight:600;margin-bottom:0.3em;'><i class="fas fa-question-circle"></i> ${faq.q}</div>
                    <div style='color:#333;'>${faq.a}</div>
                </div>
            `).join('');
    }
}

function closePersonalizedModal() {
    const modal = document.getElementById('personalized-modal');
    if (modal) modal.style.display = 'none';
}

// Example handlers for advanced options (can be expanded)
function showDoshaAdvice() {
    const prakriti = userProfile && userProfile.prakriti ? userProfile.prakriti : 'unknown';
    let html = '';
    if (prakriti === 'vata') {
        html = `<h5>Vata Balancing Remedies</h5><ul><li>Warm, nourishing foods</li><li>Regular routine</li><li>Calming herbs like Ashwagandha</li></ul>`;
    } else if (prakriti === 'pitta') {
        html = `<h5>Pitta Balancing Remedies</h5><ul><li>Cooling foods and drinks</li><li>Stress management</li><li>Soothing herbs like Brahmi</li></ul>`;
    } else if (prakriti === 'kapha') {
        html = `<h5>Kapha Balancing Remedies</h5><ul><li>Light, warm foods</li><li>Regular exercise</li><li>Stimulating herbs like Trikatu</li></ul>`;
    } else {
        html = `<p>Please complete your profile and quiz for personalized advice.</p>`;
    }
    document.getElementById('personalized-details').innerHTML = html;
}

function showLifestyleAdvice() {
    const prakriti = userProfile && userProfile.prakriti ? userProfile.prakriti : 'unknown';
    let html = '';
    if (prakriti === 'vata') {
        html = `<h5>Vata Lifestyle Tips</h5><ul><li>Regular routine and schedule</li><li>Gentle exercise like yoga</li><li>Warm oil massage (abhyanga)</li></ul>`;
    } else if (prakriti === 'pitta') {
        html = `<h5>Pitta Lifestyle Tips</h5><ul><li>Cool and calming activities</li><li>Moderate exercise</li><li>Cooling meditation practices</li></ul>`;
    } else if (prakriti === 'kapha') {
        html = `<h5>Kapha Lifestyle Tips</h5><ul><li>Regular exercise and movement</li><li>Stimulating activities</li><li>Dry massage with powders</li></ul>`;
    } else {
        html = `<p>Please complete your profile and quiz for personalized advice.</p>`;
    }
    document.getElementById('personalized-details').innerHTML = html;
}

function showDietAdvice() {
    const prakriti = userProfile && userProfile.prakriti ? userProfile.prakriti : 'unknown';
    let html = '';
    if (prakriti === 'vata') {
        html = `<h5>Vata Diet Suggestions</h5><ul><li>Sweet, sour, and salty tastes</li><li>Warm, cooked, and moist foods</li><li>Dairy products, nuts, root vegetables</li></ul>`;
    } else if (prakriti === 'pitta') {
        html = `<h5>Pitta Diet Suggestions</h5><ul><li>Sweet, bitter, and astringent tastes</li><li>Cooling foods and drinks</li><li>Fresh fruits, dairy, grains</li></ul>`;
    } else if (prakriti === 'kapha') {
        html = `<h5>Kapha Diet Suggestions</h5><ul><li>Pungent, bitter, and astringent tastes</li><li>Light, dry, and warm foods</li><li>Legumes, vegetables, fruits like apples and pears</li></ul>`;
    } else {
        html = `<p>Please complete your profile and quiz for personalized advice.</p>`;
    }
    document.getElementById('personalized-details').innerHTML = html;
}

function clearSelectedSymptoms() {
    selectedSymptoms = [];
    const searchInput = document.getElementById('symptom-search');
    if (searchInput) searchInput.value = '';
    displayRemedies([]);
}

function getCurrentPersonalizedTab() {
    const active = document.querySelector('.tab-btn.active');
    return active ? active.id.replace('tab-', '') : 'remedies';
}

function getCurrentPersonalizedRemedies() {
    const tab = getCurrentPersonalizedTab();
    if (tab === 'remedies') {
        // Not async: get from last loaded remedies in DOM
        const cards = document.querySelectorAll('#personalized-tab-content .remedy-card');
        return Array.from(cards).map(card => card.innerText.trim());
    } else if (tab === 'favorites') {
        return getFavoriteRemedies().map(r => r.name + (r.benefits ? (': ' + r.benefits) : ''));
    }
    return [];
}

function downloadPersonalizedPDF() {
    if (typeof jsPDF === 'undefined') {
        alert('PDF generation is not available.');
        return;
    }
    const doc = new jsPDF();
    const name = userProfile && userProfile.name ? userProfile.name : 'User';
    const prakriti = userProfile && userProfile.prakriti ? userProfile.prakriti : '';
    const tab = getCurrentPersonalizedTab();
    let title = 'Ayurveda Personalized Report';
    if (tab === 'favorites') title = 'My Favorite Remedies';
    doc.setFontSize(18);
    doc.text(title, 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 20, 32);
    doc.text(`Prakriti: ${prakriti}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 48);
    let y = 58;
    const remedies = getCurrentPersonalizedRemedies();
    if (remedies.length === 0) {
        doc.text('No remedies found.', 20, y);
    } else {
        doc.setFontSize(14);
        doc.text('Remedies:', 20, y);
        y += 8;
        doc.setFontSize(12);
        remedies.forEach((rem, idx) => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.text(`${idx + 1}. ${rem}`, 22, y);
            y += 8;
        });
    }
    y += 10;
    doc.setFontSize(10);
    doc.text('Disclaimer: This report is for educational purposes only. Consult a qualified healthcare provider for medical advice.', 20, y, { maxWidth: 170 });
    doc.save(`${title.replace(/\s+/g, '_')}-${name.replace(/\s+/g, '_')}.pdf`);
}

function sharePersonalizedAdvice() {
    const name = userProfile && userProfile.name ? userProfile.name : 'User';
    const prakriti = userProfile && userProfile.prakriti ? userProfile.prakriti : '';
    const tab = getCurrentPersonalizedTab();
    let title = 'Ayurveda Personalized Advice';
    if (tab === 'favorites') title = 'My Favorite Remedies';
    const remedies = getCurrentPersonalizedRemedies();
    let summary = `${title}\nName: ${name}\nPrakriti: ${prakriti}\n\nRemedies:\n` + remedies.map((r, i) => `${i + 1}. ${r}`).join('\n');
    summary += '\n\nDisclaimer: This is for educational purposes only.';
    // WhatsApp
    const waUrl = `https://wa.me/?text=${encodeURIComponent(summary)}`;
    // Email
    const mailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(summary)}`;
    // Show share options
    if (navigator.share) {
        navigator.share({ title, text: summary });
    } else {
        if (confirm('Share via WhatsApp? (Cancel for Email)')) {
            window.open(waUrl, '_blank');
        } else {
            window.open(mailUrl, '_blank');
        }
    }
} 