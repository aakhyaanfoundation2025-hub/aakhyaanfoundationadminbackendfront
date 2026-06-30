window.afterAuthSuccess = function () {
  window.location.href = "./html/mainpage.html";
};

window.addEventListener("load", async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const res = await fetch(API_PATHS.PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      window.location.href = "./html/mainpage.html";
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
});