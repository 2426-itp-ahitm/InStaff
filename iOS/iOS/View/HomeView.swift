//
//  HomeView.swift
//  iOS
//
//  Created by Alexander Hahn on 28.04.25.
//

import SwiftUI

struct HomeView: View {
    @EnvironmentObject var session: SessionManager
    @StateObject var assignmentViewModel = AssignmentViewModel(companyId: 1)
    @StateObject var shiftViewModel = ShiftViewModel(companyId: 1)
    @StateObject var roleViewModel = RoleViewModel(companyId: 1)

    var currentWeekRequests: [Assignment] {
        let calendar = Calendar.current
        let now = Date()
        let weekStart = calendar.startOfDay(for: calendar.date(from: calendar.dateComponents([.yearForWeekOfYear, .weekOfYear], from: now))!)
        let weekEnd = calendar.date(byAdding: .day, value: 7, to: weekStart)!

        return assignmentViewModel.assignments
            .filter {
                if let shift = shiftViewModel.shift(for: $0.shift) {
                    let formatter = ISO8601DateFormatter()
                    if let date = formatter.date(from: shift.startTime) {
                        return date >= weekStart && date < weekEnd
                    }
                    return false
                }
                return false
            }
            .sorted {
                guard let lhs = shiftViewModel.shift(for: $0.shift),
                      let rhs = shiftViewModel.shift(for: $1.shift) else { return false }
                return lhs.startTime < rhs.startTime
            }
    }

    var body: some View {
        NavigationSplitView {
            List {
                ForEach(currentWeekRequests) { assignment in
                    NavigationLink {
                        RequestDetailView(roleViewModel: roleViewModel, shiftViewModel: shiftViewModel, assignment: assignment, assignmentViewModel: assignmentViewModel)
                    } label: {
                        RequestRowView(roleViewModel: roleViewModel, shiftViewModel: shiftViewModel, assignment: assignment)
                    }
                }
            }
            .navigationTitle("Current Requests")
        } detail: {
            Text("Select a request")
        }
        
    }
}

#Preview {
    HomeView()
}
