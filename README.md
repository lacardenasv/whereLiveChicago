
 DEEPHOUSE

Keywords : price , safety, chicago, Places of leisure, near

*Description of the datasets and function design

[Affordable Rental Housing Developments] [https://data.cityofchicago.org/Community-Economic-Development/Affordable-Rental-Housing-Developments/uahe-iimk] [JSON] [property_name, address,longitude, latitude] Provides information on affordable rental housing development in chicago.

[Crimes - 2015][https://data.cityofchicago.org/Public-Safety/Crimes-2015/vwwp-7yr9][JSON] [longitude, lalitude] This dataset reflects reported incidents of crime (with the exception of murders where data exists for each victim) that occurred in the City of Chicago from 2001 to present, minus the most recent seven days. Data is extracted from the Chicago Police Department's CLEAR (Citizen Law Enforcement Analysis and Reporting) system 

[OpenWeatherMap][https://http://openweathermap.org/][JSON] [weather] OpenWeatherMap weather service is based on the VANE Geospatial Data Science platform for collecting, processing, and distributing information about our planet through easy to use tools and APIs.

[Libraries - Locations, Hours and Contact Information][https://data.cityofchicago.org/Education/Libraries-Locations-Hours-and-Contact-Information/x8fc-8rcq][JSON] [name_,address,location ] Chicago Public Library locations, contact information, and hours of operation.

[Police Stations][https://data.cityofchicago.org/Public-Safety/Police-Stations/z8bn-74gv][JSON] [address,location,phone] Chicago Police district station locations and contact information.

[Parks - Locations][https://data.cityofchicago.org/Parks-Recreation/Parks-Locations/wwy2-k7b3][JSON] [park_name,street_address,location] Parks managed by the Chicago Park District. Dataset includes park facilities and features information.

[Chicago Department of Public Health Clinic Locations - Map - All Clinic Types][https://data.cityofchicago.org/Health-Human-Services/Chicago-Department-of-Public-Health-Clinic-Locatio/4msa-kt5t][JSON] [site_name,clinic_type,street_address,longitude,latitude] City of Chicago Mental Health, Sexually Transmitted Infection (STI) Specialty, and Women Infant Children (WIC) clinic locations, hours of operation and contact information. Note that some locations have multiple clinic types.

	[Y] Do you use the primary dataset ”online climate data” from data.gov?
	[Y] [List] Are all these datasets from data.gov or data.indy.gov? 

*Brief Description

DeepHouse allows you to find a home that fits your needs in the city of chicago.
It takes as criteria the level of criminality in the neighborhood, nearby leisure sites such as parks, libraries, bars,police stations, proximity to the computer science department of the University of Illinois.

Fill in the structued description:

Map View:

	[Y] Basic Map with specific location (your map is located in a meaningful place, city of west lafayette for example)
	[Y] Markers for location of markets
	[Y] Labels for markets' names
	[Y] InfoWindow to show detail information of a market
	[Y] [describe] Any other cover on the map ? A polygon is made for a source point to calculate the area nearby and thus filter the nearby sites.

Data Visualization:

	[N] [describe] Use Graph? What is the type? 
	[N] [List] Any interaction available on the graph? 

Interaction Form:

	[Y] [List] Any information output? 
		Card -> weather today
	[Y] [List] Any operation option (filters)? 
		Checkbox:
			Save House 
			Home nearby
		RadioButtons:
			Parks
			Police station
			Health centers
			Leisure centers
	[Y] [List] Interaction with Map? List them. 
		Hover Mouse -> Show InfoWindow
		Click House -> Show in detail a house and the libraries near this.
	[N] [List] Interaction with data visualization? 

The application will be building with 3 principal languages, HTML, CSS, and JavaScript, but will have components that help in the objective:
	1. Bootstrap: Framework to html, Css, JavaScript
	2. JQuery: Library of JavaScript (AJAX)
	3. Font-Awesome: css toolkit for get icons 
	4. Materialize: This is a framework for material design and is installed as follows.->
		NPM:   npm install materialize-css
		Bower: bower install materialize
		You can add these lines to your html:
		<!-- Compiled and minified CSS -->
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.1/css/materialize.min.css">

		<!-- Compiled and minified JavaScript -->
			<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.1/js/materialize.min.js"></script>
		
          
Test Case Which browsers did you test your project on? Chrome, Firefox


There is a problem when starting the map sometimes there is no load and you have to reload the page.
