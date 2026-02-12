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
    
    var companyId: Int64

    init(companyId: Int64) {
        self.companyId = companyId
        loadAssignmentsAsync() {}
    }

    private func load() -> [Assignment] {
        var assignments: [Assignment] = []
        let jsonDecoder = JSONDecoder()

        guard let url = URL(string: "\(apiBaseUrl)/api/\(companyId)/assignments") else {
            print("Invalid URL: assignment")
            return assignments
        }

        let semaphore = DispatchSemaphore(value: 0)

        Task {
            do {
                let data = try await APIClient.shared.request(url: url)
                if let loadedAssignments = try? jsonDecoder.decode([Assignment].self, from: data) {
                    assignments = loadedAssignments
                    print(assignments)
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

    private func loadAssignmentsAsync(completion: @escaping () -> Void) {
        DispatchQueue.global(qos: .background).async {
            let loadedAssignments = self.load()
            DispatchQueue.main.async {
                self.assignments = loadedAssignments
                completion()
            }
        }
    }

    func count() -> Int {
        return assignments.count
    }
    
    // PUT /api/{companyId}/confirmation/confirm/{assignmentId}
    // PUT /api/{companyId}/confirmation/decline/{assignmentId}
    public func confirmAssignment(assignmentId: Int, isAccepted: Bool) -> Bool {
        let action = isAccepted ? "confirm" : "decline"
        guard let url = URL(string: "\(apiBaseUrl)/api/\(companyId)/confirmation/\(action)/\(assignmentId)") else {
            return false
        }
        let semaphore = DispatchSemaphore(value: 0)
        var success = false

        Task {
            do {
                _ = try await APIClient.shared.request(
                    url: url,
                    method: "PUT",
                    body: nil
                )
                success = true
            } catch {
                print("Error confirming assignment:", error.localizedDescription)
            }
            semaphore.signal()
        }

        semaphore.wait()
        loadAssignmentsAsync() {}
        //print(assignments)
        return success
    }
}
