// Event.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import ediyoruz
import "./Event.css";

function Event() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [eventList, setEventList] = useState([]);
  const navigate = useNavigate(); // useNavigate hook'u

  useEffect(() => {
    fetch("http://localhost:8080/events") // Backend'den verileri çek
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setEventList(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/event/detail/${eventId}`); // Etkinlik detay sayfasına yönlendirme
  };

  if (error) {
    return <div>Hata: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Yükleniyor...</div>;
  } else {
    return (
      <div className="event-container">
        {eventList.map((event) => (
          <div className="event-card" key={event.id} onClick={() => handleEventClick(event.id)}>
            {/* Etkinlik görseli */}
            <img
              src="https://ichef.bbci.co.uk/images/ic/400x400/p0jt52vz.jpg" // Varsayılan görsel
              alt={event.eventName}
              className="event-image"
            />
            {/* Etkinlik detayları */}
            <div className="event-details">
              <h2>{event.eventName}</h2>
              <p>{event.description}</p>
              <p>
                <strong>Tarih:</strong> {event.date}
              </p>
              <p>
                <strong>Saat:</strong> {event.time}
              </p>
              <p>
                <strong>Süre:</strong> {event.duration} saat
              </p>
              <p>
                <strong>Yer:</strong> {event.location}
              </p>
              <p>
                <strong>Kategori:</strong> {event.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Event;
