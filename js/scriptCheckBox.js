var svg = d3.select("#ShowComZone_CheckBox").append("svg").attr("width", 200).attr("height", 100),
                checkBox2 = new d3CheckBox();
            //Just for demonstration
            var txt = svg.append("text").attr("x", 10).attr("y", 80).text("Show Commercial Alliances"),
                update = function () {
                    var checked2 = checkBox2.checked();
                    txt.text(checked2);
                    showCommercialZone = !showCommercialZone;
                    svg.remove()
                    svg = d3.selectAll("#map_div")
                            .select("svg")
                            .select("g")
                            .call(draw_world(showCommercialZone));
                };
            checkBox2.size(30).x(70).y(20).rx(5).ry(5).markStrokeWidth(3)
                                                      .boxStrokeWidth(4)
                                                      .checked(false)
                                                      .clickEvent(update);
            svg.call(checkBox2);