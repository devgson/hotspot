function searchResultsHtml(listings) {
  return listings
    .map(listing => {
      return `<a href="/listing/${listing.slug}" class="search__result">
              <strong>${listing.title}</strong>
          </a>`;
    })
    .join("");
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[id="search-field"]');
  const searchResults = search.querySelector(".search__results");

  searchInput.on("input", function() {
    if (!this.value) {
      searchResults.style.display = "none";
      return;
    }
    searchResults.style.display = "block";
    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          console.log(res.data);
          searchResults.innerHTML = searchResultsHtml(res.data);
          return;
        }
        searchResults.innerHTML = `<a  class="search__result">
              <strong class="text-dark">No Results for '${this.value}' found </strong>
          </a>`;
      })
      .catch(err => {
        console.error(err);
      });
  });

  searchInput.on("keyup", e => {
    if (![38, 40, 13].includes(e.keyCode)) {
      return;
    }
    const activeClass = "search__result--active";
    const current = search.querySelector(".search__result--active");
    const items = search.querySelectorAll(".search__result");
    let next;
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1];
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href;
      return;
    }
    if (current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  });
}

export default typeAhead;
