const memberList = document.getElementById("memberList");
const totalMembers = document.getElementById("totalMembers");

const memberModal = document.getElementById("memberModal");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

let allMembers = [];

async function fetchMemberData() {
  try {
    memberList.innerHTML = `<p class="loading-text">Loading member data...</p>`;

    const response = await fetch(API_PATHS.MEMBERS);
    const data = await response.json();

    if (!response.ok) {
      memberList.innerHTML = `<p class="empty-text">${data.message || "Failed to fetch member data"}</p>`;
      return;
    }

    allMembers = data.members || data || [];
    totalMembers.innerText = allMembers.length;

    renderMemberRows(allMembers);
  } catch (error) {
    console.log("FETCH MEMBER DATA ERROR:", error);
    memberList.innerHTML = `<p class="empty-text">Server error. Member data not loaded.</p>`;
  }
}

function renderMemberRows(members) {
  if (!members.length) {
    totalMembers.innerText = 0;
    memberList.innerHTML = `<p class="empty-text">No member data found.</p>`;
    return;
  }

  memberList.innerHTML = members.map((member, index) => {
    return `
      <div class="member-row" id="memberRow-${member._id}">
        <div class="member-name">
          ${index + 1}. ${member.name || "No Name"}
        </div>

        <div class="member-mobile">
          ${member.mobile || "N/A"}
        </div>

        <button class="view-more-btn" onclick="openMemberDetails('${member._id}')">
          View More Data
          <i class="fa-solid fa-eye"></i>
        </button>

        <button class="delete-btn" onclick="deleteMember('${member._id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  }).join("");
}

function openMemberDetails(id) {
  const member = allMembers.find(item => item._id === id);
  if (!member) return;

  modalContent.innerHTML = `
    <div class="detail-grid">

      <div class="detail-item full">
        <span>Organization Name</span>
        <strong>${member.organization_name || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Name</span>
        <strong>${member.name || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Gender</span>
        <strong>${member.gender || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Date of Birth</span>
        <strong>${formatDate(member.dob)}</strong>
      </div>

      <div class="detail-item">
        <span>Relation</span>
        <strong>${member.relation || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Father / Husband Name</span>
        <strong>${member.father_name || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Profession</span>
        <strong>${member.profession || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Blood Group</span>
        <strong>${member.blood_group || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>State</span>
        <strong>${member.state || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>District</span>
        <strong>${member.district || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Mobile Number</span>
        <strong>${member.mobile || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Aadhaar Number</span>
        <strong>${member.aadhaar || "N/A"}</strong>
      </div>

      <div class="detail-item full">
        <span>Address</span>
        <strong>${member.address || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Pin Code</span>
        <strong>${member.pincode || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Email Address</span>
        <strong>${member.email || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Document Type</span>
        <strong>${member.document_type || "N/A"}</strong>
      </div>

      <div class="detail-item">
        <span>Declaration Accepted</span>
        <strong>${member.declaration ? "Yes" : "No"}</strong>
      </div>

      <div class="detail-item">
        <span>Submitted Date</span>
        <strong>${formatDate(member.createdAt)}</strong>
      </div>

    </div>

    <div class="image-section">
      <h3>Uploaded Documents</h3>

      <div class="member-images">

        <div class="image-box">
          <p>Profile Picture</p>
          ${getFileHtml(member.profileImage?.url)}
        </div>

        <div class="image-box">
          <p>ID Proof</p>
          ${getFileHtml(member.idUpload?.url)}
        </div>

        <div class="image-box">
          <p>Other Document</p>
          ${getFileHtml(member.otherUpload?.url)}
        </div>

      </div>
    </div>
  `;

  memberModal.classList.add("active");
}

async function deleteMember(id) {
  const confirmDelete = confirm("Are you sure you want to delete this member data?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_PATHS.MEMBERS}/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to delete member data");
      return;
    }

    allMembers = allMembers.filter(item => item._id !== id);
    totalMembers.innerText = allMembers.length;
    renderMemberRows(allMembers);

    alert("Member data deleted successfully!");
  } catch (error) {
    console.log("DELETE MEMBER ERROR:", error);
    alert("Server error. Member data not deleted.");
  }
}

function getFileHtml(url) {
  if (!url) {
    return `<div class="no-image">No File</div>`;
  }

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes(".pdf")) {
    return `<a href="${url}" target="_blank" class="file-link">View PDF</a>`;
  }

  return `<img src="${url}" alt="Member File">`;
}

function formatDate(dateValue) {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

modalClose.addEventListener("click", () => {
  memberModal.classList.remove("active");
});

memberModal.addEventListener("click", (e) => {
  if (e.target === memberModal) {
    memberModal.classList.remove("active");
  }
});

fetchMemberData();