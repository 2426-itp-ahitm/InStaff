//
//  LoginView.swift
//  iOS
//
//  Created by Alexander Hahn on 06.05.25.
//

import SwiftUI
import AppAuth

struct LoginView: View {
    @EnvironmentObject var session: SessionManager

    var body: some View {
        VStack(spacing: 30) {
            Text("Instaff Login")
                .font(.largeTitle)
                .bold()

            Button("Login with Keycloak") {
                login()
            }
            .padding()
            .background(Color.appGreen)
            .foregroundColor(.white)
            .cornerRadius(8)
        }
    }

    func login() {
        let issuer = URL(string: "http://localhost:8081/realms/demo")!

        OIDAuthorizationService.discoverConfiguration(forIssuer: issuer) { configuration, error in

            guard let config = configuration else { return }

            let request = OIDAuthorizationRequest(
                configuration: config,
                clientId: "instaff-ios",
                scopes: [OIDScopeOpenID, OIDScopeProfile, OIDScopeEmail],
                redirectURL: URL(string: "com.instaff.app://oauth/callback")!,
                responseType: OIDResponseTypeCode,
                additionalParameters: nil
            )

            guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let root = scene.windows.first?.rootViewController else { return }

            AuthManager.shared.currentAuthorizationFlow =
                OIDAuthState.authState(byPresenting: request, presenting: root) { authState, error in
                    if let authState = authState,
                       let token = authState.lastTokenResponse?.accessToken {

                        Task {
                            await MainActor.run {
                                session.accessToken = token
                                print(token)
                            }
                            await session.loadCurrentUser()
                        }
                    }
            }
            
        }
    }
}

