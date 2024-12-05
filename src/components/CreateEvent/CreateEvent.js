import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

// Enum değerlerini dizi olarak tanımla
const categories = [
  'KONSER',
  'ATOLYE_CALISMASI',
  'SEMINER',
  'PARTI',
  'SERGI',
  'TIYATRO',
  'SINEMA',
  'SPOR',
  'FESTIVAL',
  'EGITIM',
  'TOPLANTI',
  'KONFERANS',
  'FUAR',
  'DOGA_YURUYUSU',
  'YARISMA',
  'DIGER'
];

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);  // Formun gönderilme durumu
  const [message, setMessage] = useState(''); // Mesaj durumu
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const loggedInUserId = localStorage.getItem('userId'); // Dinamik olarak kullanıcı ID'sini çek
    if (!loggedInUserId) {
      alert('Kullanıcı girişi yapılmamış! Lütfen giriş yapınız.');
      return;
    }
  
    const eventData = {
      eventName: eventName,  // Etkinlik adı
      description: description, // Açıklama
      date: date, // Tarih
      time: time, // Saat
      duration: duration, // Süre
      location: location, // Lokasyon
      category: category, // Kategori
    };
  
    try {
      const response = await fetch('http://localhost:8080/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userId': loggedInUserId, // Giriş yapan kullanıcı ID'si header olarak gönderiliyor
        },
        body: JSON.stringify(eventData), // Veriler JSON formatında gönderiliyor
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend Error:', errorText);
        throw new Error(errorText || 'Something went wrong. Please try again.');
      }
  
      const data = await response.json(); // Backend'den dönen başarılı yanıt
      console.log('Event created successfully:', data);
      alert('Etkinlik başarıyla oluşturuldu!');
      // Başka işlemler yapabilirsiniz (örn. sayfa yönlendirme)
  
    } catch (error) {
      console.error('Error creating event:', error);
      alert(`Etkinlik oluşturulamadı: ${error.message}`);
    } finally {
        setIsSubmitting(false);  // İşlem tamamlandığında butonu tekrar etkinleştir
      }
  };
  
  
  
  
  
  

  return (
    <div className="create-event-container">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Name:</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Duration:</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {/* Mesaj Gönderme Alanı */}
        <div className="form-group">
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional message to participants"
          />
        </div>
        <button type="submit" className="create-event-button" disabled={isSubmitting}>
          Create Event
        </button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default CreateEvent;
