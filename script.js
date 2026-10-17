const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");

function showStatus(message) {
  const status = document.createElement("li");
  status.className = "status-message";
  status.textContent = message;
  repositoryList.replaceChildren(status);
}

function renderRepositories(repositories) {
  repositoryCount.textContent = `${repositories.length} ${repositories.length === 1 ? "repository" : "repositories"}`;

  if (repositories.length === 0) {
    showStatus("No starred repositories yet.");
    return;
  }

  const items = repositories.map((repository, index) => {
    const item = document.createElement("li");
    item.className = "repository-item";
    item.style.animationDelay = `${index * 70}ms`;

    const link = document.createElement("a");
    link.className = "repository-link";
    link.href = repository.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${repository.owner}/${repository.name}`;

    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;

    const metadata = document.createElement("p");
    metadata.className = "repository-meta";

    const language = document.createElement("span");
    language.className = "language";
    language.textContent = repository.language;

    const starredAt = document.createElement("time");
    starredAt.dateTime = repository.starredAt;
    starredAt.textContent = `Starred ${new Date(`${repository.starredAt}T00:00:00`).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    })}`;

    const marker = document.createElement("span");
    marker.className = "star-mark";
    marker.setAttribute("aria-label", "Starred repository");
    marker.textContent = "STARRED";

    metadata.append(language, starredAt);
    item.append(link, description, metadata, marker);
    return item;
  });

  repositoryList.replaceChildren(...items);
}

fetch("events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  })
  .then(renderRepositories)
  .catch((error) => {
    console.error("Could not load starred repositories:", error);
    repositoryCount.textContent = "Unavailable";
    showStatus("The repository list could not be loaded. Try refreshing the page.");
  });