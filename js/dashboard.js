const totalMembersBox = document.getElementById("totalMembers");
const totalDonationsBox = document.getElementById("totalDonations");

const memberBar = document.getElementById("memberBar");
const donationBar = document.getElementById("donationBar");

const memberBarValue = document.getElementById("memberBarValue");
const donationBarValue = document.getElementById("donationBarValue");

async function fetchDashboardData() {
  try {
    const [membersResponse, donationsResponse] = await Promise.all([
      fetch(API_PATHS.MEMBERS),
      fetch(API_PATHS.DONATE),
    ]);

    const membersData = await membersResponse.json();
    const donationsData = await donationsResponse.json();

    if (!membersResponse.ok || !donationsResponse.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const totalMembers = membersData.total || membersData.members?.length || 0;
    const totalDonations = donationsData.total || donationsData.donations?.length || 0;

    updateDashboard(totalMembers, totalDonations);

  } catch (error) {
    console.log("DASHBOARD ERROR:", error);

    totalMembersBox.innerText = "0";
    totalDonationsBox.innerText = "0";
    memberBarValue.innerText = "0";
    donationBarValue.innerText = "0";
  }
}

function updateDashboard(totalMembers, totalDonations) {
  totalMembersBox.innerText = totalMembers;
  totalDonationsBox.innerText = totalDonations;

  memberBarValue.innerText = totalMembers;
  donationBarValue.innerText = totalDonations;

  const maxValue = Math.max(totalMembers, totalDonations, 1);

  const memberPercent = (totalMembers / maxValue) * 100;
  const donationPercent = (totalDonations / maxValue) * 100;

  memberBar.style.width = `${memberPercent}%`;
  donationBar.style.width = `${donationPercent}%`;
}

function openAdminPage(pageUrl) {
  window.location.href = pageUrl;
}

fetchDashboardData();