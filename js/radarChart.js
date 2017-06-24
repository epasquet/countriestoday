// http://bl.ocks.org/nbremer/6506614

//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better 
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end, 
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html

var RadarChart = {
  draw: function(id, d, options){
  var cfg = {
	 radius: 5,
	 w: 600,
	 h: 600,
	 factor: 1,
	 factorLegend: .85,
	 legendMaxWidth: 100,
	 levels: 5,
	 maxValue: 5,
	 radians: 2 * Math.PI,
	 opacityArea: 0.5,
	 ToRight: 5,
	 TranslateX: 140,
	 TranslateY: 70,
	 ExtraWidthX: 100,
	 ExtraWidthY: 400,
	 //color: d3.scale.category10()
	 // EDIT 06_24 MANU
	 color: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
	         "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
	};

	 // EDIT 06_24 MANU
	function increment_series(series){
        return (series + 1) % cfg.color.length;
    }
	 // EDIT 06_24 MANU
    function mod(n, m) {
        return ((n % m) + m) % m;
    }

	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){
		  cfg[i] = options[i];
		}
	  }
	}
	cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	var allAxis = (d[0].map(function(i, j){return i.axis}));
	var total = allAxis.length;
	var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format('%');
	d3.select(id).select("svg").remove();
	
	var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w+cfg.ExtraWidthX)
			.attr("height", cfg.h+cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
			;

	d3.select("#radarLegends").select("svg").remove();
    var l = d3.select("#radarLegends")
			.append("svg")
			.attr("width", 700)
			.attr("height", 200)
			.append("g")
			.attr("transform", "translate(0, 20)");
			;

	var tooltip;
	
	//Circular segments
	for(var j=0; j<cfg.levels-1; j++){
	  var levelFactor = 1 + cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data(allAxis)
	   .enter()
	   .append("svg:line")
	   .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
	   .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
	   .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
	   .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
	   .attr("class", "line")
	   .style("stroke", "grey")
	   .style("stroke-opacity", "0.75")
	   .style("stroke-width", "0.3px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor + 4) + ")");
	}

	//Text indicating at what % each level is
	for(var j=0; j<cfg.levels; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data([1]) //dummy data
	   .enter()
	   .append("svg:text")
	   .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
	   .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
	   .attr("class", "legend")
	   .style("font-family", "sans-serif")
	   .style("font-size", "12px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
	   .attr("fill", "#333333")
	   //.text(Format((j+1)*cfg.maxValue/cfg.levels));
	   .text((j+1)*cfg.maxValue/cfg.levels);
	}
	
	series = indexColor;

	var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
		.style("stroke-width", "1px");

	axis.append("text")
		.attr("class", "legend")
		.text(function(d){return d})
		.style("font-family", "sans-serif")
		.style("font-size", "12px")
		.attr("text-anchor", "middle")
		.attr("dy", "1.0em")
		.attr("transform", function(d, i){return "translate(0, -10)"})
		.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-80*Math.sin(i*cfg.radians/total);})
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);})
		.call(wrap, cfg.legendMaxWidth);

 
	d.forEach(function(y, x){
	  dataValues = [];
	  g.selectAll(".nodes")
		.data(y, function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		  ]);
		});
	  dataValues.push(dataValues[0]);

	  g.selectAll(".area")
					 .data([dataValues])
					 .enter()
					 .append("polygon")
					 .attr("class", "radar-chart-serie"+series)
					 .style("stroke-width", "2px")
					 // EDIT 06_24 MANU
					 .style("stroke", cfg.color[series])
					 .attr("points",function(d) {
						 var str="";
						 for(var pti=0;pti<d.length;pti++){
							 str=str+d[pti][0]+","+d[pti][1]+" ";
						 }
						 return str;
					  })
			         // EDIT 06_24 MANU
					 .style("fill", function(j, i){return cfg.color[series]})
					 .style("fill-opacity", cfg.opacityArea)
					 .on('mouseover', function (d){
                                        newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                                        newY =  parseFloat(d3.select(this).attr('cy')) - 5;
                                        tooltip
                                            .attr('x', newX)
                                            .attr('y', newY)
                                            .text(Format(d.value))
                                            .transition(200)
                                            .style('opacity', 1);
										z = "polygon."+d3.select(this).attr("class");
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", 0.1); 
										g.selectAll(z)
										 .transition(200)
										 .style("fill-opacity", .7);
									  })
					 // added by sidoine
					 .on('click', function (d){
                                    newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                                    newY =  parseFloat(d3.select(this).attr('cy')) - 5;

                                    tooltip
                                        .attr('x', newX)
                                        .attr('y', newY)
                                        .html("Score Value " + d.value)
                                        .style("font-size","10px")
                                       .style("font-weight", "bold")
                                       .style("top", h) //Y-axis coordinate for tooltip position on mouseover event
                                       .style("left",0) //X-axis coordinate for tooltip position on mouseover event
                                       .style("color", "blue")
                                        .transition(500)
                                        .style('opacity', 1)
                                        .style("visibility", "visible");

                                    z = "polygon."+d3.select(this).attr("class");
                                    g.selectAll("polygon")
                                        .transition(200)
                                        .style("fill-opacity", 0.1);
                                    g.selectAll(z)
                                        .transition(200)
                                        .style("fill-opacity", .7);
				     })
					 .on('mouseout', function(){
					                    tooltip.style("visibility", "hidden") // added by sidoine
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", cfg.opacityArea);
					 });
	  // EDIT 06_24 MANU
	  series = increment_series(series);
	});
	// EDIT 06_24 MANU
	series = indexColor;


	d.forEach(function(y, x){
	  g.selectAll(".nodes")
		.data(y).enter()
		.append("svg:circle")
		.attr("class", "radar-chart-serie"+series)
		.attr('r', cfg.radius)
		.attr("alt", function(j){return Math.max(j.value, 0)})
		.attr("cx", function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		]);
		return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
		})
		.attr("cy", function(j, i){
		  return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
		})
		.attr("data-id", function(j){return j.axis})
		// EDIT 06_24 MANU
		.style("fill", cfg.color[series]).style("fill-opacity", .9)
		.on('mouseover', function (d){
					newX =  parseFloat(d3.select(this).attr('cx')) - 10;
					newY =  parseFloat(d3.select(this).attr('cy')) - 5;
					
					tooltip
						.attr('x', newX)
						.attr('y', newY)
						.text(Format(d.origValue) + d.unit)
						.transition(200)
						.style('opacity', 1);
						
					z = "polygon."+d3.select(this).attr("class");
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", 0.1); 
					g.selectAll(z)
						.transition(200)
						.style("fill-opacity", .7);
				  })
		.on('mouseout', function(){
					tooltip
						.transition(200)
						.style('opacity', 0);
				    tooltip.style("visibility", "hidden");// added by sidoine
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", cfg.opacityArea);
				  })
	    // added by sidoine
	    .on('click', function (d){
					newX =  parseFloat(d3.select(this).attr('cx')) - 10;
					newY =  parseFloat(d3.select(this).attr('cy')) - 5;

					tooltip
						.attr('x', newX)
						.attr('y', newY)
						.html("Value : " + d.origV + " " + d.unit)
						.style("font-size","10px")
                        .style("font-weight", "bold")
                       //.style("top", h) //Y-axis coordinate for tooltip position on mouseover event
                       //.style("left",0) //X-axis coordinate for tooltip position on mouseover event
                       //.style("color", "blue")
						.transition(500)
						.style('opacity', 1)
						.style("visibility", "visible");

					z = "polygon."+d3.select(this).attr("class");
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", 0.1);
					g.selectAll(z)
						.transition(200)
						.style("fill-opacity", .7);
				  })
		.append("svg:title")
		.text(function(j){return Math.max(j.value, 0)});

	    // EDIT 06_24 MANU
	    // Legend
        // Create colour squares
        l.append("rect")
            .attr('transform', "translate("+ mod(series - indexColor, 10) * 160 +",0)")
            .attr("x", 20)
            .attr("y", 0)
            .attr("width", 150)
            .attr("height", 70)
            .style("fill", cfg.color[series])
            .style("fill-opacity", cfg.opacityArea)
            .style("stroke", cfg.color[series])
            .style("stroke-width", "2px")
            .style("stroke-opacity", 1.);

        // Write country names
        l.append("text")
            .attr("class", "title")
            .attr('transform', "translate("+ mod(series - indexColor, 10) * 160 +",0)")
            .attr("x", 25)
            .attr("y", 5)
            .attr("dy", "1.0em")
            .attr("font-size", "14px")
            .attr("font-size", "14px")
            .style("font-weight", "bold")
            .attr("fill", cfg.color[series])
            .text(selectedCountries[mod(series - indexColor, 10)].toUpperCase())
            .call(wrap, 130)
            ;

      // EDIT 06_24 MANU
	  series = increment_series(series);
	});

	//Tooltip
	tooltip = g.append('text')
			   .style('opacity', 0)
			   .style('font-family', 'sans-serif')
			   .style('font-size', '13px');
  }
};
