
const API = "/hospital";

const $ = id => document.getElementById(id);

let hospitals = [];

// API REQUEST FUNCTION

async function api(url, options = {}) {

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {

        let message = `Request failed (${response.status})`;

        try {
            const body = await response.json();

            message = body.detail ||
                      body.message ||
                      body.title ||
                      message;

        } catch (_) {
            try {
                message = (await response.text()) || message;
            } catch (_) {}
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
}


// HTML ESCAPING

function escapeHtml(value) {

    return String(value ?? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[ch]);
}


// NAVIGATION

function showPage(page) {

    document.querySelectorAll(".page").forEach(el => {
        el.classList.toggle(
            "active",
            el.id === `page-${page}`
        );
    });

    document.querySelectorAll(".nav-button[data-page]").forEach(el => {
        el.classList.toggle(
            "active",
            el.dataset.page === page
        );
    });

    if (page === "hospitals" || page === "dashboard") {
        loadHospitals();
    }
}

document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });

});

document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.go);
    });

});


// HOSPITAL TABLE

function hospitalRow(h, actions = false) {

    return `
        <tr>
            <td>${escapeHtml(h.id)}</td>

            <td>${escapeHtml(h.name)}</td>

            <td>${escapeHtml(h.location)}</td>

            <td>${escapeHtml(h.specialization)}</td>

            ${actions ? `
                <td>
                    <button class="row-button edit"
                        data-edit="${escapeHtml(h.id)}">
                        Edit
                    </button>

                    <button class="row-button delete"
                        data-delete="${escapeHtml(h.id)}">
                        Delete
                    </button>
                </td>
            ` : ""}
        </tr>
    `;
}


// DISPLAY HOSPITALS

function renderHospitals() {

    const query = $("searchInput").value.trim().toLowerCase();

    const filtered = hospitals.filter(h =>

        [
            h.id,
            h.name,
            h.location,
            h.specialization
        ].some(v =>
            String(v ?? "").toLowerCase().includes(query)
        )
    );

    $("hospitalRows").innerHTML = filtered.length
        ? filtered.map(h => hospitalRow(h, true)).join("")
        : `<tr><td colspan="5">No hospitals found.</td></tr>`;

    $("recordCount").textContent =
        `Total records: ${filtered.length}`;


    // Recent Hospitals

    $("recentRows").innerHTML = hospitals.length

        ? [...hospitals].slice(-5).reverse().map(h => `
            <tr>
                <td>${escapeHtml(h.name)}</td>
                <td>${escapeHtml(h.location)}</td>
                <td>${escapeHtml(h.specialization)}</td>
                <td>${escapeHtml(h.id)}</td>
            </tr>
        `).join("")

        : `<tr><td colspan="4">No hospitals have been added yet.</td></tr>`;


    // Dashboard Count

    $("totalHospitals").textContent = hospitals.length;
}


// FETCH ALL HOSPITALS

async function loadHospitals() {

    try {

        hospitals = await api(API) || [];

        renderHospitals();

    } catch (error) {

        $("hospitalRows").innerHTML = `
            <tr>
                <td colspan="5">
                    ${escapeHtml(error.message)}
                </td>
            </tr>
        `;

        $("recentRows").innerHTML = `
            <tr>
                <td colspan="4">
                    Could not load hospital records.
                </td>
            </tr>
        `;
    }
}


// RESET FORM

function resetForm() {

    $("hospitalForm").reset();

    $("hospitalId").value = "";

    $("formTitle").textContent = "Add Hospital";

    $("saveButton").textContent = "Save Hospital";

    $("cancelButton").hidden = true;
}


// FORM MESSAGE

function formMessage(message, error = false) {

    $("formMessage").textContent = message;

    $("formMessage").className =
        `message ${error ? "error" : "success"}`;
}


// ADD AND UPDATE HOSPITAL

$("hospitalForm").addEventListener("submit", async event => {

    event.preventDefault();

    const id = $("hospitalId").value;

    const hospital = {

        name: $("name").value.trim(),

        location: $("location").value.trim(),

        specialization: $("specialization").value.trim()
    };

    if (
        !hospital.name ||
        !hospital.location ||
        !hospital.specialization
    ) {

        formMessage("Please fill in all fields.", true);

        return;
    }

    $("saveButton").disabled = true;

    try {

        if (id) {

            // UPDATE HOSPITAL

            await api(`${API}/${encodeURIComponent(id)}`, {

                method: "PUT",

                body: JSON.stringify(hospital)

            });

        } else {

            // ADD HOSPITAL

            await api(API, {

                method: "POST",

                body: JSON.stringify(hospital)

            });
        }

        resetForm();

        formMessage(
            id
                ? "Hospital updated successfully."
                : "Hospital added successfully."
        );

        await loadHospitals();

    } catch (error) {

        formMessage(error.message, true);

    } finally {

        $("saveButton").disabled = false;
    }

});


// EDIT AND DELETE HOSPITAL

$("hospitalRows").addEventListener("click", async event => {

    const edit = event.target.closest("[data-edit]");

    const remove = event.target.closest("[data-delete]");


    // EDIT

    if (edit) {

        const hospital = hospitals.find(
            h => String(h.id) === edit.dataset.edit
        );

        if (!hospital) return;

        $("hospitalId").value = hospital.id;

        $("name").value = hospital.name || "";

        $("location").value = hospital.location || "";

        $("specialization").value =
            hospital.specialization || "";

        $("formTitle").textContent = "Edit Hospital";

        $("saveButton").textContent = "Update Hospital";

        $("cancelButton").hidden = false;

        $("name").focus();
    }


    // DELETE

    if (remove) {

        const id = remove.dataset.delete;

        const hospital = hospitals.find(
            h => String(h.id) === id
        );

        if (!confirm(
            `Are you sure you want to delete ${hospital?.name || "this hospital"}?`
        )) {
            return;
        }

        try {

            await api(`${API}/${encodeURIComponent(id)}`, {

                method: "DELETE"

            });

            formMessage("Hospital deleted successfully.");

            await loadHospitals();

        } catch (error) {

            formMessage(error.message, true);
        }
    }

});


// BUTTON EVENTS

$("addButton").addEventListener("click", () => {

    resetForm();

    $("name").focus();

});

$("cancelButton").addEventListener("click", resetForm);

$("refreshButton").addEventListener("click", loadHospitals);

$("searchInput").addEventListener("input", renderHospitals);


// AI CHAT

function addChatMessage(text, role) {

    const message = document.createElement("div");

    message.className =
        role === "user"
            ? "user-message"
            : "assistant-message";

    message.textContent = text;

    $("chatMessages").appendChild(message);

    $("chatMessages").scrollTop =
        $("chatMessages").scrollHeight;

    return message;
}


// SEND MESSAGE TO SPRING AI

$("chatForm").addEventListener("submit", async event => {

    event.preventDefault();

    const message = $("chatInput").value.trim();

    if (!message) return;


    // DISPLAY USER MESSAGE

    addChatMessage(message, "user");

    $("chatInput").value = "";

    $("sendButton").disabled = true;


    const answer = addChatMessage(
        "Thinking...",
        "assistant"
    );


    try {

        const result = await api("/hospital/ai/chat", {

            method: "POST",

            body: JSON.stringify({

                message: message

            })

        });

        answer.textContent =
            result?.reply ||
            "The assistant did not return a response.";

    } catch (error) {

        answer.textContent =
            `Unable to get a response: ${error.message}. Check your OpenRouter API key configuration.`;

    } finally {

        $("sendButton").disabled = false;

        $("chatMessages").scrollTop =
            $("chatMessages").scrollHeight;
    }

});


// INITIAL LOAD

loadHospitals();
