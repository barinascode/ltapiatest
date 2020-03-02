var courses = window._courses
var filterCourses = new Set([])

var images_server = (param) => {
    return `https://techtransit.com/mission.courses/${param}`
}

var CreditValues = new Set([])
var RatingValues = new Set([])
var PriceValues = new Set([])

var CreditFilterIndex = null;
var RatingFilterIndex = null;
var PriceFilterIndex = null;



    function setControls(){


        var creditsFilterQTY = document.getElementById('creditsFilterQTY')
        creditsFilterQTY.max = CreditValues.length - 1
        var creditsFilterOutput = document.getElementById('creditsFilterOutput')
        creditsFilterQTY.oninput = function(){
            CreditFilterIndex = this.value
            creditsFilterOutput.innerHTML = CreditValues[ this.value ]
            applyFilters()
        }


        var ratingFilterQty = document.getElementById('ratingFilterQty')
        ratingFilterQty.max = RatingValues.length - 1
        var ratingFilterOutput = document.getElementById('ratingFilterOutput')
        ratingFilterQty.oninput = function(){
            RatingFilterIndex = this.value
            ratingFilterOutput.innerHTML = RatingValues[ this.value ]
            applyFilters()
        }
        

        var priceFilterQty = document.getElementById('priceFilterQty')
        priceFilterQty.max = PriceValues.length - 1
        var priceFilterOutput = document.getElementById('priceFilterOutput')
        priceFilterQty.oninput = function(){
            PriceFilterIndex = this.value
            priceFilterOutput.innerHTML = PriceValues[ this.value ]
            applyFilters()
        }

        ratingFilterQty.oninput()
        creditsFilterQTY.oninput()
        priceFilterQty.oninput()

    }



    function setFiltersValues(){

        courses.forEach(item => {
            CreditValues.add(parseFloat(item.maximumCredits))
            RatingValues.add(Math.round(item.rating))
            PriceValues.add(item.price)
        });

        CreditValues    =   [ ...CreditValues.values() ].sort( function(a, b){ return a - b } )
        RatingValues    =   [ ...RatingValues.values() ].sort( function(a, b){ return a - b } )
        PriceValues     =   [ ...PriceValues.values() ].sort( function(a, b){ return a - b } )

    }



    function setShowing(){
        
        let showingQty = [...filterCourses.values()].length
        let resultsQty = courses.length

        document.getElementById('showingQty').innerHTML = showingQty
        document.getElementById('resultsQty').innerHTML = resultsQty

    }



    function applyFilters(){

        filterCourses = new Set([])
        
            courses.forEach( item => {
                if( item.maximumCredits >= CreditValues[CreditFilterIndex] && !filterCourses.has(item)){
                    if( item.rating >= RatingValues[RatingFilterIndex]  && !filterCourses.has(item)){
                        if( parseFloat(item.price) >= PriceValues[PriceFilterIndex]  && !filterCourses.has(item)){
                            filterCourses.add(item)
                        }
                    }
                }
            })

        setShowing()

        render('app') // <--- Redraw function
    }


    const ratingTemplate = (rating) => {

        rating = Math.round(rating)
        let result = ``

        for(i=0; i <= 4; i++){

            result += /* html */ `
            <span class="icon-rating">
                <i data-eva="star" data-eva-fill="${( i >= rating ) ? '#c1c1c1': '#ffd365' }" data-eva-animation="zoom"></i>
            </span>`
        }

        return result 
    }



    const cardTemplate = (item) => {

        return  /* html */ `
        <article class="card ${ ( item.price ) ? 'card-silver' : 'card-green'  }">
            <div class="card-header">
                <div class="card-thumnail">
                    <picture>
                        <source srcset="${images_server(item.imageUrl)}" media="(max-width: 768px)">
                        <source srcset="${images_server(item.imageUrl)}" >
                        <img srcset="${images_server(item.imageUrl)}" alt="${item.imageText}">
                    </picture>
                </div>
                <div class="card-title">
                    <h3>${item.name}</h3>
                    <span class="card-credits">${parseFloat(item.maximumCredits)} Credits</span>
                    <span class="card-price">${ ( item.price ) ? '$'+item.price : 'free'  }</span>
                </div>
            </div>
            <div class="card-body">
                <div class='description'>
                    ${item.description}
                </div>
                <div class='rating-stars'>
                    ${ratingTemplate(item.rating)}
                </div>
            </div>
        </article>
    `
    }



    function render(id){
        document.getElementById(id).innerHTML = [ ...filterCourses.values() ].map( cardTemplate ).join('')
        eva.replace()
    }


    window.onload = ()=>{
        setFiltersValues()
        setControls()
        render('app')
    };