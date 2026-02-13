//
//  AuthManager.swift
//  iOS
//
//  Created by Alexander Hahn on 12.02.26.
//


import AppAuth

class AuthManager {
    static let shared = AuthManager()
    var currentAuthorizationFlow: OIDExternalUserAgentSession?
}