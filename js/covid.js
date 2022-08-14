// COVID-19 Country Status ver. 1.04
// Mariosnb 2022

var country = '';
var countryCode = '';

document.addEventListener("DOMContentLoaded", () => {
  $.get("https://ipinfo.io", function(response) {
    countryCode = response.country;
    // console.log(response) // ipinfo Obj
    searchCode(countryCode);
  }, "jsonp");
});

function searchCode(code) {
  const urlCode = "https://restcountries.com/v3.1/alpha/";

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
        country = reply[0].name.common;
        countryCode = reply[0].cca2;
        search();
        covid();
      }
    });
}

function search() {
  const div = document.querySelector("#id");
  const urlName = "https://restcountries.com/v3.1/name/";

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
        div.innerHTML += `Your country of residence - ${country} It has a population: ${reply[0].population.toLocaleString()} residents. <br>`;
        // console.log(reply) // Country Object
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
      div2.innerHTML += `<br> The country has ${reply.All.deaths.toLocaleString()} deads, <br>`;
      div2.innerHTML += `${reply.All.confirmed.toLocaleString()} who have become ill and ${reply.All.recovered.toLocaleString()} who have recovered.<br>`;
      // console.log(reply.All)  // Covid Object
    });
}

// Returns a flag emoji from a 2-letter country code
function country2emoji2(country_code) {
  const OFFSET = 127397;
  const codeArray = Array.from(country_code.toUpperCase());
  return String.fromCodePoint(...codeArray.map((c) => c.charCodeAt() + OFFSET));
}
