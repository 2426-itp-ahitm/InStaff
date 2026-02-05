//
//  CalendarView.swift
//  iOS
//
//  Created by Alexander Hahn on 28.04.25.
//

import SwiftUI

struct CalendarView: View {
    //@State private var selectedColor: Color = .blue
    var body: some View {
        VStack {
            DatePicker(
                "Select a date",
                selection: .constant(Date()),
                displayedComponents: [.date]
            )
            .datePickerStyle(.graphical)
            .padding()
             
            //ColorPicker("Select color", selection: $selectedColor)

        }
    }
}
