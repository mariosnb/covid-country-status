// COVID-19 Country Status ver. 1.02
// Mariosnb 2021

var country = "";
var countryCode = "";

document.addEventListener("DOMContentLoaded", () => {
  $.get("https://ipinfo.io", function(response) {
    countryCode = response.country;
    searchCode(response.country);
  }, "jsonp");
});

function searchCode(code) {
  const urlCode = "https://restcountries.eu/rest/v2/alpha/";

  fetch(urlCode + code)
    .then((reply) => {
      if (reply.status == 200)
        return reply.json();
      else throw new Error(reply.status);
    })
    .then((reply) => {
      if (reply.length < 1)
        throw new Error("country not found")
      else {
        country = reply.name;
        countryCode = reply.alpha2Code;
        search();
        covid();
      }
    });
}

function search() {
  const div = document.querySelector("#id");
  const urlName = "https://restcountries.eu/rest/v2/name/";

  fetch(urlName + country)
    .then((reply) => {
      if (reply.status == 200)
        return reply.json();
      else throw new Error(reply.status);
    })
    .then((reply) => {
      if (reply.length < 1)
        throw new Error("country not found")
      else
        div.innerHTML += `<span class="flag">${country2emoji2(countryCode)}</span><br>`
        div.innerHTML += `Η χώρα διαμονής σας - ${country} έχει πληθυσμό: ${reply[0].population} κατοίκους. <br>`;
    });
}

function covid() {
  const div2 = document.querySelector("#id");
  const url2 = "https://covid-api.mmediagroup.fr/v1/cases?country=";
  let fletter = country.slice(0, 1); // Slice the first letter to make it capital

  fetch(url2 + fletter.toUpperCase() + country.slice(1, country.length).toLowerCase())
    .then((reply) => {
      if (reply.status == 200)
        return reply.json();
      else throw new Error(reply.status);
    })
    .then((reply) => {
      if (reply.length < 1)
        throw new Error("country not found")
      else
        div2.classList.add("covid");
      div2.innerHTML += `<br> Η χώρα έχει ${reply.All.deaths} νεκρούς, <br>`;
      div2.innerHTML += `${reply.All.confirmed} που έχουν νοσήσει και ${reply.All.recovered} που έχουν αναρώσει.<br>`;
    });
}

// Returns a flag emoji from a 2-letter country code
function country2emoji2(country_code) {
  const OFFSET = 127397;
  const codeArray = Array.from(country_code.toUpperCase());
  return String.fromCodePoint(...codeArray.map((c) => c.charCodeAt() + OFFSET));
}
