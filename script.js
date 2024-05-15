fetch("data/countries.json")
  .then((response) => response.json())
  .then((data) => {
    window.countries = data;
    updateChart();
  });

function updateChart() {
  const criteria = document.getElementById("criteria").value;
  document.getElementById("chart").innerHTML = "";
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", 1400)
    .attr("height", 2000)
    .append("g")
    .attr("transform", "translate(0,0)");
  const bubble = d3.pack().size([1400, 2000]).padding(1.5);
  const root = d3.hierarchy({ children: countries }).sum((d) => {
    if (criteria === "population") return d.population;
    if (criteria === "borders") return d.borders.length;
    if (criteria === "timezones") return d.timezones.length;
    if (criteria === "languages") return d.languages.length;
  });
  const nodes = bubble(root).leaves();
  const node = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);
  node
    .append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", "black")
    .on("mouseover", function (event, d) {
      const info = `<strong>${d.data.name}</strong><br>Population: ${d.data.population}<br>Borders: ${d.data.borders.length}<br>Timezones: ${d.data.timezones.length}<br>Languages: ${d.data.languages.length}`;
      showTooltip(event, info);
    })
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip);
  node
    .append("text")
    .attr("dy", (d) => d.r / -16)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-size", (d) => `${d.r / 8}px`)
    .text((d) => d.data.name);
  node
    .append("text")
    .attr("dy", (d) => d.r / 16)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-size", (d) => `${d.r / 16}px`)
    .text((d) => d.value);
  updateTable(criteria);
}

function updateTable(criteria) {
  const tbody = document.querySelector("#data-table tbody");
  tbody.innerHTML = "";
  countries.forEach((country) => {
    const value =
      criteria === "population"
        ? country.population
        : criteria === "borders"
        ? country.borders.length
        : criteria === "timezones"
        ? country.timezones.length
        : country.languages.length;
    const row = `<tr><td>${country.name}</td><td>${value}</td></tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

function showTooltip(event, info) {
  let tooltip = document.getElementById("tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.padding = "5px";
    tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
    tooltip.style.color = "white";
    tooltip.style.borderRadius = "5px";
    tooltip.style.pointerEvents = "none";
    document.body.appendChild(tooltip);
  }
  tooltip.innerHTML = info;
  tooltip.style.display = "block";
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY + 10}px`;
}

function moveTooltip(event) {
  const tooltip = document.getElementById("tooltip");
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY + 10}px`;
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip");
  if (tooltip) {
    tooltip.style.display = "none";
  }
}
