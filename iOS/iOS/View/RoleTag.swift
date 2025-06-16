//
//  RoleTag.swift
//  iOS
//
//  Created by Alexander Hahn on 02.06.25.
//
import SwiftUI

struct RoleTag: View {
    let roleName: String

    var borderColor: Color {
        switch roleName {
        case "Koch":
            return .blue
        case "Küchenhilfe":
            return .green
        case "Kellner":
            return .orange
        case "Barkeeper":
            return .red
        case "Abwasch":
            return .indigo
        default:
            return .gray
        }
    }

    var body: some View {
        Text(roleName)
            .font(.caption)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .foregroundColor(borderColor)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(borderColor, lineWidth: 1.5)
            )
    }
}
