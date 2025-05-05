//
//  EmployeeViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation

class ShiftViewModel: ObservableObject {
    @Published var shifts: [Shift] = []

    init() {
        loadShiftsAsync()
    }

    private func load() -> [Shift] {
        var shifts: [Shift] = []
        let jsonDecoder = JSONDecoder()

        guard let url = URL(string: "http://localhost:8080/api/shifts") else {
            print("Invalid URL")
            return shifts
        }

        if let data = try? Data(contentsOf: url) {
            if let loadedShifts = try? jsonDecoder.decode([Shift].self, from: data) {
                shifts = loadedShifts
                print("Shifts loaded: \(shifts.count)")
            } else {
                print("Failed to decode shifts")
            }
        } else {
            print("Failed to load data from URL")
        }

        return shifts
    }

    private func loadShiftsAsync() {
        DispatchQueue.global(qos: .background).async {
            let loadedShifts = self.load()
            DispatchQueue.main.async {
                self.shifts = loadedShifts
            }
        }
    }

    func count() -> Int {
        return shifts.count
    }

    func shiftStartTime(index: Int) -> String? {
        return shifts[index].startTime
    }

    func shiftEndTime(index: Int) -> String? {
        return shifts[index].endTime
    }
}
