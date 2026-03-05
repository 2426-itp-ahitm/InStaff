//
//  HomeView.swift
//  iOS
//
//  Created by Alexander Hahn on 28.04.25.
//

import SwiftUI

struct HomeView: View {
    @EnvironmentObject var session: SessionManager
    @ObservedObject var assignmentViewModel: AssignmentViewModel
    @ObservedObject var roleViewModel: RoleViewModel
    @ObservedObject var shiftViewModel: ShiftViewModel
    
    var filteredAssignments: [Assignment] {
        guard let employeeId = session.employeeId else { return [] }

        return assignmentViewModel.assignments
            .filter { $0.employee == employeeId }
            .filter { assignment in
                guard let shift = shiftViewModel.shift(for: assignment.shift),
                      let start = DateUtils.toDate(shift.startTime) else { return false }

                let calendar = Calendar.current
                let now = Date()

                let startOfWeek = calendar.dateInterval(of: .weekOfYear, for: now)?.start ?? now
                let endOfWeek = calendar.date(byAdding: .day, value: 7, to: startOfWeek)!

                return start >= startOfWeek && start < endOfWeek
            }
            .sorted { l, r in
                guard let lShift = shiftViewModel.shift(for: l.shift),
                      let rShift = shiftViewModel.shift(for: r.shift),
                      let lStart = DateUtils.toDate(lShift.startTime),
                      let rStart = DateUtils.toDate(rShift.startTime) else {
                    return l.id < r.id
                }
                return lStart < rStart
            }
    }

    var body: some View {
        VStack{
            NavigationStack {
                List {
                    if filteredAssignments.isEmpty {
                        Text("Diese Woche sind keine Schichten geplant.")
                            .foregroundColor(.gray)
                    }
                    ForEach(filteredAssignments, id: \.id) { assignment in
                        HStack {
                            RequestRowView(roleViewModel: roleViewModel, shiftViewModel: shiftViewModel, assignment: assignment)
                        }
                        .contentShape(Rectangle())
                        .swipeActions(edge: .leading) {
                            Button {
                                assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: true)
                            } label: {
                                Label("Annehmen", systemImage: "checkmark")
                            }
                            .tint(.green)
                        }
                        .swipeActions(edge: .trailing) {
                            Button(role: .destructive) {
                                assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: false)
                            } label: {
                                Label("Ablehnen", systemImage: "xmark")
                            }
                            .tint(.red)
                        }
                    }
                }
                .navigationTitle("Aktuelle Anfragen")
            }
        }
    }
    
}
