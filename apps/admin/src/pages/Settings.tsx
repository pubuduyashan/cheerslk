import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [deliveryFee, setDeliveryFee] = useState({
    baseFee: 250,
    perKmFee: 30,
    freeThreshold: 5000,
    maxDistance: 15,
  });

  const [loyalty, setLoyalty] = useState({
    pointsPerLKR: 0.1,
    redemptionRate: 100,
    bronzeThreshold: 0,
    silverThreshold: 500,
    goldThreshold: 2000,
    platinumThreshold: 5000,
  });

  const [store, setStore] = useState({
    name: 'CheersLK - Main Store',
    address: '123 Main Street, Colombo 07',
    phone: '+94 11 234 5678',
    lat: 6.9271,
    lng: 79.8612,
  });

  const [hours, setHours] = useState([
    { day: 'Monday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Tuesday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Wednesday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Thursday', open: '09:00', close: '22:00', isClosed: false },
    { day: 'Friday', open: '09:00', close: '23:00', isClosed: false },
    { day: 'Saturday', open: '10:00', close: '23:00', isClosed: false },
    { day: 'Sunday', open: '10:00', close: '21:00', isClosed: false },
  ]);

  const [notifications, setNotifications] = useState({
    newOrder: true,
    orderCancellation: true,
    lowStock: true,
    riderVerification: true,
    ageVerification: true,
    dailySummary: false,
  });

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved`);
  };

  const inputClass = 'w-full rounded-lg border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none';
  const labelClass = 'block text-sm text-gray-300 mb-1';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Delivery Fee Configuration */}
      <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Delivery Fee Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Default Base Fee (LKR)</label>
            <input
              type="number"
              value={deliveryFee.baseFee}
              onChange={(e) => setDeliveryFee({ ...deliveryFee, baseFee: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Per Km Fee (LKR)</label>
            <input
              type="number"
              value={deliveryFee.perKmFee}
              onChange={(e) => setDeliveryFee({ ...deliveryFee, perKmFee: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Free Delivery Threshold (LKR)</label>
            <input
              type="number"
              value={deliveryFee.freeThreshold}
              onChange={(e) => setDeliveryFee({ ...deliveryFee, freeThreshold: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Max Delivery Distance (km)</label>
            <input
              type="number"
              value={deliveryFee.maxDistance}
              onChange={(e) => setDeliveryFee({ ...deliveryFee, maxDistance: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleSave('Delivery fee')}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Loyalty Program Settings */}
      <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Loyalty Program</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Points per LKR spent</label>
            <input
              type="number"
              step="0.01"
              value={loyalty.pointsPerLKR}
              onChange={(e) => setLoyalty({ ...loyalty, pointsPerLKR: Number(e.target.value) })}
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1">1 point per Rs. {(1 / loyalty.pointsPerLKR).toFixed(0)} spent</p>
          </div>
          <div>
            <label className={labelClass}>Points to LKR rate</label>
            <input
              type="number"
              value={loyalty.redemptionRate}
              onChange={(e) => setLoyalty({ ...loyalty, redemptionRate: Number(e.target.value) })}
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1">{loyalty.redemptionRate} points = Rs. 1</p>
          </div>
        </div>
        <h4 className="text-sm font-medium text-gray-400 mt-4 mb-3">Tier Thresholds (points)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['bronze', 'silver', 'gold', 'platinum'] as const).map((tier) => {
            const key = `${tier}Threshold` as keyof typeof loyalty;
            const colors: Record<string, string> = {
              bronze: 'text-orange-400',
              silver: 'text-gray-300',
              gold: 'text-yellow-400',
              platinum: 'text-purple-400',
            };
            return (
              <div key={tier}>
                <label className={`block text-sm mb-1 capitalize ${colors[tier]}`}>{tier}</label>
                <input
                  type="number"
                  value={loyalty[key]}
                  onChange={(e) => setLoyalty({ ...loyalty, [key]: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleSave('Loyalty')}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Store Location */}
      <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Store Location</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Store Name</label>
            <input
              value={store.name}
              onChange={(e) => setStore({ ...store, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Address</label>
            <input
              value={store.address}
              onChange={(e) => setStore({ ...store, address: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              value={store.phone}
              onChange={(e) => setStore({ ...store, phone: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={store.lat}
                onChange={(e) => setStore({ ...store, lat: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={store.lng}
                onChange={(e) => setStore({ ...store, lng: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleSave('Store location')}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Operating Hours</h3>
        <div className="space-y-3">
          {hours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-4">
              <span className="w-28 text-sm text-gray-300">{h.day}</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!h.isClosed}
                  onChange={(e) => {
                    const updated = [...hours];
                    updated[i] = { ...h, isClosed: !e.target.checked };
                    setHours(updated);
                  }}
                  className="rounded border-dark-600 bg-dark-900 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-xs text-gray-400">{h.isClosed ? 'Closed' : 'Open'}</span>
              </label>
              {!h.isClosed && (
                <>
                  <input
                    type="time"
                    value={h.open}
                    onChange={(e) => {
                      const updated = [...hours];
                      updated[i] = { ...h, open: e.target.value };
                      setHours(updated);
                    }}
                    className="rounded-lg border border-dark-600 bg-dark-900 px-2 py-1.5 text-sm text-white focus:border-brand-500 focus:outline-none"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={h.close}
                    onChange={(e) => {
                      const updated = [...hours];
                      updated[i] = { ...h, close: e.target.value };
                      setHours(updated);
                    }}
                    className="rounded-lg border border-dark-600 bg-dark-900 px-2 py-1.5 text-sm text-white focus:border-brand-500 focus:outline-none"
                  />
                </>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleSave('Operating hours')}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-xl bg-dark-800 border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
        <div className="space-y-3">
          {([
            { key: 'newOrder', label: 'New order received', desc: 'Get notified when a new order is placed' },
            { key: 'orderCancellation', label: 'Order cancellation', desc: 'Get notified when an order is cancelled' },
            { key: 'lowStock', label: 'Low stock alert', desc: 'Alert when product stock falls below threshold' },
            { key: 'riderVerification', label: 'Rider verification request', desc: 'New rider document submissions' },
            { key: 'ageVerification', label: 'Age verification request', desc: 'New NIC verification submissions' },
            { key: 'dailySummary', label: 'Daily summary email', desc: 'Receive daily sales and performance summary' },
          ] as const).map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof notifications],
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-brand-500' : 'bg-dark-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleSave('Notification')}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
