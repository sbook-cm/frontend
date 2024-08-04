import chroma from 'chroma-js';

class Theme {
  static current() {
    if(!localStorage.theme) localStorage.theme = "light";
    return localStorage.theme;
  }
  static light() {
    let config = {};
    //var rs = getComputedStyle(document.querySelector(":root")).getPropertyValue;
    let root = document.querySelector(":root")
    for(let p in Theme.config) {
      root.style.setProperty(p, Theme.config[p][0]);
    }
    localStorage.theme = "light";
  }
  static dark() {
    let config = {};
    //var rs = getComputedStyle(document.querySelector(":root")).getPropertyValue;
    let root = document.querySelector(":root")
    for(let p in Theme.config) {
      root.style.setProperty(p, Theme.config[p][1]);
    }
    localStorage.theme = "dark";
  }
  static init() {
    if(Theme.current() == "dark") Theme.dark();
    else Theme.light();
  }
}

function ThemeSwitch(props) {
  let [theme, themeChange] = useState(Theme.current());
  let classes = props.className || "";
  return (
    <div className={"button " + classes}>
      {theme == "dark"?(
        <span className="w3-text-yellow themeswitch-button" onClick={()=>(Theme.light(), themeChange("light"))}>
          <FontAwesomeIcon size="2x" icon={faSun} />
        </span>
      ):(
        <span className="w3-text-dark-blue themeswitch-button" onClick={()=>(Theme.dark(), themeChange("dark"))}>
          <FontAwesomeIcon size="3x" icon={faMoon} />
        </span>
      )}
    </div>
  );
}

Theme.config = {
  "--base" : ["#ffffff", "#232638"],
  "--focus-a1": ["#ebf", "#350b54"],
  "--focus-a2": ["#a7e", "#a7e"],
  "--focus-b1": ["#FFDf84", "#a25414"],
  "--focus-b2": ["#F2C464", "#b28424"],
  "--warning-a1": ["#FFDf84", "#614800"],
  "--warning-b1": ["#ff8747", "#7a4900"],
  "--text": ["black", "white"],
  "--text-nofocus": ["#aaa", "#444"],
  "--text-focus": ["#black", "#white"],
  "--grey1": ["#ccc", "#333"],
  "--grey2": ["#aaa", "#444"],
  "--grey3": ["#888", "#666"],
  "--header": [`#aaaa`, `#444a`],
  "--card-round": ["5px", "5px"],
  "--username-font": ["'Nova Oval'", "'Nova Oval'"],
};
let p = 20;
let d = 0.2;
for(let i = 0; i < p; i++) {
  Theme.config[`--base${i}`] = [
    chroma(Theme.config["--base"][0]).darken(d * i * 1.2).hex(),
    chroma(Theme.config["--base"][1]).brighten(d * i).hex(),
  ];
}

function Notify(message) {
  new Notification(message);
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

class Julia {
  static julia(z, c, maxIterations) {
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
  static init() {
    Julia.i = 0;
    Julia.MAXITERATIONS = 50;
    Julia.JULIA = new Complex(-0.8, 0.156);
    Julia.canvas = document.createElement("canvas");
    Julia.canvas.willReadFrequently = true;
    Julia.ctx = Julia.canvas.getContext("2d");
    Julia.canvas.width = 20;
    Julia.canvas.height = 20;
    Julia.SPEED = 0.0001;
    setInterval(function() {
      Julia.update();
      Julia.apply();
    }, 1000);
    setInterval(Julia.reverse, 30000);
  }
  static reverse() {
    Julia.speed *= -1;
  }
  static update() {
    Julia.ctx.clearRect(0, 0, Julia.canvas.width, Julia.canvas.height);

    for (let x = 0; x < Julia.canvas.width; x++) {
      for (let y = 0; y < Julia.canvas.height; y++) {
        const z = new Complex((x - Julia.canvas.width / 2) / 200, (y - Julia.canvas.height / 2) / 200);
        const iterations = Julia.julia(z, Julia.JULIA, Julia.MAXITERATIONS);
        if (iterations === Julia.MAXITERATIONS) {
          Julia.ctx.fillStyle = 'transparent';
        } else {
          Julia.ctx.fillStyle = `hsla(${iterations * 10}, 100%, 50%, 0.03)`;
        }
        Julia.ctx.fillRect(x, y, 1, 1);
      }
    }
    Julia.JULIA.real += Julia.SPEED;
    Julia.JULIA.imag += Julia.SPEED;
  }
  static apply() {
    let data = Julia.canvas.toDataURL();
    for(let elt of document.getElementsByClassName("julia")) {
      elt.style.backgroundImage = `url(${data})`;
      elt.style.backgroundSize = `100%`;
    }
  }
}

class Colorful {
  static init() {
    Colorful.color = 0;
    setInterval(Colorful.update, 1000);
  }
  static update() {
    Colorful.color += 10;
    for(let hue = 0; hue < 36; hue++) {
      let val = (hue * 10 + Colorful.color) % (360 * 2);
      if(val > 360) val -= 360;
      for(let elt of document.getElementsByClassName(`colorful-${hue}`)) {
        elt.style.backgroundColor = `hsla(${val}, 100%, 50%, 0.04)`;
      }
    }
  }
}

export { Theme, ThemeSwitch, Colorful };
