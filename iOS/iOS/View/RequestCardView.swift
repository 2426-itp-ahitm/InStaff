//
//  RequestCardView.swift
//  iOS
//
//  Created by Alexander Hahn on 05.05.25.
//

import SwiftUI

struct RequestCardView: View {
    let assignment: Assignement

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(formatDate(assignment.date))
                .font(.headline)
            Text("\(assignment.startTime) – \(assignment.endTime)")
                .font(.subheadline)

            Text(assignment.location)
                .font(.subheadline)
                .foregroundColor(.secondary)

            Text(assignment.role)
                .font(.headline)
                .bold()

            HStack {
                Button(action: {
                    // Accept action
                }) {
                    Text("Annehmen")
                        .foregroundColor(.white)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color.blue)
                        .cornerRadius(8)
                }

                Button(action: {
                    // Reject action
                }) {
                    Text("Ablehnen")
                        .foregroundColor(.black)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color(.systemGray5))
                        .cornerRadius(8)
                }
            }
        }
        .padding()
        .background(RoundedRectangle(cornerRadius: 12).fill(Color.white).shadow(radius: 3))
        .padding(.horizontal)
    }

    func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "E, d. MMM"
        return formatter.string(from: date)
    }
}

#Preview {
    RequestCardView(assignment: Assignement(id: 1, date: Date(), startTime: "18:00", endTime: "22:00", location: "Wirtshaus", role: "Koch", confirmed: nil))
}
