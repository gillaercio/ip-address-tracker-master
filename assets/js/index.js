//config
const API_KEY = "at_nrbpYbpts8ZE4iwQH5saBaw5B1bX1";
const BASE_URL = "https://geo.ipify.org/api/v2/country,city";

function isIP(value) {
  const ipRegex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  return ipRegex.test(value);
}
//elementos DOM
const ui = {
  ip: document.getElementById("ip"),
  location: document.getElementById("location"),
  timezone: document.getElementById("timezone"),
  isp: document.getElementById("isp"),
};

const form = document.querySelector(".header__search");
const input = document.getElementById("ip-input");
//mapa (Leaflet)
let map = L.map("map").setView([0, 0], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let marker = L.marker([0, 0]).addTo(map);
// função principal
async function fetchIPData(query = "") {
  try {
    setLoading(true);

    let url;

    if (!query) {
      url = `${BASE_URL}?apiKey=${API_KEY}`;
    } else if (isIP(query)) {
      url = `${BASE_URL}?apiKey=${API_KEY}&ipAddress=${query}`;
    } else {
      url = `${BASE_URL}?apiKey=${API_KEY}&domain=${query}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error fetching data");
    }

    const data = await response.json();

    updateUI(data);
    updateMap(data.location.lat, data.location.lng);
  } catch (error) {
    alert("Error: invalid IP or domain");
  } finally {
    setLoading(false);
  }
}
//atualizar UI
function updateUI(data) {
  ui.ip.textContent = data.ip;
  ui.location.textContent = `${data.location.city}, ${data.location.region}`;
  ui.timezone.textContent = `UTC ${data.location.timezone}`;
  ui.isp.textContent = data.isp;
}
//atualizar mapa
function updateMap(lat, lng) {
  map.setView([lat, lng], 13);
  marker.setLatLng([lat, lng]);
}
//carregamento
function setLoading(isLoading) {
  const value = isLoading ? "Loading..." : "--";

  Object.values(ui).forEach((el) => {
    if (isLoading) el.textContent = value;
  });
}
//evento do form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = input.value.trim();

  if (!value) return;

  fetchIPData(value);
  input.value = "";
});
//inicialização
fetchIPData();