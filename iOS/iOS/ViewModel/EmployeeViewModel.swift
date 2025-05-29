//
//  EmployeeViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation
import SwiftUICore

class EmployeeViewModel: ObservableObject {
    @Published var employees: [Employee] = []

    var companyId: Int

    init(companyId: Int) {
        self.companyId = companyId
        loadEmployeesAsync() {}
    }

    private func load() -> [Employee] {
        var employees: [Employee] = []
        let jsonDecoder = JSONDecoder()
        
        
        guard let url = URL(string: "http://localhost:8080/api/\(companyId)/employees") else {
            //print("Invalid URL for employees")
            return employees
        }

        if let data = try? Data(contentsOf: url) {
            if let fetchedEmployees = try? jsonDecoder.decode([Employee].self, from: data) {
                employees = fetchedEmployees
            } else {
                //print("Failed to decode employees")
            }
        } else {
            //print("Failed to load data from URL")
        }

        return employees
    }
    func saveEmployeeChanges(_ employee: Employee, completion: @escaping (Result<Void, Error>) -> Void) {
        guard let url = URL(string: "http://localhost:8080/api/employees/\(employee.id)") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0)))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let encoder = JSONEncoder()

        do {
            request.httpBody = try encoder.encode(employee)
        } catch {
            completion(.failure(error))
            return
        }

        URLSession.shared.dataTask(with: request) { _, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    completion(.failure(error))
                } else {
                    completion(.success(()))
                }
            }
        }.resume()
    }

    private func loadEmployeesAsync(completion: @escaping () -> Void) {
        DispatchQueue.global(qos: .background).async {
            let loadedEmployees = self.load()
            DispatchQueue.main.async {
                self.employees = loadedEmployees
                print(self.employees)
                completion()
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
    
    func updateCompanyId(_ id: Int, completion: @escaping () -> Void) {
        if companyId != id {
            companyId = id
            loadEmployeesAsync() {
                completion()
            }
        }
    }
}
