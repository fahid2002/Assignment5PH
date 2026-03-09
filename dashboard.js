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