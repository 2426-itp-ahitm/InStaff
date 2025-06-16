//
//  EmployeeViewModel.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import Foundation
import SwiftUICore

class AssignmentViewModel: ObservableObject {
    @Published var assignments: [Assignment] = []
    
    var companyId: Int

    init(companyId: Int) {
        self.companyId = companyId
        loadAssignmentsAsync() {}
    }

    private func load() -> [Assignment] {
        var assignments: [Assignment] = []
        let jsonDecoder = JSONDecoder()

        guard let url = URL(string: "http://localhost:8080/api/\(companyId)/assignments") else {
            print("Invalid URL: assignment")
            return assignments
        }

        if let data = try? Data(contentsOf: url) {
            if let loadedAssignments = try? jsonDecoder.decode([Assignment].self, from: data) {
                assignments = loadedAssignments
                //print(assignments)
            } else {
                print("Failed to decode assignments")
            }
        } else {
            print("Failed to load data from URL")
        }

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
        guard let url = URL(string: "http://localhost:8080/api/\(companyId)/confirmation/\(action)/\(assignmentId)") else {
            return false
        }
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        let semaphore = DispatchSemaphore(value: 0)
        var success = false
        URLSession.shared.dataTask(with: request) { _, response, error in
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
                success = true
            } else {
                print("Error confirming assignment:", error?.localizedDescription ?? "Unknown error")
            }
            semaphore.signal()
        }.resume()
        semaphore.wait()
        loadAssignmentsAsync() {}
        //print(assignments)
        return success
    }
}
