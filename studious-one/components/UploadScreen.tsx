import React, { useState } from 'react';
import { Event, User } from '../types';

// --- INLINED SVG ICONS ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;

// --- INLINED COMPONENTS TO AVOID CREATING NEW FILES ---

const EventCard: React.FC<{ event: Event; user: User; onViewDetails: (event: Event) => void; }> = ({ event, user, onViewDetails }) => {
    const isRegistered = user.role === 'student' && event.registrants.includes(user.name);
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                    {isRegistered && <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">Registered</span>}
                </div>
                <p className="text-gray-600 mt-2 text-sm"><LocationIcon />{event.location}</p>
                <p className="text-gray-600 mt-1 text-sm"><CalendarIcon />{new Date(event.date).toLocaleString()}</p>
                <button onClick={() => onViewDetails(event)} className="mt-4 w-full text-indigo-600 font-semibold py-2 px-4 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
};

const CreateEventModal: React.FC<{
    onClose: () => void;
    onCreateEvent: (eventData: Omit<Event, 'id' | 'organizer' | 'registrants'>) => void;
}> = ({ onClose, onCreateEvent }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateEvent({ title, description, date, location });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><CloseIcon/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full px-4 py-2 border rounded-lg h-24"></textarea>
                    <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" />
                    <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" />
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700">Create Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const RegistrationFormModal: React.FC<{
    event: Event;
    user: User;
    onClose: () => void;
    onConfirm: (eventId: number) => void;
}> = ({ event, user, onClose, onConfirm }) => {
    const [email, setEmail] = useState(''); // Optional email field

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(event.id);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Register for {event.title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><CloseIcon/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="name" value={user.name} disabled className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                        <input type="email" id="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <p className="text-xs text-gray-500">
                        Confirm your registration for this event. Your name will be added to the list of registrants.
                    </p>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700">Confirm Registration</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const EventDetailsModal: React.FC<{
    event: Event;
    user: User;
    onClose: () => void;
    onToggleRegistration: (eventId: number) => void;
    onInitiateRegistration: (event: Event) => void;
}> = ({ event, user, onClose, onToggleRegistration, onInitiateRegistration }) => {
    const isRegistered = user.role === 'student' && event.registrants.includes(user.name);
    const canRegister = user.role === 'student';
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">{event.title}</h2>
                            <p className="text-sm text-gray-500 mt-1">Organized by: {event.organizer}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><CloseIcon/></button>
                    </div>
                    <div className="mt-6 space-y-2 text-gray-700">
                        <p><CalendarIcon />{new Date(event.date).toLocaleString()}</p>
                        <p><LocationIcon />{event.location}</p>
                    </div>
                    <p className="mt-6 text-gray-600 whitespace-pre-wrap">{event.description}</p>
                    
                    {user.role === 'teacher' && (
                        <div className="mt-6">
                            <h4 className="font-bold text-gray-800">Registrants ({event.registrants.length})</h4>
                            {event.registrants.length > 0 ? (
                                <ul className="mt-2 list-disc list-inside bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                                    {event.registrants.map(name => <li key={name}>{name}</li>)}
                                </ul>
                            ) : <p className="text-sm text-gray-500 mt-2">No students have registered yet.</p>}
                        </div>
                    )}
                </div>
                <div className="bg-gray-50 px-8 py-4 sticky bottom-0">
                    {canRegister && (
                         <button 
                            onClick={() => isRegistered ? onToggleRegistration(event.id) : onInitiateRegistration(event)}
                            className={`w-full py-3 rounded-lg text-white font-bold transition-colors ${isRegistered ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                            {isRegistered ? 'Unregister' : 'Register for Event'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- MAIN DASHBOARD SCREEN ---
interface DashboardScreenProps {
  user: User;
  events: Event[];
  onLogout: () => void;
  onCreateEvent: (eventData: Omit<Event, 'id' | 'organizer' | 'registrants'>) => void;
  onToggleRegistration: (eventId: number) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, events, onLogout, onCreateEvent, onToggleRegistration }) => {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [eventToRegister, setEventToRegister] = useState<Event | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    const handleInitiateRegistration = (event: Event) => {
        setSelectedEvent(null);
        setEventToRegister(event);
    };
    
    const handleConfirmRegistration = (eventId: number) => {
        onToggleRegistration(eventId);
        setEventToRegister(null);
        setNotification('Successfully registered for the event!');
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {notification && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] bg-green-500 text-white py-2 px-6 rounded-full shadow-lg animate-fade-in-down">
                    {notification}
                </div>
            )}

            {isCreateModalOpen && <CreateEventModal onClose={() => setCreateModalOpen(false)} onCreateEvent={onCreateEvent} />}
            
            {selectedEvent && <EventDetailsModal 
                event={selectedEvent} 
                user={user} 
                onClose={() => setSelectedEvent(null)} 
                onToggleRegistration={onToggleRegistration}
                onInitiateRegistration={handleInitiateRegistration}
            />}

            {eventToRegister && user && <RegistrationFormModal 
                event={eventToRegister}
                user={user}
                onClose={() => setEventToRegister(null)}
                onConfirm={handleConfirmRegistration}
            />}

            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Studious One</h1>
                        <p className="text-sm text-gray-600">Welcome, {user.name} ({user.role})</p>
                    </div>
                    <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Logout</button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Upcoming Events</h2>
                    {user.role === 'teacher' && (
                        <button onClick={() => setCreateModalOpen(true)} className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 shadow">
                            + Create Event
                        </button>
                    )}
                </div>
                
                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} user={user} onViewDetails={setSelectedEvent} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-medium text-gray-800">No Events Scheduled</h3>
                        <p className="text-gray-500 mt-2">Check back later for new events, or create one if you are a teacher!</p>
                    </div>
                )}
            </main>
             <style>{`
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default DashboardScreen;