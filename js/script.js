// http://bl.ocks.org/nbremer/6506614

// key = nom de pays, value = donnees du pays
/*
var dataset = {};

var w = 400,
	h = 400;

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

        // loop over variables
        var tmp = [];
        for(var i = 0; i < variables.length; i++) {
            var variable = variables[i];
            var col = variable["variable"];
            var origCol = variable["origValue"];
            var name = variable["name"];
            var unity = variable["unity"];
            // EDIT 06_24 MANU
            //var origVal = dataset[country][col];
            var origValue = dataset[country][origCol];
            var x = dataset[country][col];
            if (col == "bin_oilDeficit"){
                console.log(x, origValue)
                }

            tmp.push({axis: name, value: x, origV: origValue, unit: unity});
        }
        d.push(tmp);
    }
    return d;
}

function load_and_draw_radar(){
    d3.csv("data/column_selection_FINAL.csv")
        .row(function (d, i) {
            return {
                country: d.Country,
                gdpCapita: +d["GDP - per capita"],
                elecSurplus: +d["Electricity surplus (per capita)"],
                highways: +d["Highways(km) (per km2.capita)"],
                oilDeficit: +d["Oil deficit (per capita)"],
                investPercGdp: +d["Investment (gross fixed)(% of GDP)"],
                inflation: +d["Inflation rate(%)(consumer prices)"],
                householdExp:+d["Household expenditure(M$)"],
                metropolitan: +d["Population living in 5M+ metropolitan areas"],
                // EDIT 06_24 MANU
                bin_gdpCapita: +d["bin_GDP"],
                bin_elecSurplus: +d["bin_Electricity"],
                bin_highways: +d["bin_Highways"],
                bin_oilDeficit: +d["bin_Oil"],
                bin_investPercGdp: +d["bin_Investment"],
                bin_inflation: +d["bin_Inflation"],
                bin_householdExp:+d["bin_Household"],
                bin_metropolitan: +d["bin_Population5M+"]
            };
        })
        .get(function(error, rows) {
            //console.log("Loaded " + rows.length + " rows");
            if (rows.length > 0) {
                //console.log("Last  row: ", rows[rows.length-1]);
            }
            for(var i = 0; i < rows.length; i++) {
                dataset[rows[i].country.toLowerCase()] = rows[i];
            }

            var countries = selectedCountries;
*/
            //EDIT 06_24 MANU
  //          var variables = [
    //
     //           {variable:"bin_gdpCapita", name:"GDP (per capita)", origValue:"gdpCapita", /*min: 400, max: 58900, "scaler":gdpCapitaScaler, */"unity":"$"},
     //           {variable:"bin_investPercGdp", name:"Investment (% of GDP)", origValue:"investPercGdp", /*min: 8, max: 65.10, /*"scaler":investPercGdpScaler,*/ "unity":"%"},
     //           {variable:"bin_inflation", name:"Inflation quality", origValue:"inflation", /*min: -3.7, max: 133, "scaler":inflationScaler,*/ "unity":"$"},
     //           {variable:"bin_metropolitan", name:"Population living in 5M+ metropolitan areas", origValue:"metropolitan", /*min: 0, max: 310000000, "scaler":metropolitanScaler,*/ "unity":""},
     //           {variable:"bin_oilDeficit", name:"Oil deficit (per capita)", origValue:"oilDeficit", /*min: -0.9, max: 1.51, "scaler":oilDeficitScaler,*/ "unity":"$"},
     //           {variable:"bin_elecSurplus", name:"Electricity surplus (per capita)", origValue:"elecSurplus", /*min: -6880, max: 7230, "scaler":elecSurplusScaler,*/ "unity":"$"},
     //           {variable:"bin_highways", name:"Highways(km) (per km2.capita)", origValue:"highways", /*min: 0, max: 0.0000005, "scaler":highwaysScaler,*/ "unity":"km"},
     //           {variable:"bin_householdExp", name:"Household expenditure(M$)", origValue:"householdExp", /*min: 0, max: 11550000, "scaler":householdExpScaler,*/ "unity":"$"}
     //       ];
/*
            d = build_radar_data(dataset, countries, variables);
            // d = build_radar_data_test();
            console.log(countries);


            //Call function to draw the Radar chart
            //Will expect that data is in %'s
            RadarChart.draw("#chart", d, mycfg);

        });
    }
*/
// ############################### Start EDIT By Sidoine


    // ##############################################End edit by sidoine

