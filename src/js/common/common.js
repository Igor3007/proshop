document.addEventListener('DOMContentLoaded', function (event) {

    const API_YMAPS = 'https://api-maps.yandex.ru/2.1/?apikey=0e2d85e0-7f40-4425-aab6-ff6d922bb371&suggest_apikey=ad5015b5-5f39-4ba3-9731-a83afcecb740&lang=ru_RU&mode=debug';
    const SLIDER_ARROW_PATH = 'M16.2859 12.2421C16.6493 11.9029 17.2188 11.9225 17.558 12.2859L23.7802 18.9526C24.1029 19.2984 24.1029 19.835 23.7802 20.1808L17.558 26.8474C17.2188 27.2108 16.6493 27.2304 16.2859 26.8913C15.9225 26.5521 15.9029 25.9826 16.2421 25.6193L21.8911 19.5667L16.2421 13.5141C15.9029 13.1507 15.9225 12.5812 16.2859 12.2421Z'


    /* =================================================
    css variable
    =================================================*/

    function css_variable() {
        let vh = window.innerHeight * 0.01;
        let hgtheader = document.querySelector('.header') ? document.querySelector('.header').clientHeight : 64
        let hgtheadertop = document.querySelector('.header-top') ? document.querySelector('.header-top').clientHeight : 41
        let sphead = document.querySelector('.sp-head') ? document.querySelector('.sp-head').clientHeight : 41

        document.documentElement.style.setProperty('--vh', vh + 'px');
        document.documentElement.style.setProperty('--hgt-header', hgtheader + 'px');
        document.documentElement.style.setProperty('--hgt-header-top', hgtheadertop + 'px');
        document.documentElement.style.setProperty('--hgt-sp-head', sphead + 'px');

        return {
            vh,
            hgtheader,
            hgtheadertop,
            sphead
        }
    }

    window.addEventListener('load', css_variable)
    window.addEventListener('resize', css_variable)

    /* =================================================
    load ymaps api
    =================================================*/

    window.loadApiYmaps = function (callback) {

        if (window.ymaps == undefined && !window.stateLoadingApi) {
            window.stateLoadingApi = true
            const script = document.createElement('script')
            script.src = API_YMAPS
            script.onload = () => {
                callback(window.ymaps)
            }
            document.head.append(script)
        } else {
            callback(window.ymaps)
        }

    }

    /* =================================================
    smooth scroll
    ================================================= */

    window.scrollToTargetAdjusted = function (params) {

        let element = typeof params.elem == 'string' ? document.querySelector(params.elem) : params.elem
        let elementPosition = element.getBoundingClientRect().top + window.scrollY

        let offsetPosition = elementPosition
        offsetPosition -= (params.offset ? params.offset : 0)

        window.scrollTo({
            top: Number(offsetPosition),
            behavior: "smooth"
        });
    }

    /* =================================================
    preloader
    ================================================= */

    class Preloader {

        constructor() {
            this.$el = this.init()
            this.state = false
        }

        init() {
            const el = document.createElement('div')
            el.classList.add('loading')
            el.innerHTML = '<div class="indeterminate"></div>';
            document.body.append(el)
            return el;
        }

        load() {

            this.state = true;

            setTimeout(() => {
                if (this.state) this.$el.classList.add('load')
            }, 300)
        }

        stop() {

            this.state = false;

            setTimeout(() => {
                if (this.$el.classList.contains('load'))
                    this.$el.classList.remove('load')
            }, 200)
        }

    }

    window.preloader = new Preloader();


    /* ==============================================
    Status
    ============================================== */

    function Status() {

        this.containerElem = '#status'
        this.headerElem = '#status_header'
        this.msgElem = '#status_msg'
        this.btnElem = '#status_btn'
        this.timeOut = 10000,
            this.autoHide = true

        this.init = function () {
            let elem = document.createElement('div')
            elem.setAttribute('id', 'status')
            elem.innerHTML = '<div id="status_header"></div> <div id="status_msg"></div><div id="status_btn"></div>'
            document.body.append(elem)

            document.querySelector(this.btnElem).addEventListener('click', function () {
                this.parentNode.setAttribute('class', '')
            })
        }

        this.msg = function (_msg, _header) {
            _header = (_header ? _header : 'Отлично!')
            this.onShow('complete', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }
        this.err = function (_msg, _header) {
            _header = (_header ? _header : 'Ошибка')
            this.onShow('error', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }
        this.wrn = function (_msg, _header) {
            _header = (_header ? _header : 'Внимание')
            this.onShow('warning', _header, _msg)
            if (this.autoHide) {
                this.onHide();
            }
        }

        this.onShow = function (_type, _header, _msg) {
            document.querySelector(this.headerElem).innerText = _header
            document.querySelector(this.msgElem).innerText = _msg
            document.querySelector(this.containerElem).classList.add(_type)
        }

        this.onHide = function () {
            setTimeout(() => {
                document.querySelector(this.containerElem).setAttribute('class', '')
            }, this.timeOut);
        }

    }

    window.STATUS = new Status();
    const STATUS = window.STATUS;
    STATUS.init();

    /* ==============================================
    ajax request
    ============================================== */

    window.ajax = function (params, response) {

        //params Object
        //dom element
        //collback function

        window.preloader.load()

        let xhr = new XMLHttpRequest();
        xhr.open((params.type ? params.type : 'POST'), params.url)

        if (params.headers) {
            for (let key in params.headers) {
                xhr.setRequestHeader(key, params.headers[key]);
            }
        }

        if (params.responseType == 'json') {
            xhr.responseType = 'json';
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify(params.data))
        } else {
            let formData = new FormData()
            for (key in params.data) {
                formData.append(key, params.data[key])
            }
            xhr.send(formData)
        }

        xhr.onload = function () {

            response ? response(xhr.status, xhr.response) : ''
            window.preloader.stop()
            setTimeout(function () {
                if (params.btn) {
                    params.btn.classList.remove('btn-loading')
                }
            }, 300)
        };

        xhr.onerror = function () {
            window.STATUS.err('Error: ajax request failed')
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 3) {
                if (params.btn) {
                    params.btn.classList.add('btn-loading')
                }
            }
        };
    }

    /* ==================================================
    maska
    ==================================================*/
    const {
        MaskInput,
    } = Maska

    function initMaska() {
        new MaskInput("[data-maska]")

        new MaskInput("[data-input-mask='name']", {
            mask: 'A',
            tokens: {
                A: {
                    pattern: /[a-zA-ZА-Яа-я ]/,
                    repeated: true
                },
            }
        })


    }

    initMaska();


    /* ==================================================
    burgerMenu
    ==================================================*/

    class MainMenu {
        constructor(ctx) {
            this.$el = ctx
            this.btns = this.$el.querySelectorAll('.btn-burger')
            this.container = this.$el.querySelector('[data-menu="container"]')

            this.addEvent()
            this.afterLoad()
        }

        toggleMenu(item) {
            item.classList.toggle('open')

            if (!item.classList.contains('open')) {
                this.closeMenu()
            } else {
                this.openMenu()
            }
        }

        openMenu() {
            this.container.classList.toggle('is-open')
            this.$el.body.classList.toggle('page-hidden')
            this.$el.body.classList.toggle('open-modile-menu')

        }

        closeMenu() {
            this.btns.forEach(item => {
                !item.classList.contains('open') || item.classList.remove('open')
            });

            !this.$el.body.classList.contains('open-modile-menu') || !this.$el.body.classList.remove('open-modile-menu');
            !this.container.classList.contains('is-open') || this.container.classList.remove('is-open');
            !this.$el.body.classList.contains('page-hidden') || this.$el.body.classList.remove('page-hidden');
        }



        afterLoad() {
            this.container.querySelectorAll('.isset-sub').forEach(item => {
                item.addEventListener('click', e => {
                    e.stopPropagation()


                    if (e.target.classList.contains('is-open')) {
                        e.target.classList.remove('is-open')
                        return false;
                    }

                    e.target.closest('ul').querySelectorAll('.is-open').forEach(li => {
                        li.classList.remove('is-open')
                    })

                    e.target.classList.toggle('is-open')
                })
            })
        }

        addEvent() {
            this.btns.forEach(item => {
                item.addEventListener('click', e => this.toggleMenu(item))
            })

            this.$el.querySelectorAll('[data-menu="close"]').forEach(item => {
                item.addEventListener('click', () => {
                    this.closeMenu()
                })
            })
        }
    }

    if (document.querySelector('.btn-burger')) {
        window.MainMenu = new MainMenu(document)
    }

    /* ==================================================
    get width scrollbar
    ==================================================*/

    window.getScrollBarWidth = function () {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);

        const inner = document.createElement('div');
        outer.appendChild(inner);

        const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
        outer.parentNode.removeChild(outer);
        return scrollbarWidth;
    }

    /* ===================================================
    swiper default
    ===================================================*/

    function initializeSwiper(selector, options = {}) {
        const defaultOptions = {
            slidesPerView: 'auto',
            spaceBetween: 16,
            loop: false,
        };

        const swiperOptions = {
            ...defaultOptions,
            ...options
        };

        return new Swiper(selector, swiperOptions);
    }

    /* ===================================================
    banner
    ===================================================*/

    if (document.querySelector('[data-slider="banner"]')) {

        const bannerSlider = initializeSwiper('[data-slider="banner"]', {
            slidesPerView: 'auto',
            spaceBetween: 0,
            pagination: {
                el: '[data-swiper-pagination="banner"]',
                clickable: true,
            },
            navigation: {
                prevEl: '[data-swiper-btn="banner-prev"]',
                nextEl: '[data-swiper-btn="banner-next"]',
            },
            breakpoints: {
                991.98: {
                    // spaceBetween: 0,
                },
            },
        });

    }

    /* ==================================================
    popular - category
    ==================================================*/

    if (true) {
        initializeSwiper('[data-slider="popular-category"]', {
            slidesPerView: 'auto',
            spaceBetween: 16,
            scrollbar: {
                el: '[data-swiper-scrollbar="popular-category-sb"]',
                hide: false,
                draggable: true,
            },
            navigation: {
                prevEl: '[data-swiper-btn="popular-category-prev"]',
                nextEl: '[data-swiper-btn="popular-category-next"]',
            },
            breakpoints: {
                767.98: {
                    spaceBetween: 32,
                },
            },
        });
    }

    /* ======================================================
    exclusive slider
    ======================================================*/
    const exclusiveSlider = initializeSwiper('[data-slider="exclusive"]', {

        slidesPerView: 'auto',
        spaceBetween: 16,
        scrollbar: {
            el: '[data-swiper-scrollbar="exclusive-sb"]',
            hide: false,
            draggable: true,
        },
        navigation: {
            prevEl: '[data-swiper-btn="exclusive-prev"]',
            nextEl: '[data-swiper-btn="exclusive-next"]',
        },
        pagination: false,
        breakpoints: {
            991.98: {
                spaceBetween: 0,
            },
        },

    });

    /* ====================================================
    product card
    ====================================================*/

    document.querySelectorAll(".product-card").forEach((card) => {
        const colorOptions = card.querySelectorAll('.product-card__color li');
        const imageBlocks = card.querySelectorAll('.product-card__heading-images-item');
        const sizeOptions = card.querySelectorAll('.product-card__size li');

        if (imageBlocks.length) {
            imageBlocks.forEach(initSlider);
        }

        if (colorOptions.length) {
            colorOptions.forEach((option) => {
                option.addEventListener('click', () => {
                    const selectedColor = option.getAttribute('data-color');

                    colorOptions.forEach((col) => col.classList.remove('is--active'));
                    option.classList.add('is--active');

                    imageBlocks.forEach((imgBlock) => imgBlock.classList.remove('is--active'));
                    const activeImageBlock = card.querySelector(`.product-card__heading-images-item[data-image-color='${selectedColor}']`);
                    if (activeImageBlock) {
                        activeImageBlock.classList.add('is--active');
                    }
                });
            });
        }

        if (sizeOptions.length) {
            sizeOptions.forEach((size) => {
                size.addEventListener('click', () => {
                    sizeOptions.forEach((s) => s.classList.remove('active'));
                    size.classList.add('active');
                });
            });
        }
    });

    function initSlider(imageBlock) {
        let images = imageBlock.querySelectorAll(".product-card__heading-images-item-img");
        let paginationContainer = imageBlock.querySelector(".product-card__heading-images-item-img-pagination");
        let currentIndex = 0;
        if (!images.length || !paginationContainer) return;

        paginationContainer.innerHTML = "";

        images.forEach((_, index) => {
            let dot = document.createElement("div");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("active");
            dot.dataset.index = index;
            paginationContainer.appendChild(dot);
        });

        let dots = paginationContainer.querySelectorAll(".dot");

        function updateSlider(index) {
            images.forEach(img => img.classList.remove("active"));
            images[index].classList.add("active");

            dots.forEach(dot => dot.classList.remove("active"));
            dots[index].classList.add("active");
        }

        dots.forEach(dot => {
            dot.addEventListener("mouseenter", () => {
                currentIndex = parseInt(dot.dataset.index);
                updateSlider(currentIndex);
            });
        });
    }

    /* ================================================
    recomendet
    ================================================*/

    if (document.querySelector('[data-slider="recommended"]')) {
        const recommendedSlider = initializeSwiper('[data-slider="recommended"]', {
            slidesPerView: 'auto',
            spaceBetween: 16,
            scrollbar: {
                el: '[data-swiper-scrollbar="recommended-sb"]',
                hide: false,
                draggable: true,
            },
            navigation: {
                prevEl: '[data-swiper-btn="recommended-prev"]',
                nextEl: '[data-swiper-btn="recommended-next"]',
            },
            breakpoints: {
                991.98: {
                    spaceBetween: 32,
                },
            },
        });
    }

    /* ================================================
    idea bullet
    ================================================*/

    const bullets = document.querySelectorAll('.idea__item-bullet');

    bullets.forEach((bullet) => {
        const icon = bullet.querySelector('.idea__item-bullet-icon');

        icon.addEventListener('click', function (event) {
            event.stopPropagation();

            if (bullet.classList.contains('is-active')) {
                bullet.classList.remove('is-active');
                return;
            }

            bullets.forEach((b) => b.classList.remove('is-active'));

            bullet.classList.add('is-active');
        });
    });

    document.addEventListener('click', function (event) {
        bullets.forEach((bullet) => {
            if (!bullet.contains(event.target)) {
                bullet.classList.remove('is-active');
            }
        });
    });



}); //dcl



//==============================================

document.addEventListener("DOMContentLoaded", function () {
    const actionButtons = document.querySelectorAll('[data-target]');
    const overlay = document.querySelector('[data-observ]');
    const closeButtons = document.querySelectorAll('[data-close="close"]');
    const searchInputs = document.querySelectorAll('.search-index');
    const searchFields = document.querySelectorAll('.search-field[data-window="search"]');

    function toggleWindow(target) {
        const windowElement = document.querySelector(`[data-window="${target}"]`);
        if (!windowElement) return;

        const isActive = windowElement.classList.toggle('is--active');
        if (overlay) overlay.classList.toggle('is-active', isActive);

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
        document.querySelectorAll("[data-window]").forEach(el => el.classList.remove("is--active"));
        if (overlay) overlay.classList.remove('is-active');
        actionButtons.forEach(btn => btn.classList.remove('is--active'));

        document.body.classList.remove("b--open");
    }

    // actionButtons.forEach((button) => {
    //     button.addEventListener('click', function (event) {
    //         event.stopPropagation();
    //         const target = button.getAttribute('data-target');

    //         button.classList.toggle('is--active');
    //         toggleWindow(target);
    //     });
    // });

    searchInputs.forEach((searchInput) => {
        searchInput.addEventListener('click', function (event) {
            event.stopPropagation();
            const target = 'search';
            toggleWindow(target);
            searchInput.classList.add("is--active");
            searchFields.forEach(field => field.classList.add("is--active"));
        });

        const input = searchInput.querySelector("input");
        if (input) {
            input.addEventListener("focus", function () {
                const target = 'search';
                toggleWindow(target);
                searchInput.classList.add("is--active");
                searchFields.forEach(field => field.classList.add("is--active"));
            });
        }
    });

    document.addEventListener('click', function (event) {
        if (![...actionButtons].some(btn => btn.contains(event.target)) &&
            ![...document.querySelectorAll('[data-window]')].some(win => win.contains(event.target)) &&
            ![...searchInputs].some(input => input.contains(event.target))
        ) {
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


function css_variable() {
    let vh = window.innerHeight * 0.01;
    let hgtheader = document.querySelector('.header') ? document.querySelector('.header').clientHeight : 64

    document.documentElement.style.setProperty('--vh', vh + 'px');
    document.documentElement.style.setProperty('--hgt-header', hgtheader + 'px');
}

window.addEventListener('load', css_variable)
window.addEventListener('resize', css_variable)


document.addEventListener("DOMContentLoaded", function () {
    const mobileWrapper = document.querySelector('.mobile-menu__catalog-list');

    function cloneList(sourceSelector) {
        const sourceList = document.querySelector(sourceSelector);
        if (sourceList && mobileWrapper) {
            const clonedList = sourceList.cloneNode(true);
            const mobileMenuBlock = document.createElement('div');
            mobileMenuBlock.classList.add('mobile-menu__catalog-list-cloned');

            mobileMenuBlock.appendChild(clonedList);
            mobileWrapper.appendChild(mobileMenuBlock);
        }
    }

    cloneList('.info-action .data-dropdown ul');

    cloneList('.bottom-header__wrapper ul');
});


document.addEventListener('DOMContentLoaded', function () {
    const scrollerBtn = document.querySelector('.scroller__btn');
    const scroller = document.querySelector('.scroller');

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    window.addEventListener('scroll', function () {
        if (window.scrollY > 200) {
            scroller.classList.remove('is-hidden');
        } else {
            scroller.classList.add('is-hidden');
        }
    });

    scrollerBtn.addEventListener('click', scrollToTop);
});


document.addEventListener('DOMContentLoaded', () => {
    const headerMain = document.querySelector('.main-header');
    let lastScrollY = 0;

    const handleScroll = () => {
        const scrollY = window.scrollY;
        headerMain.classList.toggle('fixed', scrollY > 500);
        lastScrollY = scrollY;
    };

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });
});