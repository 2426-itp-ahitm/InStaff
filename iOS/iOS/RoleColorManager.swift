//
//  RoleColorManager.swift
//  iOS
//
//  Created by Alexander Hahn on 06.11.25.
//

import SwiftUI
import Combine

class RoleColorManager: ObservableObject {
    let roleViewModel: RoleViewModel
    @Published var roleColors: [String: Color] = [:]
    
    private let defaultsKey = "roleColors"
    
    init(roleViewModel: RoleViewModel) {
        self.roleViewModel = roleViewModel
        loadColors()
    }
    
    func loadColors() {
        // Simulate loading roles from an API
        let roles = roleViewModel.roles
        var colors: [String: Color] = [:]
        for role in roles {
            colors[role.roleName] = .gray
        }
        self.roleColors = colors
    }
    
    func saveColor(for roleName: String, color: Color) {
        let uiColor = UIColor(color)
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0
        uiColor.getRed(&red, green: &green, blue: &blue, alpha: &alpha)

        let colorString = String(format: "#%02lX%02lX%02lX",
                                 lroundf(Float(red * 255)),
                                 lroundf(Float(green * 255)),
                                 lroundf(Float(blue * 255)))
        
        roleColors[roleName] = color
        let stringDict = roleColors.mapValues { _ in colorString }
        UserDefaults.standard.set(stringDict, forKey: defaultsKey)
        objectWillChange.send()
    }
    
    func getColor(for roleName: String) -> Color {
        if let color = roleColors[roleName] {
            return color
        }
        let defaultColor: Color = .gray
        roleColors[roleName] = defaultColor
        
        return defaultColor
    }
}

