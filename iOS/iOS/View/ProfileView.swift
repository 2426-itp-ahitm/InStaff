//
//  ProfileView.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var session: SessionManager
    
    var body: some View {
        if let id = session.employeeId {
            VStack {
                    Text("Profile: \(id)")
            }
        } else {
            VStack {
                Text("Not logged in")
            }
        }
    }
}

#Preview {
    ProfileView()
}
