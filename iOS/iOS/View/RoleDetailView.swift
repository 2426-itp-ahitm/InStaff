//
//  RoleDetailView.swift
//  iOS
//
//  Created by Codex on 20.03.26.
//

import SwiftUI

struct RoleDetailView: View {
    let role: Role

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text(role.roleName)
                    .font(.title.bold())

                Text(role.description)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding()
        }
        .navigationTitle(role.roleName)
        .navigationBarTitleDisplayMode(.inline)
    }
}
