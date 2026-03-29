let categoryChartInstance = null;
let priorityChartInstance = null;


const DATA_URL = "https://councilstorage22532654.blob.core.windows.net/public-dashboard-data/summary.json";

function safeNumber(value) {
  return typeof value === "number" ? value : 0;
}

function formatTimestamp(timestamp) {
  if (!timestamp) return "Not available";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getStatusClass(status) {
  const normalised = String(status).toLowerCase();
  if (normalised === "open") return "status-open";
  if (normalised === "resolved") return "status-resolved";
  return "status-inprogress";
}

function getPriorityClass(priority) {
  const normalised = String(priority).toLowerCase();
  if (normalised === "high") return "priority-high";
  if (normalised === "medium") return "priority-medium";
  return "priority-low";
}

function renderKpis(data) {
  document.getElementById("lastUpdated").textContent =
    formatTimestamp(data.lastUpdated);

  document.getElementById("totalIncidents").textContent =
    safeNumber(data.metrics?.totalIncidents);

  document.getElementById("openIncidents").textContent =
    safeNumber(data.metrics?.openIncidents);

  document.getElementById("resolvedIncidents").textContent =
    safeNumber(data.metrics?.resolvedIncidents);

  document.getElementById("inProgressIncidents").textContent =
    safeNumber(data.metrics?.inProgressIncidents);
}

function renderCategoryChart(data) {
  const labels = (data.byCategory || []).map((item) => item.category);
  const values = (data.byCategory || []).map((item) => item.count);

  const ctx = document.getElementById("categoryChart");

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  categoryChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Incidents",
          data: values,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}

function renderPriorityChart(data) {
  const labels = (data.byPriority || []).map((item) => item.priority);
  const values = (data.byPriority || []).map((item) => item.count);

  const ctx = document.getElementById("priorityChart");

  if (priorityChartInstance) {
    priorityChartInstance.destroy();
  }

  priorityChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Priority Distribution",
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function renderTable(data) {
  const tableBody = document.getElementById("recordsTable");
  const records = data.recentRecords || [];

  if (records.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">No recent records available.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = "";

  records.forEach((record) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHtml(record.incident_id)}</td>
      <td>${escapeHtml(record.reported_date)}</td>
      <td>${escapeHtml(record.suburb)}</td>
      <td>${escapeHtml(record.category)}</td>
      <td>
        <span class="status-badge ${getStatusClass(record.status)}">
          ${escapeHtml(record.status)}
        </span>
      </td>
      <td>
        <span class="priority-badge ${getPriorityClass(record.priority)}">
          ${escapeHtml(record.priority)}
        </span>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function renderError(message) {
  const container = document.querySelector(".container");
  const existingError = document.querySelector(".error-box");

  if (existingError) {
    existingError.remove();
  }

  const errorBox = document.createElement("div");
  errorBox.className = "error-box";
  errorBox.textContent = message;
  container.insertBefore(errorBox, container.firstChild.nextSibling);
}

async function loadDashboard() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: unable to load dashboard data`);
    }

    const data = await response.json();

    renderKpis(data);
    renderCategoryChart(data);
    renderPriorityChart(data);
    renderTable(data);
  } catch (error) {
    console.error("Dashboard loading error:", error);
    renderError("Unable to load dashboard data. Please try again later.");
    document.getElementById("recordsTable").innerHTML = `
      <tr>
        <td colspan="6">Error loading data</td>
      </tr>
    `;
  }
}

loadDashboard();