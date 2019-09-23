"use strict";

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
    friends.forEach(friend => {
      const template = document.querySelector("template").content;
      const copy = template.cloneNode(true);
      copy.querySelector("h1").textContent = friend.name;
      copy.querySelector("h3").textContent = `Also known as ${friend.nickname}`;
      copy.querySelector(".city").textContent = `${friend.nickname} lives in ${friend.city}`;
      copy.querySelector(".personality").textContent = `${friend.name} to me is all of the following things: ${friend.personality}`;
      copy.querySelector("img").src = `https://boris4life-d49c.restdb.io/media/${friend.picture}?s=t`;
      document.querySelector("#friends").appendChild(copy);
    });
  });
