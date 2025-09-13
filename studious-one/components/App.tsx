import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/UploadScreen';
import { Screen, User, Event } from './types';

// Mock data for demonstration purposes
const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: 'Annual Science Fair 2024',
    description: 'Showcase your innovative science projects! Open to all grades. Categories include Physics, Chemistry, Biology, and Computer Science. Winners will be featured in the school newsletter.',
    date: '2024-10-26T09:00:00',
    location: 'Main Auditorium',
    organizer: 'Mr. Davison',
    registrants: ['Alice', 'Bob'],
  },
  {
    id: 2,
    title: 'Inter-House Sports Day',
    description: 'A day of thrilling athletic competition between the houses. Events include track and field, tug-of-war, and team relays. Come cheer for your house!',
    date: '2024-11-15T08:00:00',
    location: 'School Sports Ground',
    organizer: 'Ms. Chen',
    registrants: [],
  },
  {
    id: 3,
    title: 'Coding Club: Hackathon',
    description: 'A 24-hour coding challenge to build an app that solves a school-related problem. Team up and code your way to glory. Pizza and snacks will be provided.',
    date: '2024-11-02T18:00:00',
    location: 'Computer Lab 3',
    organizer: 'Mr. Smith',
    registrants: ['Charlie'],
  },
];


const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Login);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);

  const handleLogin = (user: User) => {
    if (user.name.trim()) {
      setCurrentUser(user);
      setScreen(Screen.Dashboard);
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setScreen(Screen.Login);
  };
  
  const handleCreateEvent = (newEventData: Omit<Event, 'id' | 'organizer' | 'registrants'>) => {
    if(!currentUser) return;
    const newEvent: Event = {
      ...newEventData,
      id: Date.now(),
      organizer: currentUser.name,
      registrants: [],
    };
    setEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const handleToggleRegistration = (eventId: number) => {
    if (!currentUser || currentUser.role !== 'student') return;

    setEvents(prevEvents =>
      prevEvents.map(event => {
        if (event.id === eventId) {
          const isRegistered = event.registrants.includes(currentUser.name);
          const newRegistrants = isRegistered
            ? event.registrants.filter(name => name !== currentUser.name)
            : [...event.registrants, currentUser.name];
          return { ...event, registrants: newRegistrants };
        }
        return event;
      })
    );
  };


  const renderScreen = () => {
    switch (screen) {
      case Screen.Dashboard:
        return currentUser && (
          <DashboardScreen 
            user={currentUser}
            events={events}
            onLogout={handleLogout}
            onCreateEvent={handleCreateEvent}
            onToggleRegistration={handleToggleRegistration}
          />
        );
      case Screen.Login:
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App bg-gray-100">
      {renderScreen()}
    </div>
  );
};

export default App;
