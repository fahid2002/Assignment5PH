const issuesContainer = document.getElementById('issuesContainer');
const tabs = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('searchInput');
const modalCheckbox = document.getElementById('issueModal');
const modalBody = document.getElementById('modalBody');

let allIssues = [];
let currentFilter = 'all';

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-orange-400',
  low: 'bg-gray-400'
};

const statusColors = {
  open: 'border-green-500',
  closed: 'border-purple-500'
};

async function fetchIssues() {
  try {
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const result = await res.json();

    if (result.status === 'success' && Array.isArray(result.data)) {
      allIssues = result.data;
      renderIssues();
    } else {
      issuesContainer.innerHTML = '<p class="text-red-500">No issues found.</p>';
    }
  } catch (err) {
    console.error('Failed to fetch issues:', err);
    issuesContainer.innerHTML = '<p class="text-red-500">Failed to load issues.</p>';
  }
}

function renderIssues() {
  const searchTerm = searchInput.value.toLowerCase();
  issuesContainer.innerHTML = '';

  const filtered = allIssues
    .filter(issue => currentFilter === 'all' || issue.status === currentFilter)
    .filter(issue => issue.title.toLowerCase().includes(searchTerm));

  if (filtered.length === 0) {
    issuesContainer.innerHTML = '<p class="text-gray-500">No issues found.</p>';
    return;
  }

  filtered.forEach(issue => {
    const card = document.createElement('div');
    card.className = `card p-4 border-t-4 ${statusColors[issue.status]} bg-white shadow cursor-pointer relative`;

 const statusIcons = {
  open: 'B13-A5-Github-Issue-Tracker-main/assets/Open-Status.png',
  closed: 'B13-A5-Github-Issue-Tracker-main/assets/Closed- Status .png'
};


card.innerHTML = `

  <div class="flex justify-between items-center mb-2">

    <img src="${statusIcons[issue.status]}" 
         alt="${issue.status}" class="w-5 h-5">

    <span class="text-white text-xs px-2 py-1 rounded-full ${priorityColors[issue.priority.toLowerCase()] || 'bg-gray-400'}">
      ${issue.priority.toUpperCase()}
    </span>
  </div>

  <h2 class="font-bold text-lg text-black mb-1">${issue.title}</h2>

  <p class="text-gray-700 mb-2">${issue.description}</p>

  <p class="text-sm text-gray-500">Author: ${issue.author} | Assignee: ${issue.assignee || 'Unassigned'}</p>
`;

    card.addEventListener('click', () => showModal(issue));
    issuesContainer.appendChild(card);
  });
}