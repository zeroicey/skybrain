import { Calendar } from 'lucide-react'
import { useShopStore } from '@/stores/shop-store'
import { shops, shopDistricts, shopTypes } from '@/data/mock-shops'

export default function ShopNav() {
  const { selectedShopId, selectedDate, selectedDistrict, selectedType, setSelectedShop, setSelectedDate, setSelectedDistrict, setSelectedType, refreshAllData } = useShopStore()

  return (
    <div className="w-full flex items-center justify-between">
      <span className="text-xl">街道商铺监控</span>
      <div className="flex items-center gap-4">
        <select
          value={selectedShopId}
          onChange={(e) => setSelectedShop(e.target.value)}
          className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {shopDistricts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {shopTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          onClick={() => refreshAllData()}
          className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
        >
          查询
        </button>
      </div>
    </div>
  )
}