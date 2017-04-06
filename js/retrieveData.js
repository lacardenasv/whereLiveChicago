//Locations have all latitud and longitud of the posible rent house
//Global variables
var locations=[];
var name_address=[]  ;
var unsafe_locations=[];
//callbacks functions
function fdataHouse(response){
    
    $.map(response, function (house, index) {
       
        //there are some fields are undefined so i should use if 
        if ((typeof house.longitude !== 'undefined') && (typeof house.latitude !== 'undefined') ){
             
            locations.push({
            
                latitude: house.latitude,
                longitude: house.longitude
            });
 
            name_address.push({
                name: house.property_name,
                address: house.address
            });

        }
        
    })
    //console.log(locations.length);

    initMap(locations, name_address);
    
}

function fdataCrime(response){
    
    //console.log('works');
    $.map(response, function(crime, index){
  
            unsafe_locations.push({
                latitude: crime.latitude,
                longitude: crime.longitude
            })
        
         
    });
//console.log(unsafe_locations.length);   
}
    
    
   



function fdataPrice(response){
    
}

function fdataWeather(response){
    
}



//This function works for all dataset , except Zillow , this help me to retrieve the data 
 function loadDataset(url, callback) {
    
   $.ajax(url, {

        type: 'GET',
        timeout:6000,
        dataType:'json',
        contentType:'aplication/json',
        success: callback,
        async: false
        
   })      
 }

/**
 * 
 * CRITERIOS MAS IMPORTANTES : SEGURIDAD Y PRESUPUESTO
   Criterios: Centros de salud cercanos, cercanía a la universidad, modos de transporte, clima, lugares de ocio
    

*/
//Map fucntion    
function initMap(locations, name_address){
    
    var location= new google.maps.LatLng(41.8708, -87.6505);
    var name= 'Departament of Computer Science – University of Illinois, Chicago';
    var imagePordue= {url: 'img/university.png', scaledSize: new google.maps.Size(35, 35)}
    var imageHouse= {url: 'img/house.png', scaledSize: new google.maps.Size(32, 32)}
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: location,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    //locating houses
    for (var i=0 ; i< locations.length; i++) {
        var lat= locations[i].latitude;
        var long= locations[i].longitude;
        var latLng= new google.maps.LatLng(lat, long);
        var market= new google.maps.Marker({
            position: latLng,
            map: map,
            icon: imageHouse
        });

        
        
        var content= name_address[i].name + ', Address: '+name_address[i].address;
        var info = new google.maps.InfoWindow();
        
        google.maps.event.addListener(market,'click', (function(market,content,info){ 
            return function() {
                //look if house is unsave 
                var origin = market.position;
                var destinations1=[];
                //
                for (var i = 0; i < 25; i++) {
                    destinations1.push( new google.maps.LatLng(unsafe_locations[i].latitude, unsafe_locations[i].longitude))
                }
                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: destinations1,
                    travelMode: 'TRANSIT',
                 
                }, is_unsave);

                function is_unsave(response, status) {
                    $('#guardian').prepend('<img id="guardian" src="img/guardian.png" />');
                }

            };
        })(market,content,info)); 
        google.maps.event.addListener(market, 'mouseover', (function(market,content,info) {
            return function () {
                info.setContent(content);
                info.open(map,market);
              }
        })(market,content,info));

        google.maps.event.addListener(market, 'mouseout', (function(market,content,info) {
            return function () {
                
                info.close(map,market);
              }
        })(market,content,info));
                
    }
    
    //departament computers
    var marker = new google.maps.Marker({ //Line 1
        position: location, //Line2: Location to be highlighted
            map: map,//Line 3: Reference to map object
            icon: imagePordue 
    })
    
    //infoDepartament
    var infoWindow = new google.maps.InfoWindow({
        content: name
    });

    //map listenersDepartament

    // about event departament computers...
    google.maps.event.addListener(marker, 'mouseover', function() {
      
      infoWindow.open(map,marker);

    });
    google.maps.event.addListener(marker, 'mouseout', function() {
      
      infoWindow.close(map,marker);

    });
};

 // window.addEventListener('load', initMap);

$(document).ready(function(){
    

    //var dataHouse= new loadDataset(' http://www.zillow.com/webservice/GetSearchResults.htm?zws-id='+ key ,1);
    var dataRentHouse= new  loadDataset('https://data.cityofchicago.org/resource/uahe-iimk.json', fdataHouse);
    var dataCrime= new loadDataset('https://data.cityofchicago.org/resource/dfnk-7re6.json', fdataCrime);
    // var dataPrice= new loadDataset(); 
    //var dataWeather= new loadDataset(); 

    

});
