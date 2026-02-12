//
//  EmployeeViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation
import SwiftUI

class EmployeeViewModel: ObservableObject {
    @Published var employees: [Employee] = []

    var companyId: Int64

    init(companyId: Int64) {
        self.companyId = companyId
        loadEmployeesAsync() {}
    }

    private func load() -> [Employee] {
        var employees: [Employee] = []
        let jsonDecoder = JSONDecoder()

        guard let url = URL(string: "\(apiBaseUrl)/api/\(companyId)/employees") else {
            print("Invalid URL: employee")
            return employees
        }

        do {
            let semaphore = DispatchSemaphore(value: 0)

            Task {
                do {
                    let data = try await APIClient.shared.request(url: url)
                    if let fetchedEmployees = try? jsonDecoder.decode([Employee].self, from: data) {
                        employees = fetchedEmployees
                    }
                } catch {
                    print("Failed to load employees:", error)
                }
                semaphore.signal()
            }

            semaphore.wait()
        }

        return employees
    }
    func saveEmployeeChanges(_ employee: Employee, completion: @escaping (Result<Void, Error>) -> Void) {
        guard let url = URL(string: "\(apiBaseUrl)/api/\(companyId)/employees/\(employee.id)") else {
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

        Task {
            do {
                _ = try await APIClient.shared.request(
                    url: url,
                    method: "POST",
                    body: request.httpBody
                )
                DispatchQueue.main.async {
                    completion(.success(()))
                }
            } catch {
                DispatchQueue.main.async {
                    completion(.failure(error))
                }
            }
        }
    }

    private func loadEmployeesAsync(completion: @escaping () -> Void) {
        DispatchQueue.global(qos: .background).async {
            let loadedEmployees = self.load()
            DispatchQueue.main.async {
                self.employees = loadedEmployees
                //print(self.employees)
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
    
    func updateCompanyId(_ id: Int64, completion: @escaping () -> Void) {
        if companyId != id {
            companyId = id
            loadEmployeesAsync() {
                completion()
            }
        }
    }
}
