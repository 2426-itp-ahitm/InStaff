//
//  RoleTag.swift
//  iOS
//
//  Created by Alexander Hahn on 02.06.25.
//
import SwiftUI

struct RoleTag: View {
    @ObservedObject var roleColorManager: RoleColorManager
    let roleName: String

    var borderColor: Color {
        switch roleName {
        case "Koch":
            return roleColorManager.getColor(for: "Koch")
        case "Küchenhilfe":
            return roleColorManager.getColor(for: "Küchenhilfe")
        case "Kellner":
            return roleColorManager.getColor(for: "Kellner")
        case "Barkeeper":
            return roleColorManager.getColor(for: "Barkeeper")
        case "Abwasch":
            return roleColorManager.getColor(for: "Abwasch")
        default:
            return .gray
        }
    }

    var body: some View {
        Text(roleName)
            .font(.callout)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .foregroundColor(borderColor)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(borderColor, lineWidth: 1.5)
            )
    }
}
