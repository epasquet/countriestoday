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
                            .range(["#589961", "#00f923"]);

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

draw_world(showCommercialZone);

function draw_world(showCommercialZone){
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
          .style("fill", function(d){
                                     return color_countries(d);
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
                d3.select(this).style("stroke-width", "2px").style("fill", "#DDDDDD");
                // EDIT 06_24 MANU
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
                        selectedCountries.push(c);
                    }
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