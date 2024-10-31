import React, { useState } from 'react';
import { Mic2, Users, Calendar, Plus, X, Check, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';

type Guest = {
  id: string;
  name: string;
  status: 'pending' | 'confirmed' | 'declined';
  songChoice?: string;
};

type KaraokeEvent = {
  date: string;
  time: string;
  location: string;
  guests: Guest[];
};

function App() {
  const [events, setEvents] = useState<KaraokeEvent[]>([
    {
      date: '2024-03-21',
      time: '20:00',
      location: 'Melody Karaoke Bar',
      guests: [
        { id: '1', name: 'Alex Kim', status: 'confirmed', songChoice: 'Sweet Caroline' },
        { id: '2', name: 'Sarah Chen', status: 'pending' },
        { id: '3', name: 'Mike Johnson', status: 'declined' },
      ],
    },
  ]);
  const [newGuestName, setNewGuestName] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(0);

  const addGuest = (eventIndex: number) => {
    if (!newGuestName.trim()) return;
    
    const newGuests = [...events[eventIndex].guests, {
      id: Date.now().toString(),
      name: newGuestName,
      status: 'pending',
    }];
    
    const newEvents = [...events];
    newEvents[eventIndex] = { ...newEvents[eventIndex], guests: newGuests };
    setEvents(newEvents);
    setNewGuestName('');
  };

  const updateGuestStatus = (eventIndex: number, guestId: string, status: Guest['status']) => {
    const newEvents = [...events];
    const guestIndex = newEvents[eventIndex].guests.findIndex(g => g.id === guestId);
    newEvents[eventIndex].guests[guestIndex] = {
      ...newEvents[eventIndex].guests[guestIndex],
      status,
    };
    setEvents(newEvents);
  };

  const removeGuest = (eventIndex: number, guestId: string) => {
    const newEvents = [...events];
    newEvents[eventIndex].guests = newEvents[eventIndex].guests.filter(g => g.id !== guestId);
    setEvents(newEvents);
  };

  const getStatusColor = (status: Guest['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto p-6">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Mic2 className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Karaoke Night Tracker</h1>
          <p className="text-gray-600">Keep track of your weekly karaoke adventures</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Calendar className="w-6 h-6 text-purple-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {new Date(events[selectedEvent].date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h2>
                  <p className="text-gray-600">{events[selectedEvent].location} • {events[selectedEvent].time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">
                  {events[selectedEvent].guests.filter(g => g.status === 'confirmed').length} confirmed
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="Add new guest..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => addGuest(selectedEvent)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Plus className="w-5 h-5 mr-1" /> Add
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {events[selectedEvent].guests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                        {guest.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{guest.name}</h3>
                      {guest.songChoice && (
                        <p className="text-sm text-gray-600">🎵 {guest.songChoice}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(guest.status)}`}>
                      {guest.status}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => updateGuestStatus(selectedEvent, guest.id, 'confirmed')}
                        className="p-1 hover:bg-green-100 rounded-full transition-colors"
                        title="Confirm"
                      >
                        <ThumbsUp className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => updateGuestStatus(selectedEvent, guest.id, 'declined')}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        title="Decline"
                      >
                        <ThumbsDown className="w-5 h-5 text-red-600" />
                      </button>
                      <button
                        onClick={() => updateGuestStatus(selectedEvent, guest.id, 'pending')}
                        className="p-1 hover:bg-yellow-100 rounded-full transition-colors"
                        title="Mark as pending"
                      >
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </button>
                      <button
                        onClick={() => removeGuest(selectedEvent, guest.id)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        title="Remove guest"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;