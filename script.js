const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const message = document.getElementById("message");
const sortSelect = document.getElementById("sortSelect");
const modal = document.getElementById("detailsModal");
const details = document.getElementById("details");
const closeModal = document.getElementById("closeModal");
let repositories = [];
let currentPage = 1;
const perPage = 9;
let totalPages = 1;
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const query = input.value.trim();
    currentPage =1;
    if (query === "") {
        message.textContent = "Please enter something to search.";
        results.innerHTML = "";
        return;}
    message.textContent = "Loading...";
    results.innerHTML = "";
    try {
        const response = await fetch(
    "https://api.github.com/search/repositories?q="
    + encodeURIComponent(query)
    + "&page=" + currentPage
    + "&per_page=" + perPage);
        if (!response.ok) {
            throw new Error("GitHub API request failed.");}
        const data = await response.json();
        repositories = data.items;
        totalPages = Math.ceil(data.total_count / perPage);
        if (repositories.length === 0) {
            message.textContent = "No repositories found.";
            return;
        }
        message.textContent =
            `Found ${repositories.length} repositories.`;
        displayRepositories(repositories);
    } catch (error) {
        message.textContent =
            "Something went wrong. Please try again.";
        console.error(error);
    }
});
function displayRepositories(repos) {
    results.innerHTML = "";
    repos.forEach(function (repo) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h2>${repo.name}</h2>
            <p>
                ${repo.description || "No description available."}
            </p>
            <div class="info">
                ⭐ Stars: ${repo.stargazers_count}
            </div>
            <div class="info">
                💻 Language: ${repo.language || "Not specified"}
            </div>
            <div class="info">
                👤 Owner: ${repo.owner.login}
            </div>
            <button class="view-button">
                View Details
            </button>
        `;
        const viewButton =
            card.querySelector(".view-button");
        viewButton.addEventListener("click", function () {
            showDetails(repo);
        });
        results.appendChild(card);
    });
}
sortSelect.addEventListener("change", function () {
    if (repositories.length === 0) {
        return;
    }
    const sortType = sortSelect.value;
    let sortedRepositories = [...repositories];
    if (sortType === "stars") {
        sortedRepositories.sort(
            (a, b) =>
                b.stargazers_count - a.stargazers_count
        );
    } else if (sortType === "name") {
        sortedRepositories.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );
    } else if (sortType === "updated") {
        sortedRepositories.sort(
            (a, b) =>
                new Date(b.updated_at) -
                new Date(a.updated_at)
        );
    }
    displayRepositories(sortedRepositories);
});
function showDetails(repo) {
    details.innerHTML = `
        <h2>${repo.name}</h2>
        <p>
            ${repo.description || "No description available."}
        </p>
        <p>
            <strong>Owner:</strong>
            ${repo.owner.login}
        </p>
        <p>
            <strong>Language:</strong>
            ${repo.language || "Not specified"}
        </p>
        <p>
            <strong>Stars:</strong>
            ${repo.stargazers_count}
        </p>
        <p>
            <strong>Forks:</strong>
            ${repo.forks_count}
        </p>
        <p>
            <strong>Open Issues:</strong>
            ${repo.open_issues_count}
        </p>
        <p>
            <strong>License:</strong>
            ${repo.license ? repo.license.name : "None"}
        </p>
        <a href="${repo.html_url}" target="_blank">Open Repository on GitHub </a>`;
    modal.style.display = "block";
}
closeModal.addEventListener("click", function () {
    modal.style.display = "none";});
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";}
});