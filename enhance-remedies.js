const fs = require('fs');
const path = require('path');

console.log('🔧 Enhancing remedies with detailed ingredient information...');

// Enhanced remedies data with detailed ingredient information
const enhancedRemediesData = [
    {
        id: 'ginger_tea',
        name: 'Ginger Tea',
        category: 'digestive',
        origin: 'India',
        effectiveness: 'high',
        description: 'Traditional Ayurvedic remedy for digestive issues',
        ingredients: [
            {
                name: 'Fresh Ginger',
                quantity: '1 inch piece',
                benefits: 'Anti-inflammatory, digestive stimulant, nausea relief',
                bodyFunction: 'Stimulates digestive enzymes, increases gastric motility, reduces inflammation in gut',
                activeCompounds: 'Gingerol, Shogaol, Zingerone',
                whyUseful: 'Ginger contains compounds that directly stimulate the digestive system and reduce nausea by affecting the nervous system'
            },
            {
                name: 'Water',
                quantity: '1 cup',
                benefits: 'Hydration, carrier for active compounds',
                bodyFunction: 'Dissolves and transports active compounds, maintains body temperature',
                activeCompounds: 'H2O',
                whyUseful: 'Water is essential for dissolving ginger compounds and ensuring proper absorption'
            },
            {
                name: 'Honey',
                quantity: '1 teaspoon',
                benefits: 'Natural sweetener, antimicrobial, soothing',
                bodyFunction: 'Provides energy, soothes throat, enhances absorption of ginger compounds',
                activeCompounds: 'Glucose, Fructose, Antioxidants',
                whyUseful: 'Honey enhances the bioavailability of ginger compounds and provides natural energy'
            },
            {
                name: 'Lemon',
                quantity: '1/2 lemon',
                benefits: 'Vitamin C, digestive aid, flavor enhancer',
                bodyFunction: 'Increases stomach acid production, enhances iron absorption, provides antioxidants',
                activeCompounds: 'Citric Acid, Vitamin C, Limonene',
                whyUseful: 'Lemon juice stimulates digestive enzymes and enhances the absorption of ginger compounds'
            }
        ],
        preparation: 'Boil fresh ginger in water for 5 minutes, add honey and lemon juice',
        dosage: '1-2 cups daily',
        symptoms: ['indigestion', 'nausea', 'bloating', 'gas'],
        benefits: ['Improves digestion', 'Reduces nausea', 'Relieves bloating', 'Anti-inflammatory'],
        contraindications: ['Pregnancy (consult doctor)', 'Bleeding disorders', 'Gallstones'],
        suitableFor: ['vata', 'kapha'],
        price: 5.99,
        detailedBenefits: {
            digestive: 'Stimulates digestive enzymes, increases gastric motility, reduces bloating',
            antiInflammatory: 'Reduces inflammation in digestive tract and joints',
            immune: 'Boosts immune system with antioxidants and antimicrobial properties',
            energy: 'Provides natural energy through honey and ginger compounds'
        }
    },
    {
        id: 'tulsi_tea',
        name: 'Tulsi (Holy Basil) Tea',
        category: 'respiratory',
        origin: 'India',
        effectiveness: 'high',
        description: 'Natural remedy for respiratory issues and cough',
        ingredients: [
            {
                name: 'Tulsi Leaves',
                quantity: '5-6 fresh leaves',
                benefits: 'Antibacterial, antiviral, expectorant, immune booster',
                bodyFunction: 'Relaxes bronchial muscles, increases mucus production, fights respiratory infections',
                activeCompounds: 'Eugenol, Ursolic Acid, Rosmarinic Acid',
                whyUseful: 'Tulsi contains compounds that directly target respiratory pathogens and relax airway muscles'
            },
            {
                name: 'Ginger',
                quantity: '1/2 inch piece',
                benefits: 'Anti-inflammatory, expectorant, warming',
                bodyFunction: 'Reduces inflammation in airways, helps expel mucus, increases circulation',
                activeCompounds: 'Gingerol, Shogaol',
                whyUseful: 'Ginger enhances the expectorant properties of tulsi and provides additional anti-inflammatory benefits'
            },
            {
                name: 'Honey',
                quantity: '1 teaspoon',
                benefits: 'Antimicrobial, soothing, natural cough suppressant',
                bodyFunction: 'Coats throat, reduces cough reflex, fights bacteria',
                activeCompounds: 'Glucose, Fructose, Hydrogen Peroxide',
                whyUseful: 'Honey naturally suppresses cough and provides antimicrobial protection'
            }
        ],
        preparation: 'Boil tulsi leaves with ginger in water for 3-4 minutes, strain and add honey',
        dosage: '2-3 cups daily',
        symptoms: ['cough', 'congestion', 'sore_throat', 'respiratory_infections'],
        benefits: ['Relieves cough', 'Clears congestion', 'Boosts immunity', 'Soothes throat'],
        contraindications: ['Pregnancy', 'Low blood sugar', 'Blood thinners'],
        suitableFor: ['vata', 'pitta', 'kapha'],
        price: 7.99,
        detailedBenefits: {
            respiratory: 'Relaxes bronchial muscles, increases mucus production, fights infections',
            immune: 'Boosts immune system with antimicrobial and antiviral properties',
            antiInflammatory: 'Reduces inflammation in respiratory tract',
            stress: 'Adaptogenic properties help reduce stress and anxiety'
        }
    },
    {
        id: 'turmeric_milk',
        name: 'Golden Milk (Turmeric)',
        category: 'general',
        origin: 'India',
        effectiveness: 'high',
        description: 'Anti-inflammatory golden milk with turmeric',
        ingredients: [
            {
                name: 'Turmeric Powder',
                quantity: '1/2 teaspoon',
                benefits: 'Anti-inflammatory, antioxidant, immune booster',
                bodyFunction: 'Inhibits inflammatory enzymes, boosts immune cells, protects against oxidative damage',
                activeCompounds: 'Curcumin, Turmerone, Zingiberene',
                whyUseful: 'Curcumin is a powerful anti-inflammatory compound that targets multiple inflammatory pathways'
            },
            {
                name: 'Milk',
                quantity: '1 cup',
                benefits: 'Calcium, protein, enhances curcumin absorption',
                bodyFunction: 'Provides calcium for bones, protein for muscle repair, fat enhances curcumin bioavailability',
                activeCompounds: 'Calcium, Protein, Fat',
                whyUseful: 'Milk fat significantly increases the absorption of curcumin by up to 2000%'
            },
            {
                name: 'Black Pepper',
                quantity: '1/4 teaspoon',
                benefits: 'Enhances curcumin absorption, warming',
                bodyFunction: 'Increases curcumin bioavailability, stimulates circulation',
                activeCompounds: 'Piperine',
                whyUseful: 'Piperine increases curcumin absorption by inhibiting enzymes that break it down'
            },
            {
                name: 'Honey',
                quantity: '1 teaspoon',
                benefits: 'Natural sweetener, antimicrobial, energy',
                bodyFunction: 'Provides energy, enhances taste, antimicrobial properties',
                activeCompounds: 'Glucose, Fructose, Antioxidants',
                whyUseful: 'Honey provides natural energy and enhances the overall therapeutic effect'
            }
        ],
        preparation: 'Heat milk with turmeric and black pepper, add honey before serving',
        dosage: '1 cup before bed',
        symptoms: ['inflammation', 'joint_pain', 'chronic_pain', 'general_inflammation'],
        benefits: ['Reduces inflammation', 'Boosts immunity', 'Improves sleep', 'Pain relief'],
        contraindications: ['Gallbladder issues', 'Blood thinners', 'Iron deficiency'],
        suitableFor: ['vata', 'pitta', 'kapha'],
        price: 8.99,
        detailedBenefits: {
            antiInflammatory: 'Targets multiple inflammatory pathways, reduces pain and swelling',
            immune: 'Boosts immune cell activity and antioxidant protection',
            sleep: 'Promotes relaxation and better sleep quality',
            joint: 'Reduces joint inflammation and improves mobility'
        }
    },
    {
        id: 'ashwagandha_tea',
        name: 'Ashwagandha Tea',
        category: 'nervous',
        origin: 'India',
        effectiveness: 'high',
        description: 'Adaptogenic herb for stress and anxiety',
        ingredients: [
            {
                name: 'Ashwagandha Powder',
                quantity: '1/2 teaspoon',
                benefits: 'Adaptogen, stress reducer, energy booster',
                bodyFunction: 'Reduces cortisol levels, balances stress hormones, improves energy metabolism',
                activeCompounds: 'Withanolides, Withaferin A, Sitoindosides',
                whyUseful: 'Withanolides directly reduce cortisol production and improve stress response'
            },
            {
                name: 'Water',
                quantity: '1 cup',
                benefits: 'Hydration, carrier for active compounds',
                bodyFunction: 'Dissolves and transports active compounds',
                activeCompounds: 'H2O',
                whyUseful: 'Water is essential for extracting and absorbing ashwagandha compounds'
            },
            {
                name: 'Honey',
                quantity: '1 teaspoon',
                benefits: 'Natural sweetener, calming, energy',
                bodyFunction: 'Provides energy, enhances taste, calming effect',
                activeCompounds: 'Glucose, Fructose',
                whyUseful: 'Honey provides natural energy and enhances the calming effect'
            }
        ],
        preparation: 'Boil ashwagandha in water for 5 minutes, strain and add honey',
        dosage: '1-2 cups daily',
        symptoms: ['anxiety', 'stress', 'insomnia', 'fatigue'],
        benefits: ['Reduces stress', 'Improves sleep', 'Boosts energy', 'Calms mind'],
        contraindications: ['Pregnancy', 'Autoimmune conditions', 'Thyroid disorders'],
        suitableFor: ['vata', 'kapha'],
        price: 12.99,
        detailedBenefits: {
            stress: 'Reduces cortisol levels and improves stress response',
            sleep: 'Promotes deeper, more restful sleep',
            energy: 'Improves energy metabolism and reduces fatigue',
            cognitive: 'Enhances memory and concentration'
        }
    },
    {
        id: 'peppermint_tea',
        name: 'Peppermint Tea',
        category: 'respiratory',
        origin: 'Europe',
        effectiveness: 'moderate',
        description: 'Soothing tea for respiratory and digestive issues',
        ingredients: [
            {
                name: 'Peppermint Leaves',
                quantity: '1 tablespoon',
                benefits: 'Decongestant, antispasmodic, cooling',
                bodyFunction: 'Relaxes smooth muscles, opens airways, reduces inflammation',
                activeCompounds: 'Menthol, Menthone, Limonene',
                whyUseful: 'Menthol directly relaxes bronchial muscles and provides cooling relief'
            },
            {
                name: 'Water',
                quantity: '1 cup',
                benefits: 'Hydration, carrier for active compounds',
                bodyFunction: 'Dissolves and transports active compounds',
                activeCompounds: 'H2O',
                whyUseful: 'Water extracts menthol and other active compounds from peppermint'
            },
            {
                name: 'Honey',
                quantity: '1 teaspoon',
                benefits: 'Antimicrobial, soothing, natural cough suppressant',
                bodyFunction: 'Coats throat, reduces cough reflex',
                activeCompounds: 'Glucose, Fructose',
                whyUseful: 'Honey enhances the soothing effect and provides antimicrobial protection'
            }
        ],
        preparation: 'Steep peppermint leaves in hot water for 5 minutes, add honey',
        dosage: '2-3 cups daily',
        symptoms: ['cough', 'congestion', 'indigestion', 'nausea'],
        benefits: ['Relieves cough', 'Clears sinuses', 'Soothes stomach', 'Reduces nausea'],
        contraindications: ['GERD', 'Pregnancy', 'Gallstones'],
        suitableFor: ['vata', 'kapha'],
        price: 6.99,
        detailedBenefits: {
            respiratory: 'Relaxes bronchial muscles, clears congestion, soothes throat',
            digestive: 'Relaxes stomach muscles, reduces nausea and bloating',
            cooling: 'Provides cooling relief for fever and inflammation',
            antimicrobial: 'Fights respiratory and digestive infections'
        }
    }
];

// Read the current server file
const serverPath = path.join(__dirname, 'server-simple.js');
let content = fs.readFileSync(serverPath, 'utf8');

// Replace the old remedies data with enhanced data
const oldRemediesStart = content.indexOf('const worldwideRemediesData = [');
const oldRemediesEnd = content.indexOf('];', oldRemediesStart) + 2;

const newRemediesData = `const worldwideRemediesData = ${JSON.stringify(enhancedRemediesData, null, 4)};`;

content = content.substring(0, oldRemediesStart) + newRemediesData + content.substring(oldRemediesEnd);

// Write the enhanced content back
fs.writeFileSync(serverPath, content);
console.log('✅ Remedies enhanced successfully!');
console.log('🌿 Added detailed benefits and body functions for ingredients');
console.log('💡 Now includes why each ingredient is useful');
console.log('📊 Enhanced with active compounds and detailed preparation'); 