//
//  RequestView.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import SwiftUI

struct RequestView: View {
    @EnvironmentObject var session: SessionManager

    
    
    var body: some View {
        let assignmentViewModel = AssignmentViewModel(companyId: session.companyId!)
        
        if let firstAssignment = assignmentViewModel.assignments.first {
            RequestRowView(assignment: firstAssignment)
        } else {
            Text("Keine Einsätze verfügbar")
        }
        
        /*NavigationSplitView {
            List(assignmentViewModel.assignments) { assignment in
                NavigationLink {
                    CalendarView()
                } label: {
                    RequestRowView(assignment: assignment)
                }
            }
        } detail: {
            Text("Select a Assignment")
        }*/
    }
}

#Preview {
    RequestView()
        .environmentObject(SessionManager())
}
