// email-recap.js

function todayDate() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
}

function daysDiff(due) {
  if (!due) return null;
  const d = new Date(due + "T00:00:00");
  return Math.round((d - todayDate()) / 86400000);
}

// COPY of your existing logic, simplified
function categorizeTasks(tasks) {
  const out = {
    overdue: [],
    today: [],
    tomorrow: [],
    week: []
  };

  tasks.forEach(t => {
    if (!t.due || t.done) return;
    const diff = daysDiff(t.due);

    if (diff < 0) out.overdue.push(t);
    else if (diff === 0) out.today.push(t);
    else if (diff === 1) out.tomorrow.push(t);
    else if (diff >= 2 && diff <= 7) out.week.push(t);
  });

  return out;
}

// BUILD EMAIL HTML
function buildEmailHTML(label, list) {
  if (!list.length) return "";

  return `
    <h3>${label} (${list.length})</h3>
    <ul>
      ${list.map(t => `
        <li>
          <strong>${t.title}</strong><br>
          ${t.company || "Project"} — due ${t.due}
        </li>
      `).join("")}
    </ul>
  `;
}

// MAIN FUNCTION
function buildDailyEmail(data) {
  const tasks = data.tasks || [];
  const c = categorizeTasks(tasks);

  return `
    <h2>My Day Recap</h2>
    ${buildEmailHTML("🔴 Overdue", c.overdue)}
    ${buildEmailHTML("⭐ Due Today", c.today)}
    ${buildEmailHTML("🔜 Due Tomorrow", c.tomorrow)}
    ${buildEmailHTML("📅 This Week", c.week)}
  `;
}

module.exports = { buildDailyEmail };

