const blogGrid = document.getElementById("blogGrid");
const blogFileInput = document.getElementById("blogFileInput");
const blogImageModal = document.getElementById("blogImageModal");
const blogModalImage = document.getElementById("blogModalImage");
const blogModalClose = document.getElementById("blogModalClose");

let blogImages = [];
let selectedBlogFile = null;

async function fetchBlogImages() {
  try {
    const res = await fetch(API_PATHS.ADMIN_BLOG);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Blog images fetch nahi ho paayi");
      return;
    }

    blogImages = data;
    renderBlogImages();
  } catch (error) {
    alert("Server error while fetching blog images");
  }
}

function renderBlogImages() {
  blogGrid.innerHTML = "";

  blogImages.forEach((item) => {
    const card = document.createElement("div");
    card.className = "activity-calendar-card";

    const imageUrl = `${BASE_URL}${item.image}`;

    card.innerHTML = `
      <img src="${imageUrl}" alt="Blog Image">
      <button class="activity-calendar-delete-btn" title="Delete Image">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    card.querySelector("img").addEventListener("click", () => {
      openBlogImageModal(imageUrl);
    });

    card.querySelector(".activity-calendar-delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteBlogImage(item._id);
    });

    blogGrid.appendChild(card);
  });

  createBlogUploadCard();
}

function createBlogUploadCard() {
  const uploadCard = document.createElement("div");
  uploadCard.className = "activity-calendar-upload-card";

  uploadCard.innerHTML = `
    <div class="activity-calendar-upload-content">
      <div class="activity-calendar-upload-icon">
        <i class="fa-solid fa-plus"></i>
      </div>
      <h3>Add Blog Image</h3>
      <p>Click here to upload</p>
    </div>
  `;

  uploadCard.addEventListener("click", () => {
    blogFileInput.click();
  });

  blogGrid.appendChild(uploadCard);
}

blogFileInput.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please only image file upload kare.");
    return;
  }

  selectedBlogFile = file;

  const reader = new FileReader();

  reader.onload = function (e) {
    showBlogPreviewCard(e.target.result);
  };

  reader.readAsDataURL(file);
  blogFileInput.value = "";
});

function showBlogPreviewCard(imageSrc) {
  const uploadCard = document.querySelector(".activity-calendar-upload-card");

  const previewCard = document.createElement("div");
  previewCard.className = "activity-calendar-card";

  previewCard.innerHTML = `
    <img src="${imageSrc}" alt="Preview Blog Image">
    <button class="activity-calendar-save-btn">Save</button>
  `;

  previewCard.querySelector(".activity-calendar-save-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    saveBlogImage();
  });

  previewCard.querySelector("img").addEventListener("click", () => {
    openBlogImageModal(imageSrc);
  });

  blogGrid.insertBefore(previewCard, uploadCard);
  uploadCard.remove();
}

async function saveBlogImage() {
  if (!selectedBlogFile) return;

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedBlogFile);

  try {
    const res = await fetch(API_PATHS.ADMIN_BLOG, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Blog image save nahi hui");
      return;
    }

    selectedBlogFile = null;
    fetchBlogImages();
  } catch (error) {
    alert("Server error while saving blog image");
  }
}

async function deleteBlogImage(id) {
  const confirmDelete = confirm("Do you want to delete this blog image?");

  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "../index.html";
    return;
  }

  try {
    const res = await fetch(`${API_PATHS.ADMIN_BLOG}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Blog image delete nahi hui");
      return;
    }

    fetchBlogImages();
  } catch (error) {
    alert("Server error while deleting blog image");
  }
}

function openBlogImageModal(imageSrc) {
  blogModalImage.src = imageSrc;
  blogImageModal.classList.add("active");
}

function closeBlogImageModal() {
  blogImageModal.classList.remove("active");
  blogModalImage.src = "";
}

blogModalClose.addEventListener("click", closeBlogImageModal);

blogImageModal.addEventListener("click", (e) => {
  if (e.target === blogImageModal) {
    closeBlogImageModal();
  }
});

fetchBlogImages();