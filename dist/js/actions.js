if (document.querySelector('.filter-properties')) {
    document.addEventListener("DOMContentLoaded", function () {
        const container = document.querySelector('.category-filter');
        if (container) {
            const subMenus = container.querySelectorAll('.filter-properties__list ul');

            subMenus.forEach(ul => {
                const items = ul.querySelectorAll('li');

                if (items.length > 5) {
                    items.forEach((item, index) => {
                        if (index >= 5) item.classList.add('hidden');
                    });

                    const hiddenCount = items.length - 5;
                    const toggleBtn = document.createElement('div');
                    toggleBtn.classList.add('sub-menu-toggle');
                    toggleBtn.innerHTML = `Ещё <span>${hiddenCount}</span> <i class="icon"></i>`;

                    toggleBtn.addEventListener('click', (event) => {
                        event.stopPropagation();

                        ul.classList.toggle('is-open');
                        toggleBtn.classList.toggle('is-open');

                        const isOpen = ul.classList.contains('is-open');

                        items.forEach((item, index) => {
                            if (index >= 5) {
                                item.classList.toggle('hidden', !isOpen);
                            }
                        });

                        toggleBtn.innerHTML = isOpen ?
                            `Свернуть <i class="icon"></i>` :
                            `Ещё <span>${hiddenCount}</span> <i class="icon"></i>`;
                    });

                    ul.after(toggleBtn);
                }
            });
        }
    });
}


(function () {
    function toggleWindow(target) {
        console.log(`toggleWindow called with target: ${target}`);
        const windowElement = document.querySelector(`[data-window="${target}"]`);
        const overlay = document.querySelector('[data-observ]');
        const actionButtons = document.querySelectorAll('[data-target]');

        if (!windowElement) {
            console.error(`No element found for target: ${target}`);
            return;
        }

        const isActive = windowElement.classList.toggle('is--active');
        console.log(`Window element active status: ${isActive}`);
        console.log(`Window element class list: ${windowElement.classList}`);

        if (overlay) {
            overlay.classList.toggle('is-active', isActive);
            if (target === "filter" || target === "deliver") {
                overlay.classList.toggle('b-active', isActive);
            }
        }

        document.querySelectorAll("[data-window]").forEach((el) => {
            if (el !== windowElement) el.classList.remove('is--active');
        });

        actionButtons.forEach((btn) => {
            if (btn.getAttribute('data-target') !== target) {
                btn.classList.remove('is--active');
            }
        });

        document.body.classList.toggle("b--open", isActive);
    }

    function closeWindows() {
        const overlay = document.querySelector('[data-observ]');
        const actionButtons = document.querySelectorAll('[data-target]');
        document.querySelectorAll("[data-window]").forEach(el => el.classList.remove("is--active"));

        if (overlay) {
            overlay.classList.remove('is-active', 'b-active');
        }

        actionButtons.forEach(btn => btn.classList.remove('is--active'));
        document.body.classList.remove("b--open");
    }

    document.addEventListener("DOMContentLoaded", () => {
        const filterButtons = document.querySelectorAll(".filter-products__button");

        filterButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                const filterId = button.getAttribute("data-filter-id");
                console.log(`Button clicked: ${button.innerText}`);

                if (button.hasAttribute('data-target-block')) {
                    console.log("Stock button clicked, adding active class.");
                    button.classList.toggle("active");
                    return;
                }

                if (button.hasAttribute('data-target')) {
                    const target = button.getAttribute('data-target');
                    console.log(`Target for toggleWindow: ${target}`);
                    toggleWindow(target);
                    return;
                }

                const filterWindow = document.querySelector('[data-window="filter"]');

                if (!filterWindow.classList.contains('is--active')) {
                    console.log("Opening filter window");
                    toggleWindow("filter");
                }

                const filterBlock = document.querySelector(`[data-filter-block="${filterId}"]`);
                if (filterBlock) {
                    setTimeout(() => {
                        filterBlock.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }, 100);
                }

                filterButtons.forEach(btn => {
                    btn.classList.remove("active");
                    console.log(`Removing active class from: ${btn.innerText}`);
                });
                button.classList.add("active");
                console.log(`Adding active class to: ${button.innerText}`);
            });
        });

        const actionButtons = document.querySelectorAll('[data-target]');
        const overlay = document.querySelector('[data-observ]');
        const closeButtons = document.querySelectorAll('[data-close="close"]');
        const searchInputs = document.querySelectorAll('.search-index');
        const searchFields = document.querySelectorAll('.search-field[data-window="search"]');

        actionButtons.forEach((button) => {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                const target = button.getAttribute('data-target');
                toggleWindow(target);
            });
        });

        searchInputs.forEach((searchInput) => {
            searchInput.addEventListener('click', function (event) {
                event.stopPropagation();
                toggleWindow('search');
                searchInput.classList.add("is--active");
                searchFields.forEach(field => field.classList.add("is--active"));
            });

            const input = searchInput.querySelector("input");
            if (input) {
                input.addEventListener("focus", function () {
                    toggleWindow('search');
                    searchInput.classList.add("is--active");
                    searchFields.forEach(field => field.classList.add("is--active"));
                });
            }
        });

        document.addEventListener('click', function (event) {
            console.log("Document clicked");
            if (![...actionButtons].some(btn => btn.contains(event.target)) &&
                ![...document.querySelectorAll('[data-window]')].some(win => win.contains(event.target)) &&
                ![...searchInputs].some(input => input.contains(event.target))
            ) {
                console.log("Closing windows");
                closeWindows();
            }
        });

        closeButtons.forEach(closeBtn => {
            closeBtn.addEventListener("click", function (event) {
                event.stopPropagation();
                closeWindows();
            });
        });
    });
})();


if (document.querySelector('.category-filter')) {
    document.addEventListener('DOMContentLoaded', () => {
        let newRangeSlider = null;

        const initPriceRange = () => {
            const slider = document.getElementById('price-slider');
            if (!slider) {
                console.error('Слайдер не найден');
                return;
            }

            if (newRangeSlider) {
                //newRangeSlider.destroy();
                //newRangeSlider.destroy();
                newRangeSlider = null;
            }

            newRangeSlider = new ZBRangeSlider('price-slider');

            const inputMax = document.querySelector('[data-price-range="max"]');
            const inputMin = document.querySelector('[data-price-range="min"]');

            const priceMax = parseInt(slider.getAttribute('se-max'), 10) || 10000;
            const priceMin = parseInt(slider.getAttribute('se-min'), 10) || 0;

            newRangeSlider.setMinValue(priceMin);
            newRangeSlider.setMaxValue(priceMax);

            newRangeSlider.didChanged = (min, max) => {
                inputMax.value = max;
                inputMin.value = min;

                const form = inputMax.closest('form');
                const entity = form ? form.dataset.filter : '';

                // if (entity && window.Filter ? window.Filter.[entity]: '') {
                //     window.Filter[entity].submit();
                // }
            };

            inputMax.addEventListener('keyup', (e) => {
                let int = parseInt(e.target.value.replace(/\D/g, ''), 10);
                int = Math.min(int, priceMax);
                e.target.value = int;
                newRangeSlider.setMaxValue(int);
            });

            inputMin.addEventListener('keyup', (e) => {
                let int = parseInt(e.target.value.replace(/\D/g, ''), 10);
                int = Math.max(int, priceMin);
                e.target.value = int;
                newRangeSlider.setMinValue(int);
            });
        };

        const filterTrigger = document.querySelector('[data-target="filter"]');
        const filterContainer = document.querySelector('[data-filter-container="filter"]');
        const closeButton = document.querySelector('[data-close="close"]');

        if (document.querySelector('.filter-properties__range')) {
            initPriceRange();
        }

        if (filterTrigger && filterContainer && closeButton) {
            filterTrigger.addEventListener('click', () => {
                setTimeout(initPriceRange, 100);
            });
        }

        window.addEventListener('resize', () => {
            setTimeout(initPriceRange, 200);
        });

        const clearButton = document.querySelector('[data-filter="clear"]');

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                document.querySelectorAll('.category-filter__item input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });

                if (newRangeSlider) {
                    const priceMin = parseInt(document.getElementById('price-slider').getAttribute('se-min'), 10) || 0;
                    const priceMax = parseInt(document.getElementById('price-slider').getAttribute('se-max'), 10) || 10000;
                    newRangeSlider.setMinValue(priceMin);
                    newRangeSlider.setMaxValue(priceMax);
                    document.querySelector('[data-price-range="min"]').value = priceMin;
                    document.querySelector('[data-price-range="max"]').value = priceMax;
                }

                const buttons = document.querySelectorAll(".filter-products__button");
                buttons.forEach(btn => btn.classList.remove("active"));

                const form = document.querySelector('.category-filter form');
                const entity = form ? form.dataset.filter : '';
                // if (entity && window.Filter ? . [entity]) {
                //     window.Filter[entity].submit();
                // }
            });
        }
    });
}