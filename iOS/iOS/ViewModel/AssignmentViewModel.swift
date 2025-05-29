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
        loadAssignmentsAsync()
    }

    private func load() -> [Assignment] {
        var assignments: [Assignment] = []
        let jsonDecoder = JSONDecoder()

        guard let url = URL(string: "http://localhost:8080/api/\(companyId)/assignments") else {
            //print("Invalid URL")
            return assignments
        }

        if let data = try? Data(contentsOf: url) {
            if let loadedAssignments = try? jsonDecoder.decode([Assignment].self, from: data) {
                assignments = loadedAssignments
                //print("Assignments loaded: \(assignments.count)")
            } else {
                print("Failed to decode assignments")
            }
        } else {
            print("Failed to load data from URL")
        }

        return assignments
    }

    private func loadAssignmentsAsync() {
        DispatchQueue.global(qos: .background).async {
            let loadedAssignments = self.load()
            DispatchQueue.main.async {
                self.assignments = loadedAssignments
            }
        }
    }

    func count() -> Int {
        return assignments.count
    }
}
