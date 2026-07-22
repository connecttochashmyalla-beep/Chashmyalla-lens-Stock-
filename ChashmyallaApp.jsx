import React, { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const ChashmyallaApp = () => {
  const [activeTab, setActiveTab] = useState('single-vision')
  const [stockData, setStockData] = useState({})
  const [priceData, setPriceData] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState('Never')

  const categories = {
    'single-vision': 'Single Vision',
    'bifocal': 'Bifocal',
    'rx': 'Rx',
    'contact-lens': 'Contact Lens'
  }

  const sphRange = [-6, -5.5, -5, -4.5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]
  const cylRange = [0, -0.25, -0.5, -0.75, -1, -1.25, -1.5, -1.75, -2]

  useEffect(() => {
    const loadData = async () => {
      try {
        const stockRef = ref(database, 'stockData')
        const priceRef = ref(database, 'priceData')
        
        const stockSnap = await get(stockRef)
        const priceSnap = await get(priceRef)
        
        if (stockSnap.exists()) setStockData(stockSnap.val())
        if (priceSnap.exists()) setPriceData(priceSnap.val())
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const saveData = async () => {
      try {
        await set(ref(database, 'stockData'), stockData)
        await set(ref(database, 'priceData'), priceData)
        setLastSaved(new Date().toLocaleTimeString())
      } catch (error) {
        console.error('Error saving data:', error)
      }
    }

    if (Object.keys(stockData).length > 0 || Object.keys(priceData).length > 0) {
      saveData()
    }
  }, [stockData, priceData])

  const updateStock = (key, value) => {
    setStockData(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }))
  }

  const updatePrice = (key, value) => {
    setPriceData(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }))
  }

  const getStockKey = (category, sph, cyl) => `${category}_${sph}_${cyl}`

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">Loading Chashmyalla...</div>
          <p className="text-gray-600 mt-2">Connecting to Firebase</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <h1 className="text-3xl font-bold">Chashmyalla</h1>
          <p className="text-green-100 mt-1">Lens Stock & Pricing System</p>
          <p className="text-xs text-green-100 mt-3">Last saved: {lastSaved}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6 p-2 flex gap-2 flex-wrap">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded font-semibold transition-all ${
                activeTab === key
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pricing - {categories[activeTab]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tier 1 Price (PKR)</label>
              <input
                type="number"
                value={priceData[`${activeTab}_t1`] || ''}
                onChange={(e) => updatePrice(`${activeTab}_t1`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="E.g., 2500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tier 2 Price (PKR)</label>
              <input
                type="number"
                value={priceData[`${activeTab}_t2`] || ''}
                onChange={(e) => updatePrice(`${activeTab}_t2`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="E.g., 3500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">High Index (PKR)</label>
              <input
                type="number"
                value={priceData[`${activeTab}_hi`] || ''}
                onChange={(e) => updatePrice(`${activeTab}_hi`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="E.g., 4500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Stock Grid - {categories[activeTab]}</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-green-300">Standard Index</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">SPH / CYL</th>
                    {cylRange.map(cyl => (
                      <th key={cyl} className="px-2 py-2 text-center font-semibold text-gray-700 text-xs">{cyl}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sphRange.map(sph => (
                    <tr key={sph} className="border-b hover:bg-green-50">
                      <td className="px-4 py-2 font-semibold text-gray-700 bg-gray-50">{sph}</td>
                      {cylRange.map(cyl => (
                        <td key={`${sph}_${cyl}`} className="px-2 py-2 text-center">
                          <input
                            type="number"
                            value={stockData[getStockKey(`${activeTab}_std`, sph, cyl)] || ''}
                            onChange={(e) => updateStock(getStockKey(`${activeTab}_std`, sph, cyl), e.target.value)}
                            className="w-12 px-1 py-1 border border-gray-300 rounded text-center text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-green-300">High Index (1.6+)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">SPH / CYL</th>
                    {cylRange.map(cyl => (
                      <th key={cyl} className="px-2 py-2 text-center font-semibold text-gray-700 text-xs">{cyl}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sphRange.map(sph => (
                    <tr key={sph} className="border-b hover:bg-green-50">
                      <td className="px-4 py-2 font-semibold text-gray-700 bg-gray-50">{sph}</td>
                      {cylRange.map(cyl => (
                        <td key={`${sph}_${cyl}`} className="px-2 py-2 text-center">
                          <input
                            type="number"
                            value={stockData[getStockKey(`${activeTab}_hi`, sph, cyl)] || ''}
                            onChange={(e) => updateStock(getStockKey(`${activeTab}_hi`, sph, cyl), e.target.value)}
                            className="w-12 px-1 py-1 border border-green-300 rounded text-center text-xs focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                            placeholder="0"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-gray-600">✓ Data auto-saves to Firebase</p>
        </div>
      </div>
    </div>
  )
}

export default ChashmyallaApp
