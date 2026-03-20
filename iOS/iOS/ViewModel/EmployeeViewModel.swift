//
//  EmployeeViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation
import SwiftUI

private struct EmployeeUpdateRequest: Encodable {
    let firstname: String
    let lastname: String
    let email: String
    let telephone: String
    let birthDate: String
    let isManager: Bool
    let roles: [Int]
    let hourlyWage: Double
    let address: String
    let isActive: Bool
}

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

        guard let url = URL(string: "\(apiBaseUrl)/api/employees") else {
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
        guard let url = URL(string: "\(apiBaseUrl)/api/employees/\(employee.id)") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0)))
            return
        }

        let encoder = JSONEncoder()
        let requestBody = EmployeeUpdateRequest(
            firstname: employee.firstname,
            lastname: employee.lastname,
            email: employee.email,
            telephone: employee.telephone,
            birthDate: employee.birthDate,
            isManager: employee.isManager,
            roles: employee.roles.map(\.id),
            hourlyWage: employee.hourlyWage,
            address: employee.address,
            isActive: employee.isActive ?? true
        )

        do {
            let body = try encoder.encode(requestBody)
            Task {
                do {
                    _ = try await APIClient.shared.request(
                        url: url,
                        method: "PUT",
                        body: body
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
        } catch {
            completion(.failure(error))
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
