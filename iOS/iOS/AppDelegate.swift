//
//  AppDelegate.swift
//  iOS
//
//  Created by Alexander Hahn on 12.02.26.
//


import UIKit
import AppAuth

class AppDelegate: NSObject, UIApplicationDelegate {

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey : Any] = [:]
    ) -> Bool {

        if let authFlow = AuthManager.shared.currentAuthorizationFlow,
           authFlow.resumeExternalUserAgentFlow(with: url) {
            AuthManager.shared.currentAuthorizationFlow = nil
            return true
        }

        return false
    }
}
