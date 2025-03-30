document.addEventListener('DOMContentLoaded', () => {
    const alertType = document.getElementById('alertType');
    const alertRegion = document.getElementById('alertRegion');
    const activeAlertsList = document.getElementById('activeAlertsList');
    const recentAlertsList = document.getElementById('recentAlertsList');
    const mapContainer = document.getElementById('mapContainer');
    const safetyTipsContainer = document.getElementById('safetyTipsContainer');

    let map;
    let markers = [];

    // Initialize Google Maps
    const initMap = () => {
        map = new google.maps.Map(mapContainer, {
            zoom: 2,
            center: { lat: 20, lng: 0 },
            styles: [
                {
                    featureType: "all",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#666666" }]
                }
            ]
        });
    };

    // Safety tips by disaster type
    const safetyTips = {
        earthquake: [
            { title: "Drop, Cover, and Hold On", content: "Get under a sturdy desk or table and hold on until the shaking stops." },
            { title: "Stay Away from Windows", content: "Move away from glass, windows, outside doors and walls." },
            { title: "Have an Emergency Kit", content: "Prepare a kit with water, food, first-aid supplies, and important documents." }
        ],
        tsunami: [
            { title: "Move to Higher Ground", content: "If you feel a strong earthquake near the coast, immediately move to higher ground." },
            { title: "Stay Away from the Coast", content: "Do not return to the coast until officials declare it safe." },
            { title: "Listen to Warnings", content: "Pay attention to official warnings and evacuation orders." }
        ],
        hurricane: [
            { title: "Secure Your Home", content: "Board up windows and secure outdoor objects that could become projectiles." },
            { title: "Have Supplies Ready", content: "Stock up on water, non-perishable food, and batteries." },
            { title: "Know Evacuation Routes", content: "Plan and practice your evacuation route in advance." }
        ],
        flood: [
            { title: "Avoid Flood Waters", content: "Never walk or drive through flood waters - turn around, don't drown." },
            { title: "Move to Higher Ground", content: "Evacuate immediately if told to do so." },
            { title: "Prepare Your Home", content: "Move important items to higher floors and turn off utilities if instructed." }
        ],
        wildfire: [
            { title: "Create Defensible Space", content: "Clear vegetation and flammable materials around your home." },
            { title: "Have an Evacuation Plan", content: "Plan multiple evacuation routes and keep your car fueled." },
            { title: "Stay Informed", content: "Monitor local news and official social media for updates." }
        ]
    };

    // Function to format date
    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    // Function to create alert HTML
    const createAlertHTML = (alert) => {
        return `
            <div class="alert-item ${alert.severity}">
                <div class="alert-header">
                    <span class="alert-type">${alert.type}</span>
                    <span class="alert-time">${formatDate(alert.time)}</span>
                </div>
                <div class="alert-location">
                    <i class="fas fa-map-marker-alt"></i> ${alert.location}
                </div>
                <div class="alert-description">${alert.description}</div>
                <div class="alert-actions">
                    <button class="details-btn" onclick="showAlertDetails('${alert.id}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="share-btn" onclick="shareAlert('${alert.id}')">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
        `;
    };

    // Function to add marker to map
    const addMarker = (alert) => {
        const marker = new google.maps.Marker({
            position: { lat: alert.lat, lng: alert.lng },
            map: map,
            title: alert.type,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: alert.severity === 'high' ? '#e74c3c' : 
                          alert.severity === 'medium' ? '#f39c12' : '#3498db',
                fillOpacity: 0.7,
                strokeWeight: 1,
                strokeColor: '#fff'
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3>${alert.type}</h3>
                    <p>${alert.location}</p>
                    <p>${alert.description}</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    };

    // Function to update safety tips
    const updateSafetyTips = (alerts) => {
        const activeTipTypes = new Set(alerts.map(alert => alert.type.toLowerCase()));
        let tipsHTML = '';

        activeTipTypes.forEach(type => {
            if (safetyTips[type]) {
                safetyTips[type].forEach(tip => {
                    tipsHTML += `
                        <div class="tip-item">
                            <div class="tip-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <div class="tip-content">
                                <h3>${tip.title}</h3>
                                <p>${tip.content}</p>
                            </div>
                        </div>
                    `;
                });
            }
        });

        safetyTipsContainer.innerHTML = tipsHTML || '<p>No active alerts to show safety tips for.</p>';
    };

    // Function to fetch alerts from API
    const fetchAlerts = async () => {
        try {
            // In a real application, you would fetch from your backend API
            // For demo purposes, we'll use mock data
            const mockAlerts = [
                {
                    id: '1',
                    type: 'Earthquake',
                    severity: 'high',
                    time: new Date(),
                    location: 'San Francisco, CA',
                    description: 'Magnitude 6.2 earthquake detected. Aftershocks expected.',
                    lat: 37.7749,
                    lng: -122.4194
                },
                {
                    id: '2',
                    type: 'Hurricane',
                    severity: 'medium',
                    time: new Date(),
                    location: 'Miami, FL',
                    description: 'Category 3 hurricane approaching. Expected landfall in 48 hours.',
                    lat: 25.7617,
                    lng: -80.1918
                }
            ];

            // Clear existing markers
            markers.forEach(marker => marker.setMap(null));
            markers = [];

            // Update alerts lists
            activeAlertsList.innerHTML = mockAlerts
                .filter(alert => alert.severity === 'high')
                .map(alert => createAlertHTML(alert))
                .join('');

            recentAlertsList.innerHTML = mockAlerts
                .filter(alert => alert.severity !== 'high')
                .map(alert => createAlertHTML(alert))
                .join('');

            // Add markers to map
            mockAlerts.forEach(alert => addMarker(alert));

            // Update safety tips
            updateSafetyTips(mockAlerts);

        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    // Initialize map
    initMap();

    // Fetch initial alerts
    fetchAlerts();

    // Add event listeners for filters
    alertType.addEventListener('change', fetchAlerts);
    alertRegion.addEventListener('change', fetchAlerts);

    // Set up periodic updates
    setInterval(fetchAlerts, 300000); // Update every 5 minutes
});

// Global functions for alert actions
window.showAlertDetails = (alertId) => {
    // In a real application, you would show a modal with detailed information
    alert(`Showing details for alert ${alertId}`);
};

window.shareAlert = (alertId) => {
    // In a real application, you would implement social sharing
    alert(`Sharing alert ${alertId}`);
}; 