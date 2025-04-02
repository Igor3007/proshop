class Cart {
    constructor(paraps) {
        this.$el = paraps.el
        this.selectAll = this.$el.querySelector('[data-cart="select-all"]')
        this.removeAll = this.$el.querySelector('[data-cart="remove-selected"]')
        this.items = this.$el.querySelectorAll('.cart-item')
        this.popupConfirm = null
        this.popupContainer = null
        this.timeout = 15000
        this.init()
    }

    init() {
        this.addEvents()
    }

    startTimer(duration, display) {
        let timer = duration - 1,
            minutes, seconds;
        let instanceTimer = setInterval(() => {

            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(instanceTimer)
            }
        }, 1000);
    }

    removeConfirm(data) {
        return `
            <div class="remove-confirm" >
                <div class="remove-confirm__close" ></div>
                <div class="remove-confirm__icon" >
                    <span>Товар удален из корзины</span>
                </div>
                <div class="remove-confirm__name" >${data.name}</div>
                <div class="remove-confirm__recovery" >
                    <button class="btn" >Восстановить</button>
                </div>
                <div class="remove-confirm__time" >00:${(this.timeout/1000)}</div>
                
            </div>
        `;
    }

    removeAjax(items) {

        let product_id = Array.from(items).map(item => item.dataset.id)

        // ajax запрос на удаление из корзины
        console.log(product_id)
        console.log('Товар удален из корзины')
    }

    removeItem(items) {
        let popupConfirm = document.createElement('div')
        popupConfirm.innerHTML = this.removeConfirm({
            name: items.length > 1 ? 'Удалено товаров: (' + items.length + ')' : items[0].querySelector('.cart-item__name').innerText
        })
        this.startTimer((this.timeout / 1000), popupConfirm.querySelector('.remove-confirm__time'))

        if (!this.popupContainer) {
            this.popupContainer = document.createElement('div')
            this.popupContainer.classList.add('confirm-container')
            document.body.append(this.popupContainer)
        }

        this.popupContainer.append(popupConfirm)


        items.forEach(item => {
            item.classList.add('is-hide-animate')
            setTimeout(() => {
                item.classList.add('is-hide')
            }, 600)
        })

        let timer = setTimeout(() => {
            this.removeAjax(items)
            popupConfirm.remove()
        }, this.timeout)

        popupConfirm.querySelector('.btn').addEventListener('click', () => {
            clearTimeout(timer)
            popupConfirm.remove()
            items.forEach(item => {
                item.classList.toggle('is-hide', false)
                item.classList.toggle('is-hide-animate', false)
            })
        })

        popupConfirm.querySelector('.remove-confirm__close').addEventListener('click', () => {
            popupConfirm.remove()
        })


    }

    removeSelected() {
        let result = [];

        this.items.forEach(item => {
            if (item.querySelector('[type="checkbox"]').checked) {
                result.push(item)
            }
        })

        this.removeItem(result)

    }

    addEvents() {
        this.selectAll.addEventListener('change', () => {
            this.items.forEach(item => {
                item.querySelector('[type=checkbox]').checked = this.selectAll.checked
            })
        })

        this.items.forEach(item => {
            item.querySelector('[data-cart="remove"]').addEventListener('click', () => {
                this.removeItem([item])
            })
        })

        this.removeAll.addEventListener('click', () => {
            this.removeSelected()
        })
    }
}

document.addEventListener('DOMContentLoaded', function (event) {

    /* =================================
    init cart
    =================================*/

    document.querySelectorAll('.cart').forEach(el => {
        new Cart({
            el
        })
    })

    /* ==================================
    show-hide 
    ==================================*/

    if (document.querySelector('.aside-dropdown__title')) {
        document.querySelector('.aside-dropdown__title').addEventListener('click', (e) => {
            e.target.closest('.aside-dropdown').classList.toggle('is-open')
        })
    }

});