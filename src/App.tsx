import { useState, FormEvent } from "react";

type Unit = "celsius" | "fahrenheit" | "kelvin";

interface ConversionResult {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
}

function convertTemperature(value: number, from: Unit): ConversionResult {
  let celsius: number;
  switch (from) {
    case "celsius":
      celsius = value;
      break;
    case "fahrenheit":
      celsius = (value - 32) * (5 / 9);
      break;
    case "kelvin":
      celsius = value - 273.15;
      break;
  }
  const fahrenheit = celsius * (9 / 5) + 32;
  const kelvin = celsius + 273.15;
  return { celsius, fahrenheit, kelvin };
}

function formatTemperature(value: number): string {
  return value.toFixed(2);
}

const unitInfo: Record<
  Unit,
  { label: string; short: string; color: string; icon: string }
> = {
  celsius: {
    label: "Celsius",
    short: "°C",
    color: "from-sky-400 to-blue-600",
    icon: "❄️",
  },
  fahrenheit: {
    label: "Fahrenheit",
    short: "°F",
    color: "from-amber-400 to-orange-600",
    icon: "🔥",
  },
  kelvin: {
    label: "Kelvin",
    short: "K",
    color: "from-rose-400 to-fuchsia-600",
    icon: "⚛️",
  },
};

export default function App() {
  const [input, setInput] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<Unit>("celsius");
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [originalInput, setOriginalInput] = useState<{
    value: number;
    unit: Unit;
  } | null>(null);

  const handleConvert = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (input.trim() === "") {
      setError("Please enter a temperature value.");
      setResult(null);
      return;
    }

    const value = Number(input);
    if (Number.isNaN(value)) {
      setError("Please enter a valid number.");
      setResult(null);
      return;
    }

    if (fromUnit === "kelvin" && value < 0) {
      setError("Kelvin cannot be negative.");
      setResult(null);
      return;
    }

    const converted = convertTemperature(value, fromUnit);
    setOriginalInput({ value, unit: fromUnit });
    setResult(converted);
  };

  const handleReset = () => {
    setInput("");
    setError("");
    setResult(null);
    setOriginalInput(null);
    setFromUnit("celsius");
  };

  const handleSwap = (unit: Unit) => {
    if (!result) return;
    setFromUnit(unit);
    const val = result[unit];
    setInput(String(Math.round(val * 100) / 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-200 mb-4">
            <span className="text-3xl">🌡️</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Temperature Converter
          </h1>
          <p className="text-slate-600">
            Convert between Celsius, Fahrenheit, and Kelvin
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-100 border border-white p-6 sm:p-8">
          <form onSubmit={handleConvert} className="space-y-6">
            {/* Input Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Temperature Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Temperature
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. 32"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 text-lg font-medium placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition"
                />
              </div>

              {/* Unit Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Convert from
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value as Unit)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 text-lg font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition cursor-pointer"
                >
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                  <option value="kelvin">Kelvin (K)</option>
                </select>
              </div>
            </div>

            {/* Radio quick select */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Or pick a unit quickly
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(unitInfo) as Unit[]).map((unit) => {
                  const info = unitInfo[unit];
                  const isActive = fromUnit === unit;
                  return (
                    <button
                      type="button"
                      key={unit}
                      onClick={() => setFromUnit(unit)}
                      className={`relative p-4 rounded-xl border-2 font-semibold transition-all ${
                        isActive
                          ? `bg-gradient-to-br ${info.color} text-white border-transparent shadow-lg scale-[1.02]`
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-2xl mb-1">{info.icon}</div>
                      <div className="text-sm">{info.label}</div>
                      <div
                        className={`text-xs ${isActive ? "text-white/80" : "text-slate-500"}`}
                      >
                        {info.short}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                type="submit"
                className="flex-1 min-w-[120px] px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                🔄 Convert
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Results */}
          {result && originalInput && (
            <div className="mt-8 pt-8 border-t-2 border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Conversion Results
                </h2>
                <span className="text-sm text-slate-500 font-medium">
                  From: {formatTemperature(originalInput.value)}{" "}
                  {unitInfo[originalInput.unit].short}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(Object.keys(unitInfo) as Unit[]).map((unit) => {
                  const info = unitInfo[unit];
                  const isSource = unit === originalInput.unit;
                  const val = result[unit];
                  return (
                    <div
                      key={unit}
                      onClick={() => handleSwap(unit)}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSource
                          ? "border-indigo-300 bg-indigo-50/50"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      <div
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${info.color} text-white text-lg shadow-sm mb-3`}
                      >
                        {info.icon}
                      </div>
                      <div className="text-sm font-semibold text-slate-600 mb-1">
                        {info.label}
                      </div>
                      <div className="text-2xl font-bold text-slate-900 tabular-nums">
                        {formatTemperature(val)}
                        <span className="text-lg text-slate-500 ml-1">
                          {info.short}
                        </span>
                      </div>
                      {isSource && (
                        <span className="absolute top-3 right-3 text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-lg">
                          INPUT
                        </span>
                      )}
                      {!isSource && (
                        <span className="absolute top-3 right-3 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          ↻ use
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Formula hints */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  💡 Formula used
                </div>
                <p className="text-sm text-slate-700 font-mono">
                  {originalInput.unit === "celsius" &&
                    "°F = °C × 9/5 + 32    |    K = °C + 273.15"}
                  {originalInput.unit === "fahrenheit" &&
                    "°C = (°F − 32) × 5/9    |    K = (°F − 32) × 5/9 + 273.15"}
                  {originalInput.unit === "kelvin" &&
                    "°C = K − 273.15    |    °F = (K − 273.15) × 9/5 + 32"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500">
          Tip: Click any result card to convert from that unit instead.
        </div>
      </div>
    </div>
  );
}
