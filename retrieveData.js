
$(document).ready(function(){
    

//I can use this function for all request to datasets, chanching the firts parameter even if the format is diferent to json
    
    $.getJSON('https://data.cityofchicago.org/resource/uahe-iimk.json', function(result){
        contentType:'aplication/json';
        dataType:'json';
        var houses= $.map(result, function (house, index) {
            var localH= $('<tr></tr>');
            $('<td>'+house.property_name+'</td>').appendTo(localH);
            $('<td>'+house.address+'</td>').appendTo(localH);
            return localH
            
        });
        $('#house').append(houses);
    });

function initMap(){
                       
    var location= new google.maps.LatLng(41.8708, 87.6505);
    var name= 'The best University!';
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {lat: 40.4237, lng: -86.9212},
        zoom: 12}
        );
    var marker = new google.maps.Marker({ //Line 1
        position: {lat: 40.4237, lng: -86.9212}, //Line2: Location to be highlighted
            map: map,//Line 3: Reference to map object
            title: 'Purdue University' //Line 4: Title to be given
    })

    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      
      infoWindow.open(map,marker);

    });
};

  window.addEventListener('load', initMap);
 
});

