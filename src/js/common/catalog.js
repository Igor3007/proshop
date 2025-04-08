document.addEventListener("DOMContentLoaded", function () {
    const catalogItems = document.querySelectorAll(".catalog-list__links li");
    const backButton = document.querySelector("[data-back='back']");

    function updateBackButton() {
        const isActive = document.querySelector(".catalog-list__links li.is--active-md");
        backButton.style.display = isActive ? "block" : "none";
    }

    catalogItems.forEach((item) => {
        item.addEventListener("mouseenter", function () {
            if (window.innerWidth <= 767.98) return;

            const target = item.getAttribute("data-target");
            const activeItem = document.querySelector(".catalog-list__links li.is-active");
            const activeInfo = document.querySelector(".catalog-list__info-item.is-active");

            if (activeItem && activeItem !== item) {
                activeItem.classList.remove("is-active");
            }
            if (activeInfo && activeInfo.getAttribute("data-target") !== target) {
                activeInfo.classList.remove("is-active");
            }

            item.classList.add("is-active");
            document.querySelector(`.catalog-list__info-item[data-target="${target}"]`)?.classList.add("is-active");
        });

        item.addEventListener("click", function (event) {
            if (window.innerWidth > 767.98) return;

            const target = item.getAttribute("data-target");

            item.classList.add("is--active-md");
            document.querySelector(`.catalog-list__info-item[data-target="${target}"]`)?.classList.add("is--active-md");

            updateBackButton();
        });
    });

    backButton?.addEventListener("click", function () {
        document.querySelectorAll(".is--active-md").forEach(el => el.classList.remove("is--active-md"));
        updateBackButton();
    });

    updateBackButton();
});
