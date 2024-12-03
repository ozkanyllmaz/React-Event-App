import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 40.712776, // Default center: New York
  lng: -74.005974,
};

function EventDetail({ address }) {
  const [location, setLocation] = useState(center); // Başlangıç merkezi
  const [loading, setLoading] = useState(true);
  const [mapsLoaded, setMapsLoaded] = useState(false); // Maps'in yüklendiğini kontrol et

  useEffect(() => {
    // Google Maps Script'i Dinamik Yükleme
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCOhlsdXmfzGBTKgo1jfk_sSwzs08L8lRI&libraries=places`;
    script.async = true;
    script.defer = true;

    // Script yüklendiğinde mapsLoaded'i true yap
    script.onload = () => {
      setMapsLoaded(true);
    };

    // Script'i yükle
    document.body.appendChild(script);

    // Temizlik işlemi: script'i kaldır
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (mapsLoaded && address) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          const { lat, lng } = results[0].geometry.location;
          setLocation({ lat: lat(), lng: lng() }); // Koordinatları güncelle
          setLoading(false);
        } else {
          console.error('Geocode başarısız oldu: ' + status);
          setLoading(false);
        }
      });
    } else {
      setLoading(false); // Harita yüklenmediğinde loading'i false yap
    }
  }, [mapsLoaded, address]);

  return (
    <div>
      <h2>Etkinlik Detayı</h2>
      {loading ? (
        <p>Harita yükleniyor...</p>
      ) : (
        mapsLoaded && (
          <div id="map" style={containerStyle}>
            <GoogleMap center={center} zoom={12} mapContainerStyle={{ width: '100%', height: '500px' }}>
                <Marker position={location} />
            </GoogleMap>
          </div>
        )
      )}
    </div>
  );
}

export default EventDetail;
