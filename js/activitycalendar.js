const activityCalendarGrid = document.getElementById("activityCalendarGrid");
const activityCalendarFileInput = document.getElementById("activityCalendarFileInput");
const activityCalendarImageModal = document.getElementById("activityCalendarImageModal");
const activityCalendarModalImage = document.getElementById("activityCalendarModalImage");
const activityCalendarModalClose = document.getElementById("activityCalendarModalClose");

let activityCalendarImages = [];
let selectedActivityCalendarFile = null;

async function fetchActivityCalendarImages() {
  try {
    const res = await fetch(API_PATHS.ACTIVITY_CALENDAR);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Images fetch nahi ho paayi");
      return;
    }

    activityCalendarImages = data;
    renderActivityCalendarImages();
  } catch (error) {
    alert("Server error while fetching images");
  }
}

function renderActivityCalendarImages() {
  activityCalendarGrid.innerHTML = "";

  activityCalendarImages.forEach((item) => {
    const card = document.createElement("div");
    card.className = "activity-calendar-card";

    const imageUrl = `${BASE_URL}${item.image}`;

    card.innerHTML = `
      <img src="${imageUrl}" alt="Activity Calendar Image">
      <button class="activity-calendar-delete-btn" title="Delete Image">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    card.querySelector("img").addEventListener("click", () => {
      openActivityCalendarImageModal(imageUrl);
    });

    card.querySelector(".activity-calendar-delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteActivityCalendarImage(item._id);
    });

    activityCalendarGrid.appendChild(card);
  });

  createActivityCalendarUploadCard();
}

function createActivityCalendarUploadCard() {
  const uploadCard = document.createElement("div");
  uploadCard.className = "activity-calendar-upload-card";

  uploadCard.innerHTML = `
    <div class="activity-calendar-upload-content">
      <div class="activity-calendar-upload-icon">
        <i class="fa-solid fa-plus"></i>
      </div>
      <h3>Add Activity Calendar</h3>
      <p>Click here to upload</p>
    </div>
  `;

  uploadCard.addEventListener("click", () => {
    activityCalendarFileInput.click();
  });

  activityCalendarGrid.appendChild(uploadCard);
}

activityCalendarFileInput.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please only image file upload kare.");
    return;
  }

  selectedActivityCalendarFile = file;

  const reader = new FileReader();

  reader.onload = function (e) {
    showActivityCalendarPreviewCard(e.target.result);
  };

  reader.readAsDataURL(file);
  activityCalendarFileInput.value = "";
});

function showActivityCalendarPreviewCard(imageSrc) {
  const uploadCard = document.querySelector(".activity-calendar-upload-card");

  const previewCard = document.createElement("div");
  previewCard.className = "activity-calendar-card";

  previewCard.innerHTML = `
    <img src="${imageSrc}" alt="Preview Activity Calendar Image">
    <button class="activity-calendar-save-btn">Save</button>
  `;

  previewCard.querySelector(".activity-calendar-save-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    saveActivityCalendarImage();
  });

  previewCard.querySelector("img").addEventListener("click", () => {
    openActivityCalendarImageModal(imageSrc);
  });

  activityCalendarGrid.insertBefore(previewCard, uploadCard);
  uploadCard.remove();
}

async function saveActivityCalendarImage() {
  if (!selectedActivityCalendarFile) return;

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedActivityCalendarFile);

  try {
    const res = await fetch(API_PATHS.ACTIVITY_CALENDAR, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Image save nahi hui");
      return;
    }

    selectedActivityCalendarFile = null;
    fetchActivityCalendarImages();
  } catch (error) {
    alert("Server error while saving image");
  }
}

async function deleteActivityCalendarImage(id) {
  const confirmDelete = confirm("Do you want to delete this activity calendar image?");

  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  try {
    const res = await fetch(`${API_PATHS.ACTIVITY_CALENDAR}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Image delete nahi hui");
      return;
    }

    fetchActivityCalendarImages();
  } catch (error) {
    alert("Server error while deleting image");
  }
}

function openActivityCalendarImageModal(imageSrc) {
  activityCalendarModalImage.src = imageSrc;
  activityCalendarImageModal.classList.add("active");
}

function closeActivityCalendarImageModal() {
  activityCalendarImageModal.classList.remove("active");
  activityCalendarModalImage.src = "";
}

activityCalendarModalClose.addEventListener("click", closeActivityCalendarImageModal);

activityCalendarImageModal.addEventListener("click", (e) => {
  if (e.target === activityCalendarImageModal) {
    closeActivityCalendarImageModal();
  }
});

fetchActivityCalendarImages();