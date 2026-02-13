//
//  APIClient.swift
//  iOS
//
//  Created by Alexander Hahn on 12.02.26.
//


import Foundation

class APIClient {

    static let shared = APIClient()
    var sessionManager: SessionManager?

    private init() {}

    func request(
        url: URL,
        method: String = "GET",
        body: Data? = nil
    ) async throws -> Data {

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.httpBody = body
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // 🔥 Interceptor part
        if let token = await sessionManager?.accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let http = response as? HTTPURLResponse,
              200..<300 ~= http.statusCode else {
            throw URLError(.badServerResponse)
        }

        return data
    }
}
