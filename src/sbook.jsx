import $ from 'jquery';

let backend = "http://localhost:8765/";

let host = window.location.host;
if(host.startsWith("www.")) host = host.slice(4);

if(host == "sbook.onvercel.app" || host == "sbook-cm.web.app") backend = "sbook-back.up.railway.app";
else if(host == "localhost") backend = "http://localhost:8765/";


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
        if(data) resolve(new User(data))
        else reject(data);
      });
    });
  }
  static get_current() {
    return new Promise(function(resolve, reject) {
      if(User.current) return resolve(User.current);
      $.getJSON(backend + `user.json`, null, function(data) {
        if(data.ok) resolve(new User(data.user))
        else reject(data);
      });
    });
  }
  constructor(data) {
    super(data);
    User.cache[data._id] = this;
  }
}
User.cache = {};
User.current = null;

export { User };