const donateList = document.getElementById("donateList");
const totalDonations = document.getElementById("totalDonations");

const donateModal = document.getElementById("donateModal");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

let allDonations = [];

async function fetchDonationData() {
  try {
    donateList.innerHTML = `<p class="loading-text">Loading donation data...</p>`;

    const response = await fetch(API_PATHS.DONATE);
    const data = await response.json();

    if (!response.ok) {
      donateList.innerHTML = `<p class="empty-text">${data.message || "Failed to fetch donation data"}</p>`;
      return;
    }

    allDonations = data.donations || data || [];
    totalDonations.innerText = allDonations.length;

    renderDonationRows(allDonations);
  } catch (error) {
    console.log("FETCH DONATION DATA ERROR:", error);
    donateList.innerHTML = `<p class="empty-text">Server error. Donation data not loaded.</p>`;
  }
}

function renderDonationRows(donations) {
  if (!donations.length) {
    totalDonations.innerText = 0;
    donateList.innerHTML = `<p class="empty-text">No donation form data found.</p>`;
    return;
  }

  donateList.innerHTML = donations.map((donation, index) => {
    return `
      <div class="donate-row" id="donationRow-${donation._id}">
        <div class="donor-name">
          ${index + 1}. ${donation.fullName || "No Name"}
        </div>

        <div class="donor-amount">
          ₹ ${donation.donationAmount || 0}
        </div>

        <div class="action-buttons">
          <button class="view-more-btn" onclick="openDonorDetails('${donation._id}')">
            View More Data
            <i class="fa-solid fa-eye"></i>
          </button>

          <button class="delete-btn" onclick="deleteDonation('${donation._id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function openDonorDetails(id) {
  const donation = allDonations.find(item => item._id === id);
  if (!donation) return;

  modalContent.innerHTML = `
    <div class="detail-grid">
      <div class="detail-item">
        <span>Full Name</span>
        <strong>${donation.fullName || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Mobile Number</span>
        <strong>${donation.mobile || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Email</span>
        <strong>${donation.email || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>PAN Number</span>
        <strong>${donation.panNumber || "N/A"}</strong>
      </div>

      <div class="detail-item full">
        <span>Address</span>
        <strong>${donation.address || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Donation Amount</span>
        <strong>₹ ${donation.donationAmount || 0}</strong>
      </div>

      <div class="detail-item">
        <span>Document Type</span>
        <strong>${donation.documentType || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Document Number</span>
        <strong>${donation.documentNumber || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Submitted Date</span>
        <strong>${formatDate(donation.createdAt)}</strong>
      </div>
    </div>

    <div class="image-section">
      <h3>Uploaded Images</h3>

      <div class="donor-images">
        <div class="image-box">
          <p>Photo</p>
          ${getImageHtml(donation.photo?.url)}
        </div>

        <div class="image-box">
          <p>Document Front</p>
          ${getImageHtml(donation.documentFront?.url)}
        </div>

        <div class="image-box">
          <p>Document Back</p>
          ${getImageHtml(donation.documentBack?.url)}
        </div>
      </div>
    </div>
  `;

  donateModal.classList.add("active");
}

async function deleteDonation(id) {
  const confirmDelete = confirm("Are you sure you want to delete this donation form data?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_PATHS.DONATE}/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to delete donation data");
      return;
    }

    allDonations = allDonations.filter(item => item._id !== id);
    totalDonations.innerText = allDonations.length;
    renderDonationRows(allDonations);

    alert("Donation data deleted successfully!");
  } catch (error) {
    console.log("DELETE DONATION ERROR:", error);
    alert("Server error. Donation data not deleted.");
  }
}

function getImageHtml(url) {
  if (!url) {
    return `<div class="no-image">No Image</div>`;
  }

  return `<img src="${url}" alt="Donor Image">`;
}

function formatDate(dateValue) {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

modalClose.addEventListener("click", () => {
  donateModal.classList.remove("active");
});

donateModal.addEventListener("click", (e) => {
  if (e.target === donateModal) {
    donateModal.classList.remove("active");
  }
});

fetchDonationData();