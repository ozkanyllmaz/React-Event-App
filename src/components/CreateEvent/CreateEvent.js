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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      eventName,
      description,
      date,
      time,
      duration,
      location,
      category, // category state'i de gönderiliyor
    };

    try {
      const response = await fetch('http://localhost:8080/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        // Etkinlik başarılı bir şekilde kaydedildiyse, kullanıcıyı etkinlik sayfasına yönlendir
        navigate('/');
      } else {
        const errorData = await response.text();
        setErrorMessage(`Error: ${errorData}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setErrorMessage('Something went wrong. Please try again.');
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
        <button type="submit" className="create-event-button">
          Create Event
        </button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default CreateEvent;
