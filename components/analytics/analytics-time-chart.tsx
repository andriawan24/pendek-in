'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BentoCard } from '@/components/ui/bento-card';
import { LineChart } from 'lucide-react';
import type { TimeSeriesDataPoint } from '@/lib/mock-data/types';

interface AnalyticsTimeChartProps {
  data: TimeSeriesDataPoint[];
}

export function AnalyticsTimeChart({ data }: AnalyticsTimeChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);

    // Clear previous render
    svg.selectAll('*').remove();

    // Get container dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Set SVG dimensions
    svg.attr('width', width).attr('height', height);

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, (d3.max(data, (d) => d.clicks) || 0) * 1.1])
      .nice()
      .range([innerHeight, 0]);

    // Create area generator
    const area = d3
      .area<TimeSeriesDataPoint>()
      .x((d) => xScale(d.date))
      .y0(innerHeight)
      .y1((d) => yScale(d.clicks))
      .curve(d3.curveMonotoneX);

    // Create line generator
    const line = d3
      .line<TimeSeriesDataPoint>()
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
      .attr('id', 'analytics-area-gradient')
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

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').attr('stroke', '#27272a'));

    // Draw area
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#analytics-area-gradient)')
      .attr('d', area);

    // Draw line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#CCCCFF')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // Add X axis
    const tickCount = data.length > 60 ? 6 : data.length > 14 ? 8 : 7;
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(tickCount)
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
          .attr('font-size', '11px')
      );

    // Add Y axis
    g.append('g')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => d3.format('.2s')(d as number))
      )
      .call((g) => g.select('.domain').attr('stroke', '#3f3f46'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#3f3f46'))
      .call((g) =>
        g
          .selectAll('.tick text')
          .attr('fill', '#71717a')
          .attr('font-size', '11px')
      );

    // Add hover effect with tooltip
    const tooltip = d3
      .select(container)
      .append('div')
      .attr(
        'class',
        'absolute hidden rounded-lg border-2 border-zinc-700 bg-zinc-900 px-3 py-2 text-sm pointer-events-none shadow-neo-sm'
      )
      .style('z-index', '10');

    const focus = g.append('g').style('display', 'none');

    focus
      .append('circle')
      .attr('r', 6)
      .attr('fill', '#CCCCFF')
      .attr('stroke', '#121212')
      .attr('stroke-width', 2);

    focus
      .append('line')
      .attr('class', 'focus-line')
      .attr('stroke', '#CCCCFF')
      .attr('stroke-dasharray', '4,4')
      .attr('stroke-opacity', 0.5);

    const bisect = d3.bisector<TimeSeriesDataPoint, Date>((d) => d.date).left;

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
          focus
            .select('.focus-line')
            .attr('y1', 0)
            .attr('y2', innerHeight - yScale(d.clicks));

          tooltip
            .html(
              `<strong class="text-electric-yellow">${d.clicks.toLocaleString()}</strong> clicks<br/><span class="text-zinc-400">${d3.timeFormat('%B %d, %Y')(d.date)}</span>`
            )
            .style('left', `${xScale(d.date) + margin.left + 15}px`)
            .style('top', `${yScale(d.clicks) + margin.top - 15}px`);
        }
      });

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [data]);

  return (
    <BentoCard
      title="Clicks Over Time"
      icon={<LineChart className="h-4 w-4" />}
      className="min-h-[400px]"
    >
      <div ref={containerRef} className="relative h-[320px] w-full">
        <svg ref={svgRef} className="h-full w-full" />
      </div>
    </BentoCard>
  );
}
