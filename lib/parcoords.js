//var data_file = "data/d4g_malaria_explore.csv"
//var data_file = 'data/factbook_converti_float.csv'
var data_file = 'data/column_selection_normalized_2.csv'
//var polygons_file = "data/world-topo-min_country_names_modified.json"
var polygons_file = "data/Kenyan-Counties.geojson"

var dimensions = [//'Country',
                  'Electricity surplus (per capita)',
                  'Highways(km) (per km2.capita)',
                  'Oil deficit (per capita)',
                  'Oil dependency (per capita)',
                  'GDP - per capita',
                  //'Public debt(% of GDP)',
                  //'Investment (gross fixed)(% of GDP)',
                  'Inflation rate(%)(consumer prices)',
                  'Household expenditure(M$)',
                  //'Population living in 5M+ metropolitan areas'
                  ];
/*
var dimensions = [
                  'Fever or Malaria cases (%) // 2006',
                  'Malaria cases (%) // 2013',
                  'Poverty Rate // 2006',
                  'Physician density // 2013',
                  'Slept Under a Bed Net (%) // 2006',
                  'Health Spending (per pers.) // 2006',
                  'Health Facilites // 2007'];

*/
//var color_column = 'Fever or Malaria cases (%) // 2006'
var color_column = 'Inflation rate(%)(consumer prices)'

// linear color scale
var blue_to_red = d3.scale.quantize()
                    .domain([0, 0.75])
                    .range(["blue", "grey", "red"])

var main_parcoords_alpha = 0.6

var parcoords = d3.parcoords()("#parcoords")
                  .alpha(main_parcoords_alpha)
                  .alphaOnBrushed(0.2)
                  .mode("default")
                //.mode("queue")
                //.height(d3.max([document.body.clientHeight-326, 220]))
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

                                    // slickgrid needs each data element to have an id
                                       data.forEach(function(d,i) { d.id = d.id || i; });

                                    // render parallel coordinates
                                       parcoords.data(data)
                                                .render()
                                                .dimensions(dimensions)
                                                .reorderable()
                                                .brushMode("1D-axes")
                                                //.smoothness(0.15)
                                                .showControlPoints(false)
                                                .render()


                                              //.svg.selectAll("text")
                                              //    .style("font", "15px sans-serif");

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
                                        // smoothness
                                        d3.select("#smoothness").on("change", function() {
                                            d3.select("#smooth").text(this.value);
                                            parcoords.smoothness(this.value).render();
                                        });

                                        // Double Slider script

                                        //var slider = d3.slider().value(50);
                                        //d3.select('#slider3').call(slider);

                                        d3.select('#slider3').call(d3.slider().axis(true).value( [0, 25 ] ).on("slide", function(evt, value) {

                                          d3.select('#slider3textmin').text(d3.format(",.2f")(value[ 0 ]));
                                          d3.select('#slider3textmax').text(d3.format(",.2f")(value[ 1 ]));
                                          console.log(parcoords.dimensions()[0])

                                          //var parcoords_data = parcoords.brushed() || data;
                                          //update_map_with_brush(parcoords_data);

                                          //return value[0], value[1];

                                          }));


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
                                                   .labels(["00% to 25%", "25% to 50%", "50% to 75%"])

                                       d3.select("#parcoords svg")
                                          .append("g")
                                          .attr("class","legend")
                                          .attr("transform","translate(25,190)")
                                          .style("font-size","12px")
                                          .call(legend);

                                       d3.select(".legend")
                                          .append("text")
                                          .text("Fever or")
                                          .attr("transform", "translate(0,-40)")

                                       d3.select(".legend")
                                          .append("text")
                                          .text("Malaria cases")
                                          .attr("transform", "translate(0,-25)")

                                       d3.select(".legend")
                                          .append("text")
                                          .text("(% of pop, 2006)")
                                          .attr("transform", "translate(0,-10)")

                                       d3.select(".legend")
                                          .selectAll("rect")
                                          .attr("fill-opacity",main_parcoords_alpha)

                                       var w = 355,
                                           h = 420;

                                       var projection = d3.geo.mercator()
                                                               .center([38, 0.5])
                                                               .scale(2200)
                                                               .translate([w / 2, h/ 2]);

                                        // generate SVG map
                                       var svg = d3.select("#map")
                                                    .append("svg")
                                                    .attr("width", w)
                                                    .attr("height", h)
                                                    .attr("style", "display: block; margin: auto")

                                        // define path generator
                                       var path = d3.geo
                                                     .path()
                                                     .projection(projection);

                                       function get_data_for_county(county) {
                                                                                for (var i = 0; i < data.length; i++) {
                                                                                  row = data[i]
                                                                                  if (row['County'].toLowerCase() == county.toLowerCase())
                                                                                    return row;
                                                                                }
                                                                                alert("Did not find county " + county + " in dataset.");
                                       }

                                       function update_map_with_brush(brushed_data) {
                                                                                        counties = []
                                                                                        for (var i = 0; i < brushed_data.length; i++) {
                                                                                          row = brushed_data[i]
                                                                                          counties.push(row['County'])
                                                                                          //console.log(brushed_data[i])
                                                                                        }
                                                                                        update_map_with_counties(counties)
                                       }
//START MAP
                                        function update_map_with_row(row) {
                                                                              update_map_with_counties([row['County']])
                                        }

                                        function update_map_with_counties(counties) {
                                                  var county_objects = d3.selectAll(".county")
                                                  var county_objects_selected = county_objects.filter(
                                                              function(d, i) {
                                                                                county_index = d.properties.COUNTY.toUpperCase()
                                                                                return counties.indexOf(county_index) != -1;
                                                              });

                                                  var county_objects_not_selected = county_objects.filter(
                                                              function(d, i) {
                                                                                county_index = d.properties.COUNTY.toUpperCase()
                                                                                return counties.indexOf(county_index) == -1;
                                                              });

                                                  county_objects_selected.style('fill-opacity', 1);
                                                  county_objects_not_selected.style('fill-opacity', .5);
                                        }

                                        function update_map() {
                                                                  var parcoords_data = parcoords.brushed() || data;
                                                                  update_map_with_brush(parcoords_data);
                                        }
// END MAP
                                        function update_parcoords_with_row(row) {
                                                                                   parcoords.highlight([row]);
                                        }
// START GRID
                                        function update_grid() {
                                                                  var parcoords_data = parcoords.brushed() || data;
                                                                  update_grid_with_data(parcoords_data)
                                        };

                                        function update_grid_with_data(data) {
                                                                                dataView.beginUpdate();
                                                                                dataView.setItems(data);
                                                                                dataView.endUpdate();
                                        };
//END GRID
//START loading MAP IN PAGE
/*
                                        d3.json(polygons_file, function(json) {

                                                        svg.selectAll("path")
                                                           .data(json.features)
                                                           .enter()
                                                           .append("path")
                                                           .attr("d", path)
                                                           .attr("class", "county")
                                                           .style("fill", "darkorange")
                                                           .style("stroke", "#000")
                                                           .style("stroke-width", "0.5px")
                                                           .on('mouseover', function(d, i) {
                                                                                             d3.selectAll(".county").style('fill-opacity', .5);
                                                                                             d3.select(this).style('fill-opacity', 1);
                                                                                             row = get_data_for_county(d.properties.COUNTY);
                                                                                             update_parcoords_with_row(row);
                                                                                             update_grid_with_data([row])
                                                                            })
                                                           .on('mouseout', function(d, i) {
                                                                                             parcoords.unhighlight();
                                                                                             update_map();
                                                                                             update_grid();
                                                                           });
                                        });
*///END Loading and updating MAP IN PAGE
                                        // highlight map on brush and filtering grid value
                                        parcoords.on("brush", function(d) {
                                                                            update_map_with_brush(d);
                                                                            update_grid_with_data(d);
                                                              });


// START UPDATING GRID VALUE
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
};

function load_data(file) {
                            var rawFile = new XMLHttpRequest();
                            rawFile.open("GET", file, false);
                            rawFile.onreadystatechange = function () {
                                                                        if(rawFile.readyState === 4) {
                                                                          if(rawFile.status === 200 || rawFile.status == 0) {
                                                                              var lines = rawFile.responseText;
                                                                              var data = d3.csv.parse(lines)

                                                                              parallelCoordinates(data);

                                                                              // for debugging, let's print some loaded rows
                                                                              console.log("Loaded " + data.length + " rows")
                                                                              if (data.length > 0){
                                                                                  console.log("First row: ", data[0])
                                                                                  console.log("Last row: ", data[data.length-1])
                                                                                  console.log("row 42 : ", data[42])}
                                                                          }
                                                                        }
                                                          }
                            rawFile.send(null);
}

// MAIN FUNCTION
load_data(data_file);