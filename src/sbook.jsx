import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';


let backend = "http://localhost:1234/";


if(window.location.host.startsWith("localhost")) backend = "http://localhost:1234/";
else backend = "https://backend-5wak.onrender.com/";



class ModelInter {
  constructor(data) {
    for(let k in data) this[k] = data[k];
  }
}

class User extends ModelInter {
  static get(id) {
    return new Promise(function(resolve, reject) {
      if(id in User.cache) return resolve(User.cache[id]);
      $.getJSON(backend + `user/${id}.json`, null, function(data) {
        if(data) resolve(new User(data));
        else reject(data);
      });
    });
  }
  static get_current() {
    return new Promise(function(resolve, reject) {
      if(User.current) return resolve(User.current);
      if(!localStorage.sessionid) return reject();
      $.ajax({
        type: 'GET',
        dataType: "json",
        url: backend + localStorage.sessionid + `/user.json`,
        success: function(data) {
          if(data.sessionid) localStorage.sessionid = data.sessionid;
          if(data.ok && data.user) resolve(new User(data.user));
          else reject(data);
        },
        error: reject,
      });
    });
  }
  static signin(email, password) {
    return new Promise(function(resolve, reject) {
      if(User.current) return resolve(User.current);
      $.ajax({
        type: 'GET',
        dataType: "json",
        url: backend + `signin`,
        xhrFields: {
          withCredentials: true
        },
        data: {
          email: email,
          password: password
        },
        success: function(data) {
          if(data.sessionid) localStorage.sessionid = data.sessionid;
          if(data.flashes) data.flashes.map(Notify);
          if(data.ok) {
            localStorage.sessionid = data.sessionid
            resolve(new User(data.user))
          } else {
            data.msg = "Email or password Incorrect";
            reject(data)
          };
        },
        error: reject,
      });
    });
  }
  constructor(data) {
    super(data);
    User.cache[data._id] = this;
    this.profile = backend + "user/" + this._id + "/profile";
  }
  reload() {
    let _this = this;
    return new Promise(function(resolve, reject) {
      User.get(this.id).then(function(user) {
        for(let k in user) _this[k] = user[k];
        resolve();
      }).catch(reject);
    })
  }
}
User.cache = {};
User.current = null;


class Event extends ModelInter {
  static get_latest(number) {
    return new Promise(function(resolve, reject) {
      if(!localStorage.sessionid) return reject();
      $.ajax({
        url: backend + localStorage.sessionid + "/events.json",
        dataType: "JSON",
        data: { number },
        error: reject,
        success: function(data) {
          if(data.sessionid) localStorage.sessionid = data.sessionid;
          if(!data.ok) reject(data);
          console.log(data);
          resolve(data.events.map((e) => new Event(e)));
        },
      });
    });
  }
  constructor(data) {
    super(data);
  }
}

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
          <FontAwesomeIcon border size="2x" icon={faSun} />
        </span>
      ):(
        <span className="w3-text-dark-blue themeswitch-button" onClick={()=>(Theme.dark(), themeChange("dark"))}>
          <FontAwesomeIcon border size="2x" icon={faMoon} />
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
  "--text": ["black", "white"],
  "--text-nofocus": ["#aaa", "#444"],
  "--text-focus": ["#black", "#white"],
  "--grey1": ["#ccc", "#333"],
  "--grey2": ["#aaa", "#444"],
  "--grey3": ["#888", "#666"],
  "--header": [`#aaaa`, `#444a`],
  "--card-round": ["5px", "5px"],
};
let l = new w3color(Theme.config["--base"][0]), d = new w3color(Theme.config["--base"][1]);
let p = 20;
for(let i = 0; i < p; i++) {
  l.darker(20 / p * 1.5);
  d.lighter(20 / p);

  Theme.config[`--base${i}`] = [
    l.toHexString(),
    d.toHexString(),
  ];
}

$(Theme.init);

function Notify(message) {
  new Notification(message);
}

export { User, Event, Theme, ThemeSwitch };

