"use strict";

const form = document.querySelector("form");
const formEdit = document.querySelector("form.formEdit");

let uploaded;

//use javascript validation instead of HTML/Form validation
//form.setAttribute("novalidate", true);

//Make a new friend when click submit
form.addEventListener("submit", evt => {
  console.log(evt);
  evt.preventDefault();

  let friendObject = {
    name: form.elements.name.value,
    nickname: form.elements.nickname.value,
    picture: form.elements.picture.value,
    age: form.elements.age.value,
    city: form.elements.city.value,
    personality: form.elements.personality.value,
    uploaded: true
  };

  post(friendObject);
  form.reset();
});

formEdit.addEventListener("submit", evt => {
  evt.preventDefault();
  document.querySelector(".formEdit").classList.add("hide");
  document.querySelector(".newfriend").classList.remove("hide");
  put();
});

//Here we write the name in h2 above the form as we are typing in the name
// form.elements.name.addEventListener("input", e => {
//   console.log(e.key);
//   document.querySelector("h2").textContent = form.elements.name.value;
// });

//These next parts are about validation

// form.elements.name.addEventListener("input", e => {
//   form.elements.name.classList.remove("notValid");
// });

// form.elements.name.addEventListener("blur", e => {
//   console.log("The user moves away from name");
//   console.log(form.elements.name.checkValidity());

//   if (form.elements.name.checkValidity()) {
//   } else {
//     form.elements.name.classList.add("notValid");
//   }
//   //the user thinks he is done --> now we can validate the field
//   //think about what the best solution is for the user
// });

/*
Events we can work with:
input / keyup
submit
focus
blut

*/

// form.addEventListener("mouseover", () => {
//   form.style.transform = "translateX(40vw)";
// });

function get() {
  fetch("https://boris4life-d49c.restdb.io/rest/friends", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d887c39fd86cb75861e2620",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(friends => {
      console.log(friends);
      friends.forEach(cleanJSON);
    });

  //Old ADD-button!
  //   document.querySelector(".addBtn").addEventListener("click", e => {
  //     post();
  //   });
}

function cleanJSON(friend, data, updatedFriend) {
  const liPersonality = friend.personality.split(",");
  console.log(liPersonality);

  getFriend(friend, liPersonality, data, updatedFriend);
}

function getFriend(friend, liPersonality, data, updatedFriend) {
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  copy.querySelector("article.friend").dataset.friendid = friend._id;
  copy.querySelector("h1").textContent = friend.name;
  copy.querySelector("h3").textContent = `Also known as ${friend.nickname}`;

  if (friend.uploaded == true) {
    copy.querySelector("img").src = friend.picture;
  } else {
    copy.querySelector("img").src = `https://boris4life-d49c.restdb.io/media/${friend.picture}?s=t`;
  }

  copy.querySelector(".city").textContent = `${friend.nickname}'s ${friend.age} years old and lives in ${friend.city}`;

  copy.querySelector(".personality").innerHTML = `<article>${friend.name}'s best qualities:</article><article><ul><li>` + liPersonality + `</li></ul></article>`;

  copy.querySelector(".deleteBtn").addEventListener("click", () => {
    console.log(friend._id);
    deleteFriend(friend._id);
  });

  copy.querySelector(".editBtn").addEventListener("click", e => {
    //what happens when you pres the edit button goes here
    //first fetch, then populate a form
    //how do we fetch a single post from restdb? -->
    document.querySelector(".formEdit").classList.remove("hide");
    document.querySelector(".newfriend").classList.add("hide");

    fetchAndPopulate(friend._id);
    console.log("Someone clicked edit");
  });

  //Append child
  document.querySelector("#friends").appendChild(copy);
}

get();

function fetchAndPopulate(id) {
  fetch(`https://boris4life-d49c.restdb.io/rest/friends/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d887c39fd86cb75861e2620",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(friends => {
      console.log(friends);
      formEdit.elements.name.value = friends.name;
      formEdit.elements.nickname.value = friends.nickname;
      formEdit.elements.age.value = friends.age;
      formEdit.elements.city.value = friends.city;
      formEdit.elements.personality.value = friends.personality;
      formEdit.elements.picture.value = friends.picture;
      formEdit.elements.id.value = friends._id;
    });
}

function put() {
  let data = {
    name: formEdit.elements.name.value,
    nickname: formEdit.elements.nickname.value,
    picture: formEdit.elements.picture.value,
    age: formEdit.elements.age.value,
    city: formEdit.elements.city.value,
    personality: formEdit.elements.personality.value,
    id: formEdit.elements.id.value
  };

  const postData = JSON.stringify(data);
  const superID = formEdit.elements.id.value;
  fetch("https://boris4life-d49c.restdb.io/rest/friends/" + superID, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d887c39fd86cb75861e2620",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(t => t.json())
    .then(updatedFriend => {
      //getFriend(data);
      const daddy = document.querySelector(`.friend[data-friendid="${updatedFriend._id}"]`);

      console.log(updatedFriend.name);
      daddy.querySelector("h1").textContent = updatedFriend.name;
      daddy.querySelector("h3").textContent = `Also known as ${updatedFriend.nickname}`;
      daddy.querySelector(".city").textContent = `${updatedFriend.nickname}'s ${updatedFriend.age} years old and lives in ${updatedFriend.city}`;
      daddy.querySelector("img").src = updatedFriend.picture;
      daddy.querySelector(".personality").innerHTML = `<article>${updatedFriend.name}'s best qualities:</article><article><ul><li>` + updatedFriend.personality + `</li></ul></article>`;

      //cleanJSON(updatedFriend);

      console.log(data);
    });
}

function post(data) {
  //   const data = {
  //     name: "Rebecca",
  //     nickname: "Rebe",
  //     picture: "rebe.JPG",
  //     age: "26",
  //     city: "Aarhus",
  //     personality: "Funny, crazy, sweet"
  //   };

  const postData = JSON.stringify(data);
  fetch("https://boris4life-d49c.restdb.io/rest/friends", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d887c39fd86cb75861e2620",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(data => {
      //getFriend(data);
      cleanJSON(data);
      console.log(data);
    });
}

function deleteFriend(id) {
  fetch("https://boris4life-d49c.restdb.io/rest/friends/" + id, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d887c39fd86cb75861e2620",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {
      //TODO: Delete from DOM
      console.log(`.friend[data-friendid="${id}"]`);
      document.querySelector(`.friend[data-friendid="${id}"]`).remove();
    });
}
