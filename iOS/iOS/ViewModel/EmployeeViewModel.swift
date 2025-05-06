//
//  EmployeeViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation

class EmployeeViewModel: ObservableObject {
    @Published var employees: [Employee] = []

    init() {
        loadEmployeesAsync()
    }

    private func load() -> [Employee] {
        var employees: [Employee] = []
        let jsonDecoder = JSONDecoder()

        guard let url = URL(string: "http://localhost:8080/api/employees") else {
            print("Invalid URL for employees")
            return employees
        }

        if let data = try? Data(contentsOf: url) {
            if let fetchedEmployees = try? jsonDecoder.decode([Employee].self, from: data) {
                employees = fetchedEmployees
                print("Employees loaded: \(employees.count)")
            } else {
                print("Failed to decode employees")
            }
        } else {
            print("Failed to load data from URL")
        }

        return employees
    }

    private func loadEmployeesAsync() {
        DispatchQueue.global(qos: .background).async {
            let loadedEmployees = self.load()
            DispatchQueue.main.async {
                self.employees = loadedEmployees
                print(self.employees)
            }
        }
    }

    func employeeName(for employeeId: Int) -> String {
        guard let employee = employees.first(where: { $0.id == employeeId }) else {
            return "Unknown"
        }
        return employee.firstname + " " + employee.lastname
    }

    func count() -> Int {
        return employees.count
    }
}
