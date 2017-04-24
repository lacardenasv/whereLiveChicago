//Locations have all latitud and longitud of the posible rent house
//Global variables
var AVAILABLE= false;
var locations1=[];
var safe_locations=[];
var libraries=[];
var station_police=[];
var parks=[];
var health_centers=[];
var bars=[];
var community_areas=[];
var crimes=[];
var price_best= Infinity;
var json_data=[];
//callbacks functions
function fdataHouse(response){
    $.map(response, function (house, index) {
        //there are some fields are undefined so i should use if
        if ((typeof house.longitude !== 'undefined') && (typeof house.latitude !== 'undefined') ){

            locations1.push({
                community_name: house.community_area,
                community_area: house.community_area_number,
                latitude: house.latitude,
                longitude: house.longitude,
                name: house.property_name,
                address: house.address,
                phone_number: house.phone_number,
                management_company: house.management_company
            });


        }

    })
    initMap(locations1);
}

function fdataCommunityA(response) {
   // console.log(response);
    $.map(response , function (community, index) {
        community_areas.push({

            area_numbe: community.area_numbe,
            community: community.community,
            the_geom: community.the_geom,
            rate_save: 0,

        })

     })
}


function fdataCrime(response){
    //console.log(response);
    $.map(response, function(crime, index){
        crimes.push({
            id: index,
            community_area: crime.community_area
        })
    });
}



function fdataWeather(response){

    $('#weather').find('p').text('Today the weather is '+response.weather[0].main);

}

function fdataLibraries(response) {
    $.map(response, function(librarie, index){
        libraries.push({
            name: librarie.name_,
            address: librarie.address,
            location: librarie.location
        })
    })
}

function fdataPolice(response) {
    $.map(response, function (station, index) {
        station_police.push({
            address: station.address,
            phone: station.phone,
            location: {
                coordinates: [station.longitude, station.latitude]
            }
        })
    })
}
function fdataPark(response) {
    $.map(response, function (park, index) {
        //console.log(park.location);
        if ((typeof park.location !== 'undefined') ){
            parks.push({
                name : park.park_name,
                address: park.street_address,
                location:park.location
            })
        }
    })
}

function fdataHealth(response) {
    $.map(response, function (center, index) {
       // console.log(center.location);
        health_centers.push({
            name: center.site_name,
            type: center.clinic_type,
            address: center.street_address,
            location: {
                coordinates: [center.longitude, center.latitude]
            }
        })
    })
}

function fdataBar(response) {
    $.map(response, function (restaurant, index) {
        bars.push({
            address: restaurant.address,
            name: restaurant.dba_name,
            location:{
                coordinates:[restaurant.longitude,restaurant.latitude]
            }
        })
    })
}


function zillow(xml) {

    var amount;
    $response= $(xml).find('response');
    $results= $response.find('result');
    //console.log(xml);
    $.map($results, function (result,index) {
        var para= $('<p></p>');
        var rent= $(result).find('rentzestimate');
        var last_update= $(rent).find('last-updated');
        amount= $(rent).find('amount');
        if (typeof amount !== "undefined"){
            var price= para.text('Price: $'+amount.text()+ ' Last update: '+last_update.text());
            $('#prices').append(price);
            //best
            amount= parseFloat(amount.text());
            if(price_best>amount){
              price_best= amount;
              //console.log('price:'+ price_best);
            }
            //console.log(amount);
        }
    })
    //price_best=parseFloat(amount.text());

}
function climateOfficial(data) {
    //console.log(data);
    var precipi= data.results[data.results.length-1];
    //console.log(precipi);
    $('#weather').find('p').text('Precipitation: '+precipi.value);
}
//This function works for all dataset , except Zillow and Climate Official, this help me to retrieve the data
function loadDataset(url, callback) {

   $.ajax(url, {

        type: 'GET',
        timeout:6000,
        dataType:'json',
       // contentType:'aplication/json',
        success: callback,
        beforeSend: function () {
            $('.preloader-wrapper').addClass('active');
          },
        complete: function () {
            $('.preloader-wrapper').removeClass('active');
        }

   })
 }
//function retrieve data from zillow
function loadZillow(location) {

    var param0= location.address.split(" ").join('+');
    var param=param0.split('.').join('');

    var key='X1-ZWz1frg99ut91n_7yjzz';
    var proxy='https://cors-anywhere.herokuapp.com/';
    var url= 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id='+key+'&address='+param+'&citystatezip=Chicago&rentzestimate=true'

    $.ajax(proxy+url, {
        type: 'GET',
        contentType: 'text/xml',
        dataType: 'xml',
        async: false,
        success: zillow
    })
}

function loadClimate(url, callback) {
    $.ajax(url, {
        headers:{ token: 'gHlWYVHAWIRhqMjzUgRcviJjCjvaHwBB'},
        success: callback

    })
}

function rate_save() {

    for (var i = 0; i < community_areas.length; i++) {
        for (var j = 0; j < crimes.length; j++) {

            var inside= community_areas[i].area_numbe===crimes[j].community_area;
            if (inside){
                community_areas[i].rate_save=(community_areas[i].rate_save+1);
            }
        }
    }
    return true;
}
 //filters functions
 function find_save(locations, mode) {
    safe_locations=[];
    //console.log(locations);
    if (!AVAILABLE){

        var rate= rate_save();
        AVAILABLE= rate;
    }
    $.map(locations, function(house, index){
        for( var i=0; i<community_areas.length;i++){
            if (house.community_area===community_areas[i].area_numbe) {
                if(community_areas[i].rate_save<20){
                    safe_locations.push(house);
                }
                break;
            }
        }
    })
    //console.log(safe_locations);
    if(mode==2){
        initMap(safe_locations);
    }
    return safe_locations;

 }
 function find_near(mode) {
    var locations_near=[];
    var name_near=[];
    var areaNear= new google.maps.Polygon({
        paths:[
            new google.maps.LatLng(41.896608, -87.635956),
            new google.maps.LatLng(41.894026, -87.693101),
            new google.maps.LatLng(41.852611, -87.694475),
            new google.maps.LatLng(41.849159, -87.616369)
        ]
    })

   for (var i=0 ; i< locations1.length; i++) {
       var latLng=  new google.maps.LatLng(locations1[i].latitude, locations1[i].longitude);
       var near= google.maps.geometry.poly.containsLocation(latLng, areaNear);

       if (near===true){
           locations_near.push(locations1[i]);
       }
    }
    if(mode==1){
        initMap(locations_near,name_near);
    }
    return locations_near;
 }

//MODE : is the way for know which map display.
function find_save_and_near(mode) {
    var near= find_near(mode);
    var safe_near= find_save(near, mode);
    return safe_near;
}
function best() {
    $('#showbest').on('click', function () {

        $('#bestHouse').modal('open');
        show_best();
    });

}
function show_best() {
    $('#prices').empty();
    $('#security').empty();

    var depart= new google.maps.LatLng(41.8708, -87.6505);
    var safe_near= find_save_and_near(3);
    var price_min= Infinity;
    var best;
    var candidates=[];
    for (var i = 0; i < safe_near.length; i++) {

        var current=safe_near[i];
        var latLng= new google.maps.LatLng(current.latitude, current.longitude);
        var origin= new google.maps.Marker({
            position: latLng,
            address: current.address,
            name: current.name,
            phone_number: current.phone_number,
            management_company: current.management_company,
            community_n: current.community_area,
            community_name: current.community_name
        });

        new loadZillow(origin);
      //  console.log(price_best);
        if (price_best< price_min){
            best=i;
            price_min= price_best;

        }
        candidates.push({
            house: origin,
            price: price_min
        })
    }

    var final= candidates[best].house;
    var content= final.name + ' THE BEST HOUSE';
    initMap2(final,content );
    detail_card(final,depart );
}
function filters(is_check) {
    //Any suggestions for this code? , I don't like it :(
    $('#filters').on('change', '.filled-in', function () {
        var filter= $(this);
        var id= filter.attr('id');

        if (id=='near'){
            if (filter.is(':checked')){
                is_check.near= true;

            }else{
                is_check.near= false;
            }
        }else if(id=='save'){

            if (filter.is(':checked')){
                is_check.save= true;

            }else{
                is_check.save= false;
            }
        }

        if(is_check.save===true && is_check.near===true){
            find_save_and_near(2);

        }else if(is_check.save===true){
            find_save(locations1, 2);
        }else if(is_check.near===true){
            find_near(1);
        }else{
            initMap(locations1);
        }


    })
 }
 function remove_add_components() {
    $('#map').addClass('hide');
    $('#map2').removeClass('hide');
    $('#chip').removeClass('hide');
    $('#search').addClass('hide');
    $('#restore').removeClass('hide');
    $('#place').removeClass('hide');
    $('#statistics1').addClass('hide');
    $('#statistics2').removeClass('hide');
    $('#statis1').addClass('hide');

 }

function  come_back_dom() {
   $('#restore').on('click', function(){
        $('#map').removeClass('hide');
        $('#map2').addClass('hide');
        $('#chip').addClass('hide');
        $('#search').removeClass('hide');
        $('#restore').addClass('hide');
        $('#place').addClass('hide');
        $('#places').trigger("reset");

        $('#statistics2').addClass('hide');
        $('#statistics1').removeClass('hide');
        $('#statis2').addClass('hide');
   });
}
function place_checked(area_near, map2) {
    var img_park= {url: 'img/park.png', scaledSize: new google.maps.Size(35, 35)};
    var img_police={url: 'img/police.png', scaledSize: new google.maps.Size(35, 35)};
    var img_health= {url: 'img/hospital.jpg', scaledSize: new google.maps.Size(35, 35)};
    var img_center= {url: 'img/restaurant.png', scaledSize: new google.maps.Size(35, 35)}

    $('#places').on('change', '.with-gap', function () {
        var place= $(this);
        var id= place.attr('id');
        if (place.is(':checked')) {
            switch (id) {
                case 'park':
                    load_places_near(area_near, parks, map2, img_park);
                    break;
                case 'police':
                    load_places_near(area_near, station_police, map2, img_police);
                    break;

                case 'health':
                    load_places_near(area_near, health_centers, map2, img_health);
                    break;

                case 'bars':
                    load_places_near(area_near, bars, map2, img_center);
                    break;
            }
        }
    })
}
//REFACTOR
function events_marker(market, content, map, info) {

    google.maps.event.addListener(market, 'mouseover', (function(market,content,info) {
        return function () {
            info.setContent(content);
            info.open(map2,market);
        }
    })(market,content,info));

    google.maps.event.addListener(market, 'mouseout', (function(market,content,info) {
        return function () {
            info.close(map2,market);
        }
    })(market,content,info));
}

//functions for a house
function load_places_near(area_near, locations ,map2, img) {
     for (var i = 0; i < locations.length; i++) {
        var lat=locations[i].location.coordinates[1];
        var lng=locations[i].location.coordinates[0];
        var latLng=  new google.maps.LatLng(lat , lng);
        var near= google.maps.geometry.poly.containsLocation(latLng, area_near);

        if (near===true){
           var market= new google.maps.Marker({
            position: latLng,
            map: map2,
            icon: img
            });
            var content= locations[i].name + ', Address: '+locations[i].address;
            var info = new google.maps.InfoWindow();

            var events= new events_marker(market, content, map2, info);
        }
    }
}

function initMap2(origin, content) {
    //function hide map1

    var depart= new google.maps.LatLng(41.8708, -87.6505);
    var name= 'Departament of Computer Science – University of Illinois, Chicago';
    var imagePordue= {url: 'img/university.png', scaledSize: new google.maps.Size(35, 35)}

    var dom_resfresh= new remove_add_components();
    var location= origin.position;

    var description= content;
    var origin_lat_lon= origin.position.toJSON();
    var imageOrigin= {url: 'img/house.png', scaledSize: new google.maps.Size(35, 35)}
    var imageLibra={url: 'img/libra.png', scaledSize: new google.maps.Size(40, 40)}
    var mapDiv= document.getElementById('map2');
    var map2= new google.maps.Map(mapDiv, {
        center: location,
        zoom: 14,
        MapTypeId: google.maps.MapTypeId.ROADMAP
    })
    //house
    var marker = new google.maps.Marker({ //Line 1
        position: location, //Line2: Location to be highlighted
        map: map2,//Line 3: Reference to map object
        icon: imageOrigin
    })

    var infoWindow = new google.maps.InfoWindow({
        content: description
    });

    var events= new events_marker(marker, description, map2, infoWindow);

    var depart_marker = new google.maps.Marker({ //Line 1
        position: depart, //Line2: Location to be highlighted
        map: map2,//Line 3: Reference to map object
        icon: imagePordue
    })
    //infoDepartament
    var infoWindow1 = new google.maps.InfoWindow({
        content: name
    });

    var events1= new events_marker(depart_marker, name, map2, infoWindow1);
    //area near
    var area= [
        {lat: origin_lat_lon.lat + 0.010871, lng: origin_lat_lon.lng + 0.013173 },
        {lat: origin_lat_lon.lat + 0.010598, lng: origin_lat_lon.lng - 0.014128  },
        {lat: origin_lat_lon.lat - 0.0105 , lng: origin_lat_lon.lng - 0.015669   },
        {lat: origin_lat_lon.lat - 0.010693, lng: origin_lat_lon.lng + 0.013942  }
    ];

    var area_near= new google.maps.Polygon({
        paths: area,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
   // area_near.setMap(map2);
    //places near
    var near_libra= new load_places_near(area_near,libraries,map2,imageLibra);
    var checked_place= new place_checked(area_near, map2);
    var come_back= new come_back_dom();

   $('#statistics2').on('click', function () {
        new details(origin, depart);
    });

}
function details(origin, depart){
       $('#prices').empty();
       $('#security').empty();
       new loadZillow(origin);
       detail_card(origin, depart);
}

function distance(origin, depart) {
    var origin1 = origin.position;
    var distance=0;
    var destination = depart;
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
    {
        origins: [origin1],
        destinations: [destination],
        travelMode: 'WALKING',

    }, callback);

    function callback(response, status) {

        distance= response.rows[0].elements[0].distance.text;
        var time= response.rows[0].elements[0].duration.text;

        $('#distance').text('Distance: '+ distance);
        $('#time').text('Travel time walking: '+ time);
        return distance
    }
}
function detail_card(origin, depart) {

    var phone= 'Phone: '+origin.phone_number;
    var manage='Management company: '+origin.management_company;
    var dista = new distance(origin, depart);
    var comuni_area= $('<p></p>');
    var crimes= $('<p></p>');
    var safe=0;

    //DOM traversing
    $('#statis2').removeClass('hide');
    $('.card-title').text(origin.name);
    $('#ad').text('Address: '+origin.address);
    $('#manage').text(manage);
    $('#phone').text(phone);
    $('#distance_depart').text()

    //crime secure
    if(!AVAILABLE){
        var rate= new rate_save();
        AVAILABLE= rate;
    }

    $.each(community_areas, function (index, community) {
        var n_com= parseInt(community.area_numbe);
        var origin_com= parseInt(origin.community_n);
        if(origin_com===n_com){
                safe= community.rate_save;
                return ;
        }
    })

    var secutirty= comuni_area.text('Community area: '+origin.community_name);
    var crimes_n= crimes.text("Crimes's Number in this area: "+ safe);

    $('#security').append(secutirty);
    $('#security').append(crimes_n);
    //face categorize the safe

    if( safe < 10){
        $('#face').attr('src', 'img/max_safe.png');
    }else if(10 <= safe && safe < 20){
        $('#face').attr('src', 'img/good.png');
    }else if(20 <= safe && safe <30 ){
        $('#face').attr('src','img/insecure.png');
    }else{
        $('#face').attr('src', 'img/danger.png');
    }
}


/**
 *
 * CRITERIOS MAS IMPORTANTES : SEGURIDAD Y PRESUPUESTO
   Criterios: Centros de salud cercanos, cercanía a la universidad, modos de transporte, clima, lugares de ocio


*/
//Map fucntion
function initMap(locations){
    var location= new google.maps.LatLng(41.8708, -87.6505);
    var name= 'Departament of Computer Science – University of Illinois, Chicago';
    var imagePordue= {url: 'img/university.png', scaledSize: new google.maps.Size(35, 35)}
    var imageHouse= {url: 'img/house.png', scaledSize: new google.maps.Size(32, 32)}
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: location,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    //locating houses
    for (var i=0 ; i< locations.length; i++) {
        var current= locations[i];
        var lat= current.latitude;
        var long= current.longitude;
        var latLng= new google.maps.LatLng(lat, long);
        var market= new google.maps.Marker({
            position: latLng,
            map: map,
            icon: imageHouse,
            address: current.address,
            name: current.name,
            phone_number: current.phone_number,
            management_company: current.management_company,
            community_n: current.community_area,
            community_name: current.community_name
        });

        var content= current.name + ', Address: '+current.address;
        var info = new google.maps.InfoWindow();

        google.maps.event.addListener(market,'click', (function(market,content,info){

            return function() {
                var origin = market.position;
                var places_near= new initMap2(market, content);

            };
        })(market,content,info));

        var events= new events_marker(market, content, map, info);


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
    var events1= new events_marker(marker, name, map, infoWindow);

   $('#statistics1').on('click', function () {
       $('#statis1').removeClass('hide');
       dataVizualization();
   })
};

 //DATA VISUALIZATION



 function dataVizualization(){
   //crear json con data

   if(!AVAILABLE){
       var rate= rate_save();
       AVAILABLE= rate;
   }

   $.map(locations1, function(house, index){
     for( var i=0; i<community_areas.length;i++){
         if (house.community_area===community_areas[i].area_numbe) {
               var position= new google.maps.LatLng(house.latitude, house.longitude);

               var destination = new google.maps.LatLng(41.8708, -87.6505);;
               var service = new google.maps.DistanceMatrixService();
               service.getDistanceMatrix(
               {
                   origins: [position],
                   destinations: [destination],
                   travelMode: 'WALKING',

               }, dista);

               function dista(response, status) {
                  if(typeof response !== 'undefined' && response !== null ){
                     var distance= response.rows[0].elements[0].distance.text;
                     var radio= parseFloat(distance.split()[0]);
                     console.log('que putas');
                     json_data.push({
                       area_num: house.community_area,
                       area: house.community_name,
                       crimes: community_areas[i].rate_save,
                       dista: radio
                     })
                   }

                 }

             break;
         }
     }

   })

    console.log(json_data);
   //VISUALIZATION
   var svgContainer= d3.select('#statis1').append('svg')
                                          .attr('width', 200)
                                          .attr('height', 200);

    var circles = svgContainer.selectAll('circle')
                                .data(json_data)
                                .enter()
                                .append('circle');

    var circleAttr= circles
                    .attr('cx', function(d){ return 650+d.crimes;})
                    .attr('cy', function(d){ return 650+d.radio;})
                    .attr('r', 10);
   //
 }

$(document).ready(function(){

    var dataClimateOfficial= new loadClimate('https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid=GHCND:US1ILCK0036&units=standard&startdate=2017-03-15&enddate=2017-04-20&datatypeid=PRCP', climateOfficial)
    var dataRentHouse= new  loadDataset('https://data.cityofchicago.org/resource/uahe-iimk.json', fdataHouse);
    //var dataWeather= new loadDataset('http://api.openweathermap.org/data/2.5/weather?lon=-87.635597&lat=41.506149&APPID=0702dcac8a4c88c8009b41d768395487', fdataWeather);
    var dataLibraries= new loadDataset('https://data.cityofchicago.org/resource/psqp-6rmg.json', fdataLibraries);
    var dataPolice = new loadDataset('https://data.cityofchicago.org/resource/9rg7-mz9y.json', fdataPolice);
    var dataPark= new loadDataset('https://data.cityofchicago.org/resource/4xwe-2j3y.json', fdataPark);
    var dataHealth= new loadDataset('https://data.cityofchicago.org/resource/4msa-kt5t.json', fdataHealth);
    var dataCommunityA= new loadDataset('https://data.cityofchicago.org/resource/igwz-8jzy.json', fdataCommunityA);
    var dataCrime= new loadDataset('https://data.cityofchicago.org/resource/vwwp-7yr9.json', fdataCrime);
    var dataRestaurant= new loadDataset('https://data.cityofchicago.org/resource/87v8-29pv.json', fdataBar);

    //filters

    var is_check= { save: false , near: false};
    var filter= new filters(is_check);
    var bes= new best();
    //problem with modals
    $('.modal').modal();
})
