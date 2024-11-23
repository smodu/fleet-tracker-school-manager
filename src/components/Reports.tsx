'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText } from 'lucide-react'
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { sampleReportData } from './reportSampleData'

type ReportType = 'students' | 'parents' | 'drivers' | 'vehicles' | 'fuel' | 'maintenance' | 'financial'

interface ReportData {
  id: string
  date: string
  value: number
  details: string
}

const reportTypes: { value: ReportType; label: string }[] = [
  { value: 'students', label: 'Students Report' },
  { value: 'parents', label: 'Parents Report' },
  { value: 'drivers', label: 'Drivers Report' },
  { value: 'vehicles', label: 'Vehicles Report' },
  { value: 'fuel', label: 'Fuel Consumption Report' },
  { value: 'maintenance', label: 'Maintenance Report' },
  { value: 'financial', label: 'Financial Report' },
]

// const mockReportData: Record<ReportType, ReportData[]> = {
//   students: [
//     { id: '1', date: '2023-05-01', value: 150, details: 'Total active students' },
//     { id: '2', date: '2023-05-02', value: 148, details: '2 students inactive' },
//     { id: '3', date: '2023-05-03', value: 152, details: '4 new students added' },
//   ],
//   parents: [
//     { id: '1', date: '2023-05-01', value: 130, details: 'Total registered parents' },
//     { id: '2', date: '2023-05-02', value: 132, details: '2 new parent registrations' },
//     { id: '3', date: '2023-05-03', value: 131, details: '1 parent account deactivated' },
//   ],
//   drivers: [
//     { id: '1', date: '2023-05-01', value: 20, details: 'Total active drivers' },
//     { id: '2', date: '2023-05-02', value: 19, details: '1 driver on leave' },
//     { id: '3', date: '2023-05-03', value: 21, details: '2 new drivers hired' },
//   ],
//   vehicles: [
//     { id: '1', date: '2023-05-01', value: 15, details: 'Total operational vehicles' },
//     { id: '2', date: '2023-05-02', value: 14, details: '1 vehicle under maintenance' },
//     { id: '3', date: '2023-05-03', value: 16, details: '1 new vehicle added to fleet' },
//   ],
//   fuel: [
//     { id: '1', date: '2023-05-01', value: 500, details: 'Total fuel consumption (liters)' },
//     { id: '2', date: '2023-05-02', value: 480, details: 'Reduced consumption due to route optimization' },
//     { id: '3', date: '2023-05-03', value: 510, details: 'Increased consumption due to longer routes' },
//   ],
//   maintenance: [
//     { id: '1', date: '2023-05-01', value: 2, details: 'Vehicles under routine maintenance' },
//     { id: '2', date: '2023-05-02', value: 1, details: 'Emergency repair for 1 vehicle' },
//     { id: '3', date: '2023-05-03', value: 0, details: 'All vehicles operational' },
//   ],
//   financial: [
//     { id: '1', date: '2023-05-01', value: 10000, details: 'Total revenue' },
//     { id: '2', date: '2023-05-02', value: 8500, details: 'Operational costs' },
//     { id: '3', date: '2023-05-03', value: 1500, details: 'Net profit' },
//   ],
// }

const mockReportData = sampleReportData

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('students')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  })

  const filteredReportData = mockReportData[selectedReport].filter((item) => {
    const itemDate = new Date(item.date)
    return (
      (!dateRange?.from || itemDate >= dateRange.from) &&
      (!dateRange?.to || itemDate <= dateRange.to)
    )
  })

  const handleDownload = () => {
    const csvContent = [
      ['Date', 'Value', 'Details'],
      ...filteredReportData.map((item) => [item.date, item.value.toString(), item.details]),
    ].map((row) => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${selectedReport}_report.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen text-black dark:text-white">
      <h1 className="text-2xl font-bold text-black dark:text-white">Reports Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1 bg-gray-100 dark:bg-[#4C4C4C] border-hidden">
          <CardHeader>
            <CardTitle>Select Report Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setSelectedReport(value as ReportType)} defaultValue={selectedReport}>
              <SelectTrigger className="bg-gray-400 dark:bg-[#3C3C3C] text-white dark:text-gray-400 border-hidden">
                <SelectValue placeholder="Select a report type" />
              </SelectTrigger>
              <SelectContent className="bg-[#3C3C3C] text-white">
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card className="flex-1 bg-gray-100 dark:bg-[#4C4C4C] border-hidden">
          <CardHeader>
            <CardTitle>Select Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
          </CardContent>
        </Card>
      </div>
      <Card className=" bg-gray-100 dark:bg-[#4C4C4C] border-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{reportTypes.find((type) => type.value === selectedReport)?.label}</CardTitle>
          <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReportData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{format(new Date(item.date), 'PP')}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>{item.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}