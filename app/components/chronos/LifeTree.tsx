"use client";

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ScreenTimeData, ViewMode } from './types';

interface LifeTreeProps {
  data: ScreenTimeData;
  mode: ViewMode;
  onHover: (item: any) => void;
}

export default function LifeTree({ data, mode, onHover }: LifeTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 800;
    const isFlower = mode === 'flower';

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g");

    if (isFlower) {
      // --- FLOWER MODE (Circular / Petals) ---
      const radius = 300;
      svg.attr("transform", `translate(${width / 2},${height / 2})`);

      const rootData = {
        name: "Total",
        children: data.categories.map(cat => ({
          name: cat.name,
          color: cat.color,
          children: cat.children.map(app => ({
            name: app.name,
            value: app.minutes,
            color: app.color
          }))
        }))
      };

      const root = d3.hierarchy(rootData)
        .sum((d: any) => d.value || 0)
        .sort((a, b) => (b.value || 0) - (a.value || 0));

      const tree = d3.cluster<any>().size([Math.PI * 2, radius]);
      tree(root);

      const linkGenerator = d3.linkRadial<any, any>()
        .angle(d => d.x)
        .radius(d => d.y);

      // Branches (Stems)
      svg.append("g")
        .selectAll("path")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "tree-branch")
        .attr("d", linkGenerator as any)
        .style("stroke", isFlower ? "#1A1A1A" : "#FFFFFF")
        .style("stroke-opacity", 0.1)
        .style("stroke-width", "0.5px");

      // App Blooms (Petals)
      const blooms = svg.append("g")
        .selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", (d: any) => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);

      blooms.append("circle")
        .attr("r", 0)
        .style("fill", (d: any) => d.data.color)
        .style("fill-opacity", 0.6)
        .on("mouseenter", (event, d: any) => {
          d3.select(event.currentTarget).transition().duration(200).attr("r", (d.data.value / 5) + 5).style("fill-opacity", 1);
          onHover(d.data);
        })
        .on("mouseleave", (event, d: any) => {
          d3.select(event.currentTarget).transition().duration(200).attr("r", (d.data.value / 10) + 2).style("fill-opacity", 0.6);
          onHover(null);
        })
        .transition()
        .duration(1000)
        .delay((_, i) => i * 10)
        .attr("r", (d: any) => (d.data.value / 10) + 2);

    } else {
      // --- TREE MODE (Ascending / Branches) ---
      svg.attr("transform", `translate(${width / 2},${height - 100})`);
      
      const rootData = {
        name: "Total",
        children: data.categories.map(cat => ({
          name: cat.name,
          color: cat.color,
          value: cat.children.reduce((acc, curr) => acc + curr.minutes, 0)
        }))
      };

      const root = d3.hierarchy(rootData)
        .sum((d: any) => d.value || 0);

      const tree = d3.tree<any>().size([600, 500]); // [width, height]
      tree(root);

      const linkGenerator = d3.linkVertical<any, any>()
        .x(d => d.x - 300)
        .y(d => -d.y);

      // Tron (Main Trunk)
      svg.append("line")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", 0).attr("y2", -50)
        .style("stroke", "#FFFFFF")
        .style("stroke-width", "2px")
        .style("stroke-opacity", 0.5);

      // Branches (Ascending)
      svg.append("g")
        .selectAll("path")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "tree-branch")
        .attr("d", linkGenerator as any)
        .style("stroke", "#FFFFFF")
        .style("stroke-width", (d: any) => `${(d.target.value / 20) + 1}px`)
        .style("stroke-opacity", 0.4)
        .style("fill", "none")
        .style("stroke-dasharray", "1000")
        .style("stroke-dashoffset", "1000")
        .transition()
        .duration(2000)
        .style("stroke-dashoffset", "0");

      // Category Nodes (Total Time Representation)
      const nodes = svg.append("g")
        .selectAll("g")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("transform", (d: any) => `translate(${d.x - 300}, ${-d.y})`);

      nodes.append("circle")
        .attr("r", 0)
        .style("fill", (d: any) => d.data.color || "#FFFFFF")
        .style("stroke", "#FFFFFF")
        .style("stroke-opacity", 0.2)
        .on("mouseenter", (event, d: any) => {
          onHover({ name: d.data.name, value: d.value, color: d.data.color });
        })
        .on("mouseleave", () => onHover(null))
        .transition()
        .duration(1000)
        .attr("r", (d: any) => d.depth === 0 ? 10 : (d.value / 15) + 5);
        
      // Total Text
      svg.append("text")
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .text(`Total Focus: ${data.totalMinutes}m`)
        .style("fill", "#FFFFFF")
        .style("font-family", "var(--font-mono)")
        .style("font-size", "14px")
        .style("letter-spacing", "4px")
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .style("opacity", 0.5);
    }

  }, [data, mode]);

  return (
    <div className="canvas-container w-full h-full flex items-center justify-center">
      <svg ref={svgRef} className="max-w-full max-h-full" />
    </div>
  );
}
