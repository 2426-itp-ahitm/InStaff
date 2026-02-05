//
//  RoleTag.swift
//  iOS
//
//  Created by Alexander Hahn on 02.06.25.
//
import SwiftUI

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)

        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255,
                            (int >> 8) * 17,
                            (int >> 4 & 0xF) * 17,
                            (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255,
                            int >> 16,
                            int >> 8 & 0xFF,
                            int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24,
                            int >> 16 & 0xFF,
                            int >> 8 & 0xFF,
                            int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }

        self.init(.sRGB,
                  red: Double(r) / 255,
                  green: Double(g) / 255,
                  blue: Double(b) / 255,
                  opacity: Double(a) / 255)
    }
}

struct RoleTag: View {
    let roleName: String

    var backgroundColor: Color {
        switch roleName {
        case "Koch":
            return Color(hex: "CC7272")
        case "Küchenhilfe":
            return Color(hex: "72ABCC")
        case "Kellner":
            return Color(hex: "72cca2")
        case "Barkeeper":
            return Color(hex: "72cc95")
        case "Abwasch":
            return Color(hex: "cc72c8")
        default:
            return .gray
        }
    }

    var body: some View {
        Text(roleName)
            .font(.callout)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .foregroundColor(.black)
            .background(backgroundColor)
            .cornerRadius(10)
    }
}
