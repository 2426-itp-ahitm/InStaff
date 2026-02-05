//
//  iOSApp.swift
//  iOS
//
//  Created by Alexander Hahn on 28.04.25.
//

import SwiftUI
import TipKit

extension Color {
    static let appGreen = Color(red: 0.345, green: 0.506, blue: 0.341)
}

@main
struct iOSApp: App {
    init() {
        try? Tips.configure()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .tint(.appGreen)
        }
    }
}
