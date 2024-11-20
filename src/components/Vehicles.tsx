'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from 'lucide-react'

interface Vehicle {
  id: number
  number: string
  driver: string
  route: string
}

const initialVehicles: Vehicle[] = [
  { id: 1, number: 'V001', driver: 'John Doe', route: 'Route A' },
  { id: 2, number: 'V002', driver: 'Jane Smith', route: 'Route B' },
  { id: 3, number: 'V003', driver: 'Bob Johnson', route: 'Route C' },
  { id: 4, number: 'V004', driver: 'Alice Brown', route: 'Route D' },
  { id: 5, number: 'V005', driver: 'Charlie Davis', route: 'Route E' },
]

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)
  const [newVehicle, setNewVehicle] = useState({ number: '', driver: '', route: '' })
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewVehicle(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId !== null) {
      setVehicles(vehicles.map(v => v.id === editingId ? { ...v, ...newVehicle } : v))
      setEditingId(null)
    } else {
      const newId = Math.max(...vehicles.map(v => v.id), 0) + 1
      setVehicles([...vehicles, { id: newId, ...newVehicle }])
    }
    setNewVehicle({ number: '', driver: '', route: '' })
  }

  const handleEdit = (vehicle: Vehicle) => {
    setNewVehicle(vehicle)
    setEditingId(vehicle.id)
  }

  const handleDelete = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id))
  }

  return (
    <div className="flex flex-col gap-10 text-white p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h1 className="font-bold text-lg">{editingId !== null ? 'Edit vehicle' : 'Create vehicle'}</h1>
        <Input
          type="text"
          placeholder="Vehicle number"
          name="number"
          value={newVehicle.number}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          placeholder="Assign driver"
          name="driver"
          value={newVehicle.driver}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          placeholder="Assign route"
          name="route"
          value={newVehicle.route}
          onChange={handleInputChange}
          required
        />
        <Button type="submit" className="w-full max-w-20 bg-white text-black hover:bg-white/50">
          {editingId !== null ? 'Update' : 'Create'}
        </Button>
      </form>
      <div className="flex flex-col gap-6">
        <h1 className="font-bold text-lg">Your vehicles</h1>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Number</TableHead>
                <TableHead className="text-gray-300">Driver</TableHead>
                <TableHead className="text-gray-300">Route</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="border-gray-700">
                  <TableCell className="text-gray-100">{vehicle.number}</TableCell>
                  <TableCell className="text-gray-100">{vehicle.driver}</TableCell>
                  <TableCell className="text-gray-100">{vehicle.route}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(vehicle)}
                        size="icon"
                        variant="outline"
                        className="border-gray-500 text-gray-300 hover:bg-gray-700"
                        aria-label={`Edit vehicle ${vehicle.number}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(vehicle.id)}
                        size="icon"
                        variant="destructive"
                        className="bg-red-500 hover:bg-red-600"
                        aria-label={`Delete vehicle ${vehicle.number}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}