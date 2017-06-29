
//var data_file = 'data/factbook_converti_float.csv'
var data_file = 'data/column_selection_normalized_2.csv'
//var polygons_file = "data/world-topo-min_country_names_modified.json"


var dimensions = [//'Country',
                  'Electricity surplus (per capita)',
                  'Highways(km) (per km2.capita)',
                  'Oil deficit (per capita)',
                  'Oil dependency (per capita)',
                  'GDP - per capita',
                  'Public debt(% of GDP)',
                  'Investment (gross fixed)(% of GDP)',
                  'Inflation rate(%)(consumer prices)',
                  'Household expenditure(M$)',
                  'Population living in 5M+ metropolitan areas',
                  'Score'];

var color_column = 'Score' // update Sidoine

// linear color scale
var blue_to_red = d3.scale.quantize()
                    .domain([0, 1])
                    .range(["red", "brown", "orange", "blue", "green"])

var main_parcoords_alpha = 0.35

var parcoords = d3.parcoords()("#parcoords")
                  .alpha(main_parcoords_alpha)
                  .alphaOnBrushed(0.2)
                  .mode("default")
                  .height(350)
                  .margin({
                            top: 70,
                            left: 110,
                            right: 0,
                            bottom: 16
                          })
                  .color(function(d) { return blue_to_red(d[color_column]); })


// create chart from loaded data
function parallelCoordinates(data) {

//########################################### #################################################################
//#######################################   PARALLELS COORDINATES #############################################
//#############################################################################################################

                                    // slickgrid needs each data element to have an id
                                       data.forEach(function(d,i) { d.id = d.id || i;
                                                                    d['Score'] = d3.format(".4f")(+d.Score);
                  d['GDP - per capita'] =  d3.format(".4f")(+d['GDP - per capita']);
                  d['Investment (gross fixed)(% of GDP)']= d3.format(".4f")(+d['Investment (gross fixed)(% of GDP)']);
                  d['Inflation rate(%)(consumer prices)']= d3.format(".4f")(+d['Inflation rate(%)(consumer prices)']);
                  d['Population living in 5M+ metropolitan areas'] = d3.format(".4f")(+d['Population living in 5M+ metropolitan areas']);
                  d['Oil deficit (per capita)']= d3.format(".4f")(+d['Oil deficit (per capita)']);
                  d['Oil dependency (per capita)'] = d3.format(".4f")(+d['Oil dependency (per capita)']);
                  d['Electricity surplus (per capita)'] = d3.format(".4f")(+d['Electricity surplus (per capita)']);
                  d['Highways(km) (per km2.capita)']=  d3.format(".8f")(+d['Highways(km) (per km2.capita)']);
                  d['Public debt(% of GDP)'] = d3.format(".4f")(+d['Public debt(% of GDP)']);
                  d['Household expenditure(M$)'] = d3.format(".4f")(+d['Household expenditure(M$)']);



                                       });

                                    // render parallel coordinates
                                       parcoords.data(data)
                                                .render()
                                                .dimensions(dimensions)
                                                .reorderable()
                                                .brushMode("1D-axes")
                                                //.smoothness(0.15)
                                                .showControlPoints(false)
                                                .render()

                                       // click label to activate Axis bold font
                                      parcoords.svg.selectAll(".dimension")
                                        .on("click", function(dimension){
                                                                          parcoords.svg.selectAll(".dimension")
                                                                            .style("font-weight", "normal")
                                                                            .filter(function(d) { return d == dimension; })
                                                                            .style("font-weight", "bold")
                                                      })
                                        .selectAll(".label")
                                        .style("font-size", "12px");

                                      // highlight map on brush and filtering grid value
                                        parcoords.on("brush", function(d) {
                                                                            update_map_with_brush(d);
                                                                            update_grid_with_data(d);
                                                              });

                                       var insertLinebreaks = function (d) {
                                                                              var el = d3.select(this);
                                                                              var words = d.split(' // ');
                                                                              el.text('');

                                                                              for (var i = 0; i < words.length; i++) {
                                                                                var tspan = el.append('tspan').text(words[i]);
                                                                                if (i > 0)
                                                                                  tspan.attr('x', 0).attr('dy', '20');
                                                                              }
                                                               };

                                        // axis titles are too long : rotate them a bit
                                       d3.select("#parcoords")
                                         .selectAll(".axis")
                                         .selectAll("text.label")
                                         .attr("transform", "rotate(-15) translate(0, -30)")

                                        // break it two if you find " // " in it
                                       d3.select("#parcoords")
                                          .selectAll(".axis")
                                          .selectAll("text.label")
                                          .each(insertLinebreaks);

                                        // add legend
                                       legend = d3.legend.color()
                                                   .scale(blue_to_red)
                                                   .ascending(true)

                                        d3.select("#parcoords svg")
                                          .append("g")
                                          .attr("class","legend")
                                          .attr("transform","translate(10,190)")
                                          .style("font-size","10px")
                                          .call(legend);

                                       d3.select(".legend")
                                          .append("text")
                                          .text("Score")
                                          .attr("transform", "translate(0,-40)")

                                       d3.select(".legend")
                                          .append("text")
                                          .text("country to invest (based")
                                          .attr("transform", "translate(0,-25)")

                                       d3.select(".legend")
                                          .append("text")
                                          .text(" on economics datas)")
                                          .attr("transform", "translate(0,-10)")

                                       d3.select(".legend")
                                          .selectAll("rect")
                                          .attr("fill-opacity",main_parcoords_alpha)


                                       function get_data_for_county(county) {
                                                                                for (var i = 0; i < data.length; i++) {
                                                                                  row = data[i]
                                                                                  if (row['Country'].toLowerCase() == county.toLowerCase())
                                                                                    return row;
                                                                                }
                                                                                alert("Did not find county " + county + " in dataset.");
                                       }

                                       function update_map_with_brush(brushed_data) {
                                                                                        counties = []
                                                                                        for (var i = 0; i < brushed_data.length; i++) {
                                                                                          row = brushed_data[i]
                                                                                          counties.push(row['Country'])
                                                                                          //console.log(row['Country'])
                                                                                        }
                                                                                        update_map_with_counties(counties)
                                                                                        //console.log(counties)
                                       }
//START MAP
                                        function update_map_with_row(row) {
                                                                              update_map_with_counties([row['Country']])
                                        }

                                        function update_map_with_counties(counties) {
                                                // First recolor all the map with original colors
                                                for (var i = 0; i < countryList.length; i++){

                                                    d3.selectAll("." + countryList[i].replace(/[^a-zA-Z]/g, "_"))
                                                      .style("fill", function(d){
                                                            return color_countries(d)
                                                      })
                                                }
                                                // Then color the brushed countries
                                                if (counties.length != 263){
                                                    for (var i = 0; i < counties.length; i++){
                                                        //console.log(counties[i].toLowerCase().replace(/[^a-zA-Z]/g, "_"))
                                                        d3.selectAll("." + counties[i].toLowerCase().replace(/[^a-zA-Z]/g, "_"))
                                                          .style("fill", "#ff7700")
                                                    }
                                                }

                                        }

                                        function update_map() {
                                                                  var parcoords_data = parcoords.brushed() || data;
                                                                  update_map_with_brush(parcoords_data);
                                        }

                                        function update_parcoords_with_row(row) {
                                                                                   parcoords.highlight([row]);
                                        }


//########################################### #################################################################
//#######################################   START UPDATING GRID VALUE #############################################
//#############################################################################################################
// #######

// setting up grid hearder static row (first row of grid)
                                        var column_keys_with_id = d3.keys(data[0]);

                                        // remove id column from grid
                                        var column_keys = column_keys_with_id.filter( function(value) { return (value != "id")})

                                        var columns = column_keys.map(function(key,i) {
                                                                                          return {
                                                                                                    id: key,
                                                                                                    name: key,
                                                                                                    field: key,
                                                                                                    sortable: true,
                                                                                                    minWidth: 70
                                                                                                  }
                                                                                       });

                                        var options = {
                                                          enableCellNavigation: true,
                                                          enableColumnReorder: false,
                                                          multiColumnSort: false,
                                                          forceFitColumns: true
                                                      };

                                        var dataView = new Slick.Data.DataView();
                                        var grid = new Slick.Grid("#grid", dataView, columns, options);

                                        // wire up model events to drive the grid
                                        dataView.onRowCountChanged
                                                .subscribe(function (e, args) {
                                                                                 grid.updateRowCount();
                                                                                 grid.render();
                                                                              });

                                        dataView.onRowsChanged
                                                .subscribe(function (e, args) {
                                                                                  grid.invalidateRows(args.rows);
                                                                                  grid.render();
                                                            });

                                        // column sorting
                                        var sortcol = column_keys[0];
                                        var sortdir = 1;

                                        function comparer(a, b) {
                                                                    var x = a[sortcol], y = b[sortcol];
                                                                    return (x == y ? 0 : (x > y ? 1 : -1));
                                        }

                                        function update_grid() {
                                                                  var parcoords_data = parcoords.brushed() || data;
                                                                  update_grid_with_data(parcoords_data)
                                        };

                                        function update_grid_with_data(data) {
                                                                                dataView.beginUpdate();
                                                                                dataView.setItems(data);
                                                                                dataView.endUpdate();
                                        };

                                        // click header to sort grid column
                                        grid.onSort
                                            .subscribe(function (e, args) {
                                                                              sortdir = args.sortAsc ? 1 : -1;
                                                                              sortcol = args.sortCol.field;

                                                                              if ($.browser.msie && $.browser.version <= 8) {
                                                                                    dataView.fastSort(sortcol, args.sortAsc);
                                                                              }
                                                                              else {
                                                                                    dataView.sort(comparer, args.sortAsc);
                                                                              }
                                                              });

                                        // highlight row in chart
                                        grid.onMouseEnter
                                            .subscribe(function(e,args) {
                                                                            var i = grid.getCellFromEvent(e).row;
                                                                            var d = parcoords.brushed() || data;
                                                                            update_parcoords_with_row(d[i]);
                                                                            update_map_with_row(d[i]);

                                                       });
                                        grid.onMouseLeave
                                            .subscribe(function(e,args) {
                                                                            parcoords.unhighlight();
                                                                            update_map()
                                                       });

                                        // fill grid with data
                                        update_grid_with_data(data);

//#################################################################################################################
//###############################   WORLD MAP #################################################################
//#############################################################################################################

        var country_zone = {};

        var zone_color = {"alena": "#800000",
                          "ue": "#000066",
                          "mercosur": "#333300",
                          "asean": "#cc9900",
                          "zlec" : "#6d5a07",
                          "mcca" : "#820d5e",
                          "ueea" : "#076050",
                          "ccg" : "#1c1b19",
                          "": "#AAAAAA" }

        function isInArray(li, el) {
            return li.indexOf(el.toLowerCase()) > -1;
        }

        var country_score = {};

        var score_color_scale = d3.scale.linear()
                                    .domain([0, 1])
                                    .range(["#246b4d", "#00f923"]);



        function color_countries(d){
            if (showCommercialZone === true){
                 if (typeof(country_zone[d.properties.name.toLowerCase()]) !== 'undefined'){
                    cz = country_zone[d.properties.name.toLowerCase()]
                    return zone_color[cz];
                 } else {
                 return zone_color[""];
                 }
             } else {
                 if (typeof(country_score[d.properties.name.toLowerCase()]) !== 'undefined'){
                    cs = country_score[d.properties.name.toLowerCase()]
                    //console.log(d.properties.name, cs, score_color_scale(cs))
                    return score_color_scale(cs);
                 } else {
                 return score_color_scale(0);
                 console.log("nope")
                 }
             }

        }

        function update(){
            showCommercialZone = !showCommercialZone
            d3.select("#map_div").select("svg").remove()
                .call(draw_world(showCommercialZone));
        }


        function draw_world(showCommercialZone){
            var width = 1450,
                height = 600;

            var projection = d3.geo.mercator()
                .center([0, 50 ])
                .scale(220)
                .rotate([0,0])
                .translate([580, 200]);

            var svg = d3.selectAll("#map_div").append("svg")
                .attr("width", width)
                .attr("height", height);

            var g = svg.append("g");

            var country_path = d3.geo.path()
                .projection(projection);

            // definition du tooltip
            var tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                //.style("z-index", "10")
                .style("visibility", "hidden")
                .style("color", "#222222")
                .style("padding", "2px")
                .style("background", "lightsteelblue")
                .style("border", "1px")
                .style("stroke", "1px")
                .style("border-radius", "3px")

            // load country data from csv
            d3.csv("data/column_selection_normalized.csv")
                    .row(function (d, i) {
                        return {
                            country: d.Country,
                            comZone: d["Commercial zone"],
                            binScore: d["Score"]
                        };
                    })
                    .get(function(error, rows) {
                        console.log("Loaded " + rows.length + " rows");
                        if (rows.length > 0) {
                            console.log("First row: ", rows[0]);
                            console.log("Last  row: ", rows[rows.length-1]);
                        }
                        for(var i = 0; i < rows.length; i++) {
                            countryList.push(rows[i].country.toLowerCase().replace(/[^a-zA-Z]/g, "_"));
                            country_zone[rows[i].country.toLowerCase()] = rows[i].comZone.toLowerCase();
                            country_score[rows[i].country.toLowerCase()] = rows[i].binScore.toLowerCase();
                        }
                    })

            // load and display the World
            d3.json("./data/world-topo-min_country_names_modified.json", function(error, topology) {
                g.selectAll("path")
                  .data(topojson.feature(topology, topology.objects.countries)
                      .features)
                .enter()
                  .append("path")
                  .attr("d", country_path)
                  .attr("class", function(d){
                                            return d.properties.name.toLowerCase().replace(/[^a-zA-Z]/g, "_");
                                            })
                  .style("stroke-width", "0.25px")
                  .style("fill", function(d){
                                             return color_countries(d);
                                            })
                  .on("mouseover", function(d){
                                                tooltip.style("visibility", "visible")
                                                       .text(d.properties.name);
                                                row = get_selected_country(d.properties.name)
                                                update_parcoords_with_row(row);
                                                update_grid_with_data([row])
                                                // selecting country with lower case in order to use in geojason map
                                                d3.selectAll("." + d.properties.name.toLowerCase()
                                                .replace(/[^a-zA-Z]/g, "_"))
                                                .style("fill", "yellow")
                                    })
                  .on("mousemove", function(d){
                                                tooltip.style("visibility", "visible")
                                                       .style("top",(d3.event.pageY-10)+"px")
                                                       .style("left",(d3.event.pageX+10)+"px")
                                                       .text(d.properties.name);
                                    })
                  .on("mouseout", function(d){
                                                update_map();
                                                parcoords.unhighlight();
                                                update_grid();
                                                tooltip.style("visibility", "hidden");

                                    })
                  .on("click", function(d){
                        c = d.properties.name.toLowerCase()
                        load_and_draw_radar()
                        row = get_selected_country(d.properties.name)
                        //console.log("goooooood",row)
                        update_parcoords_with_row(row);
                        update_grid_with_data([row])

                        d3.select(this).style("stroke-width", "2px").style("fill", "#DDDDDD");
                         // Remplissage de la liste de selected countries
                        // Limite du nombre de pays de la liste a 3
                        // Si pays existe deja, on le retire et on le repasse en fin de liste
                        if (!isInArray(selectedCountries, c)){
                            console.log("longueur liste", selectedCountries.length)
                            if(!(selectedCountries.length > 3)){
                                console.log("liste de moins de 3 elements")
                                selectedCountries.push(c);

                            } else {
                                console.log("liste de 3 elements")
                                // On recolore le premier pays comme il était avant
                                console.log(selectedCountries[0])
                                d3.selectAll("."+selectedCountries[0])
                                    .style("fill", function(d){
                                                 console.log(color_countries(d))
                                                 return color_countries(d);
                                                })
                                    .style("stroke-width", "0.25px");
                                // On retire le premier pays de la liste pour faire de la place
                                selectedCountries.shift();
                                indexColor ++;
                                selectedCountries.push(c);

                            }
                        } else {
                            var index = selectedCountries.indexOf(c);
                            if (index > -1) {
                                selectedCountries.splice(index, 1);
                                // on déselectionne le pays si lors du clic il était déja présent dans la liste
                                //selectedCountries.push(c);
                                d3.select(this).style("stroke-width", "0.25px").style("fill", "#DDDDDD");
                                update_map();
                                parcoords.unhighlight();
                                update_grid();


                            }
                        }

                  });
            });

            var zoom = d3.behavior.zoom()
                .on("zoom",function() {
                    g.attr("transform","translate("+
                        d3.event.translate.join(",")+")scale("+d3.event.scale+")");
                    g.selectAll("path")
                        .attr("d", country_path.projection(projection));
            });
            // ZOOM on MAP
            svg.call(zoom);
        }

        function get_selected_country(country) {        //console.log(dataset[0]);
                                                            for (var i = 0; i < datasets.length; i++) {

                                                              row = datasets[i]
                                                              if (row['Country'].toLowerCase() == country.toLowerCase())
                                                                return row;
                                                            }
                                                            //alert("Did not find county " + county + " in dataset.");
                                               }

        d3.select("#myCheckbox").on("change",update)
        draw_world(showCommercialZone);

//###################################################################################################################
//################################################## RADARS CHART ###################################################
//###################################################################################################################

// http://bl.ocks.org/nbremer/6506614

// key = nom de pays, value = donnees du pays
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

            var variables = [
                // EDIT 06_24 MANU
                {variable:"bin_gdpCapita", name:"GDP (per capita)", origValue:"gdpCapita", /*min: 400, max: 58900, "scaler":gdpCapitaScaler, */"unity":"$"},
                {variable:"bin_investPercGdp", name:"Investment (% of GDP)", origValue:"investPercGdp", /*min: 8, max: 65.10, /*"scaler":investPercGdpScaler,*/ "unity":"%"},
                {variable:"bin_inflation", name:"Inflation quality", origValue:"inflation", /*min: -3.7, max: 133, "scaler":inflationScaler,*/ "unity":"$"},
                {variable:"bin_metropolitan", name:"Population living in 5M+ metropolitan areas", origValue:"metropolitan", /*min: 0, max: 310000000, "scaler":metropolitanScaler,*/ "unity":""},
                {variable:"bin_oilDeficit", name:"Oil deficit (per capita)", origValue:"oilDeficit", /*min: -0.9, max: 1.51, "scaler":oilDeficitScaler,*/ "unity":"$"},
                {variable:"bin_elecSurplus", name:"Electricity surplus (per capita)", origValue:"elecSurplus", /*min: -6880, max: 7230, "scaler":elecSurplusScaler,*/ "unity":"$"},
                {variable:"bin_highways", name:"Highways(km) (per km2.capita)", origValue:"highways", /*min: 0, max: 0.0000005, "scaler":highwaysScaler,*/ "unity":"km"},
                {variable:"bin_householdExp", name:"Household expenditure(M$)", origValue:"householdExp", /*min: 0, max: 11550000, "scaler":householdExpScaler,*/ "unity":"$"}
            ];

            d = build_radar_data(dataset, countries, variables);
            // d = build_radar_data_test();
            console.log(countries);


            //Call function to draw the Radar chart
            //Will expect that data is in %'s
            RadarChart.draw("#chart", d, mycfg);

        });
    }
};

function load_data(file) {
                            var rawFile = new XMLHttpRequest();
                            rawFile.open("GET", file, false);
                            rawFile.onreadystatechange = function () {
                                                                        if(rawFile.readyState === 4) {
                                                                          if(rawFile.status === 200 || rawFile.status == 0) {
                                                                              var lines = rawFile.responseText;
                                                                              var data = d3.csv.parse(lines)
                                                                              datasets = data;
                                                                              //console.log(dataset[0])
                                                                              parallelCoordinates(data);

                                                                              // for debugging, let's print some loaded rows
                                                                              console.log("Loaded " + data.length + " rows")
                                                                              if (data.length > 0){
                                                                                  //console.log("First row: ", data[0])
                                                                                  //console.log("Last row: ", data[data.length-1])
                                                                                  //console.log("row 42 : ", data[42])
                                                                                  }
                                                                          }
                                                                        }
                                                          }
                            rawFile.send(null);
}

// MAIN FUNCTION FOR DRAWING PARALLEL COORDINATE, MAP, GRID and RADAR

load_data(data_file);
