const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if(username === "admin" && password === "admin123") {

    localStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid credentials!");
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active styles from all tabs
      tabs.forEach(t => {
        t.classList.remove('bg-blue-600', 'text-white');
      });

      // Add active styles to the clicked tab
      tab.classList.add('bg-blue-600', 'text-white');
    });
  });
});