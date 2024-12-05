import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EventDetail.css';

function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState([41.0082, 28.9784]); // Varsayılan: İstanbul
  const [zoom, setZoom] = useState(13); // Harita için zoom seviyesi
  const [startLocation, setStartLocation] = useState({ lat: 40.8768715, lng: 29.2349672 }); // Varsayılan başlangıç: Kocaeli Üniversitesi
  const [routes, setRoutes] = useState([]); // Alternatif rotalar
  const [transportationMode, setTransportationMode] = useState('driving-car'); // Varsayılan ulaşım modu
  const [routeCalculated, setRouteCalculated] = useState(false); // Rota hesaplandı mı kontrolü

  // Etkinlik verisini ve etkinlik lokasyonunu al
  useEffect(() => {
    fetch(`http://localhost:8080/events/${eventId}`)
      .then((response) => response.json())
      .then(async (data) => {
        setEvent(data);
        if (data.location) {
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                data.location
              )}&key=e318c6973c8741a2b57ffd916184c1b7`
            );
            console.log("datalocation: " + JSON.stringify(data.location));
            const geoData = await response.json();
            if (geoData.results.length > 0) {
              const { lat, lng } = geoData.results[0].geometry;
              setLocation([lat, lng]);
              setZoom(15); // Daha detaylı görüntüleme için zoom seviyesini artırdık
            } else {
              console.warn('Lokasyon bulunamadı:', data.location);
            }
          } catch (error) {
            console.error('Geokodlama sırasında hata oluştu:', error);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Etkinlik verisi alınırken hata oluştu:', error);
        setLoading(false);
      });
  }, [eventId]);

  const geocodeStartLocation = async (startLoc) => {
    if (!startLoc) {
      alert('Başlangıç lokasyonunu giriniz!');
      return;
    }
    try {
      const encodedAddress = encodeURIComponent(startLoc);
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=e318c6973c8741a2b57ffd916184c1b7`
      );
      const geoData = await response.json();

      if (geoData?.results?.length > 0) {
        const { lat, lng } = geoData.results[0].geometry;
        setStartLocation({ lat, lng });
        setRouteCalculated(false); // Yeni başlangıç noktası girişi yapıldığında rota hesaplanmadı
      } else {
        alert('Başlangıç lokasyonu bulunamadı!');
      }
    } catch (error) {
      console.error('Başlangıç lokasyonu geokodlama sırasında hata:', error);
    }
  };

  const calculateRoute = async () => {
    if (!startLocation) {
      alert('Lütfen bir başlangıç noktasını girin!');
      return;
    }

    const apiKey = '5b3ce3597851110001cf6248ec956ed251e3457abf756c00b8fe6451'; // OpenRouteService API anahtarınızı buraya ekleyin
    const endpoint = `https://api.openrouteservice.org/v2/directions/${transportationMode}`;
    const body = {
      coordinates: [
        [startLocation.lng, startLocation.lat], // Başlangıç noktası (Kocaeli Üniversitesi)
        [location[1], location[0]], // Etkinlik lokasyonu
      ],
    };

    function decodePolyline(encoded) {
        let points = [];
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;
      
        while (index < len) {
          let b, shift = 0, result = 0;
          do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
          } while (b >= 0x20);
          const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
          lat += dlat;
      
          shift = 0;
          result = 0;
          do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
          } while (b >= 0x20);
          const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
          lng += dlng;
      
          points.push([lat / 1e5, lng / 1e5]);
        }
      
        return points;
    }
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: apiKey,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
  
      console.log("API Yanıtı:", data);
  
      if (data.routes && Array.isArray(data.routes) && data.routes.length > 0) {
        const route = data.routes[0];
        const decodedCoordinates = decodePolyline(route.geometry);
  
        console.log("Çözülmüş Koordinatlar:", decodedCoordinates);
  
        setRoutes(decodedCoordinates);
        setRouteCalculated(true);
      } else {
        alert('Rota bulunamadı!');
      }
    } catch (error) {
      console.error('Rota hesaplama sırasında hata oluştu:', error);
    }
  };

  const customIcon = new L.Icon({
    iconUrl: 'https://w7.pngwing.com/pngs/124/659/png-transparent-homes-n-land-real-estate-computer-icons-map-map-icon-angle-grass-location-thumbnail.png',
    iconSize: [60, 60],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const eventIcon = new L.Icon({
    iconUrl: 'https://png.pngtree.com/png-clipart/20220603/original/pngtree-red-location-icon-sign-png-image_7886920.png',
    iconSize: [60, 60],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (!event) {
    return <p>Etkinlik bulunamadı!</p>;
  }

  return (
    <div className="event-detail">
      <h2>Etkinlik Detayı</h2>
      <p><strong>Etkinlik Adı:</strong> {event.eventName}</p>
      <p><strong>Açıklama:</strong> {event.description}</p>
      <p><strong>Tarih:</strong> {event.date}</p>
      <p><strong>Saat:</strong> {event.time}</p>
      <p><strong>Süre:</strong> {event.duration} dakika</p>
      <p><strong>Lokasyon:</strong> {event.location}</p>
      <p><strong>Kategori:</strong> {event.category}</p>

      {/* Kullanıcı başlangıç noktası girme */}
      <div>
        <label>Başlangıç Noktasını Seçin:</label>
        <input
          type="text"
          placeholder="Başlangıç lokasyonunuzu girin"
          onBlur={(e) => geocodeStartLocation(e.target.value)} // Kullanıcı başlangıç noktasını girince kaydet
        />
        <button onClick={calculateRoute}>Rota Hesapla</button>
      </div>

      {/* Ulaşım Yöntemi Seçimi */}
      <div>
        <label>Ulaşım Yöntemi:</label>
        <select onChange={(e) => setTransportationMode(e.target.value)}>
          <option value="driving-car">Araba</option>
          <option value="cycling-regular">Bisiklet</option>
          <option value="foot-walking">Yürüyüş</option>
        </select>
      </div>

      <MapContainer center={location} zoom={zoom} style={{ height: '500px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Etkinlik konumu */}
        <Marker position={location} icon={eventIcon}>
          <Popup>{event.location}</Popup>
        </Marker>

        {/* Başlangıç konumu */}
        <Marker position={startLocation} icon={customIcon}>
          <Popup>Başlangıç: Kocaeli Üniversitesi</Popup>
        </Marker>

        {routes.length > 0 && (
          <Polyline positions={routes} color="blue" weight={5} />
        )}
      </MapContainer>
    </div>
  );
}

export default EventDetail;
