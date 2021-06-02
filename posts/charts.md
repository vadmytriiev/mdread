# Cleaning and refactoring Charts

To quickly create basic graphs for later use, it was decided to standardize their appearance and interface

## Plan

1. Provide chart render with standartizated `svg` render working with `d3.v6`
2. For each chart type, define data format compatible with chart structure.
3. Provide store and functions whose are common for any types of chart.
4. Provide base binding points for interaction and enhancement purposes

## SVG

Each chart starts with empty div with `unique_id` setted up by user. To make some event binding there are classes setted up for each layer `.chart` - resposible for svg rendered container, `.chart-group` - works with groups or stacks of data if its provided by the graph design, `.chart-particle` or `.arc` for smaller components. Default values for chart size setted up as   height : 400, width: 1200.

SVG initialization
Each chart starts with empty div with 

```js
      svg
        .attr("viewBox", [
          0,
          0,
          component.width,
          component.height + margin.bottom,
        ])
        .attr("width", component.width)
        .attr("height", component.height);
```

### Color palette

Current state: color palette adjusts itself in dependence of data. 
* Possible feature: prop to set own array of colors to customize graph (at least 2 colors in HEX format)

## Chart types

For now currently availiable 4 most used graphs: Pie chart, Bar Chart, Stacked Bar Chart and Grouped Bar Chart.

## Pie Chart

Chart data example:

```js
	[
		{ 
			primary: 'name', 
			secondary: 6
		},
		{ 
			primary: 'name2', 
			secondary: 3
		},
	]
```
 

Arc domain creation 

```js

    var color = d3.scaleOrdinal().range(color_palette);
    var pie = d3.pie().value(function (d) {return d.value;})(data);

    var arc = d3
      .arc()
      .outerRadius(radius - 1)
      .innerRadius(0);
    var labelArc = d3
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.6 - 5);
```
Arc render 
```js
		var svg = d3
          .select("#" + component.unique_id)
          .append("svg")
          .attr("width", component.width)
          .attr("height", component.height)
          .append("g")
          .attr(
            "transform",
            "translate(" +component.width / 2 +"," +component.height / 2 +")"
          );
        var g = svg
          .selectAll("arc")
          .data(pie)
          .enter()
          .append("g")
          .attr("class", "arc")
          .attr("fill", function (d, i) {return color(i);});

        g.append("path")
          .attr("d", arc)
          .style("fill", function (d, i) {return color(i);})
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 1);
```
Pie chart view


## Bar Chart

Chart data example:

```js
	[
		{ 
			primary: 'name', 
			secondary: 6
		},
		{ 
			primary: 'name2', 
			secondary: 3
		},
	]
```
 

Axis domain creation 

```js
      var x = d3
        .scaleBand()
        .domain(test_data.map((d) => d.primary))
        .range([margin.left, component.width - margin.right])
        .padding(0.1);

      var y = d3
        .scaleLinear()
        .domain([0, this.yAxisDomain.length - 1])
        .nice()
        .range([component.height - margin.bottom, margin.top]);
```
Bar render 
```js
    svg
    	.append("g")
    	.selectAll("rect")
    	.data(data)
    	.enter()
    	.append("rect")
    	.attr("x", (d) => x(d.primary).toFixed(0))
    	.attr("y", (d) => y(d.secondary))	
    	.attr("fill", (d) => color_palette[d.id]) 
    	.attr("height", (d) => y(0) - y(d.secondary))
    	.attr("width", x.bandwidth().toFixed(0));
```
Bar chart view



## Stacked Bar Chart

Chart data example:

```js
	[
		{ 
			primary: 'name', 
			property: 1,
			property: 2,
			property: 4,
			property: 3,
		},
		{ 
			primary: 'name2', 
			property: 3,
			property: 7,
			property: 2,
			property: 1,
		},
	]
```
 

Axis domain creation 

```js
      var x = d3
        .scaleBand()
        .domain(groups)
        .range([margin.left, component.width - margin.right])
        .padding([0.1]);

      var y = d3
        .scaleLinear()
        .domain([0, y_domain]) // calc domain
        .range([component.height - margin.bottom, margin.top]);
```
Stack render 
```js
    svg
    	.append("g")
    	.selectAll("g")
    	// Enter in the stack data = loop key per key = group per group
    	.data(stackedData)
    	.enter()
    	.append("g")
    	.attr("fill", function (d) {return color(d.key);})
    	.attr("key", function (d) {return d.key;})
    	.selectAll("rect")
    	.data(function (d) {return d;})
    	.enter()
    	.append("rect")
    	.attr("x", function (d) {return x(d.data.primary);})
    	.attr("y", function (d) {return y(d[1]);})
    	.attr("height", function (d) {return y(d[0]) - y(d[1]);})
    	.attr("width", x.bandwidth());
```
Stacked Bar chart view


## Grouped Bar Chart

Chart data example:

```js
	[
		{ 
			primary: 'name', 
			property: 1,
			property: 2,
			property: 4,
			property: 3,
		},
		{ 
			primary: 'name2', 
			property: 3,
			property: 7,
			property: 2,
			property: 1,
		},
	]
```
 

Axis domain creation 

```js
      var x0 = d3
        .scaleBand()
        .domain(data.map((d) => d[groupKey]))
        .rangeRound([margin.left, component.width - margin.right])
        .paddingInner(0.1);
      var x1 = d3
        .scaleBand()
        .domain(keys)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05);
   

      var y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d3.max(keys, (key) => d[key]))])
        .nice()
        .rangeRound([component.height - margin.bottom, margin.top]);
```
Group render 
```js
    svg
    	.append("g")
    	.selectAll("g")
    	.data(data)
    	.join("g")
    	.attr("transform", (d) => `translate(${x0(d[groupKey])},0)`)
    	.selectAll("rect")
    	.data((d) => keys.map((key) => ({ key, value: d[key] })))
    	.join("rect")
    	.attr("x", (d) => x1(d.key))
    	.attr("y", (d) => y(d.value))
    	.attr("width", x1.bandwidth())
    	.attr("height", (d) => y(0) - y(d.value))
    	.attr("fill", (d) => color(d.key));
```
Grouped Bar Chart


## Connected Scatterplot

Chart data example:

```js
	[
		{ 
			primary: 'name', 
			property1: 1,
			property2: 2,
			property3: 4,
			property4: 3,
		},
		{ 
			primary: 'name2', 
			property1: 3,
			property2: 7,
			property3: 2,
			property4: 1,
		},
	]
```
 

Axis domain creation 

```js
      var x = d3
        .scaleLinear()
        .domain([0, collect_props.length - 1])
        .range([margin.left, component.width - margin.right]);
   

      var y = d3
        .scaleLinear()
        .domain([0, y_domain_val ])
        .nice()
        .range([component.height, margin.top]);
      
      var line = d3.line()
        .x(function (d, i) {
          return x(d.x);
        })
        .y(function (d, i) {
          return y(d.y);
        });
```
Group render 
```js
      svg
        .append('g')
        .attr("transform", `translate(${margin.left},0)`)
        .selectAll("g")
        .data(new_data)
        .enter()
        .append("path")
        .attr("class", function (d) {
          return "chart-line chart-particle";
        })
        .attr('group', function(d){
          return d.group;
        })
        .attr("d", function (d) {
          return line(d.values);
        })
        .attr("stroke", function (d,i) {
           return color_palette[i];
        })
        .style("stroke-width", 4)
        .style("fill", "none");
```
Connected Scatterplot



## Threemap

Chart data example:

```js
	{
    name: "flare",
    children: [
      {
        name: "analytics",
        children: [
          {
            name: "cluster",
            children: [
              { name: "AgglomerativeCluster", value: 3938 },
              { name: "CommunityStructure", value: 3812 },
              { name: "HierarchicalCluster", value: 6714 },
              { name: "MergeEdge", value: 743 },
            ],
          },
          {
            name: "graph",
            children: [
              { name: "BetweennessCentrality", value: 3534 },
              { name: "LinkDistance", value: 5731 },
            ],
          },
          {
            name: "optimization",
            children: [{ name: "AspectRatioBanker", value: 7074 }],
          },
        ],
      },
  }
```

Axis domain creation 

```js
      var treemap = (data) =>
        d3.treemap().tile(tile).size([width, height]).padding(1).round(true)(
          d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value)
        );

      var tile = d3.treemapSquarify;
```
Group render 
```js
      const leaf = svg
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
        .attr("class", function (d) {
          return "leaf";
        });

      leaf.append("title").text(
        (d) =>
          `${d
            .ancestors()
            .reverse()
            .map((d) => d.data.name)
            .join("/")}\n${format(d.value)}`
      );

      leaf
        .append("rect")
        .attr("id", (d) => (d.leafUid = DOM.uid("leaf")).id)
        .attr("fill", (d) => {
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        })
        .attr("fill-opacity", 0.6)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0);

      leaf
        .append("clipPath")
        .attr("id", (d) => (d.clipUid = DOM.uid("clip")).id)
        .append("use")
        .attr("xlink:href", (d) => d.leafUid.href);

      leaf
        .append("text")
        .attr("clip-path", (d) => d.clipUid)
        .selectAll("tspan")
        .data((d) =>
          d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value))
        )
        .join("tspan")
        .attr("x", 3)
        .attr(
          "y",
          (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
        )
        .attr("fill-opacity", (d, i, nodes) =>
          i === nodes.length - 1 ? 0.7 : null
        )
        .text((d) => d);
```
Connected Scatterplot


## Save Chart Function

To download any chart there are save button on top left corner that calls function that passes current state of `svg` to functions below

```js
      function getSVGString(svgNode) {
        svgNode.setAttribute("xlink", "http://www.w3.org/1999/xlink");
        var cssStyleText = getCSSStyles(svgNode);
        appendCSS(cssStyleText, svgNode);

        var serializer = new XMLSerializer();
        var svgString = serializer.serializeToString(svgNode);
        svgString = svgString.replace(/(\w+)?:?xlink=/g, "xmlns:xlink="); 
        svgString = svgString.replace(/NS\d+:href/g, "xlink:href"); 
        return svgString;

        function getCSSStyles(parentElement) {
          var selectorTextArr = [];

          // Add Parent element Id and Classes to the list
          selectorTextArr.push("#" + parentElement.id);
          for (var c = 0; c < parentElement.classList.length; c++)
            if (!contains("." + parentElement.classList[c], selectorTextArr))
              selectorTextArr.push("." + parentElement.classList[c]);

          // Add Children element Ids and Classes to the list
          var nodes = parentElement.getElementsByTagName("*");
          for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i].id;
            if (!contains("#" + id, selectorTextArr))
              selectorTextArr.push("#" + id);

            var classes = nodes[i].classList;
            for (var c = 0; c < classes.length; c++)
              if (!contains("." + classes[c], selectorTextArr))
                selectorTextArr.push("." + classes[c]);
          }

          // Extract CSS Rules
          var extractedCSSText = "";
          for (var i = 0; i < document.styleSheets.length; i++) {
            var s = document.styleSheets[i];

            try {
              if (!s.cssRules) continue;
            } catch (e) {
              if (e.name !== "SecurityError") throw e; // for Firefox
              continue;
            }

            var cssRules = s.cssRules;
            for (var r = 0; r < cssRules.length; r++) {
              if (contains(cssRules[r].selectorText, selectorTextArr))
                extractedCSSText += cssRules[r].cssText;
            }
          }

          return extractedCSSText;

          function contains(str, arr) {
            return arr.indexOf(str) === -1 ? false : true;
          }
        }

        function appendCSS(cssText, element) {
          var styleElement = document.createElement("style");
          styleElement.setAttribute("type", "text/css");
          styleElement.innerHTML = cssText;
          var refNode = element.hasChildNodes() ? element.children[0] : null;
          element.insertBefore(styleElement, refNode);
        }
      }
```

To pass raw graph view default format of file is png
```js
      function svgString2Image(svgString, width, height, format, callback) {
        var format = format ? format : "png";

        var imgsrc =
          "data:image/svg+xml;base64," +
          btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        var image = new Image();
        image.onload = function () {
          context.clearRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);

          canvas.toBlob(function (blob) {
            var filesize = Math.round(blob.length / 1024) + " KB";
            if (callback) callback(blob, filesize);
          });
        };

        image.src = imgsrc;
      }
```
