import $ from 'jquery';

let backend = "http://localhost:1234/";

let host = window.location.host;
if(host.startsWith("www.")) host = host.slice(4);

if(host == "sbook.onvercel.app" || host == "sbook-cm.web.app") backend = "sbook-back.up.railway.app";
else if(host == "localhost") backend = "http://localhost:1234/";



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
    if(Theme.current() == "dark") Sbook.dark();
    else Theme.light();
  }
}
Theme.config = {
  "--base": ["#fff", "#223"],
  "--base2": ["#cca", "#334"],
  "--focus1": ["#a7e", "#a7e"],
  "--focus2": ["#F2C464", "#b28424"],
  "--text": ["black", "white"],
  "--grey1": ["#ccc", "#333"],
  "--grey2": ["#aaa", "#444"],
  "--grey3": ["#888", "#666"],
  "--header": [`#aaaa`, `#444a`],
  "--card-round": ["5px", "5px"],
};
$(Theme.init);

function Notify(message) {
  new Notification(message);
}

export { User, Event };

