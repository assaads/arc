import { useState } from 'react';

export default function CreateEvent() {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle event creation logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Event</h1>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Event Title" 
        required 
      />
      <button type="submit">Create</button>
    </form>
  );
}
