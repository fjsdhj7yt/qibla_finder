// Function to calculate the Qibla direction based on user's latitude and longitude
function calculateQiblaDirection(latitude, longitude) {
    const meccaLat = 21.4225; // Latitude of Mecca
    const meccaLong = 39.8262; // Longitude of Mecca
    const latDiff = (meccaLat - latitude) * (Math.PI / 180); // Latitude difference in radians
    const longDiff = (meccaLong - longitude) * (Math.PI / 180); // Longitude difference in radians
    const userLatRad = latitude * (Math.PI / 180); // Convert user's latitude to radians
    const meccaLatRad = meccaLat * (Math.PI / 180); // Convert Mecca's latitude to radians

    const qiblaDirection = Math.atan2(
        Math.sin(longDiff),
        (Math.cos(userLatRad) * Math.tan(meccaLatRad)) -
        (Math.sin(userLatRad) * Math.cos(longDiff))
    );
    
    // Convert the direction from radians to degrees and normalize it to 0-360 degrees
    return (qiblaDirection * (180 / Math.PI) + 360) % 360;
}

// Function to update the compass arrow's rotation based on the user's current heading
function updateCompass(heading) {
    const arrow = document.getElementById('arrow');
    arrow.style.transition = 'transform 0.5s ease-out';
    arrow.style.transform = `rotate(${heading}deg)`;
}

// Function to rotate the Qibla indicator to the correct direction
function animateQibla(qiblaDirection) {
    const qibla = document.getElementById('qibla');
    qibla.style.transition = 'transform 1s ease-in-out';
    qibla.style.transform = `rotate(${qiblaDirection}deg)`;
}

// Function to handle successful geolocation retrieval
function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Calculate the Qibla direction based on the user's location
    const qiblaDirection = calculateQiblaDirection(latitude, longitude);

    // Rotate the Qibla indicator
    animateQibla(qiblaDirection);

    // Update UI with the Qibla angle and user's location
    document.getElementById('qibla-angle').textContent = `${qiblaDirection.toFixed(2)}°`;
    document.getElementById('user-location').textContent = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;

    // Listen for device orientation events (to update the compass arrow)
    if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', function(event) {
            if (event.webkitCompassHeading) {
                // For iOS devices
                updateCompass(event.webkitCompassHeading);
            } else if (event.alpha) {
                // For Android devices
                updateCompass(360 - event.alpha); // Invert the heading for correct rotation
            }
        });
    } else {
        alert("Sorry, your device doesn't support orientation");
    }
}

// Function to handle errors in geolocation
function error() {
    alert("Unable to retrieve your location");
}

// Request geolocation from the browser
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert("Geolocation is not supported by your browser");
}
