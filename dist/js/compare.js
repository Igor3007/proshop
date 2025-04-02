 /* =====================================
    compare slider
    =====================================*/

 class CompareSlider {

     constructor(elem) {
         this.elem = elem
         this.container = this.elem.querySelector('.compare__content')
         this.items = this.container.querySelectorAll('.minicard')

         this.containerW = this.elem.querySelector('.compare__content')
         this.containerTable = this.elem.querySelector('.compare__content table')
         this.leftPX = 0
         this.itemWidth = this.items[0].clientWidth + 21

         this.nav = {
             next: this.elem.querySelector('[data-se-slider="next"]'),
             prev: this.elem.querySelector('[data-se-slider="prev"]'),
         }
         this.activeSlide = 0

         this.init();

     }

     init() {
         this.addEvent()
         this.nav.prev.dataset.state = '0'

         if (this.container.scrollWidth <= this.container.offsetWidth) {
             this.nav.next.dataset.state = '0'
         }
     }

     update() {

         if (this.container.scrollWidth <= this.container.offsetWidth) {
             this.nav.next.dataset.state = '0'
         } else {
             this.nav.next.dataset.state = '1'
         }



     }

     scrollElement(container, stepOffset, _this) {

         _this.leftPX = this.container.scrollLeft + Number(stepOffset)

         container.scrollTo({
             left: _this.leftPX,
             behavior: 'smooth'
         });

     }

     changeSlide() {

         this.items.forEach(item => {
             if (item.classList.contains('active'))
                 item.classList.remove('active')
         })

         if (this.items.length) {
             this.items[this.activeSlide].classList.add('active')
             this.scrollElement(this.container, this.items[this.activeSlide], this)
         }
     }

     nextSlide() {

         if (this.leftPX < (this.containerTable.clientWidth - this.containerW.clientWidth) - 20) {
             this.scrollElement(this.container, this.itemWidth, this)
         }

     }

     prevSlide() {
         this.scrollElement(this.container, -this.itemWidth, this)
     }

     addEvent() {
         this.nav.next.addEventListener('click', () => {
             this.nextSlide()

             console.log('next')
         })
         this.nav.prev.addEventListener('click', () => {
             this.prevSlide()

             console.log('prev')
         })

         this.container.addEventListener('scroll', (e) => {
             this.nav.prev.dataset.state = (e.target.scrollLeft < 10 ? '0' : '1')
             this.nav.next.dataset.state = ((e.target.scrollWidth - (this.container.offsetWidth + 50) <= e.target.scrollLeft) ? '0' : '1')

             if (e.target.scrollLeft < 10) {
                 this.activeSlide = 0
             }
         })
     }

 }



 if (document.querySelector('.compare')) {

     document.querySelectorAll('.compare').forEach(item => {
         item['compareSlider'] = new CompareSlider(item)
     })

     /* ====================================
    hide similar prop
    ====================================*/

     if (document.querySelector('[data-similar]')) {

         const toggle = document.querySelectorAll('[data-similar] input')
         const props = document.querySelectorAll('.product-table__prop')

         toggle.forEach(item => {
             item.addEventListener('change', e => {
                 !e.target.checked ? showSimilarProp() : hideSimilarProp()
             })
         })

         function showSimilarProp() {
             props.forEach(prop => {
                 if (prop.classList.contains('hide-prop-tbody')) {
                     prop.classList.remove('hide-prop-tbody')
                 }
             })
         }

         function hideSimilarProp(prop) {
             props.forEach(prop => {
                 const arr = new Set()
                 prop.querySelectorAll('td').forEach(td => {
                     arr.add(td.innerText)
                 })

                 if (arr.size <= 2) {
                     prop.classList.add('hide-prop-tbody')
                 }
             })
         }

     }

     /* ===========================================
     similar clear 
     ===========================================*/
     if (document.querySelector('[data-similar="clear"]')) {
         document.querySelector('[data-similar="clear"]').addEventListener('click', e => {

             const url = e.target.closest('[data-similar]').dataset.url

             const instansePopup = new afLightbox({
                 mobileInBottom: true
             })

             const html = `
                <div class="popup-confirm" data-form-success="remove">
                    <div class="popup-confirm__title">Внимание!</div>
                    <div class="popup-confirm__desc">Вы действительно хотите <br> очиcтить список сравнения?</div>
                    <div class="popup-confirm__btns">
                        <button class="btn btn-small" data-dialog="success">Удалить</button>
                        <button class="btn btn-small btn-gray" data-af-popup="close">Отмена</button>
                    </div>
                </div>
             `;

             instansePopup.open(html, (instanse) => {
                 instanse.querySelector('[data-dialog="success"]').addEventListener('click', e => {
                     window.location.href = url
                     instansePopup.close()
                 })
             })
         })
     }

     /* ===========================================
     similar share 
     ===========================================*/
     if (document.querySelector('[data-similar="share"]')) {
         document.querySelector('[data-similar="share"]').addEventListener('click', e => {
             const url = e.target.closest('[data-similar]').dataset.url

             const instansePopup = new afLightbox({
                 mobileInBottom: true
             })

             const html = `
           <div class="popup-confirm" data-form-success="remove">
               <div class="popup-confirm__title">Поделиться списком сравнения</div>
               <div class="popup-confirm__desc">Скопируйте ссылку и отправте друзьям!</div>
               <div class="popup-confirm__form">
                    <textarea cols="40" ></textarea>
               </div>
               <div class="popup-confirm__btns">
                    <button class="btn btn-small" data-copy="link" >Скопировать в буфер</button>
                    <button class="btn btn-small btn-gray" data-af-popup="close">Закрыть</button>
               </div>

           </div>
        `;

             instansePopup.open(html, (instanse) => {
                 instanse.querySelector('textarea').value = url
                 instanse.querySelector('[data-copy="link"]').addEventListener('click', e => {
                     navigator.clipboard.writeText(url)
                         .then(() => {
                             window.STATUS.msg('Ссылка скопирована в буфер обмена!')
                         })
                         .catch(err => {
                             console.log('Something went wrong', err);
                         });

                 })
             })
         })
     }

     /* ================================
     rotate device info
     ================================*/

     if (document.querySelector('.compare__info')) {
         let container = document.querySelector('.compare__info')
         let clearBtn = container.querySelector('.rotate-device__close')

         if (!localStorage.getItem('rotate-device-info')) {
             container.classList.add('is-visible')
         }

         clearBtn.addEventListener('click', e => {
             !container.classList.contains('is-visible') || container.classList.remove('is-visible')
             localStorage.setItem('rotate-device-info', 'close')
         })
     }

 }