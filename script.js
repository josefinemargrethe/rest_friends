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
      friends.forEach(getFriend);
    });

  document.querySelector("button").addEventListener("click", e => {
    post();
  });
}

function getFriend(friend) {
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  copy.querySelector("h1").textContent = friend.name;
  copy.querySelector("h3").textContent = `Also known as ${friend.nickname}`;

  if (friend.name === "Rebecca") {
    copy.querySelector("img").src = `${friend.picture}`;
    //copy.querySelector("img").style.transform = "rotate(90deg)";
  } else {
    copy.querySelector("img").src = `https://boris4life-d49c.restdb.io/media/${friend.picture}?s=t`;
  }

  copy.querySelector(".city").textContent = `${friend.nickname} lives in ${friend.city}`;
  copy.querySelector(".personality").textContent = `${friend.name} to me is all of the following things: ${friend.personality}`;
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
      getFriend(data);
      console.log(data);
    });
}
