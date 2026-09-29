// ================= LOGIN =================

function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "admin" && password === "1234") {

        localStorage.setItem("loggedInUser", "admin");
        localStorage.setItem("userRole", "admin");

        window.location.href = "dashboard.html";

    } 
    else if (username === "user" && password === "1234") {

        localStorage.setItem("loggedInUser", "user");
        localStorage.setItem("userRole", "user");

        window.location.href = "user-dashboard.html";

    } 
    else {

        alert("Invalid Username or Password!");

    }
}


// ================= LOGOUT =================

function logout() {

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");

    window.location.href = "login.html";
}


// ================= SUBMIT REPORT =================

function submitReport() {

    const typeElement = document.getElementById("incidentType");
    const descriptionElement = document.getElementById("description");

    if (!typeElement || !descriptionElement) {
        alert("Report form elements not found!");
        return;
    }

    const type = typeElement.value;
    const description = descriptionElement.value.trim();

    // Validation
    if (type === "" || description === "") {

        alert("Please fill all fields!");
        return;

    }

    // Get existing reports
    let reports = JSON.parse(localStorage.getItem("reports")) || [];

    // Create new report
    const newReport = {

        id: "INC-" + Date.now(),

        user: localStorage.getItem("loggedInUser") || "user",

        type: type,

        description: description,

        date: new Date().toLocaleString(),

        status: "Under Investigation"

    };

    // Add report
    reports.push(newReport);

    // Save report
    localStorage.setItem("reports", JSON.stringify(reports));

    // Success message
    alert(
        "Report Submitted Successfully!\n\n" +
        "Report ID: " + newReport.id
    );

    // Go to user dashboard
    window.location.href = "user-dashboard.html";
}


// ================= FORM SUBMIT CONNECTION =================

document.addEventListener("DOMContentLoaded", function () {

    const reportForm = document.getElementById("incidentForm");

    if (reportForm) {

        reportForm.addEventListener("submit", function (event) {

            event.preventDefault();

            submitReport();

        });

    }

});


// ================= LOAD ADMIN REPORTS =================

function loadAdminReports() {

    const box = document.getElementById("adminReports");

    if (!box) return;

    const reports =
        JSON.parse(localStorage.getItem("reports")) || [];

    updateAdminStats(reports);

    if (reports.length === 0) {

        box.innerHTML = `
            <div class="no-reports">
                <h3>📭 No Incident Reports</h3>
                <p>No reports are available.</p>
            </div>
        `;

        return;
    }

    box.innerHTML = reports
        .map(function (report) {

            return createReportCard(report);

        })
        .join("");
}


// ================= REPORT CARD =================

function createReportCard(report) {

    return `
        <div class="report-card">

            <div class="report-top">

                <div class="report-id">
                    🚨 ${report.id}
                </div>

                <strong>${report.status}</strong>

            </div>


            <div class="report-info">

                <div class="info-box">
                    <strong>User</strong>
                    <span>${report.user}</span>
                </div>

                <div class="info-box">
                    <strong>Incident Type</strong>
                    <span>${report.type}</span>
                </div>

                <div class="info-box">
                    <strong>Date</strong>
                    <span>${report.date}</span>
                </div>

                <div class="info-box">
                    <strong>Report ID</strong>
                    <span>${report.id}</span>
                </div>

            </div>


            <div class="description">

                <strong>Description</strong>

                <p>${report.description}</p>

            </div>


            <div class="status-area">

                <label>Update Status:</label>

                <select
                    class="status-select"
                    onchange="updateReportStatusById('${report.id}', this.value)"
                >

                    <option
                        value="Under Investigation"
                        ${report.status === "Under Investigation" ? "selected" : ""}
                    >
                        Under Investigation
                    </option>

                    <option
                        value="In Progress"
                        ${report.status === "In Progress" ? "selected" : ""}
                    >
                        In Progress
                    </option>

                    <option
                        value="Resolved"
                        ${report.status === "Resolved" ? "selected" : ""}
                    >
                        Resolved
                    </option>

                </select>

            </div>

        </div>
    `;
}


// ================= SEARCH + FILTER =================

function filterAdminReports() {

    const searchBox = document.getElementById("searchReport");
    const statusBox = document.getElementById("statusFilter");
    const reportBox = document.getElementById("adminReports");

    if (!searchBox || !statusBox || !reportBox) return;

    const search =
        searchBox.value.toLowerCase().trim();

    const selectedStatus =
        statusBox.value;

    const reports =
        JSON.parse(localStorage.getItem("reports")) || [];


    const filteredReports = reports.filter(function (report) {

        const id =
            String(report.id).toLowerCase();

        const user =
            String(report.user).toLowerCase();

        const type =
            String(report.type).toLowerCase();

        const searchMatch =
            id.includes(search) ||
            user.includes(search) ||
            type.includes(search);

        const statusMatch =
            selectedStatus === "All" ||
            report.status === selectedStatus;

        return searchMatch && statusMatch;

    });


    if (filteredReports.length === 0) {

        reportBox.innerHTML = `
            <div class="no-reports">

                <h3>🔍 No Reports Found</h3>

                <p>
                    No reports match your search or filter.
                </p>

            </div>
        `;

        return;
    }


    reportBox.innerHTML = filteredReports
        .map(function (report) {

            return createReportCard(report);

        })
        .join("");
}


// ================= UPDATE STATUS =================

function updateReportStatusById(reportId, newStatus) {

    let reports =
        JSON.parse(localStorage.getItem("reports")) || [];


    const index = reports.findIndex(function (report) {

        return report.id === reportId;

    });


    if (index === -1) {

        alert("Report not found!");

        return;
    }


    reports[index].status = newStatus;


    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );


    updateAdminStats(reports);


    // Reload filtered reports if filter elements exist
    const searchBox =
        document.getElementById("searchReport");

    const statusBox =
        document.getElementById("statusFilter");


    if (searchBox && statusBox) {

        filterAdminReports();

    } 
    else {

        loadAdminReports();

    }


    alert("Report status updated successfully!");
}


// ================= OLD STATUS FUNCTION =================

function updateReportStatus(index, newStatus) {

    let reports =
        JSON.parse(localStorage.getItem("reports")) || [];


    if (!reports[index]) return;


    reports[index].status = newStatus;


    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );


    updateAdminStats(reports);

    loadAdminReports();

    alert("Report status updated successfully!");
}


// ================= ADMIN STATISTICS =================

function updateAdminStats(reports) {

    const total =
        document.getElementById("totalReports");

    const investigation =
        document.getElementById("investigationReports");

    const progress =
        document.getElementById("progressReports");

    const resolved =
        document.getElementById("resolvedReports");


    const investigationCount =
        reports.filter(function (report) {

            return report.status === "Under Investigation";

        }).length;


    const progressCount =
        reports.filter(function (report) {

            return report.status === "In Progress";

        }).length;


    const resolvedCount =
        reports.filter(function (report) {

            return report.status === "Resolved";

        }).length;


    if (total) {

        total.textContent = reports.length;

    }


    if (investigation) {

        investigation.textContent =
            investigationCount;

    }


    if (progress) {

        progress.textContent =
            progressCount;

    }


    if (resolved) {

        resolved.textContent =
            resolvedCount;

    }
}


// ================= USER STATUS =================

function loadStatusReports() {

    const box =
        document.getElementById("statusReports");

    if (!box) return;


    const currentUser =
        localStorage.getItem("loggedInUser");


    const reports =
        JSON.parse(localStorage.getItem("reports")) || [];


    const myReports =
        reports.filter(function (report) {

            return report.user === currentUser;

        });


    if (myReports.length === 0) {

        box.innerHTML = `
            <div class="no-reports">

                <h3>📭 No Reports Found</h3>

                <p>
                    You have not submitted any reports.
                </p>

            </div>
        `;

        return;
    }


    box.innerHTML = myReports
        .map(function (report) {

            return `

                <div class="report-card">

                    <div class="report-top">

                        <div class="report-id">
                            🚨 ${report.id}
                        </div>

                        <strong>
                            ${report.status}
                        </strong>

                    </div>


                    <div class="report-info">

                        <div class="info-box">

                            <strong>
                                Incident Type
                            </strong>

                            <span>
                                ${report.type}
                            </span>

                        </div>


                        <div class="info-box">

                            <strong>
                                Date
                            </strong>

                            <span>
                                ${report.date}
                            </span>

                        </div>

                    </div>


                    <div class="description">

                        <strong>
                            Description
                        </strong>

                        <p>
                            ${report.description}
                        </p>

                    </div>

                </div>

            `;

        })
        .join("");
}


// ================= NAVIGATION =================

function openReport() {

    window.location.href =
        "report.html";
}


function openStatus() {

    window.location.href =
        "status.html";
}


function goBack() {

    window.history.back();

}


// ================= PAGE LOAD =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (
            document.getElementById("adminReports")
        ) {

            loadAdminReports();

        }


        if (
            document.getElementById("statusReports")
        ) {

            loadStatusReports();

        }

    }
);