const API_KEY = "at_nrbpYbpts8ZE4iwQH5saBaw5B1bX1";
const BASE_URL = "https://geo.ipify.org/api/v2/country,city";

function isIP(value) {
  const ipRegex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  return ipRegex.test(value);
}

const ui = {
  ip: document.getElementById("ip"),
  location: document.getElementById("location"),
  timezone: document.getElementById("timezone"),
  isp: document.getElementById("isp"),
};

const form = document.querySelector(".header__search");
const input = document.getElementById("ip-input");

let map = L.map("map").setView([0, 0], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const customIcon = L.icon({
  iconUrl: "assets/images/icon-location.svg",
  iconSize: [40, 50],
  iconAnchor: [20, 50],
});

let marker = L.marker([0, 0], {icon: customIcon}).addTo(map);

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
    ui.ip.textContent = "Invalid input";
  } finally {
    setLoading(false);
  }
}

function updateUI(data) {
  ui.ip.textContent = data.ip;
  ui.location.textContent = `${data.location.city}, ${data.location.region}`;
  ui.timezone.textContent = `UTC ${data.location.timezone}`;
  ui.isp.textContent = data.isp;
}

function updateMap(lat, lng) {
  map.setView([lat, lng], 13);
  marker.setLatLng([lat, lng]);
}

function setLoading(isLoading) {
  const value = isLoading ? "Loading..." : "--";

  if (isLoading) {
    Object.values(ui).forEach(el => el.textContent = "Loading...");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = input.value.trim();

  if (!value) return;

  fetchIPData(value);
  input.value = "";
});

fetchIPData();