import Link from 'next/link';

const events = [
  { id: 1, title: "Mountain Trail Challenge" },
  // ... other events
];

export default function EventList() {
  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <Link href={`/event/${event.id}`}>{event.title}</Link>
          </li>
        ))}
      </ul>
      <Link href="/event/create">Create New Event</Link>
    </div>
  );
}
