//
//  RequestDetailView.swift
//  iOS
//
//  Created by Alexander Hahn on 13.06.25.
//

import SwiftUI

struct RequestDetailView: View {
    @EnvironmentObject var session: SessionManager
    @ObservedObject var roleViewModel: RoleViewModel
    @ObservedObject var shiftViewModel: ShiftViewModel
    var assignment: Assignment
    
    @ObservedObject var assignmentViewModel: AssignmentViewModel
    @State private var confirmResult: Bool? = nil
    @State private var errorMessage: String? = nil
    
    var body: some View {
        VStack {
            let rawStartDate = shiftViewModel.shiftStartTime(by: assignment.shift)
            let rawEndDate = shiftViewModel.shiftEndTime(by: assignment.shift)
            
            let startDate = DateUtils.format(rawStartDate)
            let endDate = DateUtils.format(rawEndDate)
            
            if startDate.prefix(10) == endDate.prefix(10) {
                Text("\(startDate.prefix(10)):").bold() +
                Text(" \(startDate.suffix(5)) - \(endDate.suffix(5))")
            } else {
                Text("\(startDate)").bold() +
                Text(" - \(endDate)")
            }
            
            RoleTag(roleName: roleViewModel.roleName(for: assignment.role))

            
            HStack {
                HStack {
                    Button(action: {
                        let success = assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: true)
                        if success {
                            confirmResult = true
                            errorMessage = nil
                        } else {
                            confirmResult = false
                            errorMessage = "Failed to accept assignment. Please try again later."
                        }
                    }) {
                        Label("Accept", systemImage: assignment.confirmed == true ? "checkmark.circle.fill" : "circle")
                            .foregroundColor(assignment.confirmed == true ? .green : .primary)
                    }

                    Button(action: {
                        let success = assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: false)
                        if success {
                            confirmResult = false
                            errorMessage = nil
                        } else {
                            confirmResult = nil
                            errorMessage = "Failed to decline assignment. Please try again later."
                        }
                    }) {
                        Label("Reject", systemImage: assignment.confirmed == false ? "xmark.circle.fill" : "circle")
                            .foregroundColor(assignment.confirmed == false ? .red : .primary)
                    }
                }
            }
            
            
        }
        
    }
}
