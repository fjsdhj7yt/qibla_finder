function calculateQiblaDirection(latitude, longitude) {
    const meccaLat = 21.4225;
    const meccaLong = 39.8262;
    const latDiff = meccaLat - latitude;
    const longDiff = meccaLong - longitude;
    return Math.atan2(Math.sin(longDiff), Math.cos(latitude) * Math.tan(meccaLat) - Math.sin(latitude) * Math.cos(longDiff)) * (180 / Math.PI);
}

function updateCompass(heading) {
    const arrow = document.getElementById('arrow');
    arrow.style.transition = 'transform 0.5s ease-out';
    arrow.style.transform = `rotate(${heading}deg)`;
}

function animateQibla(qiblaDirection) {
    const qibla = document.getElementById('qibla');
    qibla.style.transition = 'transform 1s ease-in-out';
    qibla.style.transform = `rotate(${qiblaDirection}deg)`;
}

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const qiblaDirection = calculateQiblaDirection(latitude, longitude);
    
    animateQibla(qiblaDirection);
    document.getElementById('qibla-angle').textContent = `${qiblaDirection.toFixed(2)}°`;
    document.getElementById('user-location').textContent = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;

    if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', function(event) {
            if (event.webkitCompassHeading) {
                updateCompass(event.webkitCompassHeading);
            } else if (event.alpha) {
                updateCompass(360 - event.alpha);
            }
        });
    } else {
        alert("Sorry, your device doesn't support orientation");
    }
}

function error() {
    alert("Unable to retrieve your location");
}

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    alert("Geolocation is not supported by your browser");
}

// Add pulse animation to Kaaba image
document.addEventListener('DOMContentLoaded', function() {
    const kaaba = document.querySelector('.kaaba-overlay');
    setInterval(() => {
        kaaba.style.transform = 'translate(-50%, -50%) scale(1.1)';
        setTimeout(() => {
            kaaba.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 500);
    }, 2000);
});