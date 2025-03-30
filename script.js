document.addEventListener('DOMContentLoaded', () => {
    const sosButton = document.getElementById('sosButton');
    const locationStatus = document.getElementById('location-status');

    // Function to get current location
    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    };

    // Function to send SOS alert
    const sendSOSAlert = async (location) => {
        try {
            // In a real application, you would send this to your backend server
            // For demo purposes, we'll just log it
            console.log('SOS Alert sent with location:', location);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return true;
        } catch (error) {
            console.error('Error sending SOS alert:', error);
            return false;
        }
    };

    // Handle SOS button click
    sosButton.addEventListener('click', async () => {
        try {
            sosButton.disabled = true;
            locationStatus.textContent = 'Getting your location...';
            
            const location = await getCurrentLocation();
            locationStatus.textContent = 'Sending SOS alert...';
            
            const success = await sendSOSAlert(location);
            
            if (success) {
                locationStatus.textContent = 'SOS alert sent successfully! Help is on the way.';
                locationStatus.style.color = '#27ae60';
            } else {
                throw new Error('Failed to send SOS alert');
            }
        } catch (error) {
            locationStatus.textContent = `Error: ${error.message}`;
            locationStatus.style.color = '#e74c3c';
        } finally {
            sosButton.disabled = false;
            setTimeout(() => {
                locationStatus.textContent = '';
                locationStatus.style.color = '';
            }, 5000);
        }
    });
}); 