// Stripe configuration
const stripe = Stripe('pk_test_your_stripe_public_key'); // Replace with your Stripe public key
let elements;
let card;

// Pricing configuration
const pricingPlans = {
    basic: {
        monthly: 9.99,
        yearly: 95.88, // 20% discount
        features: ['Unlimited assessments', 'Detailed dosha analysis', 'PDF reports', 'Email support']
    },
    professional: {
        monthly: 19.99,
        yearly: 191.88,
        features: ['All Basic features', 'Advanced wellness plans', 'API access', 'White-label solutions']
    },
    enterprise: {
        monthly: 99.99,
        yearly: 959.88,
        features: ['All Professional features', 'Custom integrations', 'Dedicated support', 'SLA guarantee']
    }
};

// Initialize pricing page
document.addEventListener('DOMContentLoaded', function() {
    initializePricing();
    setupEventListeners();
    loadUserUsage();
});

function initializePricing() {
    // Initialize Stripe Elements
    elements = stripe.elements();
    card = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    });
    card.mount('#card-element');

    // Handle card errors
    card.addEventListener('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}

function setupEventListeners() {
    // Billing toggle
    const billingToggle = document.getElementById('billing-toggle');
    billingToggle.addEventListener('change', function() {
        updatePricing(this.checked);
    });

    // Payment form submission
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', handlePaymentSubmission);

    // Modal close
    const modal = document.getElementById('payment-modal');
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Update pricing based on billing cycle
function updatePricing(isYearly) {
    const priceElements = document.querySelectorAll('.amount');
    const periodElements = document.querySelectorAll('.period');
    
    priceElements.forEach((element, index) => {
        const plan = getPlanFromIndex(index);
        if (plan && pricingPlans[plan]) {
            const price = isYearly ? pricingPlans[plan].yearly : pricingPlans[plan].monthly;
            element.textContent = `$${price}`;
        }
    });

    periodElements.forEach(element => {
        element.textContent = isYearly ? '/year' : '/month';
    });
}

function getPlanFromIndex(index) {
    const plans = ['free', 'basic', 'professional', 'enterprise'];
    return plans[index];
}

// Subscription functions
function subscribe(plan) {
    if (plan === 'enterprise') {
        contactSales();
        return;
    }

    const modal = document.getElementById('payment-modal');
    modal.style.display = 'block';
    
    // Store selected plan
    modal.dataset.plan = plan;
    
    // Update modal content
    const modalTitle = modal.querySelector('h3');
    modalTitle.textContent = `Subscribe to ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`;
}

function startFreeTrial() {
    // Redirect to main assessment page
    window.location.href = '/';
}

function contactSales() {
    // Open email client or contact form
    const subject = encodeURIComponent('Enterprise Plan Inquiry');
    const body = encodeURIComponent('Hi, I\'m interested in your Enterprise plan. Please provide more information.');
    window.location.href = `mailto:sales@ayurvedaremedyfinder.com?subject=${subject}&body=${body}`;
}

// Payment handling
async function handlePaymentSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const email = document.getElementById('email').value;
    const plan = form.closest('.modal').dataset.plan;
    const isYearly = document.getElementById('billing-toggle').checked;
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    
    try {
        // Create payment method
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: card,
            billing_details: {
                email: email,
            },
        });

        if (error) {
            throw new Error(error.message);
        }

        // Create subscription
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan: plan,
                email: email,
                paymentMethodId: paymentMethod.id,
                interval: isYearly ? 'year' : 'month'
            }),
        });

        const result = await response.json();

        if (result.success) {
            // Confirm payment
            const { error: confirmError } = await stripe.confirmCardPayment(result.clientSecret);
            
            if (confirmError) {
                throw new Error(confirmError.message);
            }

            // Success!
            showSuccessMessage('Subscription successful! Welcome to your new plan.');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } else {
            throw new Error(result.message || 'Subscription failed');
        }
    } catch (error) {
        showErrorMessage(error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Subscribe Now';
    }
}

// Marketplace functions
function viewIntegrations() {
    // Show integrations modal or redirect to integrations page
    showIntegrationsModal();
}

function purchaseAddon(addonId) {
    const addons = {
        advanced_analytics: { name: 'Advanced Analytics', price: 199.99 },
        ai_coach: { name: 'AI Wellness Coach', price: 299.99 },
        mobile_app: { name: 'Custom Mobile App', price: 999.99 }
    };

    const addon = addons[addonId];
    if (!addon) return;

    if (confirm(`Purchase ${addon.name} for $${addon.price}?`)) {
        processAddonPurchase(addonId, addon);
    }
}

async function processAddonPurchase(addonId, addon) {
    try {
        const response = await fetch('/api/marketplace/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: addonId,
                itemType: 'addon',
                customerEmail: getUserEmail()
            }),
        });

        const result = await response.json();

        if (result.success) {
            // Handle payment
            const { error } = await stripe.confirmCardPayment(result.clientSecret);
            
            if (error) {
                throw new Error(error.message);
            }

            showSuccessMessage(`${addon.name} purchased successfully!`);
        } else {
            throw new Error(result.message || 'Purchase failed');
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
}

function showIntegrationsModal() {
    const integrations = [
        { name: 'Shopify', price: 99.99, description: 'Sell Ayurvedic products directly in your Shopify store' },
        { name: 'WooCommerce', price: 79.99, description: 'Integrate Ayurvedic recommendations with WooCommerce' },
        { name: 'Mailchimp', price: 49.99, description: 'Send personalized wellness emails based on dosha' },
        { name: 'Zapier', price: 29.99, description: 'Connect Ayurvedic insights with 5000+ apps' }
    ];

    let modalContent = `
        <div class="integrations-modal">
            <h3>Available Integrations</h3>
            <div class="integrations-grid">
    `;

    integrations.forEach(integration => {
        modalContent += `
            <div class="integration-card">
                <h4>${integration.name}</h4>
                <p>${integration.description}</p>
                <div class="integration-price">$${integration.price}</div>
                <button class="btn btn-primary" onclick="purchaseIntegration('${integration.name.toLowerCase()}')">
                    Purchase
                </button>
            </div>
        `;
    });

    modalContent += `
            </div>
        </div>
    `;

    showModal(modalContent);
}

async function purchaseIntegration(integrationName) {
    try {
        const response = await fetch('/api/marketplace/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: integrationName,
                itemType: 'integration',
                customerEmail: getUserEmail()
            }),
        });

        const result = await response.json();

        if (result.success) {
            showSuccessMessage(`${integrationName} integration purchased successfully!`);
        } else {
            throw new Error(result.message || 'Purchase failed');
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
}

// Utility functions
function getUserEmail() {
    // Get user email from localStorage or prompt
    return localStorage.getItem('userEmail') || prompt('Please enter your email:');
}

async function loadUserUsage() {
    try {
        const response = await fetch('/api/usage');
        const data = await response.json();
        
        if (data.success) {
            updateUsageDisplay(data.data);
        }
    } catch (error) {
        console.error('Error loading usage:', error);
    }
}

function updateUsageDisplay(usageData) {
    // Update usage display if user is logged in
    const usageElement = document.querySelector('.current-usage');
    if (usageElement && usageData) {
        usageElement.innerHTML = `
            <div class="usage-info">
                <p>Current Plan: ${usageData.isPremium ? 'Premium' : 'Free'}</p>
                <p>Assessments Used: ${usageData.usage.assessments}</p>
                <p>Next Billing: ${usageData.usage.premiumExpiry || 'N/A'}</p>
            </div>
        `;
    }
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Analytics tracking
function trackEvent(eventName, properties = {}) {
    // Track user interactions for analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Send to your analytics endpoint
    fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            event: eventName,
            properties: properties,
            timestamp: new Date().toISOString()
        })
    }).catch(console.error);
}

// Track pricing page interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('[onclick*="subscribe"]')) {
        trackEvent('pricing_plan_clicked', {
            plan: e.target.getAttribute('onclick').match(/subscribe\('(.+?)'\)/)?.[1]
        });
    }
    
    if (e.target.matches('[onclick*="purchaseAddon"]')) {
        trackEvent('addon_clicked', {
            addon: e.target.getAttribute('onclick').match(/purchaseAddon\('(.+?)'\)/)?.[1]
        });
    }
}); 