import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLog } from "d3-scale";
import ReactTooltip from "react-tooltip";
import { commaSeperated } from "../utils/common-functions";
import LinearGradient from "./linearGragient";

const INDIA_TOPO_JSON = require("../india.topo.json");

const PROJECTION_CONFIG = {
  scale: 375,
  center: [82.8, 22.5937], // always in [East Latitude, North Longitude]
};

const Choropleth = ({ data, colorLow, colorHigh, fill, type }) => {
  const COLOR_RANGE = [colorHigh, colorLow];

  const geographyStyle = {
    default: {
      outline: "#b13f2b",
    },
    hover: {
      fill: fill,
      outline: "#ffffff",
      transition: "all 250ms",
    },
    pressed: {
      outline: "#b13f2b",
    },
  };
  const [tooltipContent, setTooltipContent] = useState("");

  const gradientData = {
    fromColor: "rgb(240,240,240)",
    toColor: COLOR_RANGE[0],
    min: 0,
    max:
      String(
        Math.ceil(
          data.reduce((max, item) => (item.value > max ? item.value : max), 0) /
            100
        ) / 10
      ) + "K",
  };

  const colorScale = scaleLog()
    .domain(data.map((d) => d.value))
    .range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { value: "0" }) => {
    return () => {
      setTooltipContent(
        `${geo.properties.st_nm}: ${commaSeperated(
          Number(current.value)
        )} ${type}`
      );
    };
  };

  const onMouseLeave = () => {
    setTooltipContent("");
  };

  return (
    <div className="container choropleth">
      <ReactTooltip multiline={true}>{tooltipContent}</ReactTooltip>
      <ComposableMap
        projectionConfig={PROJECTION_CONFIG}
        projection="geoMercator"
        width={192}
        height={220}
        data-tip=""
      >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const current = data.find((s) => s.id === geo.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={current ? colorScale(Number(current.value)) : "#FFFFFF"}
                  style={geographyStyle}
                  onMouseEnter={onMouseEnter(geo, current)}
                  onMouseLeave={onMouseLeave}
                  stroke={"#3a0910"}
                  strokeWidth={0.15}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <LinearGradient data={gradientData} />
    </div>
  );
};

export default Choropleth;
