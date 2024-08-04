import { error } from '@sveltejs/kit';

let backend = "http://localhost:1234/";


class ModelInter {
  constructor(data) {
    for(let k in data) this[k] = data[k];
    this._data = data;
  }
}

class User extends ModelInter {
  static fromEmail(email) {
    return new Promise(function(resolve, reject) {
      fetch(`${backend}users/email/${email}`)
        .then(function(response) {
          if (!response.ok) {
            reject(response.status);
          }
          response.json()
            .then(function(data) {
              if (data) {
                const user = new User(data);
                resolve(user);
              } else {
                reject(404);
              }
            });
        })
        .catch(reject);
    });
  }
  static fromLogin(email, password) {
    return new Promise(function(resolve, reject) {
      User.fromEmail(email)
        .then(function(user) {
          if(user.password == password) resolve(user);
          else reject(500);
        })
        .catch(function() {
          reject(400);
        });
    });
  }
  static createSession(email, password) {
    return new Promise(function(resolve, reject) {
      User.fromEmail(email)
        .then(function(user) {
          if(user.password == password) resolve(user);
          else reject(500);
        })
        .catch(function() {
          reject(400);
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
  toJSON() {
    return this.data;
  }
}
User.cache = {};
User.current = null;

class Session extends ModelInter {
  static fromID(sessionid) {
    return new Promise(function(resolve, reject) {
      if(sessionid in User.cache) return resolve(User.cache[sessionid]);
        fetch(`${backend}session/${sessionid}`)
          .then(function(response) {
            if (!response.ok) {
              reject(response.status);
            }
            response.json()
              .then(function(data) {
                if (data) {
                  const user = new User(data.user);
                  const session = new Session(data.session, user);
                  resolve(session);
                } else {
                  reject(404);
                }
              });
          })
          .catch(reject);
      });
  }
  constructor(data, user) {
    super(data);
    this.user = user;
  }
}
class Event extends ModelInter {
  static get_latest(number) {
    return new Promise(function(resolve, reject) {
      if(!localStorage.sessionid) return reject();
      jQuery.ajax({
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

export { User, Event, Session };
