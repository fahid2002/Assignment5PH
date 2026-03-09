const issuesContainer = document.getElementById('issuesContainer');
const tabs = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('searchInput');
const modalCheckbox = document.getElementById('issueModal');
const modalBody = document.getElementById('modalBody');

let allIssues = [];
let currentFilter = 'all';

const priorityColors = {
  high: 'font-bold bg-red-100 text-red-600',
  medium: 'font-bold bg-orange-100 text-orange-600',
  low: 'font-bold bg-gray-100 text-gray-600'
};

const statusColors = {
  open: 'border-green-500',
  closed: 'border-purple-500'
};

const statusIcons = {
  open: 'B13-A5-Github-Issue-Tracker-main/assets/Open-Status.png',
  closed: 'B13-A5-Github-Issue-Tracker-main/assets/Closed-Status.png'
};

async function fetchIssues() {
  try {
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const result = await res.json();

    if (result.data && Array.isArray(result.data)) {
      allIssues = result.data;
      renderIssues();
    } else {
      issuesContainer.innerHTML = '<p class="text-red-500">No issues found.</p>';
    }

  } catch (err) {
    console.error(err);
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

card.className = `bg-white shadow-md rounded-lg p-4 border-t-4 ${statusColors[issue.status]} cursor-pointer flex flex-col`;
    let labelsHTML = '';

    if (issue.labels && issue.labels.includes('bug')) {

      labelsHTML = `
        <span class="font-bold text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">BUG</span>
        <span class="font-bold text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">HELP WANTED</span>
      `;

    } else {

      labelsHTML = `
        <span class="font-bold text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">ENHANCEMENT</span>
      `;

    }

    card.innerHTML = `

      <div class="flex justify-between items-center mb-3">

        <img src="${statusIcons[issue.status]}" class="w-6 h-6">

        <span class="text-white text-xs px-3 py-1 rounded-full ${priorityColors[issue.priority?.toLowerCase()] || 'bg-gray-400'}">
          ${issue.priority?.toUpperCase() || "LOW"}
        </span>

      </div>

      <h2 class="font-bold text-lg text-black mb-1">
        ${issue.title}
      </h2>

      <div class="flex-grow">

  <p class="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px]">
    ${issue.description || ""}
  </p>

  <div class="flex gap-2 mb-3 min-h-[28px]">
    ${labelsHTML}
  </div>

</div>

<hr class="mb-3">

<p class="text-xs text-gray-600">
  #${issue.id || issue._id} by ${issue.author || "unknown"}
</p>

<p class="text-xs text-gray-400">
  ${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : ""}
</p>
    `;

    card.addEventListener('click', () => showModal(issue));
    issuesContainer.appendChild(card);

  });

}

function showModal(issue) {

  modalBody.innerHTML = `

    <h2 class="font-bold text-xl mb-2">
      ${issue.title}
    </h2>

    <p class="mb-3">
      ${issue.description}
    </p>

    <p class="text-sm text-gray-600">
      Status: ${issue.status}
    </p>

    <p class="text-sm text-gray-600">
      Priority: ${issue.priority}
    </p>

    <p class="text-sm text-gray-600">
      Author: ${issue.author}
    </p>

    <p class="text-sm text-gray-600">
      Assignee: ${issue.assignee || "Unassigned"}
    </p>

    <p class="text-sm text-gray-400 mt-2">
      Created: ${issue.createdAt ? new Date(issue.createdAt).toLocaleString() : ""}
    </p>

    <p class="text-sm text-gray-400">
      Updated: ${issue.updatedAt ? new Date(issue.updatedAt).toLocaleString() : ""}
    </p>
  `;

  modalCheckbox.checked = true;
}

tabs.forEach(tab => {

  tab.addEventListener('click', () => {

    currentFilter = tab.dataset.status;

    tabs.forEach(t => t.classList.remove('btn-primary'));

    tab.classList.add('btn-primary');

    renderIssues();

  });

});

searchInput.addEventListener('input', () => {
  renderIssues();
});

fetchIssues();