'use client';

import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import { branches } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Define types for our data
interface Branch {
  id: string;
  name: string;
  city: string;
  revenue: number;
  occupancy: number;
  capacity: number;
}

// India TopoJSON data (simplified version)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas/countries.json";

// Get the coordinates for major Indian cities
const getCitiesCoordinates = () => {
  const cityCoords: Record<string, [number, number]> = {
    'Delhi': [77.209021, 28.704059],
    'Mumbai': [72.877655, 19.076090],
    'Bangalore': [77.594562, 12.971598],
    'Kolkata': [88.363895, 22.562625],
    'Pune': [73.856743, 18.520430],
    'Hyderabad': [78.486671, 17.385044],
    'Chennai': [80.278472, 13.082680],
    'Ahmedabad': [72.571365, 23.022505],
    'Jaipur': [75.787270, 26.912434],
    'Lucknow': [80.946166, 26.846694],
    'Chandigarh': [76.779373, 30.733315],
    'Patna': [85.117782, 25.594095],
    'Thiruvananthapuram': [76.936627, 8.524139],
    'Bhopal': [77.402132, 23.259933],
    'Indore': [75.833242, 22.719568],
  };

  // Map branches to markers with city coordinates
  const markers = branches.map(branch => {
    const coords = cityCoords[branch.city] || [0, 0]; // Default to [0,0] if city not found
    return {
      ...branch,
      coordinates: coords,
    };
  }).filter(marker => marker.coordinates[0] !== 0); // Filter out markers with default coordinates

  return markers;
};

export function IndiaMap() {
  const [tooltipContent, setTooltipContent] = useState('');
  const markers = getCitiesCoordinates();

  // Group branches by city to calculate revenue and student count
  const branchDataByCity = markers.reduce((acc, branch) => {
    if (!acc[branch.city]) {
      acc[branch.city] = {
        branches: [],
        totalRevenue: 0,
        totalStudents: 0,
      };
    }
    
    acc[branch.city].branches.push(branch);
    acc[branch.city].totalRevenue += branch.revenue;
    acc[branch.city].totalStudents += branch.occupancy * branch.capacity / 100; // Approximate student count
    
    return acc;
  }, {} as Record<string, { branches: any[], totalRevenue: number, totalStudents: number }>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Distribution in India</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <ComposableMap 
            projection="geoMercator" 
            projectionConfig={{ 
              center: [78, 22], 
              scale: 800 
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies
                  .filter((geo) => geo.properties.NAME === "India") // Filter to show only India
                  .map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#EAEAEC"
                      stroke="#D6D6DA"
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" }
                      }}
                    />
                  ))
              }
            </Geographies>
            
            {markers.map((marker, index) => {
              const cityData = branchDataByCity[marker.city];
              return (
                <Marker 
                  key={index} 
                  coordinates={marker.coordinates}
                  onMouseEnter={() => {
                    setTooltipContent(`
                      ${marker.city}
                      Branches: ${cityData.branches.length}
                      Revenue: ₹${cityData.totalRevenue.toLocaleString()}
                      Students: ${Math.round(cityData.totalStudents)}
                    `);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('');
                  }}
                >
                  <g
                    fill="transparent"
                    stroke="#bf2222"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(-12, -24)"
                  >
                    <circle
                      cx="12"
                      cy="10"
                      r={Math.min(10 + (cityData.totalRevenue / 100000), 20)} // Scale circle based on revenue
                    />
                  </g>
                  <text
                    textAnchor="middle"
                    y={-10}
                    style={{ fontFamily: "system-ui", fill: "#333" }}
                  >
                    {marker.city}
                  </text>
                </Marker>
              );
            })}
            
            {tooltipContent && (
              <g>
                <rect
                  x={0}
                  y={0}
                  width={200}
                  height={80}
                  rx={5}
                  ry={5}
                  fill="white"
                  stroke="#ccc"
                  strokeWidth="1"
                />
                <text
                  x={10}
                  y={20}
                  fontSize={14}
                  fontWeight="bold"
                  fill="#333"
                >
                  {tooltipContent.split('\n')[0]}
                </text>
                <text
                  x={10}
                  y={40}
                  fontSize={12}
                  fill="#666"
                >
                  {tooltipContent.split('\n')[1]}
                </text>
                <text
                  x={10}
                  y={55}
                  fontSize={12}
                  fill="#666"
                >
                  {tooltipContent.split('\n')[2]}
                </text>
                <text
                  x={10}
                  y={70}
                  fontSize={12}
                  fill="#666"
                >
                  {tooltipContent.split('\n')[3]}
                </text>
              </g>
            )}
          </ComposableMap>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(branchDataByCity).map(([city, data]) => (
            <div key={city} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: '#bf2222' }}
                  ></div>
                  <span className="font-bold text-sm">{city}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {data.branches.length} branch{data.branches.length > 1 ? 'es' : ''}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Revenue: ₹{data.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Students: {Math.round(data.totalStudents)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default IndiaMap;
