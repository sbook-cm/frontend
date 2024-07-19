import { useState, useRef, useEffect } from 'react';
import { Event } from '../sbook.jsx';
import './dashboard.sass';
import '../styles.sass';


function julia(z, c, maxIterations) {
  let iterations = 0;

  while (iterations < maxIterations) {
    z.multiply(z);
    z.add(c);

    if (z.real * z.real + z.imag * z.imag > 4) {
      return iterations;
    }
    iterations++;
  }

  return iterations;
}

class Complex {
  constructor(real, imag) {
    this.real = real;
    this.imag = imag;
  }

  add(other) {
    this.real += other.real;
    this.imag += other.imag;
  }

  multiply(other) {
    const real = this.real * other.real - this.imag * other.imag;
    const imag = this.real * other.imag + this.imag * other.real;

    this.real = real;
    this.imag = imag;
  }
}

function Loader(props) {
  const canvasRef = useRef(null);
  let i = 0;
  useEffect(() => {
    const canv = canvasRef.current;
    let ctx = canv.getContext("2d");
    const width = canv.width;
    const height = canv.height;
    const maxIterations = 100;


    let c = new Complex(-0.8, 0.156);
    let animationSpeed = 0.001;
    setInterval(function() {
      animationSpeed *= -1;
      //c = new Complex(-0.8*Math.random(0, 1), 0.156*Math.random(0, 1));
    }, 30000);


    function drawJulia() {
      ctx.clearRect(0, 0, width, height);

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const z = new Complex((x - width / 2) / 200, (y - height / 2) / 200);
          const iterations = julia(z, c, maxIterations);

          if (iterations === maxIterations) {
            ctx.fillStyle = 'transparent';
          } else {
            ctx.fillStyle = `hsla(${iterations * 10}, 100%, 50%, ${iterations / 100})`;
          }

          ctx.fillRect(x, y, 1, 1);
        }
      }

      c.real += animationSpeed;
      c.imag += animationSpeed;

      requestAnimationFrame(drawJulia);
    }

    drawJulia();
  }, []);
  return (<canvas ref={canvasRef} width={props.width||150} height={props.height||150} className=""></canvas>);
}

function Dashboard() {
  let [events, setEvents] = useState([]);
  useEffect(() => {
      setTimeout(function fetchEvents() {
        Event.get_latest(20).then(function(callevent) {
          setEvents(callevent);
        });
      }, 5000);
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

        {events.length == 0 && (
          <div className="w3-padding-64 w3-container">
            Getting your data ready..., watcha this!
            <Loader />
          </div>
        )}
      </div>
      <div id="right">
      </div>
    </>
  );
}

export default Dashboard;
