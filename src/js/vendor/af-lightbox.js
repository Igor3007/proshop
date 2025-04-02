class afLightbox {
    constructor(opion) {

        this.modal = '';
        this.instanseIndex = null;
        if (opion) {
            this.mobileBottom = (opion.mobileInBottom ? opion.mobileInBottom : false)
            this.clases = (opion.clases ? opion.clases : null)
        }

        this.init()
    }

    init() {

        if (typeof window.afLightbox == 'undefined') {
            window.afLightbox = {
                items: [],
                close: null,
                closeAll: null
            };
        }

        window.afLightbox.items.push(this);
        this.instanseIndex = (window.afLightbox.items.length - 1)

        window.afLightbox.closeAll = () => {
            window.afLightbox.items.forEach(el => el.close())
            window.afLightbox.items = [];
        }

        window.afLightbox.close = () => {
            window.afLightbox.items[(window.afLightbox.items.length - 1)].close()
        }

    }

    createTemplate() {
        let template = document.createElement('div')
        template.innerHTML = `<div class="af-popup ${this.clases} "> <div class="af-popup__bg"></div><div class="af-popup__wrp"><div class="af-popup__container"><div class="af-popup__close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"></path></svg></div><div class="af-popup__content"></div></div></div></div>`
        document.body.append(template)
        this.instanse = template;
        return template;
    }

    open(content, afterShow) {

        let _this = this;
        this.modal = this.createTemplate();

        if (window.innerWidth <= 480 && this.mobileBottom) {
            this.modal.querySelector(".af-popup").classList.add("af-popup--mobile")
        }

        document.body.classList.add('page-hidden')

        this.modal.querySelector('.af-popup__content').innerHTML = content
        this.modal.querySelector('.af-popup__close').addEventListener('click', function () {
            _this.close()
        })

        if (this.modal.querySelector('[data-af-popup="close"]')) {
            this.modal.querySelector('[data-af-popup="close"]').addEventListener('click', function (e) {
                _this.close()
            })
        }

        if (afterShow) afterShow(this.modal);

        setTimeout(() => {
            this.modal.querySelector(".af-popup").classList.add("af-popup--visible")
        }, 10)

        this.createEvent();

    }

    changeContent(content) {
        this.modal.querySelector('.af-popup__content').innerHTML = content
    }

    createEvent() {

        let _this = this

        this.instanse.querySelector('.af-popup').addEventListener('click', function (e) {
            if (!e.target.closest('.af-popup__container')) {
                _this.close()
            }
        })

        // this.instanse.querySelector('.af-popup__container').addEventListener('click', function (event) {
        //     event.stopPropagation(true)
        // })
    }

    close() {


        if (document.body.classList.contains('page-hidden')) {
            document.body.classList.remove('page-hidden')
        }

        this.instanse.querySelector('.af-popup').classList.remove('af-popup--visible')

        setTimeout(() => {
            this.instanse.remove()
            window.afLightbox.items.splice(this.instanseIndex, 1)
        }, 300)


    }
}