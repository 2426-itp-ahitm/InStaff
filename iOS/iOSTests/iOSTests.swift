//
//  iOSTests.swift
//  iOSTests
//
//  Created by Alexander Hahn on 28.04.25.
//

import Testing
@testable import iOS

struct iOSTests {

    @Test func example() async throws {
        // Write your test here and use APIs like `#expect(...)` to check expected conditions.
    }

    @Test func assignmentStatusGroupings_workForAllSixStates() async throws {
        #expect(AssignmentStatus.pending.isOpen)
        #expect(AssignmentStatus.requested.isOpen)
        #expect(!AssignmentStatus.confirmed.isOpen)

        #expect(AssignmentStatus.confirmed.isAccepted)
        #expect(AssignmentStatus.requestConfirmed.isAccepted)
        #expect(!AssignmentStatus.declined.isAccepted)

        #expect(AssignmentStatus.declined.isDeclined)
        #expect(AssignmentStatus.requestDeclined.isDeclined)
        #expect(!AssignmentStatus.pending.isDeclined)
    }

    @Test func assignmentStatusLabels_coverAllSixStates() async throws {
        #expect(AssignmentStatus.pending.displayLabel == "Ausstehend")
        #expect(AssignmentStatus.confirmed.displayLabel == "Angenommen")
        #expect(AssignmentStatus.declined.displayLabel == "Abgelehnt")
        #expect(AssignmentStatus.requested.displayLabel == "Angefragt")
        #expect(AssignmentStatus.requestConfirmed.displayLabel == "Anfrage bestaetigt")
        #expect(AssignmentStatus.requestDeclined.displayLabel == "Anfrage abgelehnt")
    }
}
