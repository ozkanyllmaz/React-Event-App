import React, { useEffect, useState } from 'react';
import './MyEvents.css';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Düzenleme modu
  const [editedEvent, setEditedEvent] = useState(null); // Düzenlenecek etkinlik
  const isLoggedIn = localStorage.getItem('isLoggedIn'); // Giriş kontrolü
  const UserId = localStorage.getItem('userId'); // Kullanıcı ID'si

  useEffect(() => {
    if (isLoggedIn && UserId) {
      // Giriş yapıldıysa ve UserId mevcutsa, etkinlikleri alalım
      fetch(`http://localhost:8080/events/user/${UserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log('Gelen Etkinlikler:', data);  // Gelen yanıtı kontrol et
          setEvents(data); // Alınan etkinlikleri state'e kaydediyoruz
        })
        .catch(error => {
          console.error("Etkinlikler alınırken hata oluştu:", error);
        });
    }
  }, [isLoggedIn, UserId]);

  const handleEditClick = (event) => {
    setIsEditing(true);
    setEditedEvent(event); // Düzenlenecek etkinliği set ediyoruz
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    const eventId = editedEvent.id;
    fetch(`http://localhost:8080/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedEvent),
    })
      .then(response => response.json())
      .then(data => {
        setEvents(events.map(event => event.id === eventId ? data : event)); // Güncellenmiş etkinliği listede güncelle
        setIsEditing(false); // Düzenleme modunu kapat
        alert('Etkinlik başarıyla güncellendi!');
      })
      .catch(error => {
        console.error('Etkinlik güncellenirken bir hata oluştu:', error);
        alert('Etkinlik güncellenemedi!');
      });
  };

  if (!isLoggedIn) {
    return <div>Giriş yapmadınız. Etkinliklerimi görmek için giriş yapmalısınız.</div>;
  }

  if (!UserId) {
    return <div>Kullanıcı ID'si bulunamadı. Lütfen tekrar giriş yapın.</div>;
  }

  return (
    <div className="events-page">
      <h2>Etkinliklerim</h2>
      {events.length === 0 ? (
        <p>Henüz etkinlik oluşturmadınız.</p>
      ) : (
        events.map(event => (
          <div className="event" key={event.id}>
            {isEditing && editedEvent.id === event.id ? (
              <div className="event-edit">
                <div className="event-field">
                  <label>Etkinlik Adı:</label>
                  <input
                    type="text"
                    name="name"
                    value={editedEvent.eventName}
                    onChange={handleChange}
                  />
                </div>
                <div className="event-field">
                  <label>Açıklama:</label>
                  <input
                    type="text"
                    name="description"
                    value={editedEvent.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="event-field">
                  <label>Tarih:</label>
                  <input
                    type="date"
                    name="date"
                    value={editedEvent.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="event-field">
                  <label>Saat:</label>
                  <input
                    type="time"
                    name="time"
                    value={editedEvent.time}
                    onChange={handleChange}
                  />
                </div>
                <div className="event-field">
                  <label>Süre:</label>
                  <input
                    type="number"
                    name="duration"
                    value={editedEvent.duration}
                    onChange={handleChange}
                  />
                </div>
                <div className="event-field">
                  <label>Yer:</label>
                  <input
                    type="text"
                    name="location"
                    value={editedEvent.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="event-field">
                  <label>Kategori:</label>
                  <input
                    type="text"
                    name="category"
                    value={editedEvent.category}
                    onChange={handleChange}
                  />
                </div>
                <button onClick={handleSaveClick}>Save</button>
              </div>
            ) : (
              <div>
                <p><strong>Etkinlik Adı:</strong> {event.eventName}</p>
                <p><strong>Açıklama:</strong> {event.description}</p>
                <p><strong>Tarih:</strong> {event.date}</p>
                <p><strong>Saat:</strong> {event.time}</p>
                <p><strong>Süre:</strong> {event.duration} saat</p>
                <p><strong>Yer:</strong> {event.location}</p>
                <p><strong>Kategori:</strong> {event.category}</p>
                <button onClick={() => handleEditClick(event)}>Edit</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyEvents;
