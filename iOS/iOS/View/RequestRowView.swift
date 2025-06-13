//
//  RequestRowView.swift
//  iOS
//
//  Created by Alexander Hahn on 29.05.25.
//

import SwiftUI

struct RequestRowView: View {
    @EnvironmentObject var session: SessionManager
    @ObservedObject var roleViewModel: RoleViewModel
    @ObservedObject var shiftViewModel: ShiftViewModel
    var assignment: Assignment
    
    var body: some View {
        VStack(alignment: .leading) {
            let rawStartDate = shiftViewModel.shiftStartTime(by: assignment.shift)
            let rawEndDate = shiftViewModel.shiftEndTime(by: assignment.shift)

            let startDate = DateUtils.format(rawStartDate)
            let endDate = DateUtils.format(rawEndDate)

            let (confirmationText, confirmationColor): (String, Color) = {
                switch assignment.confirmed {
                case true:
                    return ("Confirmed", .green)
                case false:
                    return ("Rejected", .red)
                default:
                    return ("Not confirmed", .blue)
                }
            }()
            if startDate.prefix(10) == endDate.prefix(10) {
                Text("\(startDate.prefix(10)):").bold() +
                Text(" \(startDate.suffix(5)) - \(endDate.suffix(5))")
            } else {
                Text("\(startDate)").bold() +
                Text(" - \(endDate)")
            }

            RoleTag(roleName: roleViewModel.roleName(for: assignment.role))

            Text(confirmationText)
                .foregroundColor(confirmationColor)
            
            
        }
    }
}
