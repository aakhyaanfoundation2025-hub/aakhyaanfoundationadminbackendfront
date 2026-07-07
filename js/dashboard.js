const totalMembersBox = document.getElementById("totalMembers");
const totalDonationsBox = document.getElementById("totalDonations");

const memberGraphBar = document.getElementById("memberGraphBar");
const donationGraphBar = document.getElementById("donationGraphBar");

const memberGraphValue = document.getElementById("memberGraphValue");
const donationGraphValue = document.getElementById("donationGraphValue");

const maxScale = document.getElementById("maxScale");
const midScale = document.getElementById("midScale");

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
    updateDashboard(0, 0);
  }
}

function updateDashboard(totalMembers, totalDonations) {
  totalMembersBox.innerText = totalMembers;
  totalDonationsBox.innerText = totalDonations;

  memberGraphValue.innerText = totalMembers;
  donationGraphValue.innerText = totalDonations;

  const maxValue = Math.max(totalMembers, totalDonations, 1);

  maxScale.innerText = maxValue;
  midScale.innerText = Math.ceil(maxValue / 2);

  const chartHeight = 220;

  const memberHeight = Math.max((totalMembers / maxValue) * chartHeight, totalMembers > 0 ? 12 : 0);
  const donationHeight = Math.max((totalDonations / maxValue) * chartHeight, totalDonations > 0 ? 12 : 0);

  setTimeout(() => {
    memberGraphBar.style.height = `${memberHeight}px`;
    donationGraphBar.style.height = `${donationHeight}px`;
  }, 150);
}

function openAdminPage(pageUrl) {
  window.location.href = pageUrl;
}

fetchDashboardData();