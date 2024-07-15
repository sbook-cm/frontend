class ModelInter {
  constructor(data) {
    this.data = data;
    for(let key in data) this[key] = data[key];
  }
}
class User extends ModelInter {
  static get(id, $http, callback) {
    if(id in User.cache) return User.cache[id];
    $http.get(`/users/${id}.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        callback(new User(data.user, $http));
      }
    });
  }
  static get_current($http, callback) {
    if(User.current) return User.current;
    $http.get(`/user.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        let user = new User(data.user);
        User.current = user;
        callback(user);
      }
    });
  }
  constructor(data) {
    super(data);
    User.cache[data.id] = this;
    this.schools = data.schools.filter((e, i) => data.schools.indexOf(e) == i);
  }
  iter_schools($http, callback) {
    for(let schoolid of this.schools) {
      School.get(schoolid, $http, function(school) {
        if(school)
        callback(school);
      });
    }
  }
  modified() {
    return (
      this.name != this.data.name ||
      this.bio != this.data.bio
    )
  }
  save(callback) {

    let user = this;
    jQuery.ajax({
      url: '/settings/profile/submit/',
      success: function(data) {
        flashMessage("green", "Updated profile succesfuly");
        user.data.bio = user.bio;
        user.data.name = user.name;
        if(callback) callback();
      },
      error: function(zer) {
        flashMessage("red" , "Could not save question");
      },
      type: 'GET',
      data: this.serialize(),
      dataType: 'JSON',
    });
  }
  serialize() {
    return {
      bio: this.bio,
      name: this.name,
    };
  }
}
User.cache = {};
User.current = null;
class QuizzUser extends ModelInter {
  static get(id, $http, callback) {
    $http.get(`/quizz/users/${id}.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        callback(new QuizzUser(data.user));
      }
    });
  }
  static get_current($http, callback) {
    $http.get(`/quizz/user.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        callback(new QuizzUser(data.user));
      }
    });
  }
  constructor(data) {
    super(data);
    this.sbook = new User(data.sbook);
  }
}


class School extends ModelInter {
  static get(id, $http, callback) {
    $http.get(`/school/${id}.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        callback(new School(data.school));
      } else {
        callback(null);
      }
    });
  }
  static all($http, callback) {
    $http.get(`/school/schools.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        callback(data.schools.map((s) => new School(s)));
      } else {
        callback(null);
      }
    });
  }
  constructor(data) {
    super(data);
    School.cache[data.id] = this;
    this.admins = [];
    for(let admin of data.admins) this.admins.push(new User(admin));
    this.students = [];
    for(let student of data.students) this.students.push(new User(student));
    this.teachers = [];
    for(let teacher of data.teachers) this.teachers.push(new User(teacher));
    this.classrooms = [];
    for(let cls of data.classrooms) this.classrooms.push(new Classroom(cls));
  }
  user_classrooms(user) {
    return this.classrooms.filter((c) => c.has_member(user));
  }
  is_admin(user) {
    for(let admin of this.admins) {
      if(admin.id == user.id) return true;
    }
    return false;
  }
  is_teacher(user) {
    for(let teacher of this.teachers) {
      if(teacher.id == user.id) return true;
    }
    return false;
  }
  is_student(user) {
    for(let students of this.students) {
      if(students.id == user.id) return true;
    }
    return false;
  }
}
School.cache = {};

class Classroom extends ModelInter {
  static get(id, $http, callback) {
    $http.get(`/school/classroom/${id}.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        callback(new Classroom(data.classroom));
      } else {
        callback(null);
      }
    });
  }
  static all($http, callback) {
    $http.get(`/school/classrooms.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        callback(
          data.classrooms.map((d) => new Classroom(d)),
        );
      } else {
        callback(null);
      }
    });
  }
  constructor(data) {
    super(data);
    this.admins = [];
    for(let admin of data.admins) this.admins.push(new User(admin));
    this.students = [];
    for(let student of data.students) this.students.push(new User(student));
    this.teachers = [];
    for(let teacher of data.teachers) this.teachers.push(new User(teacher));
  }
  is_admin(user) {
    for(let admin of this.admins) {
      if(admin.id == user.id) return true;
    }
    return false;
  }
  is_teacher(user) {
    for(let teacher of this.teachers) {
      if(teacher.id == user.id) return true;
    }
    return false;
  }
  is_student(user) {
    for(let students of this.students) {
      if(students.id == user.id) return true;
    }
    return false;
  }
  has_member(user) {
    return this.is_admin(user) || this.is_teacher(user) || this.is_student(user);
  }
}



class Question extends ModelInter {
  constructor(id, {question, options}) {
    let opts = {};
    if(options) for(let [k, v] of options) opts[k] = v;
    super({question, id, options: opts});
  }
  serialize() {
    let obj = {
      question: this.question,
      options: {},
    };
    for(let i = 0; i < this.options.length; i++) {
      obj.options[
        String.fromCodePoint(i+'A'.charCodeAt(0)).toString()
      ] = this.options[i].text;
    }
    return obj;
  }
  addOption(k, v) {
    if(Object.keys(this.options).length > 10) {
      flashMessage("#f93",`Oh, ${Object.keys(this.options).length} thats many options, don't you think?`);
      return;
    }
    if(k == null) k = String.fromCodePoint(
      Object.keys(this.options).length+'A'.charCodeAt(0)
    ).toString()
    this.options[k] = v;
  }
}
class Quizz extends ModelInter {
  static from_id_async(id) {
    return new Promise(function(resolve) {
      $.ajax({
        dataType: "json",
        url: `/quizz/quizzes/${id}.json`,
        data: null,
        success: function(data) {
          if(data.ok) {
            resolve(new Quizz(data.quizz));
          } else {
            resolve(false);
          }
        }
      });
    });
  }
  static get(id, $http, callback) {
    $http.get(`/quizz/quizzes/${id}.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        callback(new Quizz(data.quizz));
      }
    });
  }
  static all($http, callback) {
    $http.get(`/quizz/quizzes.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        let quizzes = [];
        for(let qd of data.quizzes) {
          quizzes.push(new Quizz(qd));
        }
        callback(quizzes);
      }
    });
  }
  constructor(data) {
    super(data);
    let i = 0;
    this.questions = data.questions.map((q) => new Question(i++ ,q));
    this.authors = data.authors.map((q) => new QuizzUser(q));
  }
  modified() {
    return (
      this.name != this.data.name ||
      this.bio != this.data.bio
    )
  }
  save(callback) {
    let user = this;
    jQuery.ajax({
      url: '/settings/profile/submit/',
      success: function(data) {
        flashMessage("green", "Updated profile succesfuly");
        user.data.bio = user.bio;
        user.data.name = user.name;
        if(callback) callback();
      },
      error: function(zer) {
        flashMessage("red" , "Could not save question");
      },
      type: 'GET',
      data: this.serialize(),
      dataType: 'JSON',
    });
  }
  serialize() {
    return {
      bio: this.bio,
      name: this.name,
    };
  }
}
class NoteUser extends ModelInter {
  static get(id, $http, callback) {
    $http.get(`/note/users/${id}.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        callback(new NoteUser(data.user));
      }
    });
  }
  static get_current($http, callback) {
    $http.get(`/note/user.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        callback(new NoteUser(data.user));
      }
    });
  }
  constructor(data) {
    super(data);
    this.notes = data.notes.map((n) => new Note(n));
    this.sbook = new User(data.sbook);
  }
}
class Note extends ModelInter {
  constructor(data) {
    super(data);
  }
  Star_widget(user) {
    let span = jQuery(`<span class="note-${this.id}-stars" style="cursor: pointer;"></span>`);
    let id = this.id;
    span.click(function() { Sbook.star_note(id, user); });
    let starred = user.starred_notes.includes(this.id);
    let stars = Number(this.stars);
    let icon = $(`<span class="w3-text-yellow"></span>`)
      .append(
        $(`<i class="${starred?'fas':'far'} fa-xl fa-star"></i>`)
          .append($(`<img width="20" src="/static/svg/solid/star.svg" />`))
      );
    if(stars < 1000) stars = String(stars.toFixed(1));
    else stars = String((stars / 1000).toFixed(1)) + "k";
    let numStars = $(`<span>${stars}</span>`);
    span.append(icon);
    span.append(numStars);
    return span;
  }
  toggleStar() {
    Sbook.star_note(this.id);
  }
  updateStars(user) {
    for(let elt of jQuery(`.note-${this.id}-stars`)) {
      $(elt.parentElement)
        .empty()
        .append(this.Star_widget(user));
    }
  }
}


function flashMessage(stat, text) {
  jQuery.toast({
    text : text,
    showHideTransition : 'slide',  // It can be plain, fade or slide
    bgColor : stat,              // Background color for toast
    textColor : '#fff',            // text color
    allowToastClose : false,       // Show the close button or not
    hideAfter : 5000,              // `false` to make it sticky or time in miliseconds to hide after
    stack : 5,                     // `fakse` to show one stack at a time count showing the number of toasts that can be shown at once
    textAlign : 'left',            // Alignment of text i.e. left, right, center
    position : 'bottom-right'       // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values to position the toast on page
  });
}


class UserRole extends ModelInter {
  static all($http, callback) {
    $http.get(`/school/roles.json`).then(function(res) {
      let data = res.data;
      if(data.ok) {
        let roles = [];
        for(let ur of data.roles) {
          roles.push(new UserRole(ur));
        }
        callback(roles);
      }
    });
  }

}









class Sbook {
  static renderMarkdown() {
    for(let elt of document.getElementsByClassName('raw-markdown')) {
      if(!elt.textContent.trim()) {
        continue;
      }
      jQuery.ajax({
        url: '/markdown/',
        success: function(data) {
          console.log(data);
          if(data.ok) {
            elt.innerHTML = data.html;
            elt.classList.remove('raw-markdown');
          }
        },
        type: 'GET',
        data: {
          md: btoa(elt.innerHTML.trim()),
        },
        dataType: 'JSON',
      });
    }
  }
  static renderStars() {
    for(let span of jQuery("span[stars]")) {
      span = jQuery(span);
      let stars = Number(span.attr("stars"));
      let icon = $(`<span><i class="fas fa-star"></i></span>`);
      if(stars < 1000) stars = String(stars.toFixed(1));
      else stars = String((stars / 1000).toFixed(1)) + "k";
      let numStars = $(`<span>${stars}</span>`);
      span.empty();
      span.append(icon);
      span.append(numStars);
    }
  }
  static theme() {
    if(!"theme" in localStorage) localStorage.theme = "light";
    return localStorage.theme;
  }
  static lightTheme() {
    let config = {};
    //var rs = getComputedStyle(document.querySelector(":root")).getPropertyValue;
    let root = document.querySelector(":root")
    for(let p in Sbook.themeConfig) {
      root.style.setProperty(p, Sbook.themeConfig[p][0]);
    }
    localStorage.theme = "light";
  }
  static darkTheme() {
    let config = {};
    //var rs = getComputedStyle(document.querySelector(":root")).getPropertyValue;
    let root = document.querySelector(":root")
    for(let p in Sbook.themeConfig) {
      root.style.setProperty(p, Sbook.themeConfig[p][1]);
    }
    localStorage.theme = "dark";
  }
  static init() {
    if(Sbook.theme() == "dark") Sbook.darkTheme();
    else Sbook.lightTheme();
  }
  static star_note(noteid, user) {
    if($http) {
      $http.get(`/note/${noteid}/star/`).then(function(res) {
        let data = res.data;
        if(data.ok) {
          flashMessage(
            "green",
            data.actual?"succesfully starred note":"succesfully unstarred note"
          );
          if(data.actual) user.starred_notes.push(noteid)
          else user.starred_notes.splice(user.starred_notes.indexOf(noteid), 1);
        } else {
          flashMessage("red" , "Could not star note: " + err.toString());
        }
      });
    } else {
      jQuery.ajax({
        url: `/note/${noteid}/star/`,
        success: function(data) {
          flashMessage(
            "green",
            data.actual?"succesfully starred note":"succesfully unstarred note"
          );
          if(data.actual) user.starred_notes.push(noteid)
          else user.starred_notes.splice(user.starred_notes.indexOf(noteid), 1);
        },
        error: function(err) {
          flashMessage("red" , "Could not star note: " + err.toString());
        },
        type: 'GET',
        data: null,
      });
    }
  }
}
let
  lbase = new w3color("whitesmoke"),
  dbase = new w3color("rgb(5, 10, 15)");
let
  lbase2 = new w3color("rgb(230, 230, 230)"),
  dbase2 = new w3color("rgb(15, 15, 15)");
let
  lborder = new w3color(lbase),
  dborder = new w3color(dbase);
dborder.lighter(10);
lborder.darker(10);
Sbook.themeConfig = {
  "--bg-image": [
    "url('http://localhost/image/back-light.png')",
    "url('http://localhost/image/back-dark.png')"
  ],
  "--base": [lbase.toHexString(), dbase.toHexString()],
  "--base2": [lbase2.toHexString(), dbase2.toHexString()],
  "--text": ["black", "white"],
  "--border": [lborder.toHexString(), dborder.toHexString()],
  "--header": [
    `rgba(${lborder.red}, ${lborder.green}, ${lborder.blue}, 0.5)`,
    `rgba(${dborder.red}, ${dborder.green}, ${dborder.blue}, 0.5)`,
  ],
};
for(let i = 0;i <= 100;i++) {
  Sbook.themeConfig[`--base-a${i}`] = [
    `rgba(${lbase.red}, ${lbase.green}, ${lbase.blue}, ${i / 100})`,
    `rgba(${dbase.red}, ${dbase.green}, ${dbase.blue}, ${i / 100})`
  ];
  Sbook.themeConfig[`--base2-a${i}`] = [
    `rgba(${lbase2.red}, ${lbase2.green}, ${lbase2.blue}, ${i / 100})`,
    `rgba(${dbase2.red}, ${dbase2.green}, ${dbase2.blue}, ${i / 100})`
  ];
}
jQuery(Sbook.init);
setInterval(Sbook.renderStars, 500);
