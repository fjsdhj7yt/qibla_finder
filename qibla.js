function radians(degrees) {
    return degrees * (Math.PI / 180.0);
  }
  
  function degrees(radians) {
    return radians * (180.0 / Math.PI);
  }
  
  function calculateQiblaDirection(latitude, longitude) {
      const meccaLat = 21.4225;
      const meccaLong = 39.8262;
      const latDiff = radians(meccaLong - longitude);
      const userLatRad = radians(latitude);
      const meccaLatRad = radians(meccaLat);
  
      return degrees(Math.atan2(
          Math.sin(latDiff),
          (Math.cos(userLatRad) * Math.tan(meccaLatRad)) - (Math.sin(userLatRad) * Math.cos(latDiff))
      ));
  }
  
  function updateCompass(heading) {
      const arrow = document.getElementById('arrow');
      arrow.style.transition = 'transform 0.5s ease-out';
      arrow.style.transform = `rotate(${heading}deg)`; // Rotate the arrow according to the compass heading
  }
  
  function animateQibla(qiblaDirection) {
      const qibla = document.getElementById('qibla');
      qibla.style.transition = 'transform 1s ease-in-out';
      qibla.style.transform = `rotate(${qiblaDirection}deg)`; // Rotate the Qibla arrow
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
                  updateCompass(event.webkitCompassHeading); // iOS specific compass heading
              } else if (event.alpha) {
                  updateCompass(360 - event.alpha); // General browser compass heading
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
  
