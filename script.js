"use strict";

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

  document.querySelector(".addBtn").addEventListener("click", e => {
    post();
  });
}

function cleanJSON(friend) {
  const liPersonality = friend.personality.split(",");
  console.log(liPersonality);

  getFriend(friend, liPersonality);
}

function getFriend(friend, liPersonality) {
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  copy.querySelector("article.friend").dataset.friendid = friend._id;
  copy.querySelector("h1").textContent = friend.name;
  copy.querySelector("h3").textContent = `Also known as ${friend.nickname}`;

  if (friend.name === "Rebecca") {
    copy.querySelector("img").src = `${friend.picture}`;
    //copy.querySelector("img").style.transform = "rotate(90deg)";
  } else {
    copy.querySelector("img").src = `https://boris4life-d49c.restdb.io/media/${friend.picture}?s=t`;
  }

  copy.querySelector(".city").textContent = `${friend.nickname} lives in ${friend.city}`;
  //   copy.querySelector(".personality").textContent = `${friend.name} to me is all of the following things: ${friend.personality}`;
  //personality[0] + "," personality[1] + "," + personality[2] + "," + personality[3];
  copy.querySelector(".personality").innerHTML = `<article>${friend.name}'s best qualities:</article><article><ul><li>` + liPersonality + `</li></ul></article>`;

  copy.querySelector(".deleteBtn").addEventListener("click", () => {
    console.log(friend._id);
    deleteFriend(friend._id);
  });
  document.querySelector("#friends").appendChild(copy);
}

get();

function post() {
  const data = {
    name: "Rebecca",
    nickname: "Rebe",
    picture: "rebe.JPG",
    age: "26",
    city: "Aarhus",
    personality: "Funny, crazy, sweet"
  };

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
