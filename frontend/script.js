const uploadForm = document.getElementById("uploadForm");
const documentList = document.getElementById("documentList");
const message = document.getElementById("message");
const refreshButton = document.getElementById("refreshButton");

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const documentType = document.getElementById("documentType").value;
    const file = document.getElementById("document").files[0];

    if (!documentType || !file) {
        message.textContent = "Please select document type and file.";
        return;
    }

    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("document", file);

    try {
        const response = await fetch("/api/documents/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Upload failed.");
        }

        message.textContent = "Document uploaded successfully.";
        uploadForm.reset();
        loadDocuments();
    } catch (error) {
        message.textContent = error.message;
    }
});

refreshButton.addEventListener("click", loadDocuments);

async function loadDocuments() {
    documentList.innerHTML = "<p>Loading documents...</p>";

    try {
        const response = await fetch("/api/documents");
        const data = await response.json();

        if (!data.documents || data.documents.length === 0) {
            documentList.innerHTML = "<p>No documents uploaded yet.</p>";
            return;
        }

        documentList.innerHTML = "";

        data.documents.forEach((doc) => {
            const item = document.createElement("div");
            item.className = "document";

            item.innerHTML = `
                <div><strong>Type:</strong> ${escapeHtml(doc.documentType)}</div>
                <div><strong>File:</strong> ${escapeHtml(doc.originalName)}</div>
                <div>
                    <strong>Status:</strong>
                    <span class="status ${escapeHtml(doc.status)}">${escapeHtml(doc.status)}</span>
                </div>
                <div><strong>Uploaded:</strong> ${new Date(doc.uploadedAt).toLocaleString()}</div>

                <div class="actions">
                    <a href="${doc.filePath}" target="_blank">
                        <button class="small">View File</button>
                    </a>

                    <button class="small" onclick="changeStatus('${doc._id}', 'Verified')">
                        Verify
                    </button>

                    <button class="small" onclick="changeStatus('${doc._id}', 'Rejected')">
                        Reject
                    </button>

                    <button class="small danger" onclick="deleteDocument('${doc._id}')">
                        Delete
                    </button>
                </div>
            `;

            documentList.appendChild(item);
        });
    } catch (error) {
        documentList.innerHTML = `<p>Could not load documents: ${escapeHtml(error.message)}</p>`;
    }
}

async function changeStatus(id, status) {
    try {
        const getResponse = await fetch(`/api/documents/${id}`);
        const getData = await getResponse.json();

        const response = await fetch(`/api/documents/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                documentType: getData.document.documentType,
                status
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Update failed.");
        }

        loadDocuments();
    } catch (error) {
        alert(error.message);
    }
}

async function deleteDocument(id) {
    if (!confirm("Are you sure you want to delete this document?")) {
        return;
    }

    try {
        const response = await fetch(`/api/documents/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Delete failed.");
        }

        loadDocuments();
    } catch (error) {
        alert(error.message);
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// Load documents when page opens
loadDocuments();