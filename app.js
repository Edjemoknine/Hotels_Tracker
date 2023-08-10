let map;
let bound;
async function initMap() {
    let center={ lat: 36.20342, lng: 1.2680696 };
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("mapContainer"), {
    
    center,
    zoom: 6,
    disableDefaultUI:true});

    bound = new google.maps.LatLngBounds()

}

window.initMap=initMap;

// **********************************************************
let country = document.querySelector('#country');
let language = document.querySelector('#language');
let listC = document.querySelector('#auto');
let LangUL = document.querySelector('#lg');
let form = document.querySelector('form');

country.addEventListener('click',()=>{
    language.value='';
    if(country){country.value=''}

})

form.addEventListener('submit', async(e)=>{
    e.preventDefault();
    let location =country.value ;
    language.value=''
    listC.classList.remove('active')
    await initMap()
    await GetHotels(location);
    
})
country.addEventListener('input', async(e)=>{

    let location=e.target.value
    let Countries= await FetchCountries()
    let selectCountries = Countries.filter((country)=> 
    country.name.toLowerCase().startsWith(location));
    listC.classList.add('active')
    listC.innerHTML='';
    selectCountries.map((countryA)=>{
        listC.innerHTML+=`
        <li>${countryA.name}</li>`;

        listC.querySelectorAll('li').forEach((count)=>{
            count.addEventListener('click',()=>{
            
                country.value=count.innerHTML;
                language.value=''
                listC.classList.remove('active')
            })
        })
    })
if(country.value==''){
    listC.classList.remove('active')
}

})

language.addEventListener('click',()=>{
    country.value='';
    LangUL.classList.toggle('active')
    
})
// **********************************************************
// ******************** Fetch Geolocation ******************

let FetchCountries = async ()=>{

    const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/countries?limit=10&offset=20';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '6c2a704035mshed3f3f412f5f9aap1c236bjsnbaf789e00c56',
		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
    let countries=result.data;
	// console.log(countries);
    
    selectCountry(countries);
    return countries;
    
} catch (error) {
	console.error(error);
}
}
FetchCountries();


// ******************** Add Countries to Dom ****************
function selectCountry(countries){
    LangUL.innerHTML='';
    countries.forEach((count)=>{
        let li=document.createElement('li');
        li.className='country';
        li.innerText=count.name;
        LangUL.appendChild(li);
    })
    

    LangUL.querySelectorAll('.country').forEach((country)=>{
        country.onclick=async()=>{
    
            language.value=country.innerHTML
            LangUL.classList.remove('active');
           await initMap()
           await GetHotels(country.innerText);
        }
    })
}

// **********************************************************
// ************* Fetch Hotels *******************************
let GetHotels = async (location)=>{

const url = `https://hotels4.p.rapidapi.com/locations/v3/search?q=${location}`;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '6c2a704035mshed3f3f412f5f9aap1c236bjsnbaf789e00c56',
		'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
	}
};
try {
	const response = await fetch(url, options);
	const result = await response.json();
    
    let Hotels=result.sr;
    getPosition(Hotels)

} catch (error) {
	console.error(error);
}
}

// *********************************Mapping position *********
let  getPosition =(Hotels)=>{

    Hotels.map((hotel ,i)=>{
        const {coordinates}=hotel;
        let centerPo={ lat:+coordinates.lat, lng:+coordinates.long };
    
        new google.maps.Marker({
            position:centerPo,
            label:`${i+1}`,
            map
        })
        bound.extend(new google.maps.LatLng(centerPo))
        map.fitBounds(bound);
    })
}

// *********************************************************
// *********************************************************