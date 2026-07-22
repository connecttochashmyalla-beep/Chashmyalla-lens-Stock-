import { useState, useEffect, useRef } from 'react';
import { RotateCcw, Plus, X, Eye } from 'lucide-react';

const emptyRx = () => ({
  rightEye: { sphere: '', cylinder: '', axis: '', pd: '' },
  leftEye: { sphere: '', cylinder: '', axis: '', pd: '' },
  add: ''
});

/**
 * Shared stock/pricing data shape — same as before, unchanged.
 * In production, replace this with a fetch/props call to the stock system.
 */
const stockPricingData = {
  SingleVision: {
    Simple: {
      HC: {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 1000, stock: 40 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 1000, stock: 35 },
          { index: 'highIndex', sphMax: 20, cylMax: 6, price: 1500, stock: 12 }
        ]
      },
      'Super HC': {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 1800, stock: 18 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 2000, stock: 3 }
        ]
      },
      WT: {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 100, stock: 60 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 100, stock: 55 },
          { index: 'highIndex', sphMax: 20, cylMax: 6, price: 500, stock: 20 }
        ]
      },
      'MC PC': {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 3000, stock: 9 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 3500, stock: 9 },
          { index: 'highIndex', sphMax: 20, cylMax: 6, price: 3500, stock: 4 }
        ]
      }
    },
    UV: {
      'BC Green': {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 1500, stock: 22 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 1800, stock: 22 },
          { index: 'highIndex', sphMax: 20, cylMax: 6, price: 2500, stock: 8 }
        ]
      },
      'BC Blue': { mode: 'singleVision', tiers: [{ index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 2000, stock: 14 }] },
      AXIS: {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 2000, stock: 17 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 2200, stock: 17 }
        ]
      },
      EAGLE: {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 3500, stock: 11 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 3800, stock: 11 },
          { index: 'highIndex', sphMax: 20, cylMax: 6, price: 4500, stock: 5 }
        ]
      },
      'BC PC': {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 4000, stock: 6 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 4200, stock: 6 },
          { index: 'highIndex', sphMax: 20, cylMax: 6, price: 5500, stock: 2 }
        ]
      },
      'TECC BC': {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 3500, stock: 0 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 3800, stock: 0 }
        ]
      },
      DRIVAZE: {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 3500, stock: 13 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 3800, stock: 13 },
          { index: 'highIndex', sphMax: 20, cylMax: 6, price: 5000, stock: 4 }
        ]
      },
      'VISION MAX': { mode: 'singleVision', tiers: [{ index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 5000, stock: 7 }] }
    },
    Solar: {
      CRPG: {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 1800, stock: 19 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 2000, stock: 19 },
          { index: 'highIndex', sphMax: 20, cylMax: 6, price: 3000, stock: 6 }
        ]
      },
      CRPB: { mode: 'singleVision', tiers: [{ index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 2000, stock: 10 }] }
    },
    'UV+Solar': {
      '4 in 1': {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 3500, stock: 8 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 3800, stock: 8 },
          { index: 'highIndex', sphMax: 20, cylMax: 6, price: 5000, stock: 3 }
        ]
      },
      '5 in 1': {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 5000, stock: 5 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 5000, stock: 5 },
          { index: 'highIndex', sphMax: 20, cylMax: 6, price: 7200, stock: 2 }
        ]
      }
    },
    Sunglasses: {
      Sunglasses: {
        mode: 'singleVision',
        tiers: [
          { index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 3000, stock: 25 },
          { index: 'standard', signContext: 'plus', sphMax: 6, cylMax: 2, price: 3000, stock: 25 },
          { index: 'highIndex', sphMax: 20, cylMax: 6, price: 5000, stock: 9 }
        ]
      },
      Polarized: { mode: 'singleVision', tiers: [{ index: 'standard', signContext: 'minus', sphMax: 6, cylMax: 2, price: 4000, stock: 12 }] }
    }
  },
  Bifocal: {
    Simple: {
      'HC+': { mode: 'T1', signContext: 'plus', tiers: [{ subTier: 'KT', price: 1800, stock: 14 }, { subTier: 'KTD', price: 2000, stock: 9 }, { subTier: 'PROG', price: 2500, stock: 5 }] },
      'HC-': { mode: 'T1', signContext: 'minus', tiers: [{ subTier: 'KT', price: 2000, stock: 14 }, { subTier: 'KTD', price: 2500, stock: 9 }, { subTier: 'PROG', price: 3000, stock: 5 }] },
      WT: { mode: 'T1', signContext: 'both', tiers: [{ subTier: 'KT', price: 1500, stock: 20 }] },
      'WT KT': { mode: 'T2', price: 2500, stock: 20 },
      'HC KT': { mode: 'T2', price: 3500, stock: 12 },
      'HC KT D': { mode: 'T2', price: 4000, stock: 8 },
      'HC PROG': { mode: 'T2', price: 4000, stock: 6 }
    },
    UV: {
      'BC PC': { mode: 'T1', signContext: 'both', tiers: [{ subTier: 'PROG', price: 4500, stock: 4 }] },
      'BC+': { mode: 'T1', signContext: 'plus', tiers: [{ subTier: 'KT', price: 3000, stock: 7 }, { subTier: 'KTD', price: 3500, stock: 5 }, { subTier: 'PROG', price: 4000, stock: 3 }] },
      'BC-': { mode: 'T1', signContext: 'minus', tiers: [{ subTier: 'KT', price: 3500, stock: 7 }, { subTier: 'KTD', price: 4500, stock: 5 }, { subTier: 'PROG', price: 4500, stock: 3 }] },
      BC: { mode: 'T2', price: 5000, stock: 6 },
      'BC PROG': { mode: 'T2', price: 6000, stock: 4 }
    },
    Solar: {
      'CRPG+': { mode: 'T1', signContext: 'plus', tiers: [{ subTier: 'KT', price: 2800, stock: 9 }, { subTier: 'KTD', price: 3500, stock: 6 }, { subTier: 'PROG', price: 4000, stock: 3 }] },
      'CRPG-': { mode: 'T1', signContext: 'minus', tiers: [{ subTier: 'KT', price: 3500, stock: 9 }, { subTier: 'KTD', price: 4000, stock: 6 }, { subTier: 'PROG', price: 5000, stock: 3 }] },
      'PG+': { mode: 'T1', signContext: 'plus', tiers: [{ subTier: 'KT', price: 1800, stock: 11 }] },
      'PG-': { mode: 'T1', signContext: 'minus', tiers: [{ subTier: 'KT', price: 2000, stock: 11 }] },
      'CRPG KT': { mode: 'T2', price: 5000, stock: 5 },
      'CRPG PROG': { mode: 'T2', price: 6500, stock: 2 }
    },
    'UV+Solar': {
      '4 in 1': { mode: 'T1', signContext: 'both', tiers: [{ subTier: 'KT', price: 5000, stock: 4 }, { subTier: 'KTD', price: 6000, stock: 2 }] },
      '5 in 1': { mode: 'T1', signContext: 'both', tiers: [{ subTier: 'KT', price: 6000, stock: 3 }, { subTier: 'KTD', price: 7500, stock: 1 }] },
      '4 IN 1': { mode: 'T2', price: 7000, stock: 5 },
      '4 IN 1 PROG': { mode: 'T2', price: 10000, stock: 2 }
    }
  }
};

// Picker values: ±0.25 steps from 0.00 to 8.00
const PICKER_VALUES = Array.from({ length: 65 }, (_, i) => Math.round((i - 32) * 25) / 100);
const formatSigned = (v) => (v === 0 ? '0.00' : v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2));

export default function PrescriptionLensFlow() {
  const [prescription, setPrescription] = useState({
    rightEye: { sphere: '', cylinder: '', axis: '', pd: '' },
    leftEye: { sphere: '', cylinder: '', axis: '', pd: '' },
    add: ''
  });
  const [selectedVisionType, setSelectedVisionType] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [prescriptionDone, setPrescriptionDone] = useState(false);

  // Saved reference prescriptions — separate from the active prescription above.
  // These are just a customer history log; saving one never touches `prescription`.
  const [savedReferences, setSavedReferences] = useState([]);
  const [showReferencePopup, setShowReferencePopup] = useState(false);
  const [referenceDraft, setReferenceDraft] = useState(emptyRx());

  // SPH/CYL number picker (tap-to-select grid; typing directly still works too)
  const [activePicker, setActivePicker] = useState(null); // { eye, field } | null
  const [pickerFilter, setPickerFilter] = useState('all'); // 'all' | 'positive' | 'negative'

  const openPicker = (eye, field) => {
    setActivePicker({ eye, field });
    setPickerFilter('all');
  };
  const closePicker = () => setActivePicker(null);
  const selectPickerValue = (value) => {
    if (activePicker) {
      handlePrescriptionChange(activePicker.eye, activePicker.field, formatSigned(value));
    }
    setActivePicker(null);
  };
  const pickerScrollRef = useRef(null);
  const pickerZeroRef = useRef(null);
  useEffect(() => {
    if (activePicker && pickerZeroRef.current && pickerScrollRef.current) {
      // Open the popup scrolled so 0 sits at the top: positives are further up, negatives further down.
      pickerZeroRef.current.scrollIntoView({ block: 'start' });
    }
  }, [activePicker, pickerFilter]);
  const getFilteredPickerValues = () => {
    let values;
    if (pickerFilter === 'positive') values = PICKER_VALUES.filter((v) => v >= 0);
    else if (pickerFilter === 'negative') values = PICKER_VALUES.filter((v) => v <= 0);
    else values = PICKER_VALUES;
    // Descending order: positive values at the top, negative values at the bottom, 0 in the middle
    return [...values].sort((a, b) => b - a);
  };

  // ---- Prescription chart helpers ----
  const isAxisRequired = (eye) => {
    const cyl = prescription[eye].cylinder;
    return cyl && cyl !== '0' && cyl !== '';
  };
  const isAxisValid = (eye) => {
    if (!isAxisRequired(eye)) return true;
    return prescription[eye].axis && prescription[eye].axis !== '';
  };
  const getAxisInputClassSoft = (eye) => {
    if (!isAxisRequired(eye)) return 'w-full px-3 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent';
    if (isAxisValid(eye)) return 'w-full px-3 py-2.5 text-sm bg-green-50 border-2 border-green-300 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent';
    return 'w-full px-3 py-2.5 text-sm bg-red-50 border-2 border-red-300 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-transparent';
  };

  const handlePrescriptionChange = (eye, field, value) => {
    setPrescription((prev) => ({ ...prev, [eye]: { ...prev[eye], [field]: value } }));
    setSelectedVisionType('');
    setPrescriptionDone(false);
  };

  const handleResetPrescription = () => {
    setPrescription({
      rightEye: { sphere: '', cylinder: '', axis: '', pd: '' },
      leftEye: { sphere: '', cylinder: '', axis: '', pd: '' },
      add: ''
    });
    setSelectedVisionType('');
    setPrescriptionDone(false);
  };

  // ---- Reference prescription popup (customer history — read-only reference) ----
  const handleReferenceDraftChange = (eye, field, value) => {
    setReferenceDraft((prev) => ({ ...prev, [eye]: { ...prev[eye], [field]: value } }));
  };

  const handleSaveReference = () => {
    setSavedReferences((prev) => [...prev, { ...referenceDraft, savedAt: new Date().toLocaleDateString() }]);
    setReferenceDraft(emptyRx());
    setShowReferencePopup(false);
  };

  const handleCancelReference = () => {
    setReferenceDraft(emptyRx());
    setShowReferencePopup(false);
  };

  // ---- Vision type: Distance / NearSide / Bifocal ----
  const getAvailableVisionTypes = () => {
    const addValue = parseFloat(prescription.add) || 0;
    if (addValue === 0) return ['Distance'];
    return ['Distance', 'NearSide', 'Bifocal'];
  };

  const getFinalPrescription = () => {
    const rightSph = parseFloat(prescription.rightEye.sphere) || 0;
    const leftSph = parseFloat(prescription.leftEye.sphere) || 0;
    const addValue = parseFloat(prescription.add) || 0;

    const formatValue = (v) => (!v || v === '0' || v === 0 ? '' : v);
    const formatWithSign = (v) => {
      if (!v || v === '0' || v === 0) return '';
      const n = parseFloat(v);
      return n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
    };

    if (selectedVisionType === 'NearSide') {
      return {
        rightEye: {
          sphere: formatWithSign(rightSph + addValue),
          cylinder: formatValue(prescription.rightEye.cylinder),
          axis: formatValue(prescription.rightEye.axis),
          pd: formatValue(prescription.rightEye.pd)
        },
        leftEye: {
          sphere: formatWithSign(leftSph + addValue),
          cylinder: formatValue(prescription.leftEye.cylinder),
          axis: formatValue(prescription.leftEye.axis),
          pd: formatValue(prescription.leftEye.pd)
        }
      };
    }
    if (selectedVisionType === 'Distance') {
      return {
        rightEye: {
          sphere: formatValue(prescription.rightEye.sphere),
          cylinder: formatValue(prescription.rightEye.cylinder),
          axis: formatValue(prescription.rightEye.axis),
          pd: formatValue(prescription.rightEye.pd)
        },
        leftEye: {
          sphere: formatValue(prescription.leftEye.sphere),
          cylinder: formatValue(prescription.leftEye.cylinder),
          axis: formatValue(prescription.leftEye.axis),
          pd: formatValue(prescription.leftEye.pd)
        }
      };
    }
    if (selectedVisionType === 'Bifocal') {
      return {
        rightEye: {
          sphere: formatValue(prescription.rightEye.sphere),
          cylinder: formatValue(prescription.rightEye.cylinder),
          axis: formatValue(prescription.rightEye.axis),
          pd: formatValue(prescription.rightEye.pd),
          add: formatValue(prescription.add)
        },
        leftEye: {
          sphere: formatValue(prescription.leftEye.sphere),
          cylinder: formatValue(prescription.leftEye.cylinder),
          axis: formatValue(prescription.leftEye.axis),
          pd: formatValue(prescription.leftEye.pd),
          add: formatValue(prescription.add)
        }
      };
    }
    return null;
  };

  // ---- Pricing method — copied unchanged from the stock-connected version ----
  const getMaxAbsSph = () => {
    const r = Math.abs(parseFloat(prescription.rightEye.sphere) || 0);
    const l = Math.abs(parseFloat(prescription.leftEye.sphere) || 0);
    return Math.max(r, l);
  };
  const getMaxAbsCyl = () => {
    const r = Math.abs(parseFloat(prescription.rightEye.cylinder) || 0);
    const l = Math.abs(parseFloat(prescription.leftEye.cylinder) || 0);
    return Math.max(r, l);
  };
  const getSignContext = () => {
    const rightSph = parseFloat(prescription.rightEye.sphere) || 0;
    const leftSph = parseFloat(prescription.leftEye.sphere) || 0;
    const rightPositive = rightSph >= 0;
    const leftPositive = leftSph >= 0;
    if (rightPositive !== leftPositive) return 'plus';
    return rightPositive ? 'plus' : 'minus';
  };
  const hasCylValue = () => {
    const r = parseFloat(prescription.rightEye.cylinder) || 0;
    const l = parseFloat(prescription.leftEye.cylinder) || 0;
    return r !== 0 || l !== 0;
  };
  const pickSingleVisionTier = (variant) => {
    const maxSph = getMaxAbsSph();
    const maxCyl = getMaxAbsCyl();
    const sign = getSignContext();
    const matching = variant.tiers.filter(
      (t) => (!t.signContext || t.signContext === sign) && maxSph <= t.sphMax && maxCyl <= t.cylMax
    );
    if (matching.length === 0) return null;
    matching.sort((a, b) => (a.index === 'standard' ? -1 : 1));
    return matching[0];
  };
  const getAvailableLensOptions = (lensType) => {
    const category = selectedVisionType === 'Bifocal' ? 'Bifocal' : 'SingleVision';
    const typeData = stockPricingData[category]?.[lensType];
    if (!typeData) return [];

    const options = [];

    if (category === 'SingleVision') {
      Object.entries(typeData).forEach(([name, variant]) => {
        const tier = pickSingleVisionTier(variant);
        if (tier) {
          options.push({
            key: `${lensType}-${name}`,
            name,
            price: tier.price,
            stock: tier.stock,
            indexLabel: tier.index === 'highIndex' ? 'High Index' : 'Standard'
          });
        }
      });
      return options;
    }

    const cylPresent = hasCylValue();
    const sign = getSignContext();

    Object.entries(typeData).forEach(([name, variant]) => {
      if (variant.mode === 'T1' && !cylPresent) {
        if (variant.signContext !== 'both' && variant.signContext !== sign) return;
        variant.tiers.forEach((t) => {
          options.push({
            key: `${lensType}-${name}-${t.subTier}`,
            name: `${name} (${t.subTier})`,
            price: t.price,
            stock: t.stock,
            indexLabel: null
          });
        });
      } else if (variant.mode === 'T2' && cylPresent) {
        options.push({ key: `${lensType}-${name}`, name, price: variant.price, stock: variant.stock, indexLabel: null });
      }
    });

    return options;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">PRESCRIPTION DETAILS</h2>
      </div>

      {/* Source selector: Card / Exam / Glasses (single select) */}
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-2 max-w-xs">
          {['Card', 'Exam', 'Glasses'].map((source) => (
            <button
              key={source}
              onClick={() => setSelectedSource(selectedSource === source ? '' : source)}
              className={`py-1.5 px-2 rounded-md border transition-all text-xs font-medium ${
                selectedSource === source
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Prescription chart — blue header card, matching reference design */}
      {selectedSource && (
        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">Prescription Details</h3>
                <p className="text-xs text-blue-100 leading-tight">Via {selectedSource}</p>
              </div>
            </div>
            <button
              onClick={handleResetPrescription}
              title="Reset prescription"
              className="flex items-center justify-center w-8 h-8 bg-white/15 hover:bg-white/25 text-white rounded-full transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white p-6">
            <button
              onClick={() => setShowReferencePopup(true)}
              title="Save a previous prescription as reference"
              className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 mb-4 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Save previous as reference
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-3"></div>
              <div className="grid grid-cols-4 gap-3 flex-1">
                <div className="text-center text-xs font-medium text-gray-500">SPH</div>
                <div className="text-center text-xs font-medium text-gray-500">CYL</div>
                <div className="text-center text-xs font-medium text-gray-500">AXIS</div>
                <div className="text-center text-xs font-medium text-gray-500">PD</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="font-semibold text-gray-700 text-lg w-3">R</div>
              <div className="grid grid-cols-4 gap-3 flex-1">
                <div className="relative">
                  <input type="text" placeholder="±0.0" value={prescription.rightEye.sphere}
                    onChange={(e) => handlePrescriptionChange('rightEye', 'sphere', e.target.value)}
                    className="w-full pl-3 pr-7 py-2.5 text-sm bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
                  <button type="button" onClick={() => openPicker('rightEye', 'sphere')} title="Pick value"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 text-xs">▦</button>
                </div>
                <div className="relative">
                  <input type="text" placeholder="±0.0" value={prescription.rightEye.cylinder}
                    onChange={(e) => handlePrescriptionChange('rightEye', 'cylinder', e.target.value)}
                    className="w-full pl-3 pr-7 py-2.5 text-sm bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
                  <button type="button" onClick={() => openPicker('rightEye', 'cylinder')} title="Pick value"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 text-xs">▦</button>
                </div>
                <input type="text" placeholder="0-180" value={prescription.rightEye.axis}
                  onChange={(e) => handlePrescriptionChange('rightEye', 'axis', e.target.value)}
                  className={getAxisInputClassSoft('rightEye')} />
                <input type="text" placeholder="63mm" value={prescription.rightEye.pd}
                  onChange={(e) => handlePrescriptionChange('rightEye', 'pd', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <div className="font-semibold text-gray-700 text-lg w-3">L</div>
              <div className="grid grid-cols-4 gap-3 flex-1">
                <div className="relative">
                  <input type="text" placeholder="±0.0" value={prescription.leftEye.sphere}
                    onChange={(e) => handlePrescriptionChange('leftEye', 'sphere', e.target.value)}
                    className="w-full pl-3 pr-7 py-2.5 text-sm bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
                  <button type="button" onClick={() => openPicker('leftEye', 'sphere')} title="Pick value"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 text-xs">▦</button>
                </div>
                <div className="relative">
                  <input type="text" placeholder="±0.0" value={prescription.leftEye.cylinder}
                    onChange={(e) => handlePrescriptionChange('leftEye', 'cylinder', e.target.value)}
                    className="w-full pl-3 pr-7 py-2.5 text-sm bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
                  <button type="button" onClick={() => openPicker('leftEye', 'cylinder')} title="Pick value"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 text-xs">▦</button>
                </div>
                <input type="text" placeholder="0-180" value={prescription.leftEye.axis}
                  onChange={(e) => handlePrescriptionChange('leftEye', 'axis', e.target.value)}
                  className={getAxisInputClassSoft('leftEye')} />
                <input type="text" placeholder="63mm" value={prescription.leftEye.pd}
                  onChange={(e) => handlePrescriptionChange('leftEye', 'pd', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-500 mb-2">ADD</label>
              <input type="text" placeholder="+0.00" value={prescription.add}
                onChange={(e) => {
                  setPrescription((prev) => ({ ...prev, add: e.target.value }));
                  setSelectedVisionType('');
                  setPrescriptionDone(false);
                }}
                className="w-full max-w-xs px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 text-gray-700 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!isAxisValid('rightEye') || !isAxisValid('leftEye')) {
                    alert('Please enter AXIS value when CYL is provided.');
                    return;
                  }
                  setPrescriptionDone(true);
                }}
                title="Done"
                className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
              >
                ✅
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved reference prescriptions — history only, doesn't affect the active prescription */}
      {savedReferences.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Saved References</p>
          <div className="space-y-2">
            {savedReferences.map((ref, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
                <span className="font-medium text-gray-800">{ref.savedAt}</span>
                {' — R: '}
                {[ref.rightEye.sphere && `SPH ${ref.rightEye.sphere}`, ref.rightEye.cylinder && `CYL ${ref.rightEye.cylinder}`, ref.rightEye.axis && `AXIS ${ref.rightEye.axis}`]
                  .filter(Boolean)
                  .join(' ') || '—'}
                {' | L: '}
                {[ref.leftEye.sphere && `SPH ${ref.leftEye.sphere}`, ref.leftEye.cylinder && `CYL ${ref.leftEye.cylinder}`, ref.leftEye.axis && `AXIS ${ref.leftEye.axis}`]
                  .filter(Boolean)
                  .join(' ') || '—'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reference prescription popup — saves to history only, never touches the active prescription above */}
      {showReferencePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="relative bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border border-slate-200 rounded-2xl p-6 shadow-2xl max-w-md w-full">
            <button
              onClick={handleCancelReference}
              className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="text-slate-500 text-xs font-medium tracking-widest uppercase mb-5 text-center">
              Previous Prescription (Reference Only)
            </p>

            <div className="grid grid-cols-5 gap-3 mb-2">
              <div></div>
              <div className="text-center text-xs font-medium text-slate-500">SPH</div>
              <div className="text-center text-xs font-medium text-slate-500">CYL</div>
              <div className="text-center text-xs font-medium text-slate-500">AXIS</div>
              <div className="text-center text-xs font-medium text-slate-500">PD</div>
            </div>

            <div className="grid grid-cols-5 gap-3 items-center mb-4">
              <div className="font-semibold text-slate-700 text-lg">R</div>
              <input type="text" placeholder="±0.00" value={referenceDraft.rightEye.sphere}
                onChange={(e) => handleReferenceDraftChange('rightEye', 'sphere', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
              <input type="text" placeholder="±0.00" value={referenceDraft.rightEye.cylinder}
                onChange={(e) => handleReferenceDraftChange('rightEye', 'cylinder', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
              <input type="text" placeholder="0-180" value={referenceDraft.rightEye.axis}
                onChange={(e) => handleReferenceDraftChange('rightEye', 'axis', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
              <input type="text" placeholder="63mm" value={referenceDraft.rightEye.pd}
                onChange={(e) => handleReferenceDraftChange('rightEye', 'pd', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
            </div>

            <div className="grid grid-cols-5 gap-3 items-center mb-5">
              <div className="font-semibold text-slate-700 text-lg">L</div>
              <input type="text" placeholder="±0.00" value={referenceDraft.leftEye.sphere}
                onChange={(e) => handleReferenceDraftChange('leftEye', 'sphere', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
              <input type="text" placeholder="±0.00" value={referenceDraft.leftEye.cylinder}
                onChange={(e) => handleReferenceDraftChange('leftEye', 'cylinder', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
              <input type="text" placeholder="0-180" value={referenceDraft.leftEye.axis}
                onChange={(e) => handleReferenceDraftChange('leftEye', 'axis', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
              <input type="text" placeholder="63mm" value={referenceDraft.leftEye.pd}
                onChange={(e) => handleReferenceDraftChange('leftEye', 'pd', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-slate-500 mb-2">ADD</label>
              <input type="text" placeholder="+0.00" value={referenceDraft.add}
                onChange={(e) => setReferenceDraft((prev) => ({ ...prev, add: e.target.value }))}
                className="w-full max-w-xs px-3 py-2.5 text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent" />
            </div>

            <button
              onClick={handleSaveReference}
              title="Save as reference"
              className="w-full flex items-center justify-center w-10 h-10 mx-auto bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
            >
              ✅
            </button>
          </div>
        </div>
      )}

      {/* 2. Vision type: Distance / NearSide / Bifocal */}
      {prescriptionDone && (
      <>
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-3 text-gray-700">
          Vision Type *
          <span className="text-sm text-gray-500 font-normal ml-2">
            {getAvailableVisionTypes().length === 1 ? '(Auto-selected)' : '(Select based on your needs)'}
          </span>
        </label>
        {getAvailableVisionTypes().length > 1 ? (
          <div className="grid grid-cols-3 gap-3">
            {getAvailableVisionTypes().map((type) => (
              <button
                key={type}
                onClick={() => setSelectedVisionType(type)}
                className={`p-4 rounded-lg border-2 transition-all font-semibold ${
                  selectedVisionType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => setSelectedVisionType('Distance')}
            className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg text-left"
          >
            <p className="text-blue-800 font-medium">✓ Auto-Selected: <strong>Distance</strong> (Single Vision)</p>
          </button>
        )}
      </div>

      {/* 3. Final result */}
      {selectedVisionType && (() => {
        const finalRx = getFinalPrescription();
        if (!finalRx) return null;
        return (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-green-800 mb-3 text-lg">Final Reading Result — {selectedVisionType}</h4>
            <div className="bg-white rounded-md p-4 space-y-2">
              <div className="text-sm">
                <span className="font-semibold text-gray-700">R: </span>
                <span className="text-gray-800">
                  {[
                    finalRx.rightEye.sphere && `SPH ${finalRx.rightEye.sphere}`,
                    finalRx.rightEye.cylinder && `CYL ${finalRx.rightEye.cylinder}`,
                    finalRx.rightEye.axis && `AXIS ${finalRx.rightEye.axis}`,
                    finalRx.rightEye.pd && `PD ${finalRx.rightEye.pd}`,
                    finalRx.rightEye.add && `ADD ${finalRx.rightEye.add}`
                  ].filter(Boolean).join(' | ')}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-700">L: </span>
                <span className="text-gray-800">
                  {[
                    finalRx.leftEye.sphere && `SPH ${finalRx.leftEye.sphere}`,
                    finalRx.leftEye.cylinder && `CYL ${finalRx.leftEye.cylinder}`,
                    finalRx.leftEye.axis && `AXIS ${finalRx.leftEye.axis}`,
                    finalRx.leftEye.pd && `PD ${finalRx.leftEye.pd}`,
                    finalRx.leftEye.add && `ADD ${finalRx.leftEye.add}`
                  ].filter(Boolean).join(' | ')}
                </span>
              </div>
            </div>
          </div>
        );
      })()}
      </>
      )}

      {/* SPH/CYL number picker popup — tap-to-select grid, ±0.25 steps from 0.25 to 24.00 */}
      {activePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end sm:items-center justify-center z-50" onClick={closePicker}>
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm max-h-[75vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-500 px-2 py-3 flex items-center justify-between shrink-0">
              {['positive', 'all', 'negative'].map((f) => (
                <button
                  key={f}
                  onClick={() => setPickerFilter(f)}
                  className="flex-1 flex flex-col items-center gap-1 py-1"
                >
                  <span className={`text-sm font-medium ${pickerFilter === f ? 'text-white font-bold' : 'text-red-100'}`}>
                    {f === 'positive' ? 'Positive (+)' : f === 'negative' ? 'Negative (-)' : 'All'}
                  </span>
                  {pickerFilter === f && <span className="w-6 h-0.5 bg-white rounded-full" />}
                </button>
              ))}
            </div>

            <div ref={pickerScrollRef} className="flex-1 min-h-0 overflow-y-auto p-3">
              <div className="grid grid-cols-4 gap-2">
                {getFilteredPickerValues().map((v) => {
                  const label = formatSigned(v);
                  const isSelected = activePicker && parseFloat(prescription[activePicker.eye][activePicker.field] || '') === v;
                  return (
                    <button
                      key={v}
                      ref={v === 0 ? pickerZeroRef : null}
                      onClick={() => selectPickerValue(v)}
                      className={`py-3 rounded-lg text-sm font-bold transition-colors ${
                        isSelected ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
