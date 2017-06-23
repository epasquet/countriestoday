// http://bl.ocks.org/nbremer/6506614

// key = nom de pays, value = donnees du pays
var dataset = {};

var w = 400,
	h = 400;

var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['Smartphone','Tablet'];

// radar data
var d = [];

//Options for the Radar chart, other than default
var mycfg = {
    w: w,
    h: h,
    maxValue: 1.0,
    levels: 5,
    ExtraWidthX: 300
}

function build_radar_data(dataset, countries, variables) {
    var d = [];

    // loop over countries
    for(var j = 0; j < countries.length; j++) {
        var country = countries[j];
        // console.log(country);

        // loop over variables
        var tmp = [];
        for(var i = 0; i < variables.length; i++) {
            var variable = variables[i];
            var col = variable["variable"];
            var name = variable["name"];
            /*
            var minval = variable["min"];
            var maxval = variable["max"];
            var avgval = 0.5 * (minval + maxval);
            var x = 0.5 + (dataset[country][col] - avgval) / (maxval - minval);
            */
            //var scaler = variable["scaler"];
            var unity = variable["unity"];
            /*
            var minval = scaler(variable["min"]);
            var maxval = scaler(variable["max"]);
            var avgval = 0.5 * (minval + maxval);
            */
            var origVal = dataset[country][col];
            //var x = 0.5 + (scaler(dataset[country][col]) - avgval) / (maxval - minval);7
            var x = dataset[country][col]

            tmp.push({axis: name, value: x, origValue: origVal, unit: unity});
        }
        d.push(tmp);
    }
    return d;
}

function load_and_draw_radar(){
    d3.csv("data/column_selection_binned.csv")
        .row(function (d, i) {
            return {
                country: d.Country,
                gdpCapita: +d["GDP - per capita"],
                elecSurplus: +d["Electricity surplus (per capita)"],
                highways: +d["Highways(km) (per km2.capita)"],
                oilDeficit: +d["Oil deficit (per capita)"],
                //oilDependency: +d["Oil dependency (per capita)"],
                //debt: +d["Public debt(% of GDP)"],
                investPercGdp: +d["Investment (gross fixed)(% of GDP)"],

                //country: d.Country,
                //area: +d["Area (sq km)"],
                //pop: +d.Population,
                //birthRate: +d["Birth rate(births/1000 population)"],
                //deathRate: +d["Birth rate(deaths/1000 population)"],
                //laborForce : +d["Labor force"],
                //lifeExpectancy : +d["Life expectancy at birth(years)"],
                //gdp: +d["GDP"],
                //gdpCapita: +d["GDP - per capita"],
                //gdpGrossRate: +d["GDP - real growth rate(%)"],
                //indusProdGrossRate : +d["Industrial production growth rate(%)"],
                //investPercGdp: +d["Investment (gross fixed)(% of GDP)"],
                inflation: +d["Inflation rate(%)(consumer prices)"],
                //debt: +d["Public debt(% of GDP)"],
                //exports : +d["Exports"],
                //elecCons : +d["Electricity - consumption(kWh)"],
                //elecProd : +d["Electricity - production(kWh)"],
                //gasCons: +d["Natural gas - consumption(cu m)"],
                //gasExports: +d["Natural gas - exports(cu m)"],
                //gasImports: +d["Natural gas - imports(cu m)"],
                //gasProd: +d["Natural gas - production(cu m)"],
                //gasReserves: +d["Natural gas - proved reserves(cu m)"],
                //oilCons: +d["Oil - consumption(bbl/day)"],
                //oilExports: +d["Oil - exports(bbl/day)"],
                //oilImports: +d["Oil - imports(bbl/day)"],
                //oilProd: +d["Oil - production(bbl/day)"],
                //oilReserves: +d["Oil - proved reserves(bbl)"],
                householdExp:+d["Household expenditure(M$)"],
                metropolitan: +d["Population living in 5M+ metropolitan areas"]
            };
        })
        .get(function(error, rows) {
            console.log("Loaded " + rows.length + " rows");
            if (rows.length > 0) {
                console.log("First row: ", rows[0]);
                console.log("Last  row: ", rows[rows.length-1]);
            }
            for(var i = 0; i < rows.length; i++) {
                dataset[rows[i].country.toLowerCase()] = rows[i];
            }
            /*
            gdpCapitaScaler = d3.scale.linear()
                                .domain(d3.extent(rows, function(row){return row.gdpCapita;}))
                                .range([0.1, 1]);
            investPercGdpScaler = d3.scale.linear()
                                .domain(d3.extent(rows, function(row){return row.investPercGdp;}))
                                .range([0.1, 1]);
            inflationScaler = d3.scale.sqrt()
                                .domain(d3.extent(rows, function(row){return row.inflation;}))
                                .range([0.1, 1]);
            metropolitanScaler = d3.scale.linear()
                                .domain(d3.extent(rows, function(row){return row.metropolitan;}))
                                .range([0.1, 1]);
            oilDeficitScaler = d3.scale.linear()
                                .domain(d3.extent(rows, function(row){return row.oilDeficit;}))
                                .range([0.1, 1]);
            elecSurplusScaler = d3.scale.linear()
                                .domain(d3.extent(rows, function(row){return row.elecSurplus;}))
                                .range([0.1, 1]);
            highwaysScaler = d3.scale.sqrt()
                                .domain(d3.extent(rows, function(row){return row.highways;}))
                                .range([0.1, 1]);
            householdExpScaler = d3.scale.sqrt()
                                .domain(d3.extent(rows, function(row){return row.elecSurplus;}))
                                .range([0.1, 1]);
            */
            /*
            console.log("France     : ", dataset["france"]);
            console.log("France GDP : ", dataset["france"].GDP);
            console.log("France GDP : ", dataset["france"]["GDP"]);*/

            // var countries = ["france", "germany"];
            var countries = selectedCountries;

            var variables = [
                {variable:"gdpCapita", name:"GDP (per capita)", /*min: 400, max: 58900, "scaler":gdpCapitaScaler, */"unity":"knkn"},
                {variable:"investPercGdp", name:"Investment (% of GDP)", /*min: 8, max: 65.10, /*"scaler":investPercGdpScaler,*/ "unity":"\$"},
                {variable:"inflation", name:"Inflation", /*min: -3.7, max: 133, "scaler":inflationScaler,*/ "unity":"\$"},
                {variable:"metropolitan", name:"Population living in 5M+ metropolitan areas", /*min: 0, max: 310000000, "scaler":metropolitanScaler,*/ "unity":"\$"},
                {variable:"oilDeficit", name:"Oil deficit (per capita)", /*min: -0.9, max: 1.51, "scaler":oilDeficitScaler,*/ "unity":"\$"},
                //{variable:"oilDependency", name:"Oil dependency (per capita)", min: 0, max: 261700000000},
                {variable:"elecSurplus", name:"Electricity surplus (per capita)", /*min: -6880, max: 7230, "scaler":elecSurplusScaler,*/ "unity":"\$"},
                {variable:"highways", name:"Highways(km) (per km2.capita)", /*min: 0, max: 0.0000005, "scaler":highwaysScaler,*/ "unity":"\$"},
                {variable:"householdExp", name:"Household expenditure(M$)", /*min: 0, max: 11550000, "scaler":householdExpScaler,*/ "unity":"\$"}
                /*
                {variable:"gdpCapita", name:"GDP per capita", min: 400, max: 58900},
                {variable:"inflation", name:"Inflation", min: -3.6, max: 133},
                {variable:"oilReserves", name:"Oil reserves", min: 0, max: 261800000000},
                {variable:"debt", name:"Debt", min: 0, max: 4710000000000},
                {variable:"investPercGdp", name:"Investment (% of GDP)", min: 8, max: 65.10}
                */
            ];

            d = build_radar_data(dataset, countries, variables);
            // d = build_radar_data_test();
            console.log("d : ", d);


            //Call function to draw the Radar chart
            //Will expect that data is in %'s
            RadarChart.draw("#chart", d, mycfg);

        });
    }



////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
	.selectAll('svg')
	.append('svg')
	.attr("width", w)
	.attr("height", h+300)

//Create the title for the legend
var text = svg.append("text")
	.attr("class", "title")
	.attr('transform', 'translate(90,0)') 
	.attr("x", w - 70)
	.attr("y", 10)
	.attr("font-size", "12px")
	.attr("fill", "#404040")
	.text("What % of owners use a specific service in a week");
		
//Initiate Legend	
var legend = svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)') 
	;
	//Create colour squares
	legend.selectAll('rect')
	  .data(LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", w - 65)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale(i);})
	  ;
	//Create text next to squares
	legend.selectAll('text')
	  .data(LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", w - 52)
	  .attr("y", function(d, i){ return i * 20 + 9;})
	  .attr("font-size", "11px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; })
	  ;	
