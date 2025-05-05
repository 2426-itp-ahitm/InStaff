//
//  EmployeeViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation

class EmployeeViewModel: ObservableObject {
    @Published var employees: [Int64: String] = [:]

    init() {
        loadEmployees()
    }

    func loadEmployees() {
        guard let url = URL(string: "http://localhost:8080/api/employees") else {
            print("Invalid URL for employees")
            return
        }

        URLSession.shared.dataTask(with: url) { (data: Data?, response: URLResponse?, error: Error?) in
            if let error = error {
                print("Error fetching employees: \(error)")
                return
            }

            guard let data = data else {
                print("No data received for employees")
                return
            }

            do {
                let fetchedEmployees = try JSONDecoder().decode([Employee].self, from: data)
                DispatchQueue.main.async {
                    self.employees = Dictionary(uniqueKeysWithValues: fetchedEmployees.map { ($0.id, "\($0.firstname) \($0.lastname)") })
                }
            } catch {
                print("Failed to decode employees: \(error)")
            }
        }.resume()
    }

    func employeeName(for employeeId: Int64) -> String {
        return employees[employeeId] ?? "Unbekannt"
    }
}
