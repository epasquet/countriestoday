draw_world(showCommercialZone);

function draw_world(showCommercialZone){
    // MODIF 06_16
    var country_zone = {};

    // MODIF 06_16
    var zone_color = {"alena": "#800000",
                      "ue": "#000066",
                      "mercosur": "#333300",
                      "asean": "#cc9900",
                      "zlec" : "#6d5a07",
                      "mcca" : "#820d5e",
                      "ueea" : "#076050",
                      "ccg" : "#1c1b19",
                      "": "#AAAAAA" }

    // MODIF 06_16
    function isInArray(li, el) {
        return li.indexOf(el.toLowerCase()) > -1;
    }

    // MODIF 06_20
    var country_score = {};

    // MODIF 06_20
    var score_color_scale = d3.scale.linear()
                                .domain([0, 1])
                                .range(["#589961", "#00f923"]);

    var width = 1450,
        height = 600;

    var projection = d3.geo.mercator()
        .center([10, 50 ])
        .scale(180)
        .rotate([0,0])
        .translate([580, 200]);

    var svg = d3.selectAll("#map_div").append("svg")
        .attr("width", width)
        .attr("height", height);

    var country_path = d3.geo.path()
        .projection(projection);

    var g = svg.append("g");

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

    // MODIF 06_16
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
                    //console.log("First row: ", rows[0]);
                    //console.log("Last  row: ", rows[rows.length-1]);
                }
                for(var i = 0; i < rows.length; i++) {
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
          .style("fill", function(d){if (showCommercialZone === true){
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
                                         }
                                     }
                                    })
          .on("mouseover", function(d){return tooltip.style("visibility", "visible")
                                                     .text(d.properties.name);})
          .on("mousemove", function(d){return tooltip.style("visibility", "visible")
                                                     .style("top",(d3.event.pageY-10)+"px")
                                                     .style("left",(d3.event.pageX+10)+"px")
                                                     .text(d.properties.name);})
          .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
          .on("click", function(d){
                c = d.properties.name.toLowerCase()
                console.log(c);
                load_and_draw_radar()
                // MODIF 06_16
                d3.select(this).style("stroke-width", "2px").style("fill", "#DDDDDD");
                // MODIF 06_16
                if (!isInArray(selectedCountries, c)){
                    selectedCountries.push(c);
                    }
                console.log(selectedCountries)
                });
    });

    var zoom = d3.behavior.zoom()
        .on("zoom",function() {
            g.attr("transform","translate("+
                d3.event.translate.join(",")+")scale("+d3.event.scale+")");
            g.selectAll("path")
                .attr("d", country_path.projection(projection));
    });

    svg.call(zoom);
}