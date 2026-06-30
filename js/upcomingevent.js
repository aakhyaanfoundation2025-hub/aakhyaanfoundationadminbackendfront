const locationInput = document.getElementById("locationInput");
const locationBtn = document.getElementById("locationBtn");

const addEventBtn = document.getElementById("addEventBtn");
const eventList = document.getElementById("eventList");

const headlineMarquee = document.getElementById("headlineMarquee");
const locationMarquee = document.getElementById("locationMarquee");

let eventData = {
  location: "",
  events: [],
};

function getToken() {
  return localStorage.getItem("token");
}

function updateButton(button, isSaved) {
  if (isSaved) {
    button.className = "action-btn delete";
    button.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  } else {
    button.className = "action-btn save";
    button.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>`;
  }
}

async function fetchUpcomingEventData() {
  try {
    const res = await fetch(API_PATHS.UPCOMING_EVENT);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Event data fetch nahi hua");
      return;
    }

    eventData = data;
    renderAll();
  } catch (error) {
    alert("Server error while fetching upcoming event data");
  }
}

function renderStaticFields() {
  locationInput.value = eventData.location || "";
  locationInput.disabled = !!eventData.location;

  updateButton(locationBtn, !!eventData.location);
}

function renderMarquee() {
  if (eventData.events && eventData.events.length > 0) {
    headlineMarquee.textContent = eventData.events
      .map((item) => item.text)
      .join("   ✦   ");
  } else {
    headlineMarquee.textContent = "No upcoming event added yet";
  }

  if (eventData.location) {
    locationMarquee.textContent = eventData.location;
  } else {
    locationMarquee.textContent = "Location will appear here";
  }
}

function renderEvents() {
  eventList.innerHTML = "";

  if (!eventData.events || eventData.events.length === 0) {
    eventList.innerHTML = `<p class="empty-event-text">No event added yet.</p>`;
    return;
  }

  eventData.events.forEach((eventItem) => {
    const item = document.createElement("div");
    item.className = "event-item";

    item.innerHTML = `
      <textarea disabled>${eventItem.text}</textarea>
      <button class="action-btn delete" data-id="${eventItem._id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    item.querySelector("button").addEventListener("click", () => {
      deleteEvent(eventItem._id);
    });

    eventList.appendChild(item);
  });
}

function addNewEventBox() {
  const oldNewBox = document.querySelector(".new-event-box");
  if (oldNewBox) return;

  const item = document.createElement("div");
  item.className = "event-item new-event-box";

  item.innerHTML = `
    <textarea placeholder="Type upcoming event headline"></textarea>
    <button class="action-btn save">
      <i class="fa-solid fa-floppy-disk"></i>
    </button>
  `;

  const textarea = item.querySelector("textarea");
  const saveBtn = item.querySelector("button");

  saveBtn.addEventListener("click", async () => {
    const text = textarea.value.trim();

    if (!text) {
      alert("Please type event headline");
      return;
    }

    await saveEvent(text);
  });

  eventList.appendChild(item);
  textarea.focus();
}

async function saveEvent(text) {
  const token = getToken();

  if (!token) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  try {
    const res = await fetch(`${API_PATHS.UPCOMING_EVENT}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Event save nahi hua");
      return;
    }

    eventData = data.data;
    renderAll();
  } catch (error) {
    alert("Server error while saving event");
  }
}

async function deleteEvent(eventId) {
  const confirmDelete = confirm("Do you want to delete this event?");
  if (!confirmDelete) return;

  const token = getToken();

  if (!token) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  try {
    const res = await fetch(`${API_PATHS.UPCOMING_EVENT}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Event delete nahi hua");
      return;
    }

    eventData = data.data;
    renderAll();
  } catch (error) {
    alert("Server error while deleting event");
  }
}

async function saveLocation() {
  const value = locationInput.value.trim();

  if (!value) {
    alert("Please enter event location");
    return;
  }

  const token = getToken();

  if (!token) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  try {
    const res = await fetch(`${API_PATHS.UPCOMING_EVENT}/location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ location: value }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Location save nahi hui");
      return;
    }

    eventData = data.data;
    renderAll();
  } catch (error) {
    alert("Server error while saving location");
  }
}

async function deleteLocation() {
  const confirmDelete = confirm("Do you want to delete location?");
  if (!confirmDelete) return;

  const token = getToken();

  if (!token) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  try {
    const res = await fetch(`${API_PATHS.UPCOMING_EVENT}/location`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Location delete nahi hui");
      return;
    }

    eventData = data.data;
    renderAll();
  } catch (error) {
    alert("Server error while deleting location");
  }
}

locationBtn.addEventListener("click", () => {
  if (eventData.location) {
    deleteLocation();
  } else {
    saveLocation();
  }
});

addEventBtn.addEventListener("click", () => {
  addNewEventBox();
});

function renderAll() {
  renderStaticFields();
  renderEvents();
  renderMarquee();
}

fetchUpcomingEventData();