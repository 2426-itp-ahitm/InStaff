//  ShiftViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation

class ShiftViewModel: ObservableObject {
    @Published var shifts: [Int64: String] = [:]

    init() {
        loadShifts()
    }

    func loadShifts() {
        guard let url = URL(string: "http://localhost:8080/api/shifts") else {
            print("Invalid URL")
            return
        }

        URLSession.shared.dataTask(with: url) { (data: Data?, response: URLResponse?, error: Error?) in
            if let error = error {
                print("Error fetching shifts: \(error)")
                return
            }

            guard let data = data else {
                print("No data received")
                return
            }

            do {
                let fetchedShifts = try JSONDecoder().decode([Shift].self, from: data)
                DispatchQueue.main.async {
                    self.shifts = Dictionary(uniqueKeysWithValues: fetchedShifts.map { ($0.id, "\($0.startTime) - \($0.endTime)") })
                }
            } catch {
                print("Failed to decode shifts: \(error)")
            }
        }.resume()
    }

    func shiftTime(for shiftId: Int64) -> String {
        return shifts[shiftId] ?? "Unbekannt"
    }
}
