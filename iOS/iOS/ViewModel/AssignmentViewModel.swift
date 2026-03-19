//
//  EmployeeViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation
import SwiftUI

class AssignmentViewModel: ObservableObject {
    @Published var assignments: [Assignment] = []
    
    var employeeId: Int64

    init(employeeId: Int64) {
        self.employeeId = employeeId
        Task {
            await loadAssignmentsAsync()
        }
    }

    private func load() -> [Assignment] {
        guard employeeId > 0 else { return []}
        
        var assignments: [Assignment] = []
        let jsonDecoder = JSONDecoder()

        guard let url = URL(string: "\(apiBaseUrl)/api/assignments/employee/\(employeeId)") else {
            print("Invalid URL: assignment")
            return assignments
        }

        let semaphore = DispatchSemaphore(value: 0)

        Task {
            do {
                let data = try await APIClient.shared.request(url: url)
                if let loadedAssignments = try? jsonDecoder.decode([Assignment].self, from: data) {
                    assignments = loadedAssignments
                    print("Loaded assignments: ", assignments.count)
                } else {
                    print("Failed to decode assignments")
                }
            } catch {
                print("Failed to load assignments:", error)
            }
            semaphore.signal()
        }

        semaphore.wait()
        return assignments
    }

    private func loadAssignmentsAsync() async {
        guard employeeId > 0 else { return }

        guard let url = URL(string: "\(apiBaseUrl)/api/assignments/employee/\(employeeId)") else {
            return
        }

        do {
            let data = try await APIClient.shared.request(url: url)
            let decoded = try JSONDecoder().decode([Assignment].self, from: data)

            await MainActor.run {
                self.assignments = decoded
                print("loaded assignments for employee \(employeeId)")
            }

        } catch {
            print("Failed to load assignments:", error)
        }
    }

    func count() -> Int {
        return assignments.count
    }
    
    // PUT /api/{companyId}/confirmation/confirm/{assignmentId}
    // PUT /api/{companyId}/confirmation/decline/{assignmentId}
    public func confirmAssignment(assignmentId: Int, isAccepted: Bool) {
        guard let url = URL(string: "\(apiBaseUrl)/api/assignments/\(assignmentId)/confirm/\(isAccepted)") else {
            return
        }

        Task {
            do {
                _ = try await APIClient.shared.request(
                    url: url,
                    method: "PUT",
                    body: nil
                )

                await MainActor.run {
                    Task {
                        await self.loadAssignmentsAsync()
                    }
                }
            } catch {
                print("Error confirming assignment:", error.localizedDescription)
            }
        }
    }
}
