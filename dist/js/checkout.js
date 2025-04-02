document.addEventListener('DOMContentLoaded', function (event) {

    /*================================== 
    step tabs
    ==================================*/

    class TabsCheckout {
        constructor(params) {

            this.params = params
            this.nav = document.querySelector(params.nav)
            this.container = document.querySelector(params.container)
            this.currentSlide = 0
            this.maxSlide = null

            this.init()
        }

        init() {
            this.maxSlide = Array.from(this.nav.children).length
            this.addEvents()
        }

        next() {
            if (this.currentSlide < this.maxSlide) {
                this.currentSlide++
                this.changeTab(this.currentSlide)
            }
        }

        prev() {
            if (this.currentSlide > 0) {
                this.currentSlide--
                this.changeTab(this.currentSlide)
            }
        }

        changeTab(index) {
            Array.from(this.container.children).forEach((el, i) => {
                el.classList.toggle('is-active', i == index)

                if (this.params.onChange && i == index) {
                    this.params.onChange(el, index)
                }
                this.currentSlide = index
            })

            Array.from(this.nav.children).forEach((el, i) => {
                el.classList.toggle('is-active', i == index)
            })
        }


        addEvents() {
            Array.from(this.nav.children).forEach((item, index) => {
                item.addEventListener('click', () => {
                    this.changeTab(index)
                })
            })
        }
    }


    class loadMapPointPickup {
        constructor() {
            this.$el = document.querySelector('.checkout-pickup')
            this.map = null;
            this.points = []
            this.init()
        }

        init() {
            window.loadApiYmaps((ymaps) => {
                this.initMap(ymaps)
            })

            this.createPointsArray()
            this.addEvents()
        }

        initMap() {
            ymaps.ready(() => {


                this.map = new ymaps.Map('map', {
                    center: [55.76, 37.64],
                    zoom: 14,
                    controls: ['zoomControl'],

                }, {
                    searchControlProvider: 'yandex#search',
                    suppressMapOpenBlock: true,
                    zoomControlPosition: {
                        right: 32,
                        top: 32
                    },

                });


                this.createPlacemark()



            })
        }

        createPointsArray() {
            this.$el.querySelectorAll('[data-coordinates]').forEach(item => {
                this.points.push({
                    coordinates: item.dataset.coordinates.split(',')
                })
            })
        }

        createPlacemark() {

            console.log(this.points)

            this.points.forEach(item => {

                const myPlacemark = new ymaps.Placemark(item.coordinates, {
                    hintContent: '',
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: '/img/svg/ic_pin.svg',
                    iconImageSize: [60, 68],
                    iconImageOffset: [-30, -68]
                });

                this.map.geoObjects.add(myPlacemark)
            })


            this.map.setBounds(this.map.geoObjects.getBounds());
            this.map.setZoom(this.map.getZoom() - 1);

        }

        setCenterPoint(index) {
            this.map.setCenter(this.points[index]['coordinates'])
            this.map.setZoom(17)
        }

        addEvents() {
            this.$el.querySelectorAll('[data-coordinates]').forEach((item, index) => {
                item.addEventListener('click', () => {
                    this.setCenterPoint(index)

                    this.$el.querySelectorAll('[data-coordinates]').forEach((el, i) => {
                        el.classList.toggle('is-active', i == index)
                    })
                })
            })
        }

    }

    /* ==========================================
       suggest input
     ========================================== */

    class inputSuggest {

        constructor(option) {
            this.option = option
            this.elem = option.elem
            this.maxHeightSuggestList = this.option.maxHeightSuggestList || false
            this.list = document.createElement('ul');
            this.init()
        }

        init() {
            this.createSuggestList()
            this.addEvent()

            if (this.maxHeightSuggestList) {
                this.list.style.maxHeight = this.maxHeightSuggestList
            }
        }

        createSuggestList() {


            if (this.elem.dataset.url) {
                this.loadSuggestElem(this.elem.dataset.url, (arr) => {
                    this.renderSuggestList(arr)
                })
            } else {
                if (this.option.on.listHadler) {
                    this.option.on.listHadler(this)
                } else {
                    this.renderSuggestList([{
                        text: 'no result',
                        value: '0',
                    }])
                }
            }




        }

        renderSuggestList(arr) {

            this.list.querySelectorAll('li').forEach((removeItem) => {
                removeItem.remove()
            })

            arr.forEach((item) => {
                let li = document.createElement('li')
                li.innerText = item.text
                li.setAttribute('rel', item.value)

                this.eventListItem(li)
                this.list.append(li)
            })

            this.list.classList.add('suggest-list')
            this.mountList()
        }

        mountList() {

            if (this.elem.parentNode.querySelector('.suggest-list')) {
                this.elem.parentNode.querySelector('.suggest-list').remove()
            }

            this.elem.parentNode.append(this.list)

        }

        loadSuggestElem(url, callback) {
            window.ajax({
                type: 'GET',
                responseType: 'json',
                url: url
            }, function (status, response) {
                callback(response)
            })
        }

        changeInput(event) {

            let value = event.target.value.toLowerCase()

            if (this.elem.dataset.url) {

                this.list.style.display = 'initial'

                this.list.querySelectorAll('li').forEach(function (li) {

                    if (li.classList.contains('hide')) {
                        li.classList.remove('hide')
                    }

                    if (li.innerText.toLowerCase().indexOf(value) == -1 && value.length) {
                        li.classList.add('hide')
                    }
                })

                //update list
                this.mountList()
            } else {
                this.option.on.listHadler(this)
            }
        }

        closeList() {
            this.list.style.display = 'none'

            if (!this.elem.value.length) {
                this.elem.removeAttribute('area-valid')
                if (this.option.on.change) {
                    this.option.on.change('', false)
                }
            }

        }
        openList() {
            this.list.style.display = 'block'
            this.elem.setAttribute('area-valid', true)
            this.createSuggestList()
        }

        debounce(func, wait, immediate) {
            var timeout;

            return function () {

                var context = this,
                    args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) {
                        console.log('immediate::');
                        func.apply(context, args);
                    }
                }

                var callNow = immediate && !timeout;
                clearTimeout(timeout);

                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            }
        }

        addEvent() {

            const debounceKeyup = this.debounce((e) => {
                this.changeInput(e)
            }, 300)

            this.elem.addEventListener('keyup', debounceKeyup)

            this.elem.addEventListener('focus', (event) => {
                this.openList()
            })

            this.elem.addEventListener('click', (event) => {
                event.stopPropagation()
            })

            this.elem.addEventListener('blur', () => {
                setTimeout(() => {
                    this.closeList()
                }, 100)
            })
        }

        eventListItem(li) {
            li.addEventListener('click', (event) => {
                this.elem.setAttribute('area-valid', true)
                this.elem.value = event.target.innerText
                this.closeList()

                if (this.option.on.change) {
                    this.option.on.change(event.target.innerText, event.target.getAttribute('rel'))
                }
            })
        }

    }

    if (document.querySelector('.checkout__steps-nav')) {
        const STEPS = new TabsCheckout({
            nav: '.checkout__steps-nav ul',
            container: '.checkout__steps-content',
            onChange: (el, index) => {

                if (index == 1 && !window.mapPointPickup) {
                    //init pickup  
                    window.mapPointPickup = new loadMapPointPickup()
                }

                if (index == 1) {
                    //init suggest 

                    setTimeout(() => {
                        window.loadApiYmaps((ymaps) => {
                            el.querySelectorAll('.input--suggest input').forEach((input) => {
                                new inputSuggest({
                                    elem: input,
                                    on: {
                                        listHadler: function (inst) {

                                            if (!inst.elem.value.length) {
                                                return false
                                            }

                                            ymaps.ready(() => {
                                                ymaps.suggest(inst.elem.value).then(
                                                    (items) => {

                                                        console.log(items)

                                                        const suggestArray = items.map(elem => ({
                                                            text: elem.displayName,
                                                            value: elem.value,
                                                        }));
                                                        inst.renderSuggestList(suggestArray)
                                                    },

                                                    (error) => {
                                                        console.err('Error inputSuggest ' + error)
                                                    }

                                                )

                                            })
                                        }
                                    }
                                });

                            })



                        })
                    }, 500)


                }

                //hide aside

                document.querySelector('.checkout__aside').classList.toggle('is-open', index == 2)
                document.querySelectorAll('.checkout__steps-nav ul li').forEach((item, i) => {
                    item.classList.toggle('is-complete', i < index)
                })
            }
        })

        document.querySelectorAll('[data-next-step]').forEach(el => {
            el.addEventListener('click', e => STEPS.next())
        })
        document.querySelectorAll('[data-prev-step]').forEach(el => {
            el.addEventListener('click', e => STEPS.prev())
        })
    }

    if (document.querySelector('.checkout-user__tabs')) {
        new TabsCheckout({
            nav: '.checkout-user__tabs ul',
            container: '.checkout-user__tabs-container'
        })
    }

    if (document.querySelector('.checkout-delivery__tabs')) {
        new TabsCheckout({
            nav: '.checkout-delivery__tabs',
            container: '.checkout-delivery__content',

        })
    }

    /* ==================================
    select
    ==================================*/

    const selectCustom = new afSelect({
        selector: 'select'
    })

    selectCustom.init()

    /* ==================================
    show-hide 
    ==================================*/

    if (document.querySelector('.aside-dropdown__title')) {
        document.querySelector('.aside-dropdown__title').addEventListener('click', (e) => {
            e.target.closest('.aside-dropdown').classList.toggle('is-open')
        })
    }


});