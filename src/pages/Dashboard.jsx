import './dashboard.sass';
import '../styles.sass';
import { useState, useEffect } from 'react';
import { Event } from '../sbook.jsx';

function Dashboard() {
  let [events, setEvents] = useState([]);
  useEffect(() => {
      async function fetchEvents() {
        await Event.get_latest(20).then(function(callevent) {
          setEvents(callevent);
        });
      }
      fetchEvents();
    }, []);
  return (
    <>
      <div id="left">
      </div>
      <div id="center">
        <h3 className="w3-center">What are we doing today?</h3>
        {events.map((event) => (
          <div key={event._id} className="center-card">
              <p className="title">{event.params.username} came back</p>
              <div className="desc">
                <p>a session {event.params.sessionid} was accessed by a user {event.params.username}</p>
              </div>
          </div>
        ))}
      </div>
      <div id="right">
      </div>
    </>
  );
}

export default Dashboard;
