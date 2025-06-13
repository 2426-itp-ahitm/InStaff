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

            if assignment.confirmed == nil {
                HStack {
                    Button("Accept") {
                        // No action yet
                    }
                    Button("Reject") {
                        // No action yet
                    }
                }
            }
        }
        
    }
}
