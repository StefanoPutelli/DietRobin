'use client';

import React from 'react';
import { ParsedNutritionData } from '@/lib/foodApi';


export default function NutritionDisplay({ npdata }: { npdata: ParsedNutritionData }) {

  const [portionSize, setPortionSize] = React.useState(1);

  function calculatePortionSize(nutrients: ParsedNutritionData) {
    return {
      ...nutrients,
      energy: nutrients.energy.map(item => ({
      ...item,
      value: item.value * portionSize % 1 === 0 ? item.value * portionSize : (item.value * portionSize).toFixed(2)
      })),
      mainNutrients: Object.fromEntries(
      Object.entries(nutrients.mainNutrients).map(([key, items]) => [
        key,
        items.map(item => ({
        ...item,
        value: item.value * portionSize % 1 === 0 ? item.value * portionSize : (item.value * portionSize).toFixed(2)
        }))
      ])
      ),
      microNutrients: Object.fromEntries(
      Object.entries(nutrients.microNutrients).map(([key, items]) => [
        key,
        items.map(item => ({
        ...item,
        value: item.value * portionSize % 1 === 0 ? item.value * portionSize : (item.value * portionSize).toFixed(2)
        }))
      ])
      )
    };
  }

  const data = calculatePortionSize(npdata);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{data.name}</h2>
      <p className="text-gray-600 mb-2">Category: {data.category}</p>

      {/* Select portion size */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-semibold">Select portion size:</label>
        <select className="border p-2 rounded" value={portionSize} onChange={(e) => setPortionSize(parseInt(e.target.value))}>
          <option value={1}>100g</option>
          <option value={2}>200g</option>
          <option value={3}>300g</option>
        </select>
      </div>

      {/* Energy Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Energy Value</h3>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nutrient</th>
              <th className="border p-2">Value</th>
              <th className="border p-2">Unit</th>
            </tr>
          </thead>
          <tbody>
            {data.energy.map((item, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.value}</td>
                <td className="border p-2">{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Nutrients */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Main Nutrients</h3>
        {Object.entries(data.mainNutrients).map(([key, nutrients]) => (
          <details key={key} className="mb-4" open>
            <summary className="cursor-pointer font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</summary>
            <table className="w-full border-collapse border border-gray-200 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Nutrient</th>
                  <th className="border p-2">Value</th>
                  <th className="border p-2">Unit</th>
                </tr>
              </thead>
              <tbody>
                {nutrients.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.value}</td>
                    <td className="border p-2">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        ))}
      </div>

      {/* Micro Nutrients */}
      <div>
        <h3 className="text-lg font-semibold">Micro Nutrients</h3>
        {Object.entries(data.microNutrients).map(([key, nutrients]) => (
          <details key={key} className="mb-4">
            <summary className="cursor-pointer font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</summary>
            <table className="w-full border-collapse border border-gray-200 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Nutrient</th>
                  <th className="border p-2">Value</th>
                  <th className="border p-2">Unit</th>
                </tr>
              </thead>
              <tbody>
                {nutrients.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.value}</td>
                    <td className="border p-2">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        ))}
      </div>
    </div>
  );
};
