'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataPoint {
  date: Date;
  clicks: number;
}

interface AnalyticsChartProps {
  data?: DataPoint[];
}

export function AnalyticsChart({ data: propData }: AnalyticsChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    if (propData && propData.length > 0) {
      return propData.map((d) => ({
        date: d.date instanceof Date ? d.date : new Date(d.date),
        clicks: d.clicks,
      }));
    }
    return [];
  }, [propData]);

  const trend = useMemo(() => {
    if (data.length < 2) return 0;
    const midpoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midpoint);
    const secondHalf = data.slice(midpoint);
    const firstTotal = firstHalf.reduce((sum, d) => sum + d.clicks, 0);
    const secondTotal = secondHalf.reduce((sum, d) => sum + d.clicks, 0);
    if (firstTotal === 0) return 0;
    return Math.round(((secondTotal - firstTotal) / firstTotal) * 100);
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.clicks) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Create area generator
    const area = d3
      .area<DataPoint>()
      .x((d) => xScale(d.date))
      .y0(innerHeight)
      .y1((d) => yScale(d.clicks))
      .curve(d3.curveMonotoneX);

    // Create line generator
    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.clicks))
      .curve(d3.curveMonotoneX);

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#CCCCFF')
      .attr('stop-opacity', 0.4);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#CCCCFF')
      .attr('stop-opacity', 0.05);

    // Draw area
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area);

    // Draw line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#CCCCFF')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(5)
          .tickFormat(
            d3.timeFormat('%b %d') as (date: Date | d3.NumberValue) => string
          )
      )
      .call((g) => g.select('.domain').attr('stroke', '#3f3f46'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#3f3f46'))
      .call((g) =>
        g
          .selectAll('.tick text')
          .attr('fill', '#71717a')
          .attr('font-size', '10px')
      );

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .call((g) => g.select('.domain').attr('stroke', '#3f3f46'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#3f3f46'))
      .call((g) =>
        g
          .selectAll('.tick text')
          .attr('fill', '#71717a')
          .attr('font-size', '10px')
      );

    // Add hover effect with tooltip
    const tooltip = d3
      .select(container)
      .append('div')
      .attr(
        'class',
        'absolute hidden rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2 text-sm pointer-events-none'
      )
      .style('z-index', '10');

    const focus = g.append('g').style('display', 'none');

    focus
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#CCCCFF')
      .attr('stroke', '#121212')
      .attr('stroke-width', 2);

    const bisect = d3.bisector<DataPoint, Date>((d) => d.date).left;

    svg
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .attr('fill', 'transparent')
      .on('mouseover', () => {
        focus.style('display', null);
        tooltip.classed('hidden', false);
      })
      .on('mouseout', () => {
        focus.style('display', 'none');
        tooltip.classed('hidden', true);
      })
      .on('mousemove', (event) => {
        const [xPos] = d3.pointer(event);
        const x0 = xScale.invert(xPos);
        const i = bisect(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d =
          d1 &&
          x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime()
            ? d1
            : d0;

        if (d) {
          focus.attr(
            'transform',
            `translate(${xScale(d.date)},${yScale(d.clicks)})`
          );
          tooltip
            .html(
              `<strong>${d.clicks}</strong> clicks<br/>${d3.timeFormat('%b %d')(d.date)}`
            )
            .style('left', `${xScale(d.date) + margin.left + 10}px`)
            .style('top', `${yScale(d.clicks) + margin.top - 10}px`);
        }
      });

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [data]);

  const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-400">
            Total clicks ({data.length} days)
          </p>
          <p className="text-lg font-bold text-white">
            {totalClicks.toLocaleString()}
          </p>
        </div>
        {trend !== 0 && (
          <div
            className={`flex items-center gap-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {trend > 0 ? '+' : ''}
              {trend}%
            </span>
          </div>
        )}
      </div>

      {/* Chart container */}
      <div ref={containerRef} className="relative min-h-[200px] flex-1">
        <svg ref={svgRef} className="h-full w-full" />
      </div>
    </div>
  );
}
