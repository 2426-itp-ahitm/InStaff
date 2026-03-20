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
        guard session.employee != nil else { return [] }
        let calendar = Calendar.current
        let now = Date()
        let endDate = calendar.date(byAdding: .day, value: 7, to: now) ?? now

        return assignmentViewModel.assignments
            .filter { assignment in
                guard let start = DateUtils.toDate(assignment.shift.startTime) else { return false }
                return start >= now && start < endDate
            }
            .sorted { l, r in
                guard
                    let lStart = DateUtils.toDate(l.shift.startTime),
                    let rStart = DateUtils.toDate(r.shift.startTime)
                else {
                    return l.id < r.id
                }
                return lStart < rStart
            }
    }

    var body: some View {
        List {
            if filteredAssignments.isEmpty {
                Text("In den nächsten 7 Tagen sind keine Schichten geplant.")
                    .foregroundColor(.gray)
            }
            ForEach(filteredAssignments, id: \.id) { assignment in
                let isPast = isPast(assignment)
                HStack {
                    RequestRowView(roleViewModel: roleViewModel, shiftViewModel: shiftViewModel, assignment: assignment)
                }
                .opacity(isPast ? 0.4 : 1.0)
                .contentShape(Rectangle())
                .swipeActions(edge: .leading) {
                    Button {
                        assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: true)
                    } label: {
                        Label("Annehmen", systemImage: "checkmark")
                    }
                    .tint(.green)
                    .disabled(isPast)
                }
                .swipeActions(edge: .trailing) {
                    Button(role: .destructive) {
                        assignmentViewModel.confirmAssignment(assignmentId: assignment.id, isAccepted: false)
                    } label: {
                        Label("Ablehnen", systemImage: "xmark")
                    }
                    .tint(.red)
                    .disabled(isPast)
                }
            }
        }
        .navigationTitle("Aktuelle Anfragen")
    }

    private func isPast(_ assignment: Assignment) -> Bool {
        guard let endDate = DateUtils.toDate(assignment.shift.endTime) else {
            return false
        }
        return endDate < Date()
    }
}
